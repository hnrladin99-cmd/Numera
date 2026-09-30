/* ============================================================
   NUMERA: THE LOST EQUATION — Game Engine v3.0
   Localisasi Bahasa Indonesia & Save Game System
   ============================================================ */
'use strict';

// ============================================================
// GAME DATA — Definisi Konten (Tidak berubah saat runtime)
// ============================================================
const DATA = {

  // ---- INTRO DIALOGUES ----
  intro: [
    { char: '🧙', name: 'Sage Axiom',
      text: 'Anak muda... Syukurlah kamu datang. Aku takut yang terburuk telah terjadi saat gempa melanda Numeria.' },
    { char: '🧙', name: 'Sage Axiom',
      text: '<span class="gold">Equation Core</span> — kristal kuno yang menjaga harmoni matematika — telah dihancurkan oleh kekuatan gelap yang dikenal sebagai <span class="gold">The Nullifier</span>.' },
    { char: '🧙', name: 'Sage Axiom',
      text: 'Tanpa Core tersebut, angka-angka kehilangan maknanya. Pola-pola hancur. Fondasi logika runtuh. Monster yang lahir dari kekacauan kini menjaga setiap pecahannya.' },
    { char: '⚡', name: 'The Nullifier',
      text: 'Ha ha ha... Era matematika telah BERAKHIR! Tidak akan ada lagi persamaan yang bisa dipecahkan! Dunia ini akan jatuh ke dalam kekacauan abadi yang indah!' },
    { char: '🧙', name: 'Sage Axiom',
      text: 'Empat Pecahan Persamaan (Equation Fragment) tersebar di berbagai wilayah. Kamu — <span class="gold">Arithmos</span> — adalah satu-satunya yang bisa mengumpulkannya. Selesaikan tantangannya, kalahkan para penjaga, dan pulihkan Equation Core!' }
  ],

  // ---- REGION DEFINITIONS ----
  regions: {
    village: {
      id: 'village', name: 'Desa Asal', icon: '🏘', bgClass: 'village',
      description: 'Sebuah desa damai di antara perbukitan. Penduduk berbisik tentang Equation Core yang hancur dengan wajah cemas. Di sinilah perjalananmu dimulai.',
      emoji: '🏘🌾🌅🌾🏘',
      npcId: 'village_elder', puzzleId: null, bossId: null
    },
    forest: {
      id: 'forest', name: 'Hutan Angka', icon: '🌲', bgClass: 'forest',
      description: 'Hutan kuno di mana pepohonan tumbuh dalam pola matematika. Penjaga Angka bersembunyi di dalam, terkorupsi oleh kekacauan Nullifier.',
      emoji: '🌲🍄🌲🌿🌲',
      npcId: 'forest_elder', puzzleId: 'forest_puzzle', bossId: 'forest_boss',
      keyItem: 'forest_key', keyItemName: 'Kunci Hutan',
      questId: 0, questSteps: { travel: 0, puzzle: 1, key: 2, boss: 3 }
    },
    fireland: {
      id: 'fireland', name: 'Tanah Api', icon: '🌋', bgClass: 'fireland',
      description: 'Tanah vulkanik di mana sungai lava mengalir dalam pola geometris. Penjaga Api mengendalikan api yang terbentuk dari persamaan yang rusak.',
      emoji: '🌋🔥🌋💨🌋',
      npcId: 'fire_elder', puzzleId: 'fire_puzzle', bossId: 'fire_boss',
      keyItem: 'fire_rune', keyItemName: 'Rune Api',
      questId: 1, questSteps: { travel: 0, key: 1, puzzle: 2, boss: 3 }
    },
    frozen: {
      id: 'frozen', name: 'Alam Beku', icon: '❄', bgClass: 'frozen',
      description: 'Lanskap musim dingin abadi di mana kepingan salju jatuh dalam urutan aljabar. Penjaga Es telah mengunci semua kehangatan di balik penghalang matematika.',
      emoji: '❄🏔❄⛄❄',
      npcId: 'ice_elder', puzzleId: 'frozen_puzzle', bossId: 'frozen_boss',
      keyItem: 'ice_shard', keyItemName: 'Pecahan Es',
      questId: 2, questSteps: { travel: 0, key: 1, puzzle: 2, boss: 3 }
    },
    castle: {
      id: 'castle', name: 'Kastil Kuno', icon: '🏰', bgClass: 'castle',
      description: 'Benteng Nullifier, di mana semua kekacauan matematika berpusat. Boss Terakhir menantimu di puncak. Ini adalah ujian terakhirmu.',
      emoji: '🏰⚡🌑💀🏰',
      npcId: 'castle_sage', puzzleId: 'castle_puzzle', bossId: 'final_boss',
      keyItem: null,
      questId: 3, questSteps: { travel: 0, puzzle: 1, boss: 2, core: 3 }
    }
  },

  // ---- NPC DATA ----
  npcs: {
    village_elder: {
      name: 'Elder Sigma', char: '👴',
      greeting: 'Ah, Arithmos muda! Kamu telah menjawab panggilan ini. Jalan ke utara menuju Hutan Angka — dulunya indah, kini terpelintir oleh kekacauan Nullifier. Temukan Penjaga dan rebut pecahan pertama!',
      choices: [
        { label: '🗺 Beri tahu aku tentang wilayah-wilayah', response: 'Ada empat wilayah yang menjaga Pecahan Persamaan: Hutan, Tanah Api, Alam Beku, dan Kastil Kuno. Setiap penjaga semakin kuat dari sebelumnya. Kalahkan mereka secara berurutan untuk memulihkan Core.' },
        { label: '💎 Apa itu Equation Core?', response: 'Core itu ditempa oleh Ahli Matematika Kuno untuk menjaga keseimbangan semua angka. Tanpanya, 2+2 mungkin sama dengan 5, dan tak terhingga bisa menjadi nol. Kekacauan terjadi ketika matematika rusak.' },
        { label: '⚔ Ada saran untuk perjalananku?', response: 'Percayalah pada logikamu. Jawaban benar memberikan 10 damage ke boss, dengan peluang critical 18% yang meningkatkan damage menjadi 15. Jawaban salah membuatmu kehilangan 20 HP. Kurangi HP boss hingga nol untuk menang. Gunakan ramuan dengan bijak!' },
        { label: '👋 Selamat tinggal', response: null, action: 'leave' }
      ]
    },
    forest_elder: {
      name: 'Sylvan Equa', char: '🧝',
      greeting: 'Berhenti, pengembara! Aku Sylvan Equa, penjaga hutan ini. Sang Penjaga — binatang buas yang terbuat dari persamaan yang rusak — telah mengorupsi segalanya. Buka peti untuk menemukan Kunci Hutan, lalu selesaikan Batu Teka-teki untuk membuktikan kemampuanmu!',
      choices: [
        { label: '👹 Siapakah Sang Penjaga?', response: 'Penjaga Angka dulunya adalah pelindung yang damai. Kekuatan Nullifier mengubahnya menjadi buas. Ia memiliki 100 HP — jawaban benar memberikan 10 damage, atau 15 damage jika seranganmu critical (peluang 18%). Jawaban salah membuatmu terkena 20 damage.' },
        { label: '🗡 Bagaimana cara mengalahkannya?', response: 'Jawaban benar memberikan 10 damage ke boss, dengan peluang critical 18% yang meningkatkan damage menjadi 15. Jawaban salah memberikan 20 damage padamu. Boss mulai dengan 100 HP. Tetap tenang dan berpikir dengan teliti!' },
        { label: '🧩 Teka-teki apa yang harus kuselesaikan?', response: 'Batu Urutan ada di depan. Jawab keempat tantangan matematika dengan benar untuk mendapatkan Kunci Hutan. Tanpa kunci itu, sarang Sang Penjaga akan tetap tertutup.', action: 'hint_puzzle' },
        { label: '👋 Tinggalkan', response: null, action: 'leave' }
      ]
    },
    fire_elder: {
      name: 'Ignis Primus', char: '🔥',
      greeting: 'Jadi kamu selamat dari Hutan... mengesankan, Arithmos muda. Tapi Tanah Api jauh lebih berbahaya. Penjaga Api mengendalikan matematika vulkanik — persamaan yang ditempa dalam lava. Temukan Rune Api di peti dan hadapi ujianmu!',
      choices: [
        { label: '🌋 Apa itu Tanah Api?', response: 'Tanah Api adalah gurun vulkanik yang terkorupsi oleh kekacauan perkalian. Setiap api menyala dengan rasio yang salah, setiap letusan mengikuti urutan yang rusak. Penjaga Api lebih kuat dari Penjaga Hutan — 100 HP, tapi pertanyaannya lebih sulit.' },
        { label: '🔥 Bagaimana cara mengalahkan Penjaga Api?', response: 'Jawaban benar memberi 10 damage, atau 15 damage jika seranganmu critical (peluang 18%). Jawaban salah mengorbankan 20 HP-mu. Pertanyaan ini melibatkan perkalian dan pembagian — tetap fokus! Jaga HP-mu dengan menggunakan ramuan jika perlu.' },
        { label: '🗝 Di mana Rune Api berada?', response: 'Rune Api terkunci di dalam peti vulkanik di dekat sini. Buka untuk mendapatkan akses ke ruang Penjaga. Tanpanya, gerbang api tidak akan terbuka untukmu.' },
        { label: '👋 Tinggalkan', response: null, action: 'leave' }
      ]
    },
    ice_elder: {
      name: 'Cryo Sigma', char: '🧊',
      greeting: 'Kamu sudah tiba sejauh ini, Arithmos pemberani. Alam Beku menguji penguasaanmu terhadap pecahan dan aljabar. Penjaga Es adalah yang paling sabar dari semuanya — ia menunggu, dan pertanyaannya menusuk sedingin angin. Persiapkan dirimu.',
      choices: [
        { label: '❄ Apa yang menanti di Alam Beku?', response: 'Kepingan salju berjatuhan dalam urutan aljabar di sini. Pecahan Es tersembunyi di peti yang membeku — kamu akan membutuhkannya untuk masuk ke ruangan Penjaga. Teka-teki di sini menguji pecahan dan persamaan.' },
        { label: '🏔 Seberapa kuat Penjaga Es?', response: 'Penjaga Es memiliki 100 HP seperti yang lainnya, tetapi serangannya penuh perhitungan dan presisi. Jawaban salah mengorbankan 20 HP. Jawaban benar memberikan 10 damage, atau 15 damage saat seranganmu critical (peluang 18%).' },
        { label: '📐 Matematika seperti apa yang akan kuhadapi?', response: 'Pecahan, aljabar dasar, dan pola geometris. Luangkan waktumu — tidak seperti api, es memberimu ruang untuk berpikir. Tapi jangan lengah!' },
        { label: '👋 Tinggalkan', response: null, action: 'leave' }
      ]
    },
    castle_sage: {
      name: 'Sang Petapa Tersegel', char: '👻',
      greeting: 'Kamu membawa tiga Pecahan Persamaan... Aku bisa merasakan kekuatannya. Nullifier menanti di puncak kastil ini bersama pecahan terakhir. Inilah saatnya, Arithmos. Nasib Numeria bergantung pada apa yang kamu lakukan selanjutnya. Hadapi Boss Terakhir!',
      choices: [
        { label: '💀 Beritahu aku tentang Boss Terakhir', response: 'Nullifier sendiri telah mengambil wujud fisik di dalam kastil. Dia memiliki 100 HP, dan pertanyaannya mencakup semua matematika — pola, operasi, aljabar, segalanya. Jawaban benar memberikan 10 damage, atau 15 damage jika seranganmu critical (peluang 18%). Jawaban salah membuatmu terkena 20 damage. Tetap fokus!' },
        { label: '💎 Aku punya ketiga pecahan', response: 'Ya! Dengan tiga pecahan dan kekuatan yang kamu kumpulkan, kamu sudah siap. Kalahkan Nullifier dan keempat pecahan itu akan bersatu untuk memulihkan Equation Core selamanya. Numeria mengandalkanmu!' },
        { label: '⚔ Aku siap', response: 'Maka pergilah, Arithmos! Buktikan bahwa matematika tidak dapat dibungkam. Kekuatan kuno dari angka ada bersamamu!', action: 'hint_boss' },
        { label: '👋 Tinggalkan', response: null, action: 'leave' }
      ]
    }
  },

  // ---- PUZZLE DATA ----
  puzzles: {
    forest_puzzle: [
      { title: 'Pengenalan Pola',
        flavor: 'Batu Urutan bersinar dengan pola misterius...',
        question: '2 → 4 → 8 → 16 → ?',
        hint: 'Setiap angka dikalikan dengan jumlah yang sama',
        answers: ['18', '24', '32', '36'], correct: 2,
        explanation: 'Setiap angka × 2: jadi 16 × 2 = 32 ✓' },
      { title: 'Angka yang Hilang',
        flavor: 'Gerbang terkunci memiliki teka-teki angka yang terukir...',
        question: '3 + ? = 11',
        hint: 'Kurangi: 11 − 3 = ?',
        answers: ['7', '8', '9', '6'], correct: 1,
        explanation: '11 − 3 = 8. Angka yang hilang adalah 8 ✓' },
      { title: "Rahasia Fibonacci",
        flavor: "Akar pohon kuno membentuk urutan terkenal...",
        question: '1, 1, 2, 3, 5, ?',
        hint: 'Setiap angka adalah jumlah dari dua angka sebelumnya',
        answers: ['6', '7', '8', '9'], correct: 2,
        explanation: '3 + 5 = 8. Ini adalah urutan Fibonacci ✓' },
      { title: 'Perkalian Hutan',
        flavor: 'Roh hutan berbicara: "Hitung daun di semua pohon..."',
        question: '5 pohon × 4 daun = ?',
        hint: 'Total daun = pohon × daun per pohon',
        answers: ['16', '18', '20', '22'], correct: 2,
        explanation: '5 × 4 = 20. Total ada dua puluh daun ✓' }
    ],
    fire_puzzle: [
      { title: 'Api Pembagian',
        flavor: 'Aliran lava terbagi ke dalam saluran — hitung jalurnya...',
        question: '48 ÷ 6 = ?',
        hint: 'Berapa kali 6 masuk ke dalam 48?',
        answers: ['6', '7', '8', '9'], correct: 2,
        explanation: '48 ÷ 6 = 8. Delapan saluran lava ✓' },
      { title: 'Perkalian Vulkanik',
        flavor: 'Gunung berapi bergemuruh — letusannya mengikuti pola...',
        question: '9 × 7 = ?',
        hint: '9 × 7 = 9 × 5 + 9 × 2',
        answers: ['54', '56', '63', '72'], correct: 2,
        explanation: '9 × 7 = 63. Gunung berapi meraung menyetujui ✓' },
      { title: 'Persentase Api',
        flavor: 'Api menyala pada tepat setengah intensitas maksimumnya...',
        question: '50% dari 80 = ?',
        hint: 'Setengah dari 80',
        answers: ['30', '35', '40', '45'], correct: 2,
        explanation: '50% = setengah. 80 ÷ 2 = 40 ✓' },
      { title: 'Urutan Lava',
        flavor: 'Lava meletus dalam suatu pola: perhatikan jedanya...',
        question: '5, 10, 20, 40, ?',
        hint: 'Setiap angka dikalikan dengan faktor yang sama',
        answers: ['60', '70', '80', '40'], correct: 2,
        explanation: 'Masing-masing × 2: 40 × 2 = 80 ✓' }
    ],
    frozen_puzzle: [
      { title: 'Pecahan Es',
        flavor: 'Kristal es membentuk pola pecahan di atas kepala...',
        question: '3/4 dari 24 = ?',
        hint: 'Bagi dengan 4, lalu kalikan dengan 3',
        answers: ['12', '16', '18', '20'], correct: 2,
        explanation: '24 ÷ 4 = 6, lalu 6 × 3 = 18 ✓' },
      { title: 'Aljabar Beku',
        flavor: 'Gerbang beku memiliki kunci aljabar...',
        question: '2x + 4 = 14, x = ?',
        hint: 'Kurangi 4 dari kedua sisi, lalu bagi dengan 2',
        answers: ['4', '5', '6', '7'], correct: 1,
        explanation: '2x = 10, jadi x = 5 ✓' },
      { title: 'Geometri Kepingan Salju',
        flavor: 'Kepingan salju memiliki 6 segmen yang sama persis...',
        question: 'Keliling persegi, sisi = 7?',
        hint: 'Tambahkan keempat sisi yang sama panjang',
        answers: ['21', '28', '35', '49'], correct: 1,
        explanation: '4 × 7 = 28. Empat sisi dengan panjang 7 ✓' },
      { title: 'Rata-Rata Badai Salju',
        flavor: 'Suhu yang dicatat selama 3 hari harus dirata-rata...',
        question: 'Rata-rata dari 6, 9, 12 = ?',
        hint: 'Jumlahkan, bagi dengan banyaknya angka',
        answers: ['7', '8', '9', '10'], correct: 2,
        explanation: '(6+9+12) ÷ 3 = 27 ÷ 3 = 9 ✓' }
    ],
    castle_puzzle: [
      { title: 'Kekuatan Inti',
        flavor: 'Dinding kastil berdenyut dengan energi matematika kuno...',
        question: '2³ = ?',
        hint: '2 dikalikan dengan dirinya sendiri 3 kali',
        answers: ['4', '6', '8', '16'], correct: 2,
        explanation: '2 × 2 × 2 = 8. Kekuatan telah terbuka ✓' },
      { title: "Teka-teki Nullifier",
        flavor: 'Prasasti gelap tertulis: temukan yang tak diketahui...',
        question: '√144 = ?',
        hint: 'Angka berapa yang jika dikalikan dengan dirinya sendiri bernilai 144?',
        answers: ['10', '11', '12', '13'], correct: 2,
        explanation: '12 × 12 = 144, jadi √144 = 12 ✓' },
      { title: 'Persamaan Kekacauan',
        flavor: 'Nullifier menyebarkan persamaan ini di dinding...',
        question: '3x − 7 = 14, x = ?',
        hint: 'Tambahkan 7 ke kedua sisi, lalu bagi dengan 3',
        answers: ['5', '6', '7', '8'], correct: 2,
        explanation: '3x = 21, jadi x = 7 ✓' },
      { title: 'Urutan Terakhir',
        flavor: 'Gerbang terakhir terbuka dengan jawaban akhir...',
        question: 'Bilangan prima setelah 11 = ?',
        hint: 'Bilangan prima tidak memiliki pembagi selain 1 dan dirinya sendiri',
        answers: ['12', '13', '14', '15'], correct: 1,
        explanation: '13 adalah bilangan prima — hanya bisa dibagi 1 dan 13 ✓' }
    ]
  },

  // ---- BOSS DATA ----
  bosses: {
    forest_boss: {
      name: 'Penjaga Angka', char: '🐲',
      maxHp: 100, damagePerHit: 10, playerDmgPerMiss: 20, playerCritChance: 0.18, playerCritMultiplier: 1.5,
      questions: [
        { q: '12 ÷ 4 = ?',     options: ['2','3','4','5'],   correct: 1 },
        { q: '7 × 8 = ?',      options: ['48','52','54','56'], correct: 3 },
        { q: '√64 = ?',        options: ['6','7','8','9'],    correct: 2 },
        { q: '15 + 28 = ?',    options: ['41','43','45','47'], correct: 1 },
        { q: '100 − 37 = ?',   options: ['53','63','67','73'], correct: 1 },
        { q: '9 × 6 = ?',      options: ['48','52','54','58'], correct: 2 },
        { q: '3² + 5 = ?',     options: ['8','10','14','17'], correct: 2 },
        { q: '5/8 dari 32 = ?', options: ['15','18','20','24'], correct: 2 },
        { q: '48 ÷ 6 = ?',    options: ['6','7','8','9'],    correct: 2 },
        { q: '25% dari 80 = ?', options: ['15','20','25','30'], correct: 1 }
      ],
      rewardExp: 150, rewardItem: 'eq_fragment_1',
      unlocks: 'fireland',
      victoryStory: 'Penjaga Angka runtuh — wujud kekacauannya hancur menjadi serpihan cahaya matematika murni. Pecahan Persamaan pertama bangkit dari puing-puing, berdenyut dengan harmoni yang telah pulih.',
      nextQuest: 1
    },
    fire_boss: {
      name: 'Penjaga Api', char: '🐉',
      maxHp: 100, damagePerHit: 10, playerDmgPerMiss: 20, playerCritChance: 0.18, playerCritMultiplier: 1.5,
      questions: [
        { q: '6 × 9 = ?',       options: ['45','52','54','58'], correct: 2 },
        { q: '81 ÷ 9 = ?',      options: ['7','8','9','10'],    correct: 2 },
        { q: '13 × 4 = ?',      options: ['42','48','52','56'], correct: 2 },
        { q: '144 ÷ 12 = ?',    options: ['10','11','12','13'], correct: 2 },
        { q: '7² = ?',          options: ['42','47','49','56'], correct: 2 },
        { q: '3² × 4 = ?',      options: ['24','30','32','36'], correct: 3 },
        { q: '72 ÷ 8 = ?',      options: ['8','9','10','12'], correct: 1 },
        { q: '1/3 dari 24 = ?', options: ['6','7','8','9'],    correct: 0 },
        { q: '125 ÷ 5 = ?',     options: ['20','23','24','25'], correct: 3 },
        { q: '9 + 17 = ?',      options: ['24','25','26','27'], correct: 2 }
      ],
      rewardExp: 200, rewardItem: 'eq_fragment_2',
      unlocks: 'frozen',
      victoryStory: 'Penjaga Api mengeluarkan raungan vulkanik saat jawaban benarmu yang terakhir mengenainya. Pecahan Persamaan kedua muncul dari lava yang mendingin, bersinar redup dan anggun.',
      nextQuest: 2
    },
    frozen_boss: {
      name: 'Penjaga Es', char: '🐺',
      maxHp: 100, damagePerHit: 10, playerDmgPerMiss: 20, playerCritChance: 0.18, playerCritMultiplier: 1.5,
      questions: [
        { q: '2/5 dari 50 = ?',  options: ['15','18','20','25'], correct: 2 },
        { q: '4x = 36, x = ?',   options: ['7','8','9','10'],    correct: 2 },
        { q: 'Luas p.panjang 6×9?', options: ['30','48','54','60'], correct: 2 },
        { q: 'KPK dari 4 dan 6?', options: ['8','10','12','16'], correct: 2 },
        { q: '(-3) + 8 = ?',     options: ['3','4','5','6'],     correct: 2 },
        { q: '3/4 dari 24 = ?',  options: ['12','16','18','20'], correct: 2 },
        { q: '2x + 4 = 14, x = ?', options: ['4','5','6','7'], correct: 1 },
        { q: 'Keliling persegi, sisi = 7?', options: ['21','28','35','49'], correct: 1 },
        { q: 'Rata-rata dari 6, 9, 12 = ?', options: ['7','8','9','10'], correct: 2 },
        { q: '2³ = ?',          options: ['4','6','8','16'], correct: 2 }
      ],
      rewardExp: 250, rewardItem: 'eq_fragment_3',
      unlocks: 'castle',
      victoryStory: 'Penjaga Es hancur menjadi ribuan serpihan kristal. Pecahan Persamaan ketiga bangkit, terasa hangat saat disentuh meskipun udara di sekitarnya sangat dingin.',
      nextQuest: 3
    },
    final_boss: {
      name: 'Sang Nullifier', char: '😈',
      maxHp: 100, damagePerHit: 10, playerDmgPerMiss: 20, playerCritChance: 0.18, playerCritMultiplier: 1.5,
      questions: [
        { q: '2⁵ = ?',           options: ['16','32','64','128'], correct: 1 },
        { q: '√196 = ?',         options: ['12','13','14','15'],  correct: 2 },
        { q: '5x − 10 = 15, x?', options: ['3','4','5','6'],      correct: 2 },
        { q: 'Jumlah: 1+2+3...+10?', options: ['45','50','55','60'], correct: 2 },
        { q: '3/8 + 5/8 = ?',    options: ['1/2','3/4','7/8','1'], correct: 3 },
        { q: '40% dari 90 = ?',  options: ['30','32','36','40'], correct: 2 },
        { q: '9² = ?',           options: ['72','81','90','99'], correct: 1 },
        { q: '(3 + 5) × 2 = ?', options: ['12','14','16','18'], correct: 2 },
        { q: '√225 = ?',         options: ['13','14','15','16'], correct: 2 },
        { q: '17 − 9 + 4 = ?',   options: ['10','11','12','13'], correct: 2 }
      ],
      rewardExp: 500, rewardItem: 'equation_core',
      unlocks: null,
      victoryStory: 'Nullifier menjerit saat jawaban benarmu yang terakhir menghancurkan wujud gelapnya sepenuhnya. Pecahan Persamaan keempat dan terakhir melayang dari tubuhnya yang hancur — dan keempat pecahan mulai bersinar terang...',
      nextQuest: -1 // triggers ending
    }
  },

  // ---- ITEM DATA ----
  items: {
    potion:        { id: 'potion',        name: 'Ramuan Darah',        icon: '🧪', type: 'Konsumsi',     desc: 'Ramuan biru berkilau yang memulihkan 40 HP.', usable: true, healAmount: 40 },
    enlighment_stone: { id: 'enlighment_stone', name: 'Enlighment Stone', icon: '🔮', type: 'Konsumsi', desc: 'Batu langka yang menandai jawaban benar pada satu pertanyaan teka-teki atau pertarungan boss.', usable: true, stackable: true },
    number_crystal:{ id: 'number_crystal',name: 'Kristal Angka',       icon: '💎', type: 'Barang Misi',  desc: 'Kristal yang berdengung dengan energi matematika. Bersinar saat di dekat teka-teki.', usable: false },
    forest_key:    { id: 'forest_key',    name: 'Kunci Hutan',         icon: '🗝', type: 'Kunci',        desc: 'Kunci ajaib dari Hutan Angka. Digunakan untuk membuka Sarang Penjaga.', usable: false },
    fire_rune:     { id: 'fire_rune',     name: 'Rune Api',            icon: '🔑', type: 'Kunci',        desc: 'Batu rune vulkanik. Diperlukan untuk masuk ke ruang Penjaga Api.', usable: false },
    ice_shard:     { id: 'ice_shard',     name: 'Pecahan Es',          icon: '❄', type: 'Kunci',        desc: 'Pecahan dari es abadi. Dibutuhkan untuk membuka gerbang Penjaga Es.', usable: false },
    eq_fragment_1: { id: 'eq_fragment_1', name: 'Pecahan Persamaan I', icon: '✨', type: 'Pecahan Inti', desc: 'Pecahan pertama dari Equation Core. Berdenyut dengan harmoni angka yang pulih.', usable: false },
    eq_fragment_2: { id: 'eq_fragment_2', name: 'Pecahan Persamaan II',icon: '✨', type: 'Pecahan Inti', desc: 'Pecahan kedua. Sinarnya membesar saat didekatkan dengan yang pertama.', usable: false },
    eq_fragment_3: { id: 'eq_fragment_3', name: 'Pecahan Persamaan III',icon:'✨', type: 'Pecahan Inti', desc: 'Pecahan ketiga. Tiga sudah terkumpul, satu lagi tersisa.', usable: false },
    equation_core: { id: 'equation_core', name: 'Equation Core',       icon: '🔮', type: 'Relik Kuno',   desc: 'Equation Core yang telah pulih sepenuhnya. Harmoni matematika kembali mengalir ke seluruh Numeria.', usable: false }
  },

  // ---- QUEST DATA ----
  quests: [
    {
      id: 0, title: 'Cari Penjaga Angka',
      steps: [
        { text: 'Pergi ke Hutan Angka', done: false },
        { text: 'Selesaikan Batu Teka-teki', done: false },
        { text: 'Dapatkan Kunci Hutan', done: false },
        { text: 'Kalahkan Penjaga Angka', done: false }
      ]
    },
    {
      id: 1, title: 'Klaim Pecahan Persamaan II',
      steps: [
        { text: 'Lakukan perjalanan ke Tanah Api', done: false },
        { text: 'Temukan Rune Api', done: false },
        { text: 'Selesaikan Teka-teki Api', done: false },
        { text: 'Kalahkan Penjaga Api', done: false }
      ]
    },
    {
      id: 2, title: 'Capai Alam Beku',
      steps: [
        { text: 'Lakukan perjalanan ke Alam Beku', done: false },
        { text: 'Temukan Pecahan Es', done: false },
        { text: 'Selesaikan Teka-teki Beku', done: false },
        { text: 'Kalahkan Penjaga Es', done: false }
      ]
    },
    {
      id: 3, title: 'Pulihkan Equation Core',
      steps: [
        { text: 'Masuki Kastil Kuno', done: false },
        { text: 'Selesaikan Teka-teki Kastil', done: false },
        { text: 'Hadapi Nullifier — Boss Terakhir', done: false },
        { text: 'Pulihkan Equation Core', done: false }
      ]
    }
  ]
};

