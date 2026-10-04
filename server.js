'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3001;
const DB_PATH = process.env.NUMERA_DB || path.join(ROOT, 'data', 'numera.sqlite');
const SESSION_DAYS = 7;
const BOSS_ORDER = ['forest_boss', 'fire_boss', 'frozen_boss', 'final_boss'];
const BOSS_QUESTIONS = {
  forest_boss: [
    ['12 ÷ 4 = ?', ['2', '3', '4', '5'], 1], ['7 × 8 = ?', ['48', '52', '54', '56'], 3],
    ['√64 = ?', ['6', '7', '8', '9'], 2], ['15 + 28 = ?', ['41', '43', '45', '47'], 1],
    ['100 − 37 = ?', ['53', '63', '67', '73'], 1], ['9 × 6 = ?', ['48', '52', '54', '58'], 2],
    ['3² + 5 = ?', ['8', '10', '14', '17'], 2], ['5/8 dari 32 = ?', ['15', '18', '20', '24'], 2],
    ['48 ÷ 6 = ?', ['6', '7', '8', '9'], 2], ['25% dari 80 = ?', ['15', '20', '25', '30'], 1]
  ],
  fire_boss: [
    ['6 × 9 = ?', ['45', '52', '54', '58'], 2], ['81 ÷ 9 = ?', ['7', '8', '9', '10'], 2],
    ['13 × 4 = ?', ['42', '48', '52', '56'], 2], ['144 ÷ 12 = ?', ['10', '11', '12', '13'], 2],
    ['7² = ?', ['42', '47', '49', '56'], 2], ['3² × 4 = ?', ['24', '30', '32', '36'], 3],
    ['72 ÷ 8 = ?', ['8', '9', '10', '12'], 1], ['1/3 dari 24 = ?', ['6', '7', '8', '9'], 0],
    ['125 ÷ 5 = ?', ['20', '23', '24', '25'], 3], ['9 + 17 = ?', ['24', '25', '26', '27'], 2]
  ],
  frozen_boss: [
    ['2/5 dari 50 = ?', ['15', '18', '20', '25'], 2], ['4x = 36, x = ?', ['7', '8', '9', '10'], 2],
    ['Luas p.panjang 6×9?', ['30', '48', '54', '60'], 2], ['KPK dari 4 dan 6?', ['8', '10', '12', '16'], 2],
    ['(-3) + 8 = ?', ['3', '4', '5', '6'], 2], ['3/4 dari 24 = ?', ['12', '16', '18', '20'], 2],
    ['2x + 4 = 14, x = ?', ['4', '5', '6', '7'], 1], ['Keliling persegi, sisi = 7?', ['21', '28', '35', '49'], 1],
    ['Rata-rata dari 6, 9, 12 = ?', ['7', '8', '9', '10'], 2], ['2³ = ?', ['4', '6', '8', '16'], 2]
  ],
  final_boss: [
    ['2⁵ = ?', ['16', '32', '64', '128'], 1], ['√196 = ?', ['12', '13', '14', '15'], 2],
    ['5x − 10 = 15, x?', ['3', '4', '5', '6'], 2], ['Jumlah: 1+2+3...+10?', ['45', '50', '55', '60'], 2],
    ['3/8 + 5/8 = ?', ['1/2', '3/4', '7/8', '1'], 3], ['40% dari 90 = ?', ['30', '32', '36', '40'], 2],
    ['9² = ?', ['72', '81', '90', '99'], 1], ['(3 + 5) × 2 = ?', ['12', '14', '16', '18'], 2],
    ['√225 = ?', ['13', '14', '15', '16'], 2], ['17 − 9 + 4 = ?', ['10', '11', '12', '13'], 2]
  ]
};

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    username_key TEXT NOT NULL UNIQUE,
    salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS game_saves (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS verified_bosses (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    boss_id TEXT NOT NULL,
    score_points INTEGER NOT NULL,
    defeated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, boss_id)
  );
  CREATE TABLE IF NOT EXISTS game_sessions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at_ms INTEGER NOT NULL,
    completed_at_ms INTEGER,
    elapsed_ms INTEGER,
    completion_time_seconds INTEGER,
    formatted_completion_time TEXT,
    status TEXT NOT NULL DEFAULT 'active'
  );
  CREATE TABLE IF NOT EXISTS run_bosses (
    session_id INTEGER NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    boss_id TEXT NOT NULL,
    defeated_at_ms INTEGER NOT NULL,
    PRIMARY KEY (session_id, boss_id)
  );
  CREATE TABLE IF NOT EXISTS combats (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    boss_id TEXT NOT NULL,
    boss_hp INTEGER NOT NULL,
    question_index INTEGER NOT NULL,
    questions TEXT NOT NULL,
    correct_count INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    game_session_id INTEGER REFERENCES game_sessions(id)
  );
