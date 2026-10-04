# NUMERA

## Menjalankan

Gunakan Node.js 24 atau lebih baru. SQLite memakai modul bawaan Node, jadi tidak perlu instalasi package.

```powershell
node server.js
```

Buka `http://localhost:3001`. Database dibuat otomatis di `data/numera.sqlite`. Untuk mengganti port atau lokasi database, atur `PORT` atau `NUMERA_DB` sebelum menjalankan server.

## Akun dan save

Mode tamu tetap tersedia dan menyimpan progress di browser. Register/login memakai username dan password; password diproses dengan scrypt, sedangkan cookie session berisi token acak HttpOnly yang hash-nya disimpan di SQLite. Save akun disimpan terpisah per user.

## Timer dan leaderboard

Sesi waktu akun dimulai server saat permainan baru dimulai. Server mencatat completion hanya setelah empat boss dikalahkan berurutan melalui combat terverifikasi; waktu mulai/selesai berasal dari clock server, bukan nilai yang dikirim browser. Leaderboard publik membaca completion tercepat per akun dari SQLite dan menyimpan durasi milidetik, detik, format tampilan, tanggal, serta status selesai. Timer guest tersimpan lokal dan tidak masuk leaderboard global.