const PUZZLE_GENERATORS = {
  forest_puzzle: ['forest_doubling', 'forest_missing_addend', 'forest_sequence', 'forest_multiplication'],
  fire_puzzle: ['fire_division', 'fire_multiplication', 'fire_percentage', 'fire_sequence'],
  frozen_puzzle: ['ice_fraction', 'ice_algebra', 'ice_perimeter', 'ice_average'],
  castle_puzzle: ['castle_power', 'castle_square_root', 'castle_algebra', 'castle_prime']
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createPuzzleOptions(answer, excludedAnswers = []) {
  const excluded = new Set(excludedAnswers.map(String));
  const candidates = [];
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30].forEach(offset => {
    candidates.push(answer + offset, answer - offset);
  });

  let offset = 35;
  while (candidates.filter(value => value >= 0 && !excluded.has(String(value))).length < 3) {
    candidates.push(answer + offset, answer - offset);
    offset += 10;
  }

  const distractors = shuffle([...new Set(candidates
    .filter(value => value >= 0 && value !== answer && !excluded.has(String(value))))])
    .slice(0, 3);
  const answers = shuffle([answer, ...distractors].map(String));
  return { answers, correct: answers.indexOf(String(answer)) };
}

function generatePuzzleQuestion(generator, template, excludedAnswers = [], previousQuestion = '', attempt = 0) {
  let question;
  let answer;
  let hint = template.hint;

  switch (generator) {
    case 'forest_doubling': {
      const start = randomInt(2, 8);
      const values = [start, start * 2, start * 4, start * 8];
      answer = start * 16;
      question = `${values.join(' → ')} → ?`;
      hint = 'Perhatikan faktor pengali yang sama di antara setiap angka.';
      break;
    }
    case 'forest_missing_addend': {
      const first = randomInt(4, 20);
      answer = randomInt(3, 18);
      question = `${first} + ? = ${first + answer}`;
      hint = `Kurangi ${first} dari jumlah di ruas kanan.`;
      break;
    }
    case 'forest_sequence': {
      const first = randomInt(1, 8);
      const second = randomInt(1, 8);
      const sequence = [first, second];
      while (sequence.length < 5) sequence.push(sequence[sequence.length - 1] + sequence[sequence.length - 2]);
      answer = sequence.pop();
      question = `${sequence.join(', ')}, ?`;
      hint = 'Setiap angka merupakan jumlah dari dua angka sebelumnya.';
      break;
    }
    case 'forest_multiplication': {
      const trees = randomInt(3, 9);
      const leaves = randomInt(2, 8);
      answer = trees * leaves;
      question = `${trees} pohon × ${leaves} daun = ?`;
      hint = 'Kalikan jumlah pohon dengan daun pada setiap pohon.';
      break;
    }
    case 'fire_division': {
      const divisor = randomInt(3, 12);
      const quotient = randomInt(3, 12);
      answer = divisor * quotient;
      question = `${answer} ÷ ${divisor} = ?`;
      hint = `Cari angka yang jika dikalikan ${divisor} menghasilkan ${answer}.`;
      answer = quotient;
      break;
    }
    case 'fire_multiplication': {
      const first = randomInt(4, 12);
      const second = randomInt(3, 9);
      answer = first * second;
      question = `${first} × ${second} = ?`;
      hint = 'Gunakan perkalian atau penjumlahan berulang.';
      break;
    }
    case 'fire_percentage': {
      const percent = [10, 20, 25, 50, 75][randomInt(0, 4)];
      const amount = randomInt(10, 50) * 4;
      answer = amount * percent / 100;
      question = `${percent}% dari ${amount} = ?`;
      hint = `Ubah ${percent}% menjadi pecahan dari 100, lalu kalikan dengan ${amount}.`;
      break;
    }
    case 'fire_sequence': {
      const factor = randomInt(2, 3);
      const start = randomInt(2, 8);
      const values = [start, start * factor, start * factor ** 2];
      answer = start * factor ** 3;
      question = `${values.join(', ')}, ?`;
      hint = `Setiap angka dikalikan dengan faktor yang sama (${factor}).`;
      break;
    }
    case 'ice_fraction': {
      const denominator = randomInt(2, 5);
      const numerator = randomInt(1, denominator - 1);
      const amount = denominator * randomInt(4, 20);
      answer = numerator * amount / denominator;
      question = `${numerator}/${denominator} dari ${amount} = ?`;
      hint = `Bagi ${amount} dengan ${denominator}, lalu kalikan hasilnya dengan ${numerator}.`;
      break;
    }
    case 'ice_algebra': {
      const coefficient = randomInt(2, 8);
      const x = randomInt(2, 12);
      const constant = randomInt(1, 15);
      answer = x;
      question = `${coefficient}x + ${constant} = ${coefficient * x + constant}, x = ?`;
      hint = `Kurangi ${constant} dari kedua sisi, lalu bagi dengan ${coefficient}.`;
      break;
    }
    case 'ice_perimeter': {
      const side = randomInt(4, 15);
      answer = side * 4;
      question = `Keliling persegi dengan sisi ${side} = ?`;
      hint = 'Persegi memiliki empat sisi yang sama panjang.';
      break;
    }
    case 'ice_average': {
      const average = randomInt(5, 18);
      const firstOffset = randomInt(-4, 4);
      const secondOffset = randomInt(-4, 4);
      const values = [average + firstOffset, average + secondOffset, average - firstOffset - secondOffset];
      answer = average;
      question = `Rata-rata dari ${values.join(', ')} = ?`;
      hint = 'Jumlahkan semua angka, lalu bagi dengan banyaknya angka.';
      break;
    }
    case 'castle_power': {
      const base = randomInt(2, 5);
      const exponent = randomInt(2, 3);
      answer = base ** exponent;
      question = `${base}${exponent === 2 ? '²' : '³'} = ?`;
      hint = `Kalikan ${base} dengan dirinya sendiri sebanyak ${exponent} kali.`;
      break;
    }
    case 'castle_square_root': {
      const root = randomInt(5, 20);
      answer = root;
      question = `√${root ** 2} = ?`;
      hint = 'Cari angka yang jika dikalikan dengan dirinya sendiri menghasilkan bilangan di dalam akar.';
      break;
    }
    case 'castle_algebra': {
      const coefficient = randomInt(2, 9);
      const x = randomInt(2, 12);
      const constant = randomInt(1, 15);
      const subtract = Math.random() < 0.5;
      answer = x;
      question = subtract
        ? `${coefficient}x − ${constant} = ${coefficient * x - constant}, x = ?`
        : `${coefficient}x + ${constant} = ${coefficient * x + constant}, x = ?`;
      hint = subtract
        ? `Tambahkan ${constant} ke kedua sisi, lalu bagi dengan ${coefficient}.`
        : `Kurangi ${constant} dari kedua sisi, lalu bagi dengan ${coefficient}.`;
      break;
    }
    case 'castle_prime': {
      const primes = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
      answer = primes[randomInt(0, primes.length - 1)];
      let previous = answer - 1;
      while (previous > 1 && !primes.includes(previous) && previous % 2 === 0) previous--;
      while (previous > 1) {
        let isPrime = true;
        for (let divisor = 2; divisor <= Math.sqrt(previous); divisor++) {
          if (previous % divisor === 0) { isPrime = false; break; }
        }
        if (isPrime) break;
        previous--;
      }
      question = `Bilangan prima setelah ${previous} = ?`;
      hint = 'Bilangan prima hanya habis dibagi 1 dan dirinya sendiri.';
      break;
    }
    default:
      return { ...template };
  }

  if ((excludedAnswers.map(String).includes(String(answer)) || question === previousQuestion) && attempt < 100) {
    return generatePuzzleQuestion(generator, template, excludedAnswers, previousQuestion, attempt + 1);
  }
  const options = createPuzzleOptions(answer, excludedAnswers);
  return {
    ...template,
    question,
    hint,
    answers: options.answers,
    correct: options.correct,
    explanation: `${question.replace('?', String(answer))} ✓`
  };
}