`);
if (!db.prepare('PRAGMA table_info(combats)').all().some(column => column.name === 'game_session_id')) {
  db.exec('ALTER TABLE combats ADD COLUMN game_session_id INTEGER REFERENCES game_sessions(id)');
}
db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(JSON.stringify(body));
};
const fail = (res, status, error) => send(res, status, { error });
const cookieValue = req => (req.headers.cookie || '').split(';').map(part => part.trim())
  .find(part => part.startsWith('numera_session='))?.slice('numera_session='.length);
const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1024 * 1024) reject(Object.assign(new Error('Request terlalu besar.'), { status: 413 }));
    });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { reject(Object.assign(new Error('Format JSON tidak valid.'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

function sessionUser(req) {
  const token = cookieValue(req);
  if (!token) return null;
  return db.prepare(`SELECT users.id, users.username FROM sessions
    JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ? AND sessions.expires_at > ?`)
    .get(hashToken(token), Date.now()) || null;
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  return !origin || new URL(origin).host === req.headers.host;
}

function validateSave(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
  if (!payload.player || !payload.world || !payload.stats || !payload.quest) return false;
  if (JSON.stringify(payload).length > 900_000) return false;
  if (!Array.isArray(payload.player.inventory) || payload.player.inventory.length > 200) return false;
  if (!Array.isArray(payload.world.unlocked) || !Array.isArray(payload.world.cleared)) return false;
  if (!Array.isArray(payload.bossesDefeated) || payload.bossesDefeated.length > BOSS_ORDER.length) return false;
  const numberFields = [payload.player.hp, payload.player.maxHp, payload.player.level, payload.player.exp,
    payload.stats.puzzlesSolved, payload.stats.bossesDefeated, payload.stats.score];
  if (!numberFields.every(value => Number.isFinite(value) && value >= 0 && value <= 10_000_000)) return false;
  return typeof payload.player.name === 'string' && payload.player.name.length <= 30;
}

function formatElapsedTime(elapsedMs) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return hours
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function publicLeaderboard(limit) {
  return db.prepare(`WITH ranked_runs AS (
      SELECT game_sessions.*, ROW_NUMBER() OVER (
        PARTITION BY user_id ORDER BY elapsed_ms ASC, completed_at_ms ASC
      ) AS best_rank
      FROM game_sessions WHERE status = 'completed' AND elapsed_ms IS NOT NULL
    )
    SELECT users.username, ranked_runs.id AS session_id, ranked_runs.elapsed_ms,
      ranked_runs.completion_time_seconds, ranked_runs.formatted_completion_time,
      ranked_runs.completed_at_ms, COUNT(run_bosses.boss_id) AS bosses_defeated
    FROM ranked_runs JOIN users ON users.id = ranked_runs.user_id
    LEFT JOIN run_bosses ON run_bosses.session_id = ranked_runs.id
    WHERE ranked_runs.best_rank = 1
    GROUP BY ranked_runs.id
    ORDER BY ranked_runs.elapsed_ms ASC, ranked_runs.completed_at_ms ASC, users.username_key ASC
    LIMIT ?`)
    .all(limit).map((row, index) => ({ rank: index + 1, username: row.username,
      elapsedMs: row.elapsed_ms, completionTimeSeconds: row.completion_time_seconds,
      formattedCompletionTime: row.formatted_completion_time,
      completedAt: new Date(row.completed_at_ms).toISOString(), completed: true,
      bossesDefeated: row.bosses_defeated, progression: row.bosses_defeated }));
}

async function api(req, res, url) {
  if (req.method !== 'GET' && !sameOrigin(req)) return fail(res, 403, 'Origin tidak diizinkan.');
  const user = sessionUser(req);

  if (req.method === 'POST' && url.pathname === '/api/register') {
    const body = await readJson(req);
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) return fail(res, 400, 'Username harus 3-20 karakter: huruf, angka, atau garis bawah.');
    if (password.length < 8 || password.length > 128) return fail(res, 400, 'Password harus berisi 8-128 karakter.');
    const salt = crypto.randomBytes(16);
    const passwordHash = crypto.scryptSync(password, salt, 64);
    try {
      const result = db.prepare('INSERT INTO users (username, username_key, salt, password_hash) VALUES (?, ?, ?, ?)')
        .run(username, username.toLowerCase(), salt.toString('hex'), passwordHash.toString('hex'));
      return createSession(res, Number(result.lastInsertRowid), username);
    } catch (error) {
      if (String(error.message).includes('UNIQUE')) return fail(res, 409, 'Username sudah digunakan.');
      throw error;
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/login') {
    const body = await readJson(req);
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const account = db.prepare('SELECT * FROM users WHERE username_key = ?').get(username.toLowerCase());
    const salt = account ? Buffer.from(account.salt, 'hex') : Buffer.alloc(16);
    const expected = account ? Buffer.from(account.password_hash, 'hex') : Buffer.alloc(64);
    const actual = crypto.scryptSync(password.slice(0, 128), salt, 64);
    if (!account || !crypto.timingSafeEqual(actual, expected)) return fail(res, 401, 'Username atau password tidak cocok.');
    return createSession(res, account.id, account.username);
  }

  if (req.method === 'GET' && url.pathname === '/api/me') {
    return user ? send(res, 200, { user: { username: user.username } }) : send(res, 200, { user: null });
  }

  if (req.method === 'POST' && url.pathname === '/api/logout') {
    const token = cookieValue(req);
    if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
    return send(res, 200, { ok: true }, { 'Set-Cookie': 'numera_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
  }

  if (req.method === 'GET' && url.pathname === '/api/leaderboard') {
    return send(res, 200, { entries: publicLeaderboard(Math.max(1, Math.min(100, Number(url.searchParams.get('limit')) || 20))) });
  }

  if (url.pathname.startsWith('/api/') && !user) return fail(res, 401, 'Silakan login terlebih dahulu.');

  if (req.method === 'GET' && url.pathname === '/api/game/session') {
    const session = db.prepare(`SELECT id, started_at_ms FROM game_sessions
      WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1`).get(user.id);
    return send(res, 200, { session: session ? { id: session.id, startedAtMs: session.started_at_ms } : null });
  }

  if (req.method === 'POST' && url.pathname === '/api/game/start') {
    db.prepare(`UPDATE game_sessions SET status = 'abandoned' WHERE user_id = ? AND status = 'active'`).run(user.id);
    db.prepare('DELETE FROM combats WHERE user_id = ?').run(user.id);
    const startedAtMs = Date.now();
    const result = db.prepare(`INSERT INTO game_sessions (user_id, started_at_ms, status)
      VALUES (?, ?, 'active')`).run(user.id, startedAtMs);
    return send(res, 200, { session: { id: Number(result.lastInsertRowid), startedAtMs } });
  }

  if (req.method === 'POST' && url.pathname === '/api/game/complete') {
    const session = db.prepare(`SELECT id, started_at_ms FROM game_sessions
      WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1`).get(user.id);
    if (!session) return fail(res, 409, 'Tidak ada sesi permainan aktif.');
    const defeated = new Set(db.prepare('SELECT boss_id FROM run_bosses WHERE session_id = ? AND user_id = ?')
      .all(session.id, user.id).map(row => row.boss_id));
    if (!BOSS_ORDER.every(bossId => defeated.has(bossId))) return fail(res, 409, 'Semua boss utama harus dikalahkan sebelum completion dicatat.');
    const completedAtMs = Date.now();
    const elapsedMs = Math.max(0, completedAtMs - session.started_at_ms);
    const completionTimeSeconds = Math.floor(elapsedMs / 1000);
    const formattedCompletionTime = formatElapsedTime(elapsedMs);
    db.prepare(`UPDATE game_sessions SET status = 'completed', completed_at_ms = ?, elapsed_ms = ?,
      completion_time_seconds = ?, formatted_completion_time = ? WHERE id = ? AND user_id = ? AND status = 'active'`)
      .run(completedAtMs, elapsedMs, completionTimeSeconds, formattedCompletionTime, session.id, user.id);
    return send(res, 200, { sessionId: session.id, startedAtMs: session.started_at_ms,
      completedAtMs, elapsedMs, completionTimeSeconds, formattedCompletionTime, completed: true });
  }

  if (req.method === 'GET' && url.pathname === '/api/save') {
    const row = db.prepare('SELECT payload, updated_at FROM game_saves WHERE user_id = ?').get(user.id);
    return send(res, 200, { save: row ? JSON.parse(row.payload) : null, updatedAt: row?.updated_at || null });
  }

  if (req.method === 'DELETE' && url.pathname === '/api/save') {
    db.prepare('DELETE FROM game_saves WHERE user_id = ?').run(user.id);
    db.prepare('DELETE FROM combats WHERE user_id = ?').run(user.id);
    db.prepare('DELETE FROM verified_bosses WHERE user_id = ?').run(user.id);
    return send(res, 200, { ok: true });
  }

  if (req.method === 'PUT' && url.pathname === '/api/save') {
    const body = await readJson(req);
    if (!validateSave(body.save)) return fail(res, 400, 'Data save tidak valid.');
    db.prepare(`INSERT INTO game_saves (user_id, payload, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET payload = excluded.payload, updated_at = CURRENT_TIMESTAMP`)
      .run(user.id, JSON.stringify(body.save));
    return send(res, 200, { ok: true });
  }

  if (req.method === 'POST' && url.pathname === '/api/combat/start') {
    const body = await readJson(req);
    const index = BOSS_ORDER.indexOf(body.bossId);
    if (index < 0) return fail(res, 400, 'Boss tidak dikenal.');
    const gameSession = db.prepare(`SELECT id FROM game_sessions WHERE user_id = ? AND status = 'active'
      ORDER BY id DESC LIMIT 1`).get(user.id);
    if (!gameSession) return fail(res, 409, 'Mulai permainan baru sebelum melawan boss.');
    const defeated = new Set(db.prepare('SELECT boss_id FROM run_bosses WHERE user_id = ? AND session_id = ?')
      .all(user.id, gameSession.id).map(row => row.boss_id));
    if (index > 0 && !defeated.has(BOSS_ORDER[index - 1])) return fail(res, 403, 'Boss sebelumnya belum tercatat kalah.');
    const questions = BOSS_QUESTIONS[body.bossId].map(([q, options, correct]) => ({ q, options, correct }));
    for (let i = questions.length - 1; i > 0; i--) {
      const j = crypto.randomInt(i + 1);
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    db.prepare(`INSERT INTO combats (user_id, boss_id, boss_hp, question_index, questions, correct_count, active, created_at, game_session_id)
      VALUES (?, ?, 100, 0, ?, 0, 1, ?, ?) ON CONFLICT(user_id) DO UPDATE SET boss_id=excluded.boss_id,
      boss_hp=100, question_index=0, questions=excluded.questions, correct_count=0, active=1, created_at=excluded.created_at`)
      .run(user.id, body.bossId, JSON.stringify(questions), Date.now(), gameSession.id);
    return send(res, 200, { questions: questions.map(({ q, options }) => ({ q, options })) });
  }

  if (req.method === 'POST' && url.pathname === '/api/combat/answer') {
    const body = await readJson(req);
    const combat = db.prepare('SELECT * FROM combats WHERE user_id = ? AND active = 1').get(user.id);
    if (!combat || combat.boss_id !== body.bossId || !Number.isInteger(body.answerIndex)) return fail(res, 409, 'Pertarungan tidak aktif atau jawaban tidak valid.');
    const gameSession = db.prepare(`SELECT id FROM game_sessions WHERE user_id = ? AND status = 'active'
      ORDER BY id DESC LIMIT 1`).get(user.id);
    if (!gameSession || gameSession.id !== combat.game_session_id) return fail(res, 409, 'Sesi permainan sudah tidak aktif.');
    const questions = JSON.parse(combat.questions);
    const question = questions[combat.question_index % questions.length];
    if (body.answerIndex < 0 || body.answerIndex >= question.options.length) return fail(res, 400, 'Pilihan jawaban tidak valid.');
    const correct = body.answerIndex === question.correct;
    const damage = correct ? (crypto.randomInt(100) < 18 ? 15 : 10) : 0;
    const bossHp = Math.max(0, combat.boss_hp - damage);
    const correctCount = combat.correct_count + Number(correct);
    const nextQuestionIndex = combat.question_index + 1;
    const defeated = bossHp === 0;
    const scoreDelta = correct ? 80 : 0;
    db.prepare('UPDATE combats SET boss_hp = ?, question_index = ?, correct_count = ?, active = ? WHERE user_id = ?')
      .run(bossHp, nextQuestionIndex, correctCount, Number(!defeated), user.id);
    if (defeated) {
      db.prepare('INSERT OR IGNORE INTO verified_bosses (user_id, boss_id, score_points) VALUES (?, ?, ?)')
        .run(user.id, combat.boss_id, correctCount * 80 + 300);
      const inserted = db.prepare('INSERT OR IGNORE INTO run_bosses (session_id, user_id, boss_id, defeated_at_ms) VALUES (?, ?, ?, ?)')
        .run(gameSession.id, user.id, combat.boss_id, Date.now());
      return send(res, 200, { correct, damage, bossHp, defeated: true, scoreDelta: scoreDelta + (inserted.changes ? 300 : 0) });
    }
    return send(res, 200, { correct, damage, bossHp, defeated: false, scoreDelta });
  }

  return fail(res, 404, 'Endpoint tidak ditemukan.');
}

function createSession(res, userId, username) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
    .run(hashToken(token), userId, expiresAt);
  return send(res, 200, { user: { username } }, {
    'Set-Cookie': `numera_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_DAYS * 24 * 60 * 60}`
  });
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') return fail(res, 405, 'Method tidak diizinkan.');
    const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const filePath = path.resolve(ROOT, `.${pathname}`);
    if (!filePath.startsWith(ROOT + path.sep) || /\.(sqlite|db)$/i.test(filePath) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404); return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) fail(res, error.status || 500, error.status ? error.message : 'Terjadi kesalahan server.');
    else res.destroy();
  }
});

server.listen(PORT, () => console.log(`NUMERA berjalan di http://localhost:${PORT}`));