# BlokSpace - Classic Game

Sebuah game klasik yang dibuat dengan HTML5, CSS3, dan JavaScript vanilla. Game ini menampilkan gameplay retro dengan visual modern dan responsif.

## 🎮 Fitur Game

- **Gameplay Klasik**: Tembak musuh dan hindari peluru mereka
- **Kontrol Dual**: Keyboard untuk PC dan touch controls bergaya gameboy untuk mobile
- **Sound Effects**: Efek suara ringan dan menarik menggunakan Web Audio API
- **Responsive Design**: Tampilan modern yang beradaptasi dengan berbagai ukuran layar
- **Mobile Friendly**: Kontrol touch yang dioptimalkan untuk perangkat mobile
- **Game Controls**: Pause/Resume, Reset, dan Mute
- **Particle Effects**: Efek ledakan dan partikel yang menarik
- **Auto-updating Copyright**: Tahun copyright yang otomatis update

## 🎯 Cara Bermain

### PC Controls:
- **WASD** atau **Arrow Keys**: Gerakkan player
- **Space**: Tembak
- **P**: Pause/Resume
- **R**: Reset game
- **M**: Mute/Unmute sound

### Mobile Controls:
- **D-Pad**: Gerakkan player
- **Tombol A**: Tembak
- **Tombol B**: Special (reserved untuk fitur masa depan)

## 🚀 Cara Menjalankan

1. Clone atau download repository ini
2. Buka file `index.html` di browser modern
3. Atau jalankan local server:
   ```bash
   # Menggunakan Python
   python -m http.server 8000
   
   # Menggunakan Node.js
   npx http-server -p 8000
   ```
4. Buka `http://localhost:8000` di browser

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur game dan canvas
- **CSS3**: Styling modern dengan gradients, animations, dan responsive design
- **JavaScript ES6+**: Game logic dan mechanics
- **Web Audio API**: Sound effects
- **Canvas API**: Rendering graphics
- **Google Fonts**: Typography (Orbitron)

## 📱 Kompatibilitas

- ✅ Chrome/Chromium (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)
- ✅ Opera (Desktop & Mobile)

## 🎨 Fitur Visual

- **Modern UI**: Design dengan glassmorphism dan neon effects
- **Responsive Layout**: Adaptif untuk desktop, tablet, dan mobile
- **Gameboy-style Controls**: Kontrol mobile yang terinspirasi dari gameboy klasik
- **Particle System**: Efek visual yang menarik untuk ledakan
- **Smooth Animations**: Transisi dan animasi yang halus

## 🔧 Struktur File

```
BlokSpace/
├── index.html          # File HTML utama
├── styles.css          # Stylesheet dengan responsive design
├── game.js            # Game engine dan logic
└── README.md          # Dokumentasi ini
```

## 🎵 Audio Features

Game menggunakan Web Audio API untuk menghasilkan sound effects secara procedural:
- **Shoot Sound**: Efek suara tembakan
- **Hit Sound**: Efek suara ketika mengenai musuh
- **Player Hit**: Efek suara ketika player terkena
- **Mute Toggle**: Kontrol untuk mematikan/menyalakan suara

## 🏆 Game Mechanics

- **Lives System**: Player memiliki 3 nyawa
- **Score System**: Dapatkan 100 poin per musuh yang dikalahkan
- **Enemy AI**: Musuh bergerak dan menembak secara otomatis
- **Collision Detection**: Sistem deteksi tabrakan yang akurat
- **Invincibility Frames**: Player memiliki waktu kebal setelah terkena damage
- **Dynamic Enemy Spawning**: Musuh spawn secara dinamis

## 📄 Lisensi

© 2025 KingSyah - All rights reserved

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau laporkan bug melalui issues.

## 📞 Kontak

Untuk pertanyaan atau saran, silakan hubungi KingSyah.

---

**Selamat bermain BlokSpace! 🎮**