// ============================================================
// GAME STATE — Persisten antar layar
// ============================================================
const DEFAULT_STATE = {
  screen: 'menu',
  prevScreen: null,

  player: {
    name: 'Arithmos',
    hp: 100, maxHp: 100,
    respawnsRemaining: 3,
    level: 1, exp: 0, maxExp: 100,
    inventory: ['potion', 'number_crystal']
  },

  world: {
    unlocked: ['village', 'forest'],
    cleared: ['village'],
    current: null
  },

  puzzleProgress: {},
  bossesDefeated: [],

  battle: {
    bossId: null,
    bossHp: 0,
    questionIndex: 0,
    questionOrder: [],
    answered: false,
    dmgDealtToBoss: 0,
    dmgTakenByPlayer: 0,
    correctCount: 0
  },

  quest: {
    activeIndex: 0,
    stepsCompleted: {}
  },

  stats: {
    puzzlesSolved: 0,
    bossesDefeated: 0,
    regionsCleared: 1,
    itemsCollected: 2,
    score: 0,
    damageTaken: 0
  },

  intro: { index: 0 },
  npc: { id: null },
  victory: { bossId: null }
};

// Deep copy clone
let State = JSON.parse(JSON.stringify(DEFAULT_STATE));

// ============================================================
// UTILITIES
// ============================================================
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

function showToast(msg, type = '', dur = 2800) {
  const t = $('toast');
  t.textContent = msg;
  t.className = `toast show${type ? ' toast-' + type : ''}`;
  clearTimeout(t._t);
  t._t = setTimeout(() => { t.className = 'toast'; }, dur);
}

function setBar(id, pct) {
  const el = $(id);
  if (el) el.style.width = Math.max(0, Math.min(100, pct)) + '%';
}

function countUp(el, target, ms = 900) {
  if (!el) return;
  const t0 = Date.now();
  const step = () => {
    const p = Math.min((Date.now() - t0) / ms, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  step();
}

function typewrite(el, text, speed = 20) {
  el.innerHTML = '';
  let i = 0;
  clearInterval(Game._tw);
  Game._tw = setInterval(() => {
    if (i >= text.length) {
      clearInterval(Game._tw);
      Game._stopIntroVoice();
      return;
    }
    if (text[i] === '<') {
      const end = text.indexOf('>', i);
      el.innerHTML += text.slice(i, end + 1);
      i = end + 1;
    } else {
      el.innerHTML += text[i++];
    }
  }, speed);
}

function completeTypewrite(el, text) {
  clearInterval(Game._tw);
  Game._stopIntroVoice();
  el.innerHTML = text;
}

// ============================================================
// SCREEN MANAGER
// ============================================================
function showScreen(name) {
  if (name !== 'intro') Game._stopIntroVoice();
  $$('.screen').forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); });
  const t = document.querySelector(`[data-screen="${name}"]`);
  if (t) {
    t.classList.remove('hidden');
    t.scrollTop = 0;
    setTimeout(() => t.classList.add('active'), 12);
  }
  const previousScreen = State.screen;
  State.prevScreen = State.screen;
  State.screen = name;
  Game._setMusicForScreen(name, previousScreen);
}

// ============================================================
// PARTICLE SYSTEM
// ============================================================
class Particles {
  constructor() {
    this.c = $('particle-canvas');
    this.x = this.c.getContext('2d');
    this.p = [];
    this._resize();
    window.addEventListener('resize', () => this._resize());
    this._loop();
  }
  _resize() { this.c.width = innerWidth; this.c.height = innerHeight; }
  _spawn(x, y, color, n = 8) {
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 / n) * i + Math.random() * 0.6;
      const s = 1 + Math.random() * 3;
      this.p.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s - 2,
                    life: 1, decay: 0.02 + Math.random()*0.02,
                    r: 2 + Math.random()*4, color });
    }
  }
  burst(x, y) {
    this._spawn(x, y, '#f0c040', 12);
    this._spawn(x, y, '#6c3fd4', 8);
    this._spawn(x, y, '#40e080', 6);
  }
  _loop() {
    const { x: ctx, c, p } = this;
    ctx.clearRect(0, 0, c.width, c.height);
    for (let i = p.length - 1; i >= 0; i--) {
      const q = p[i];
      q.x += q.vx; q.y += q.vy; q.vy += 0.08; q.life -= q.decay;
      if (q.life <= 0) { p.splice(i, 1); continue; }
      ctx.save(); ctx.globalAlpha = q.life; ctx.fillStyle = q.color;
      ctx.beginPath(); ctx.arc(q.x, q.y, q.r * q.life, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(() => this._loop());
  }
}

// ============================================================
// HUD UPDATE
// ============================================================
function updateHUD() {
  const { hp, maxHp, level, exp, maxExp } = State.player;
  const hpPct = (hp / maxHp) * 100;
  const expPct = (exp / maxExp) * 100;
  const respawnsRemaining = Math.max(0, Math.min(3, State.player.respawnsRemaining));
  const respawnHearts = Array.from({ length: 3 }, (_, index) =>
    `<span class="respawn-heart${index < respawnsRemaining ? ' available' : ' spent'}" aria-hidden="true">${index < respawnsRemaining ? '❤️' : '🖤'}</span>`
  ).join('');

  // Region HUD
  setBar('hud-hp-bar', hpPct);
  if ($('hud-hp-text'))  $('hud-hp-text').textContent  = `${hp}/${maxHp}`;
  setBar('hud-exp-bar', expPct);
  if ($('hud-exp-text')) $('hud-exp-text').textContent = `${exp}/${maxExp}`;
  if ($('hud-level'))    $('hud-level').textContent    = `Lv.${level}`;
  if ($('region-respawn-lives')) {
    $('region-respawn-lives').innerHTML = respawnHearts;
    $('region-respawn-lives').setAttribute('aria-label', `Kesempatan respawn tersisa: ${respawnsRemaining} dari 3`);
  }

  // Map HUD
  setBar('map-hp-bar', hpPct);
  if ($('map-hp-text'))    $('map-hp-text').textContent    = `${hp}/${maxHp}`;
  if ($('map-level-text')) $('map-level-text').textContent = `Lv.${level}`;
  if ($('map-respawn-lives')) {
    $('map-respawn-lives').innerHTML = respawnHearts;
    $('map-respawn-lives').setAttribute('aria-label', `Kesempatan respawn tersisa: ${respawnsRemaining} dari 3`);
  }

  // Puzzle HUD
  setBar('puzzle-hp-bar', hpPct);
  if ($('puzzle-hp-text')) $('puzzle-hp-text').textContent = `${hp}/${maxHp}`;

  // Battle HUD
  if ($('player-battle-hp-bar')) $('player-battle-hp-bar').style.width = hpPct + '%';
  if ($('player-battle-hp-text')) $('player-battle-hp-text').textContent = `${hp}/${maxHp}`;
}

function gainExp(amount) {
  const p = State.player;
  p.exp += amount;
  if (p.exp >= p.maxExp) {
    p.exp -= p.maxExp;
    p.level++;
    p.maxHp += 15;
    p.hp = Math.min(p.hp + 30, p.maxHp);
    showToast(`🎉 Level Up! Sekarang Lv.${p.level}! +30 HP`, 'gold', 3000);
  }
  updateHUD();
}

function giveItem(itemId) {
  const item = DATA.items[itemId];
  if (item && (item.stackable || !State.player.inventory.includes(itemId))) {
    State.player.inventory.push(itemId);
    State.stats.itemsCollected++;
    if (item) showToast(`${item.icon} Diperoleh: ${item.name}!`, 'gold', 3000);
  }
}

// ============================================================
// QUEST HELPERS
// ============================================================
function markQuestStep(questIdx, stepIdx) {
  if (!DATA.quests[questIdx] || !Number.isInteger(stepIdx)) return;
  if (!State.quest.stepsCompleted[questIdx]) {
    State.quest.stepsCompleted[questIdx] = [];
  }
  if (!State.quest.stepsCompleted[questIdx].includes(stepIdx)) {
    State.quest.stepsCompleted[questIdx].push(stepIdx);
    renderQuestTracker();
  }
}

function markRegionQuestStep(regionId, stepName) {
  const region = DATA.regions[regionId];
  if (!region || !region.questSteps || State.quest.activeIndex !== region.questId) return;
  const stepIdx = region.questSteps[stepName];
  if (Number.isInteger(stepIdx)) markQuestStep(region.questId, stepIdx);
}

function reconcileQuestProgress() {
  if (!State.quest.stepsCompleted) State.quest.stepsCompleted = {};

  Object.entries(DATA.regions).forEach(([regionId, region]) => {
    if (!region.questSteps) return;
    const questId = region.questId;
    const steps = State.quest.stepsCompleted[questId] || [];
    const puzzles = region.puzzleId ? DATA.puzzles[region.puzzleId] : [];
    const bossDefeated = region.bossId && State.bossesDefeated.includes(region.bossId);
    const objectiveComplete = {
      key: !region.keyItem || State.player.inventory.includes(region.keyItem),
      puzzle: !region.puzzleId || (State.puzzleProgress[regionId] || 0) >= puzzles.length,
      boss: Boolean(bossDefeated),
      core: State.player.inventory.includes('equation_core')
    };

    Object.entries(objectiveComplete).forEach(([name, complete]) => {
      const stepIdx = region.questSteps[name];
      if (!Number.isInteger(stepIdx)) return;
      const filtered = (State.quest.stepsCompleted[questId] || []).filter(index => index !== stepIdx);
      if (complete) filtered.push(stepIdx);
      State.quest.stepsCompleted[questId] = [...new Set(filtered)];
    });
  });
}

function advanceQuest(nextQuestIdx) {
  if (nextQuestIdx >= 0 && nextQuestIdx < DATA.quests.length) {
    State.quest.activeIndex = nextQuestIdx;
  }
}

function renderQuestTracker() {
  const els = $$('.quest-tracker-view');
  if (!els.length) return;
  const q = DATA.quests[State.quest.activeIndex];
  
  els.forEach(el => {
    if (!q) { el.innerHTML = ''; return; }
    const done = State.quest.stepsCompleted[q.id] || [];
    const completedCount = q.steps.filter((_, i) => done.includes(i)).length;
    const activeStep = q.steps.findIndex((_, i) => !done.includes(i));
    const progress = Math.round((completedCount / q.steps.length) * 100);
    el.innerHTML = `
      <div class="qt-heading">
        <div class="qt-title"><span aria-hidden="true">📋</span> ${q.title}</div>
        <div class="qt-progress-label">${completedCount}/${q.steps.length}</div>
      </div>
      <div class="qt-progress" role="progressbar" aria-label="Progres misi" aria-valuemin="0" aria-valuemax="${q.steps.length}" aria-valuenow="${completedCount}">
        <div class="qt-progress-fill" style="width:${progress}%"></div>
      </div>
      <ul class="qt-steps">
        ${q.steps.map((s, i) => `
          <li class="qt-step ${done.includes(i) ? 'done' : i === activeStep ? 'current' : ''}">
            <span class="qt-icon" aria-hidden="true">${done.includes(i) ? '✓' : i === activeStep ? '›' : '·'}</span>
            <span>${s.text}</span>
          </li>
        `).join('')}
      </ul>
    `;
  });
}

// ============================================================
// MENU EFFECTS
// ============================================================
function initMenuEffects() {
  const rain = $('equation-rain');
  if (!rain || rain.children.length > 0) return;
  const syms = ['∑','∫','π','∞','√','Δ','∂','±','≠','≈','×','÷','∈','φ','λ','2+2','x²','f(x)','∀x','lim'];
  for (let i = 0; i < 22; i++) {
    const d = document.createElement('div');
    d.className = 'eq-drop';
    d.textContent = syms[i % syms.length];
    d.style.left = (Math.random() * 100) + 'vw';
    d.style.animationDuration = (8 + Math.random() * 12) + 's';
    d.style.animationDelay = (-Math.random() * 18) + 's';
    d.style.fontSize = (0.7 + Math.random() * 0.8) + 'rem';
    d.style.opacity = (0.08 + Math.random() * 0.25);
    rain.appendChild(d);
  }
}

function initStars() {
  const c = $('intro-stars');
  if (!c || c.children.length > 0) return;
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = 0.5 + Math.random() * 2;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-duration:${2+Math.random()*4}s;animation-delay:${-Math.random()*5}s`;
    c.appendChild(s);
  }
}

// ============================================================
// MAIN GAME OBJECT
// ============================================================
const Game = {
  _tw: null,
  fx: null,
  _menuClickSound: null,
  _nullifierSounds: null,
  _combatSounds: null,
  _puzzleSounds: null,
  _bgm: null,
  _activeBgm: null,
  _introVoiceSounds: null,
  _activeIntroVoice: null,

  // ============================================================
  // INIT & SAVE SYSTEM
  // ============================================================
  init() {
    document.head.insertAdjacentHTML('beforeend', '<style>.gold{color:var(--gold);font-weight:600}</style>');
    this.fx = new Particles();
    this._menuClickSound = new Audio('sounds/Select.wav');
    this._nullifierSounds = {
      entrance: new Audio('sounds/snd_joker_neochaos_ja_ch1.wav'),
      attack: [
        new Audio('sounds/snd_joker_anything_ja_ch1.wav'),
        new Audio('sounds/snd_joker_chaos_ja_ch1.wav'),
        new Audio('sounds/snd_joker_laugh0_ch1.wav')
      ],
      hit: new Audio('sounds/snd_joker_oh_ch1.wav')
    };
    this._combatSounds = {
      playerHit: new Audio('sounds/snd_bump_ch1.wav'),
      bossHit: new Audio('sounds/snd_damage_ch1.wav'),
      firstBossHit: new Audio('sounds/snd_queenhowl_b_bc.wav'),
      firstBossAttack: [
        new Audio('sounds/snd_queen_bitcrushlaugh.wav'),
        new Audio('sounds/snd_queen_laugh_0_bc.wav')
      ],
      secondBossEntrance: new Audio('sounds/snd_susieroar_ch1.wav'),
      secondBossAttack: new Audio('sounds/snd_suslaugh_ch1.wav'),
      secondBossHit: new Audio('sounds/snd_sussurprise_ch1.wav'),
      respawn: new Audio('sounds/Respawn_sfx.mp3'),
      death: new Audio('sounds/death_sfx.mp3'),
      victory: new Audio('sounds/snd_won.wav')
    };
    this._puzzleSounds = {
      correct: new Audio('sounds/duolingo-correct.mp3'),
      wrong: new Audio('sounds/duolingo-wrong.mp3')
    };
    this._introVoiceSounds = {
      sage: new Audio('sounds/snd_txtsans.wav'),
      nullifier: new Audio('sounds/snd_txtjok.wav')
    };
    Object.values(this._introVoiceSounds).forEach(sound => {
      sound.loop = true;
      sound.volume = 0.7;
    });
    this._bgm = {
      guild: new Audio('bgm/bgm_guild.mp3'),
      boss: new Audio('bgm/all_boss.mp3'),
      nullifier: new Audio('bgm/boss_nullifier.mp3')
    };
    Object.values(this._bgm).forEach(track => {
      track.loop = true;
      track.volume = 0.35;
      track.preload = 'none';
    });
    document.addEventListener('click', () => this._resumeBgm(), true);
    $('screen-menu').addEventListener('click', event => {
      if (!(event.target instanceof Element) || !event.target.closest('button:not(:disabled)')) return;
      this._menuClickSound.currentTime = 0;
      this._menuClickSound.play().catch(error => {
        console.warn('Gagal memutar efek suara menu.', error);
      });
    });
    initMenuEffects();
    this.checkSaveData();
    updateHUD();
    showScreen('menu');
  },

  _setMusicForScreen(screen, previousScreen) {
    if (!this._bgm) return;

    const isWorldScreen = ['menu', 'worldmap', 'region', 'npc', 'puzzle'].includes(screen)
      || (screen === 'inventory' && previousScreen !== 'boss' && State.prevScreen !== 'boss');
    const trackName = screen === 'boss' || (screen === 'inventory' && State.prevScreen === 'boss')
      ? (State.battle.bossId === 'final_boss' ? 'nullifier' : 'boss')
      : isWorldScreen ? 'guild' : null;

    if (trackName === this._activeBgm) return;

    const previousTrack = this._activeBgm && this._bgm[this._activeBgm];
    if (previousTrack) {
      previousTrack.pause();
      previousTrack.currentTime = 0;
    }
    this._activeBgm = trackName;
    if (trackName) this._playBgm(this._bgm[trackName]);
  },

  _resumeBgm() {
    if (!this._activeBgm || !this._bgm) return;
    const track = this._bgm[this._activeBgm];
    if (track.paused) this._playBgm(track);
  },

  _playBgm(track) {
    track.play().catch(error => {
      if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
        console.warn('Gagal memutar musik latar.', error);
      }
    });
  },

  _startIntroVoice(characterName) {
    this._stopIntroVoice();
    const voice = characterName === 'The Nullifier' ? 'nullifier' : 'sage';
    const sound = this._introVoiceSounds[voice];
    sound.currentTime = 0;
    this._activeIntroVoice = voice;
    sound.play().catch(error => {
      if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
        console.warn('Gagal memutar suara dialog pembuka.', error);
      }
    });
  },

  _stopIntroVoice() {
    if (!this._activeIntroVoice || !this._introVoiceSounds) return;
    const sound = this._introVoiceSounds[this._activeIntroVoice];
    sound.pause();
    sound.currentTime = 0;
    this._activeIntroVoice = null;
  },

  _playCombatSound(name) {
    const sounds = this._combatSounds?.[name];
    const sound = Array.isArray(sounds)
      ? sounds[randomInt(0, sounds.length - 1)]
      : sounds;
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(error => {
      console.warn(`Gagal memutar efek suara ${name}.`, error);
    });
  },

  _playPuzzleSound(result) {
    const sound = this._puzzleSounds?.[result];
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(error => {
      console.warn(`Gagal memutar efek suara jawaban ${result}.`, error);
    });
  },

  checkSaveData() {
    const saveExists = localStorage.getItem('numera_save');
    const btnLoad = $('btn-load');
    if (saveExists) {
      btnLoad.classList.remove('disabled');
      btnLoad.disabled = false;
      btnLoad.onclick = () => this.loadGame();
    } else {
      btnLoad.classList.add('disabled');
      btnLoad.disabled = true;
      btnLoad.onclick = () => showToast('Belum ada data permainan yang tersimpan.', '');
    }
  },

  saveGame() {
    localStorage.setItem('numera_save', JSON.stringify(State));
    showToast('💾 Progress permainan berhasil disimpan.', 'success');
    this.checkSaveData();
  },

  loadGame() {
    const saved = localStorage.getItem('numera_save');
    if (saved) {
      try {
        State = JSON.parse(saved);
        if (!Number.isInteger(State.player.respawnsRemaining)) {
          State.player.respawnsRemaining = DEFAULT_STATE.player.respawnsRemaining;
        }
        reconcileQuestProgress();
        showToast('Lanjutkan permainan terakhir!', 'success');
        updateHUD();
        renderQuestTracker();
        
        // Go back to the screen we were on, defaulting to world map if inside a battle
        if (State.screen === 'boss' || State.screen === 'puzzle' || State.screen === 'intro') {
          this.goToWorldMap();
        } else {
          showScreen(State.screen === 'menu' ? 'worldmap' : State.screen);
          if (State.screen === 'region' && State.world.current) {
            this.enterRegion(State.world.current);
          } else {
            this.goToWorldMap();
          }
        }
      } catch(e) {
        showToast('Gagal memuat save data!', 'error');
      }
    }
  },

  confirmDeleteSave() {
    $('modal-delete-save').classList.remove('hidden');
  },

  executeDeleteSave() {
    localStorage.removeItem('numera_save');
    this.closeModal('modal-delete-save');
    showToast('Data permainan berhasil dihapus.', 'gold');
    this.checkSaveData();
  },

  // ============================================================
  // MAIN MENU
  // ============================================================
  startGame() {
    // Reset state for new game
    State = JSON.parse(JSON.stringify(DEFAULT_STATE));
    initStars();
    State.intro.index = 0;
    showScreen('intro');
    this._renderIntro();
  },
  showHowToPlay() { $('modal-howto').classList.remove('hidden'); },
  showCredits()   { $('modal-credits').classList.remove('hidden'); },
  closeModal(id)  { const el = $(id); if (el) el.classList.add('hidden'); },
  exitGame() {
    State = JSON.parse(JSON.stringify(DEFAULT_STATE));
    showScreen('menu');
    this.checkSaveData();
    this.closeModal('modal-settings');
    this.closeModal('modal-delete-save');
    showToast('🚪 Kamu keluar dari permainan dan kembali ke menu utama.', 'gold');
  },

  // ============================================================
  // INTRODUCTION
  // ============================================================
  _renderIntro() {
    const d = DATA.intro[State.intro.index];
    $('intro-char-art').textContent = d.char;
    $('intro-char-name').textContent = d.name;
    this._startIntroVoice(d.name);
    typewrite($('intro-text'), d.text, 22);

    const dots = $('intro-dots');
    dots.innerHTML = DATA.intro.map((_, i) =>
      `<div class="dot${i === State.intro.index ? ' active' : i < State.intro.index ? ' done' : ''}"></div>`
    ).join('');

    const isLast = State.intro.index === DATA.intro.length - 1;
    $('btn-dialogue-next').innerHTML = isLast
      ? 'Mulai Perjalanan <span class="arrow">▶</span>'
      : 'Selanjutnya <span class="arrow">▶</span>';
  },

  nextDialogue() {
    const el = $('intro-text');
    const d = DATA.intro[State.intro.index];
    const plainLen = d.text.replace(/<[^>]+>/g, '').length;
    if (el.textContent.length < plainLen) {
      completeTypewrite(el, d.text); return;
    }
    State.intro.index++;
    if (State.intro.index >= DATA.intro.length) this.goToWorldMap();
    else this._renderIntro();
  },

  // ============================================================
  // WORLD MAP
  // ============================================================
  goToWorldMap() {
    showScreen('worldmap');
    updateHUD();
    this._updateWorldMap();
    renderQuestTracker();
  },

  _updateWorldMap() {
    const regionOrder = ['village', 'forest', 'fireland', 'frozen', 'castle'];
    regionOrder.forEach(id => {
      const el = $('loc-' + id);
      if (!el) return;

      const isUnlocked = State.world.unlocked.includes(id);
      const isCleared  = State.world.cleared.includes(id);

      let cls = 'map-location ';
      if (!isUnlocked) cls += 'locked';
      else if (isCleared) cls += 'unlocked cleared-loc';
      else cls += 'unlocked';
      if (id === 'castle') cls += ' final-loc';
      el.className = cls;

      const icon = el.querySelector('.loc-icon');
      if (icon) {
        if (!isUnlocked) icon.textContent = '🔒';
        else if (isCleared) icon.textContent = '✅';
        else icon.textContent = DATA.regions[id]?.icon || '📍';
      }

      const badge = $('badge-' + id);
      if (badge) {
        badge.style.display = isCleared ? 'flex' : 'none';
        badge.textContent = '✓';
      }

      el.onclick = isUnlocked ? () => Game.selectRegion(id) : () => showToast('🔒 Wilayah terkunci! Selesaikan misimu saat ini.', 'error');
    });
  },

  selectRegion(id) {
    if (!State.world.unlocked.includes(id)) {
      showToast('🔒 Wilayah ini masih terkunci!', 'error'); return;
    }
    if (!DATA.regions[id]) { showToast('🚧 Wilayah segera datang!', ''); return; }
    State.world.current = id;
    this.enterRegion(id);
  },

  // ============================================================
  // REGION EXPLORATION
  // ============================================================
  enterRegion(id) {
    const region = DATA.regions[id];
    markRegionQuestStep(id, 'travel');
    showScreen('region');
    updateHUD();
    renderQuestTracker();

    $('region-bg').className = 'region-bg ' + (region.bgClass || '');
    $('region-title').textContent = region.name;

    $('region-scene').innerHTML = `
      <div class="scene-environment">
        <div class="scene-emoji-row">${region.emoji}</div>
        <p class="scene-description">${region.description}</p>
      </div>
      <div class="interaction-cards" id="interaction-cards"></div>
    `;
    this._buildCards(id);
  },

  _buildCards(id) {
    const region   = DATA.regions[id];
    const cleared  = State.world.cleared.includes(id);
    const progress = State.puzzleProgress[id] || 0;
    const puzzles  = region.puzzleId ? DATA.puzzles[region.puzzleId] : null;
    const puzzleDone = puzzles ? progress >= puzzles.length : true;
    const hasKey   = region.keyItem ? State.player.inventory.includes(region.keyItem) : true;
    const bossDefeated = region.bossId ? State.bossesDefeated.includes(region.bossId) : true;

    const cards = [];

    // NPC
    if (region.npcId) {
      const npc = DATA.npcs[region.npcId];
      cards.push({
        icon: npc.char, label: npc.name, desc: 'Bicara dengan penjaga',
        action: () => Game.talkToNPC(region.npcId), disabled: false
      });
    }

    // Chest
    if (region.keyItem) {
      const chestOpened = State.player.inventory.includes(region.keyItem) || bossDefeated;
      cards.push({
        icon: chestOpened ? '📭' : '📦',
        label: 'Peti Harta',
        desc: chestOpened ? 'Sudah dibuka' : `Berisi: ${region.keyItemName} + peluang 1:100`,
        action: chestOpened ? null : () => Game.openChest(id),
        disabled: chestOpened
      });
    }

    // Puzzle Stone
    if (region.puzzleId) {
      cards.push({
        icon: puzzleDone ? '🪨' : '🪨',
        label: 'Batu Teka-teki',
        desc: puzzleDone ? '✓ Selesai' : `Tantangan (${progress}/${puzzles.length} selesai)`,
        action: puzzleDone ? null : () => Game.startPuzzle(id, region.puzzleId),
        disabled: puzzleDone
      });
    }

    // Boss door
    if (region.bossId) {
      const canFight = hasKey || bossDefeated;
      cards.push({
        icon: bossDefeated ? '✅' : '🚪',
        label: bossDefeated ? 'Boss Terkalahkan' : "Sarang Sang Penjaga",
        desc: bossDefeated
          ? 'Kemenangan diraih'
          : canFight ? 'Tantang Sang Penjaga!' : `Butuh ${region.keyItemName} dulu`,
        action: bossDefeated ? null : canFight ? () => Game.startBoss(region.bossId) : null,
        disabled: bossDefeated || !canFight
      });
    }

    if (id === 'village' && !cards.find(c => c.label === 'Maju ke Utara')) {
      cards.push({
        icon: '🌲', label: 'Maju ke Utara', desc: 'Perjalanan ke Hutan Angka',
        action: () => Game.goToWorldMap(), disabled: false
      });
    }

    Game._cards = cards;
    $('interaction-cards').innerHTML = cards.map((c, i) => `
      <div class="interaction-card ${c.disabled ? 'disabled' : ''}" id="icard-${i}"
           ${!c.disabled ? `onclick="Game._card(${i})"` : ''}>
        <div class="ic-icon">${c.icon}</div>
        <div class="ic-label">${c.label}</div>
        <div class="ic-desc">${c.desc}</div>
      </div>`).join('');
  },

  _cards: [],
  _card(i) { if (this._cards[i]?.action) this._cards[i].action(); },

  openChest(regionId) {
    const region = DATA.regions[regionId];
    giveItem(region.keyItem);
    if (Math.random() < 1 / 100) giveItem('enlighment_stone');
    this.fx.burst(innerWidth / 2, innerHeight / 2);
    markRegionQuestStep(regionId, 'key');
    setTimeout(() => this._buildCards(regionId), 400);
  },

  // ============================================================
  // NPC DIALOGUE
  // ============================================================
  talkToNPC(npcId) {
    const npc = DATA.npcs[npcId];
    if (!npc) return;
    State.npc.id = npcId;
    showScreen('npc');

    $('npc-char-art').textContent = npc.char;
    $('npc-char-name').textContent = npc.name;

    const region = DATA.regions[State.world.current];
    $('npc-bg').className = 'npc-bg ' + (region?.bgClass || '');

    typewrite($('npc-text'), npc.greeting, 20);
    $('npc-choices').innerHTML = npc.choices.map((c, i) =>
      `<button class="btn-choice" id="npc-c-${i}" onclick="Game.pickChoice(${i})">${c.label}</button>`
    ).join('');
  },

  pickChoice(i) {
    const npc = DATA.npcs[State.npc.id];
    const ch  = npc.choices[i];
    $$('.btn-choice').forEach((b, j) => b.classList.toggle('selected', j === i));

    if (ch.action === 'leave') { this.enterRegion(State.world.current); return; }
    if (ch.action === 'hint_puzzle') showToast('💡 Coba selesaikan Batu Teka-teki dulu!', 'gold');
    if (ch.action === 'hint_boss') showToast('⚔ Sang Penjaga menantimu di Sarangnya!', 'gold');
    if (ch.response) typewrite($('npc-text'), ch.response, 20);
  },

  // ============================================================
  // MATH PUZZLE SYSTEM
  // ============================================================
  startPuzzle(regionId, puzzleId) {
    State._activePuzzleRegion = regionId;
    State._activePuzzleId = puzzleId;
    const startIdx = State.puzzleProgress[regionId] || 0;
    State._puzzleIdx = startIdx;
    State._activePuzzleQuestion = null;
    State._previousPuzzleQuestion = null;
    State._previousPuzzleAnswers = [];
    State._puzzleRetry = false;
    showScreen('puzzle');
    this._renderPuzzle();
  },

  _renderPuzzle() {
    const puzzleId = State._activePuzzleId;
    const puzzles  = DATA.puzzles[puzzleId];
    const idx      = State._puzzleIdx;
    const generator = PUZZLE_GENERATORS[puzzleId]?.[idx];
    if (!State._activePuzzleQuestion) {
      const excludedAnswers = State._puzzleRetry ? State._previousPuzzleAnswers : [];
      State._activePuzzleQuestion = generatePuzzleQuestion(
        generator,
        puzzles[idx],
        excludedAnswers,
        State._previousPuzzleQuestion || ''
      );
    }
    const p = State._activePuzzleQuestion;
    State._puzzleAnswered = false;
    updateHUD();

    $('puzzle-title').textContent   = p.title;
    $('puzzle-flavor').textContent  = p.flavor;
    $('puzzle-question').textContent= p.question;
    $('puzzle-hint').textContent    = '💡 ' + p.hint;
    $('puzzle-progress-fill').style.width = (idx / puzzles.length * 100) + '%';

    $('answer-grid').innerHTML = p.answers.map((a, i) =>
      `<button class="answer-btn" id="ans-${i}" onclick="Game.pickAnswer(${i})">${a}</button>`
    ).join('');

    $('puzzle-feedback').classList.add('hidden');
    $('answer-grid').classList.remove('hidden');
    this._updateEnlighmentStoneButtons();
  },

  pickAnswer(idx) {
    if (State._puzzleAnswered) return;
    const p = State._activePuzzleQuestion;
    if (!p) return;
    const correct  = idx === p.correct;

    State._puzzleAnswered = true;
    $$('.answer-btn').forEach(b => b.disabled = true);
    $(`ans-${idx}`).classList.add(correct ? 'correct' : 'wrong');

    if (correct) {
      this._playPuzzleSound('correct');
      State.stats.puzzlesSolved++;
      State.stats.score += 50;
      gainExp(20);
      this.fx.burst(
        $(`ans-${idx}`).getBoundingClientRect().left + 40,
        $(`ans-${idx}`).getBoundingClientRect().top  + 30
      );
      showToast('✅ Benar! +20 EXP', 'success');
    } else {
      this._playPuzzleSound('wrong');
      showToast('❌ Salah! HP tidak berkurang. Coba soal baru.', 'error');
      State._previousPuzzleQuestion = p.question;
      State._previousPuzzleAnswers = [...p.answers];
      State._activePuzzleQuestion = null;
      State._puzzleRetry = true;
    }
    this._showPuzzleFeedback(
      correct,
      correct ? p.explanation : 'Jawaban belum tepat. Soal baru dengan tema yang sama akan diberikan; progres teka-teki belum bertambah.'
    );
  },

  _showPuzzleFeedback(correct, explanation) {
    const fb = $('puzzle-feedback');
    fb.classList.remove('hidden');
    $('feedback-icon').textContent = correct ? '🎉' : '💡';
    $('feedback-text').innerHTML = `<strong style="color:var(--${correct?'success':'hp-red'})">${correct?'Benar!':'Kurang tepat...'}</strong><br>${explanation}`;
    const puzzles = DATA.puzzles[State._activePuzzleId];
    const isLast  = State._puzzleIdx >= puzzles.length - 1;
    $('feedback-btn').textContent = correct
      ? (isLast ? 'Selesaikan Teka-teki' : 'Pertanyaan Berikutnya')
      : 'Coba Soal Baru';
    $('answer-grid').classList.add('hidden');
  },

  nextPuzzle() {
    if (State._puzzleRetry) {
      State._puzzleAnswered = false;
      this._renderPuzzle();
      State._puzzleRetry = false;
      return;
    }

    const regionId = State._activePuzzleRegion;
    State._puzzleIdx++;
    const puzzles = DATA.puzzles[State._activePuzzleId];
    State._activePuzzleQuestion = null;
    State._previousPuzzleQuestion = null;
    State._previousPuzzleAnswers = [];
    State._puzzleAnswered = false;

    if (State._puzzleIdx >= puzzles.length) {
      State.puzzleProgress[regionId] = puzzles.length;
      markRegionQuestStep(regionId, 'puzzle');
      const region = DATA.regions[regionId];
      if (region.keyItem && !State.player.inventory.includes(region.keyItem)) {
        giveItem(region.keyItem);
        markRegionQuestStep(regionId, 'key');
      }
      this._unlockNextRegion(regionId);
      gainExp(40);
      showToast('🧩 Teka-teki Selesai!', 'gold', 2500);
      this.fx.burst(innerWidth / 2, innerHeight / 2);
      setTimeout(() => this.enterRegion(regionId), 1600);
    } else {
      $('puzzle-feedback').classList.add('hidden');
      $('answer-grid').classList.remove('hidden');
      const c = $('puzzle-card');
      c.style.animation = 'none'; c.offsetHeight; c.style.animation = '';
      this._renderPuzzle();
    }
  },

  // ============================================================
  // INVENTORY
  // ============================================================
  openInventory() {
    State.prevScreen = State.screen;
    showScreen('inventory');
    this._renderInventory();
  },

  _renderInventory() {
    const grid = $('inventory-grid');
    const inv  = State.player.inventory;
    
    // Check if empty
    if (inv.length === 0) {
      grid.innerHTML = `<div class="inventory-empty-msg">Belum ada item yang tersimpan di dalam tas.</div>`;
      return;
    }

    grid.innerHTML = '';
    // Show only items we have, in a neat grid. (Not 12 fixed slots if empty looks bad)
    for (let i = 0; i < inv.length; i++) {
      const slot = document.createElement('div');
      const item = DATA.items[inv[i]];
      if (item) {
        slot.className = 'inventory-slot filled';
        slot.innerHTML = `
          <div class="inv-slot-icon">${item.icon}</div>
          <div class="inv-slot-name">${item.name}</div>
        `;
        slot.onclick = () => this._showItemDetail(inv[i], slot);
        grid.appendChild(slot);
      }
    }
    
    // Fill remaining to maintain grid shape if we want at least a few empty boxes
    const totalBoxes = Math.max(8, Math.ceil(inv.length / 4) * 4);
    for (let j = inv.length; j < totalBoxes; j++) {
      const emptySlot = document.createElement('div');
      emptySlot.className = 'inventory-slot empty';
      grid.appendChild(emptySlot);
    }
  },

  _showItemDetail(itemId, slotEl) {
    const item = DATA.items[itemId];
    $$('.inventory-slot').forEach(s => s.classList.remove('selected'));
    slotEl.classList.add('selected');
    $('item-detail-empty').classList.add('hidden');
    $('item-detail-content').classList.remove('hidden');
    $('item-detail-img').textContent   = item.icon;
    $('item-detail-name').textContent  = item.name;
    $('item-detail-type').textContent  = item.type;
    $('item-detail-desc').textContent  = item.desc;
    const btn = $('btn-use-item');
    if (item.usable) {
      btn.classList.remove('hidden');
      btn.textContent = itemId === 'potion' ? 'Gunakan Ramuan' : 'Gunakan Item';
      btn.onclick = () => this._useItem(itemId);
    } else {
      btn.classList.add('hidden');
    }
  },

  _useItem(itemId) {
    const item = DATA.items[itemId];
    if (itemId === 'potion') {
      State.player.hp = Math.min(State.player.maxHp, State.player.hp + item.healAmount);
      const idx = State.player.inventory.indexOf(itemId);
      if (idx >= 0) State.player.inventory.splice(idx, 1);
      updateHUD();
      showToast(`🧪 Menggunakan ${item.name}! +${item.healAmount} HP`, 'success');
      this._renderInventory();
      $('item-detail-empty').classList.remove('hidden');
      $('item-detail-content').classList.add('hidden');
    } else if (itemId === 'enlighment_stone') {
      this.useEnlighmentStone(State.prevScreen || State.screen);
    }
  },

  _enlighmentStoneCount() {
    return State.player.inventory.filter(id => id === 'enlighment_stone').length;
  },

  _updateEnlighmentStoneButtons() {
    const count = this._enlighmentStoneCount();
    [
      ['use-stone-puzzle', '✨ Gunakan Enlighment Stone'],
      ['use-stone-boss', '✨ Gunakan Enlighment Stone']
    ].forEach(([id, label]) => {
      const button = $(id);
      if (!button) return;
      button.classList.toggle('hidden', count === 0);
      button.textContent = `${label} (${count})`;
    });
  },

  useEnlighmentStone(targetScreen = State.screen) {
    const inventoryOpen = State.screen === 'inventory' && State.prevScreen === targetScreen;
    let answerButton;

    if (targetScreen === 'puzzle' && (State.screen === 'puzzle' || inventoryOpen)) {
      const feedback = $('puzzle-feedback');
      const puzzle = State._activePuzzleQuestion;
      if (!puzzle || !feedback.classList.contains('hidden')) {
        showToast('Batu hanya bisa digunakan sebelum menjawab soal.', 'error');
        return false;
      }
      answerButton = $(`ans-${puzzle.correct}`);
    } else if (targetScreen === 'boss' && (State.screen === 'boss' || inventoryOpen)) {
      if (!State.battle.bossId || State.battle.answered) {
        showToast('Batu hanya bisa digunakan sebelum menjawab soal.', 'error');
        return false;
      }
      const boss = DATA.bosses[State.battle.bossId];
      const order = State.battle.questionOrder && State.battle.questionOrder.length
        ? State.battle.questionOrder
        : boss.questions;
      const question = order[State.battle.questionIndex % order.length];
      answerButton = $(`batans-${question.correct}`);
    } else {
      showToast('Batu ini hanya bisa digunakan saat menjawab teka-teki atau melawan boss.', 'error');
      return false;
    }

    if (!answerButton) {
      showToast('Jawaban belum siap ditampilkan. Coba lagi sebentar.', 'error');
      return false;
    }

    const stoneIndex = State.player.inventory.indexOf('enlighment_stone');
    if (stoneIndex < 0) {
      this._updateEnlighmentStoneButtons();
      showToast('Kamu tidak memiliki Enlighment Stone.', 'error');
      return false;
    }

    State.player.inventory.splice(stoneIndex, 1);
    answerButton.classList.add('correct');
    this._updateEnlighmentStoneButtons();
    showToast('🔮 Jawaban yang benar ditandai hijau!', 'success');

    if (inventoryOpen) {
      showScreen(targetScreen);
      updateHUD();
      renderQuestTracker();
    }
    return true;
  },

  closeInventory() {
    const prev = State.prevScreen || 'region';
    showScreen(prev);
    updateHUD();
    renderQuestTracker();
  },

  // ============================================================
  // BOSS BATTLE — Core Logic
  // ============================================================
  _playNullifierSound(type) {
    if (State.battle.bossId !== 'final_boss' || !this._nullifierSounds) return;

    const sound = type === 'entrance'
      ? this._nullifierSounds.entrance
      : type === 'hit'
        ? this._nullifierSounds.hit
        : this._nullifierSounds.attack[randomInt(0, this._nullifierSounds.attack.length - 1)];
    sound.currentTime = 0;
    sound.play().catch(error => {
      console.warn('Gagal memutar efek suara Nullifier.', error);
    });
  },

  startBoss(bossId) {
    const boss = DATA.bosses[bossId];
    const questionOrder = [...boss.questions].sort(() => Math.random() - 0.5);
    State.battle = {
      bossId,
      bossHp: boss.maxHp,
      questionIndex: 0,
      questionOrder,
      answered: false,
      dmgDealtToBoss: 0,
      dmgTakenByPlayer: 0,
      correctCount: 0
    };
    reconcileQuestProgress();
    renderQuestTracker();
    this._playNullifierSound('entrance');
    if (bossId === 'fire_boss') this._playCombatSound('secondBossEntrance');
    showScreen('boss');
    updateHUD();

    $('boss-name').textContent          = boss.name;
    $('boss-art').textContent           = boss.char;
    $('player-battle-name').textContent = State.player.name;
    $('player-art').textContent         = '🧙';

    this._updateBossBar();
    this._renderBossQuestion();
  },

  _updateBossBar() {
    const boss = DATA.bosses[State.battle.bossId];
    const pct  = (State.battle.bossHp / boss.maxHp) * 100;
    setBar('boss-hp-bar', pct);
    $('boss-hp-text').textContent = `${State.battle.bossHp}/${boss.maxHp}`;
  },

  _renderBossQuestion() {
    const boss = DATA.bosses[State.battle.bossId];
    const order = State.battle.questionOrder && State.battle.questionOrder.length
      ? State.battle.questionOrder
      : [...boss.questions].sort(() => Math.random() - 0.5);
    State.battle.questionOrder = order;
    const qi   = State.battle.questionIndex % order.length;
    const q    = order[qi];
    State.battle.answered = false;

    $('round-badge').textContent = `Pertanyaan ${State.battle.questionIndex + 1}  •  HP Boss: ${State.battle.bossHp}/${boss.maxHp}`;

    $('battle-question').textContent = q.q;
    $('battle-result').classList.add('hidden');
    $('battle-log').textContent = '';

    const card = $('battle-question-card');
    card.style.animation = 'none'; card.offsetHeight; card.style.animation = '';

    $('battle-answers').innerHTML = q.options.map((a, i) =>
      `<button class="battle-answer-btn" id="batans-${i}" onclick="Game.pickBossAnswer(${i})">${a}</button>`
    ).join('');
    this._updateEnlighmentStoneButtons();
  },

  pickBossAnswer(ansIdx) {
    if (State.battle.answered) return;
    State.battle.answered = true;

    const boss    = DATA.bosses[State.battle.bossId];
    const order   = State.battle.questionOrder && State.battle.questionOrder.length
      ? State.battle.questionOrder
      : [...boss.questions].sort(() => Math.random() - 0.5);
    const qi      = State.battle.questionIndex % order.length;
    const q       = order[qi];
    const correct = ansIdx === q.correct;

    $$('.battle-answer-btn').forEach(b => b.disabled = true);
    $(`batans-${ansIdx}`).classList.add(correct ? 'correct' : 'wrong');
    if (!correct) $(`batans-${q.correct}`).classList.add('correct');

    const resultEl = $('battle-result');
    resultEl.classList.remove('hidden');

    if (correct) {
      this._playNullifierSound('hit');
      this._playCombatSound('bossHit');
      if (State.battle.bossId === 'forest_boss') this._playCombatSound('firstBossHit');
      if (State.battle.bossId === 'fire_boss') this._playCombatSound('secondBossHit');
      const isCritical = Math.random() < boss.playerCritChance;
      const dmg = Math.round(boss.damagePerHit * (isCritical ? boss.playerCritMultiplier : 1));
      State.battle.bossHp = Math.max(0, State.battle.bossHp - dmg);
      State.battle.dmgDealtToBoss += dmg;
      State.battle.correctCount++;
      State.stats.score += 80;

      this._updateBossBar();
      $('battle-result-icon').textContent = '⚔️';
      $('battle-result-text').textContent = `${isCritical ? 'CRITICAL! ' : ''}Berhasil! Boss menerima ${dmg} damage! (HP: ${State.battle.bossHp})`;
      $('battle-log').textContent = isCritical
        ? '💥 Serangan critical-mu menghantam boss dengan kekuatan penuh!'
        : '✨ Seranganmu tepat sasaran!';

      const bossArt = $('boss-art');
      bossArt.classList.add('hurt');
      setTimeout(() => bossArt.classList.remove('hurt'), 600);
      this.fx.burst(
        bossArt.getBoundingClientRect().left + 70,
        bossArt.getBoundingClientRect().top  + 90
      );

      if (State.battle.bossHp <= 0) {
        $('battle-log').textContent = '🏆 HP Boss mencapai 0! KEMENANGAN!';
        setTimeout(() => this._bossDefeated(), 1600);
        return;
      }

      State.battle.questionIndex++;
      setTimeout(() => this._renderBossQuestion(), 2000);

    } else {
      const dmg = boss.playerDmgPerMiss;
      this._playNullifierSound('attack');
      this._playCombatSound('playerHit');
      if (State.battle.bossId === 'forest_boss') this._playCombatSound('firstBossAttack');
      if (State.battle.bossId === 'fire_boss') this._playCombatSound('secondBossAttack');
      State.player.hp = Math.max(0, State.player.hp - dmg);
      State.battle.dmgTakenByPlayer += dmg;
      State.stats.damageTaken += dmg;
      updateHUD();

      $('battle-result-icon').textContent = '💥';
      $('battle-result-text').textContent = `Salah! Kamu terkena ${dmg} damage! (HP-mu: ${State.player.hp})`;
      $('battle-log').textContent = '⚡ Energi kekacauan Sang Penjaga menyerangmu!';

      const playerArt = $('player-art');
      const bossArt   = $('boss-art');
      playerArt.classList.add('hurt');
      bossArt.classList.add('attacking');
      setTimeout(() => {
        playerArt.classList.remove('hurt');
        bossArt.classList.remove('attacking');
      }, 600);

      if (State.player.hp <= 0) {
        $('battle-log').textContent = '💀 Kamu telah dikalahkan...';
        setTimeout(() => this._playerDefeated(), 1600);
        return;
      }

      State.battle.questionIndex++;
      setTimeout(() => this._renderBossQuestion(), 2200);
    }
  },

  _bossDefeated() {
    const boss     = DATA.bosses[State.battle.bossId];
    const regionId = State.world.current;
    this._playCombatSound('victory');

    if (!State.bossesDefeated.includes(State.battle.bossId)) {
      State.bossesDefeated.push(State.battle.bossId);
    }
    State.stats.bossesDefeated++;
    State.stats.regionsCleared++;
    State.stats.score += 300;

    if (!State.world.cleared.includes(regionId)) {
      State.world.cleared.push(regionId);
    }

    giveItem(boss.rewardItem);

    this._unlockNextRegion(regionId);

    gainExp(boss.rewardExp);
    markRegionQuestStep(regionId, DATA.regions[regionId]?.questSteps?.core !== undefined ? 'core' : 'boss');
    State.victory.bossId = State.battle.bossId;

    this.showVictory();
  },

  _unlockNextRegion(regionId) {
    const region = DATA.regions[regionId];
    const boss = region?.bossId && DATA.bosses[region.bossId];
    if (!region || !boss?.unlocks) return;

    const puzzles = region.puzzleId ? DATA.puzzles[region.puzzleId] : null;
    const puzzleDone = !puzzles || (State.puzzleProgress[regionId] || 0) >= puzzles.length;
    const bossDefeated = State.bossesDefeated.includes(region.bossId);
    if (!puzzleDone || !bossDefeated || State.world.unlocked.includes(boss.unlocks)) return;

    State.world.unlocked.push(boss.unlocks);
    showToast(`🗺 ${DATA.regions[boss.unlocks]?.name} TERBUKA!`, 'gold', 4000);
  },

  _playerDefeated() {
    this._playCombatSound('death');
    if (State.player.respawnsRemaining <= 0) {
      State = JSON.parse(JSON.stringify(DEFAULT_STATE));
      State.world.current = 'village';
      State.world.cleared = [];
      State.stats = {
        puzzlesSolved: 0,
        bossesDefeated: 0,
        regionsCleared: 0,
        itemsCollected: 0,
        score: 0,
        damageTaken: 0
      };
      localStorage.removeItem('numera_save');
      this.checkSaveData();
      this.enterRegion('village');
      showToast('Kesempatan habis! Semua progres direset. Petualangan baru dimulai dari Desa Asal.', 'gold', 5000);
      return;
    }

    showScreen('defeat');
    $('defeat-boss-name').textContent = DATA.bosses[State.battle.bossId]?.name || 'Sang Penjaga';
    $('defeat-region-name').textContent = DATA.regions[State.world.current]?.name || 'wilayah ini';
    $('defeat-lives').textContent = `Kesempatan hidup kembali tersisa: ${State.player.respawnsRemaining}`;
    $('btn-retry-boss').disabled = State.player.respawnsRemaining <= 0;
    $('btn-retry-boss').textContent = State.player.respawnsRemaining > 0
      ? `⚔ Coba Lagi Bertarung (${State.player.respawnsRemaining} kesempatan)`
      : '⚔ Kesempatan Habis';
  },

  retryBoss() {
    if (State.player.respawnsRemaining <= 0) {
      showToast('Kesempatan hidup kembali sudah habis.', 'error');
      return;
    }
    State.player.respawnsRemaining--;
    this._playCombatSound('respawn');
    State.player.hp = Math.max(20, Math.floor(State.player.maxHp * 0.3));
    updateHUD();
    this.startBoss(State.battle.bossId);
  },

  retreatToMap() {
    State.player.hp = Math.max(20, Math.floor(State.player.maxHp * 0.3));
    updateHUD();
    this.goToWorldMap();
  },

  // ============================================================
  // VICTORY SCREEN
  // ============================================================
  showVictory() {
    showScreen('victory');
    const boss     = DATA.bosses[State.victory.bossId];
    const unlocked = boss.unlocks;

    this.fx.burst(innerWidth / 2, innerHeight / 3);
    setTimeout(() => this.fx.burst(innerWidth / 2, innerHeight * 0.7), 600);

    $('victory-subtitle').textContent   = `${boss.name} Dikalahkan!`;
    $('victory-exp').textContent        = `+${boss.rewardExp} EXP`;
    $('victory-story-text').textContent = boss.victoryStory;

    const rewardItem = DATA.items[boss.rewardItem];
    if (rewardItem) {
      $('victory-item-icon').textContent = rewardItem.icon;
      $('victory-item-name').textContent = rewardItem.name;
    }

    const unlockCard = $('victory-unlock-card');
    if (unlocked && DATA.regions[unlocked]) {
      unlockCard.style.display = '';
      $('victory-unlock-name').textContent = DATA.regions[unlocked].name;
    } else {
      unlockCard.style.display = 'none';
    }

    $('v-puzzles').textContent = State.stats.puzzlesSolved;
    $('v-damage').textContent  = State.battle.dmgTakenByPlayer + ' HP';
    $('v-hits').textContent    = `${State.battle.correctCount} Serangan`;

    if (boss.nextQuest >= 0) advanceQuest(boss.nextQuest);
    renderQuestTracker();
  },

  afterVictory() {
    const boss = DATA.bosses[State.victory.bossId];
    if (boss.nextQuest === -1) {
      this.showEnding();
    } else {
      this.goToWorldMap();
    }
  },

  // ============================================================
  // ENDING SCREEN
  // ============================================================
  showEnding() {
    showScreen('ending');
    $('core-art').textContent = '🔮';

    const story = 'Dengan bersatunya keempat Pecahan Persamaan, cahaya menyilaukan meledak dari tanganmu. Pecahan-pecahan itu berputar dalam harmoni matematika yang sempurna, masing-masing terkunci pada tempatnya dengan nada resonansi layaknya alam semesta yang sedang menghela napas. Equation Core telah kembali utuh. Di seluruh Numeria, angka-angka kembali menemukan maknanya. Sungai mengalir dalam proporsi yang benar. Pepohonan tumbuh dalam rasio yang tepat. Wujud gelap Nullifier larut dalam jeritan diam terakhirnya. Dunia telah pulih. Dan itu semua karenamu, Arithmos.';

    typewrite($('ending-story'), story, 14);

    [['stat-regions', State.stats.regionsCleared, 500],
     ['stat-puzzles', State.stats.puzzlesSolved,  700],
     ['stat-bosses',  State.stats.bossesDefeated, 900],
     ['stat-items',   State.stats.itemsCollected,  1100]].forEach(([id, val, delay]) => {
      setTimeout(() => countUp($(id), val), delay);
    });
    setTimeout(() => {
      countUp($('stat-score'), State.stats.score + State.player.hp * 2, 1400);
    }, 1300);

    this.fx.burst(innerWidth/2, innerHeight/3);
    setTimeout(() => this.fx.burst(innerWidth*0.3, innerHeight*0.6), 700);
    setTimeout(() => this.fx.burst(innerWidth*0.7, innerHeight*0.6), 1100);
  },

  playAgain() {
    this.startGame();
  }
};

// ============================================================
// START
// ============================================================
document.addEventListener('DOMContentLoaded', () => Game.init());
