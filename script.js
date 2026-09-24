/**
 * ============================================================================
 * WEB APP TRUNG THU TƯƠNG TÁC (MOBILE-FIRST)
 * ============================================================================
 * 
 * 🔧 HƯỚNG DẪN CẤU HÌNH (DỄ DÀNG THAY ĐỔI THÔNG TIN):
 * 1. Mật khẩu ngày sinh: Đổi giá trị biến BIRTHDAY (ví dụ: '2706' là ngày 27/06).
 * 2. Đường dẫn nhạc: Đổi biến MUSIC_PATH (file mp3 trong thư mục assets).
 * 3. Đường dẫn ảnh kỷ niệm: Đổi biến PHOTO_PATH (file jpg/png trong assets).
 * 4. Lời chúc: Đổi biến WISH_TEXT theo mong muốn của bạn.
 */

// =================== CẤU HÌNH CHÍNH (CONFIGURATION) ===================
const BIRTHDAY = '2706'; // Mật khẩu ngày sinh (DDMM)
const MUSIC_PATH = 'assets/nhac-trung-thu.mp3'; // Nhạc nền Trung Thu
const PHOTO_PATH = 'assets/hinh-anh-ky-niem.jpg'; // Ảnh kỷ niệm bạn gái
const WISH_TEXT = 'Chúc em yêu Hải Anh luôn xinh gái, vui tươi và sẽ sớm bên anh.'; // Lời chúc ngọt ngào

// 📧 EMAIL NHẬN THÔNG TIN LỊCH HẸN (Gửi tự động qua FormSubmit):
const RECEIVER_EMAIL = 'nguyenmanhhung15022004@gmail.com';
// ======================================================================

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const audio = document.getElementById('bg-audio');
  const musicToggleBtn = document.getElementById('music-toggle');
  const memoryPhoto = document.getElementById('memory-photo');
  const wishTextContent = document.getElementById('wish-text-content');

  // Gán thông tin từ cấu hình
  if (audio) audio.src = MUSIC_PATH;
  if (memoryPhoto) memoryPhoto.src = PHOTO_PATH;
  if (wishTextContent) wishTextContent.textContent = WISH_TEXT;

  // Khởi tạo các hệ thống
  initAudioSystem();
  initStarField();
  initConfetti();
  initScreen1();
  initScreen2();
  initScreen3();
  initScreen4();
});

/* ==========================================================================
   HỆ THỐNG ÂM THANH (AUDIO MANAGER)
   ========================================================================== */
let isAudioPlaying = false;

function initAudioSystem() {
  const audio = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-toggle');
  if (!audio || !musicBtn) return;

  musicBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
      audio.pause();
      isAudioPlaying = false;
      musicBtn.classList.remove('playing');
    } else {
      audio.play().then(() => {
        isAudioPlaying = true;
        musicBtn.classList.add('playing');
      }).catch(err => {
        console.warn('Autoplay prevented:', err);
      });
    }
  });

  audio.addEventListener('play', () => {
    isAudioPlaying = true;
    musicBtn.classList.add('playing');
  });

  audio.addEventListener('pause', () => {
    isAudioPlaying = false;
    musicBtn.classList.remove('playing');
  });
}

function startAudio() {
  const audio = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-toggle');
  if (!audio) return;

  audio.play().then(() => {
    isAudioPlaying = true;
    if (musicBtn) musicBtn.classList.add('playing');
  }).catch(e => {
    console.log('User interaction required for audio:', e);
  });
}

/* ==========================================================================
   CHUYỂN MÀN HÌNH (SCREEN TRANSITION HELPER)
   ========================================================================== */
function switchScreen(fromScreenId, toScreenId) {
  const fromScreen = document.getElementById(fromScreenId);
  const toScreen = document.getElementById(toScreenId);

  if (fromScreen) {
    fromScreen.classList.remove('active');
  }

  setTimeout(() => {
    if (toScreen) {
      toScreen.classList.add('active');
    }
  }, 350);
}

/* ==========================================================================
   MÀN 1: CHIẾC HỘP KHÓA MẬT MÃ
   ========================================================================== */
function initScreen1() {
  const closedBox = document.getElementById('closed-gift-box');
  const boxLid = document.getElementById('box-lid');
  const modal = document.getElementById('password-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const submitBtn = document.getElementById('submit-pin-btn');
  const pinInput = document.getElementById('pin-input');
  const pinError = document.getElementById('pin-error');
  const form = document.getElementById('password-form');

  if (!closedBox || !modal) return;

  // Mở modal khi chạm vào hộp
  closedBox.addEventListener('click', () => {
    modal.classList.remove('hidden');
    if (pinInput) {
      setTimeout(() => pinInput.focus(), 250);
    }
  });

  // Đóng modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      if (pinError) pinError.classList.add('hidden');
    });
  }

  // Xử lý kiểm tra mật mã
  function verifyCode() {
    const entered = (pinInput ? pinInput.value.trim() : '');

    // Chuẩn hóa chuỗi nhập (loại bỏ dấu gạch chéo hoặc khoảng trắng nếu nhập 27/06)
    const sanitized = entered.replace(/[\/\-\s]/g, '');

    if (sanitized === BIRTHDAY || entered === BIRTHDAY) {
      // Đúng mật khẩu!
      if (pinError) pinError.classList.add('hidden');
      modal.classList.add('hidden');

      // Kích hoạt hiệu ứng mở nắp hộp 3D
      if (boxLid) {
        boxLid.classList.add('lid-opened');
      }

      // Nổ pháo hoa nhỏ ăn mừng
      if (typeof fireConfettiBurst === 'function') {
        fireConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.55, 30);
      }

      // Chuyển sang Màn 2 sau 700ms
      setTimeout(() => {
        switchScreen('screen-1', 'screen-2');
      }, 750);

    } else {
      // Sai mật mã -> Rung lắc và hiện thông báo dễ thương
      if (pinError) {
        pinError.classList.remove('hidden');
      }

      // Rung lắc cả hộp và modal card
      const modalBox = modal.querySelector('.modal-card');
      if (modalBox) {
        modalBox.classList.remove('shake-anim');
        void modalBox.offsetWidth; // Reflow
        modalBox.classList.add('shake-anim');
      }
      if (closedBox) {
        closedBox.classList.remove('shake-anim');
        void closedBox.offsetWidth; // Reflow
        closedBox.classList.add('shake-anim');
      }

      // Rung phản hồi haptic trên điện thoại nếu được hỗ trợ
      if (navigator.vibrate) {
        navigator.vibrate([80, 40, 80]);
      }
    }
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', verifyCode);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      verifyCode();
    });
  }
}

/* ==========================================================================
   MÀN 2: KHÁM PHÁ BÊN TRONG CHIẾC HỘP (3 LẦN CHẠM)
   ========================================================================== */
function initScreen2() {
  const boxInterior = document.getElementById('box-interior');
  const boxVoid = document.getElementById('box-void');
  const memoryCard = document.getElementById('memory-card');
  const dot1 = document.getElementById('dot-1');
  const dot2 = document.getElementById('dot-2');
  const dot3 = document.getElementById('dot-3');
  const hintText = document.getElementById('touch-hint-text');
  const fingerGuide = document.getElementById('tap-finger-guide');

  let touchCount = 0;

  if (!boxInterior) return;

  boxInterior.addEventListener('click', (e) => {
    // Nếu chạm vào tấm thiệp đã hiển thị đầy đủ, không tăng touchCount vô tận
    if (touchCount >= 3) return;

    touchCount++;

    // Hiệu ứng haptic nhẹ
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // ====== LẦN CHẠM 1: Bật nhạc & Ánh sáng le lói ======
    if (touchCount === 1) {
      // Bật nhạc nền (vượt qua cơ chế chặn Autoplay trên mobile)
      startAudio();

      // Thêm ánh sáng le lói
      if (boxVoid) {
        boxVoid.classList.add('glow-level-1');
      }
      if (dot1) dot1.classList.add('active');

      if (fingerGuide) {
        fingerGuide.style.display = 'none';
      }

      if (hintText) {
        hintText.innerHTML = '<span class="hint-text pulse-text">Ánh sáng le lói dần... Chạm tiếp lần 2 nè ✨</span>';
      }

      // Tạo các hạt sáng bay lên từ lòng hộp
      createSparkleBurstAround(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight * 0.5);
    }

    // ====== LẦN CHẠM 2: Bật sáng hoàn toàn - Hiện thiệp ảnh & Lời chúc ======
    else if (touchCount === 2) {
      if (boxVoid) {
        boxVoid.classList.remove('glow-level-1');
        boxVoid.classList.add('glow-level-2');
      }
      if (dot2) dot2.classList.add('active');

      // Tấm thiệp / Khung ảnh kỷ niệm nổi bật trôi từ trong lòng hộp ra
      if (memoryCard) {
        memoryCard.classList.add('show-card');
      }

      if (hintText) {
        hintText.innerHTML = '<span class="hint-text pulse-text">Chạm một lần nữa để nhận món quà cuối cùng! 🎁</span>';
      }

      // Bắn tia sáng vàng lấp lánh
      createSparkleBurstAround(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight * 0.5);
    }

    // ====== LẦN CHẠM 3: Món quà cuối cùng - Lời mời hẹn hò ======
    else if (touchCount === 3) {
      if (dot3) dot3.classList.add('active');

      if (hintText) {
        hintText.innerHTML = '<span class="hint-text">Mở món quà đặc biệt... ✨</span>';
      }

      // Bùng nổ pháo hoa giấy confetti
      if (typeof launchFullConfetti === 'function') {
        launchFullConfetti();
      }

      // Chuyển mượt sang Màn 3 sau 850ms
      setTimeout(() => {
        switchScreen('screen-2', 'screen-3');
      }, 850);
    }
  });
}

/* ==========================================================================
   MÀN 3: THỬ THÁCH LỜI MỜI HẸN HÒ
   ========================================================================== */
function initScreen3() {
  const btnAgree = document.getElementById('btn-agree');
  const btnRefuse = document.getElementById('btn-refuse');
  const btnRefuseText = document.getElementById('btn-refuse-text');
  const playground = document.getElementById('choice-playground');

  // Danh sách các câu trêu chọc biến đổi liên tục
  const teasePhrases = [
    'Không bấm được đâu! 😜',
    'Chịu đi mà! 🥺',
    'Năn nỉ đấy! ❤️',
    'Bấm nút kia cơ! 👉',
    'Còn lâu mới bấm trúng! 😝',
    'Thua chưa nè! 😆',
    'Nút này bị khoá rùi! 🔒',
    'Đồng ý với anh đi! 🥰'
  ];
  let phraseIndex = 0;

  // Nút "Đồng ý"
  if (btnAgree) {
    btnAgree.addEventListener('click', () => {
      // Nổ pháo hoa rực rỡ
      if (typeof launchFullConfetti === 'function') {
        launchFullConfetti();
      }
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 150]);
      }

      // Chuyển sang Màn 4 (Form đặt lịch hẹn)
      setTimeout(() => {
        switchScreen('screen-3', 'screen-4');
      }, 700);
    });
  }

  // Hàm di chuyển né tránh thông minh của nút "Không đồng ý"
  function dodgeButton(e) {
    if (e && e.cancelable && e.type === 'touchstart') {
      e.preventDefault(); // Ngăn chặn sự kiện click kịp kích hoạt trên di động
    }

    if (!btnRefuse || !playground) return;

    // Kích thước khu vực an toàn
    const playRect = playground.getBoundingClientRect();
    const btnRect = btnRefuse.getBoundingClientRect();

    // Giới hạn trong viewport di động để không bao giờ văng ra ngoài mép màn hình
    const maxSafeX = Math.min(playRect.width - btnRect.width - 15, window.innerWidth - btnRect.width - 30);
    const minSafeX = -playRect.width / 2 + btnRect.width / 2 + 10;

    // Random vị trí mới
    const randomX = (Math.random() - 0.5) * (playRect.width * 0.9);
    // Di chuyển lên hoặc xuống trong tầm -60px đến +50px
    const randomY = (Math.random() - 0.5) * 80;

    btnRefuse.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // Đổi câu chữ trêu chọc
    phraseIndex = (phraseIndex + 1) % teasePhrases.length;
    if (btnRefuseText) {
      btnRefuseText.textContent = teasePhrases[phraseIndex];
    }

    // Rung haptic nhẹ
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }

  if (btnRefuse) {
    // Bắt sự kiện touchstart với { passive: false } để phản hồi tức thì
    btnRefuse.addEventListener('touchstart', dodgeButton, { passive: false });
    // Bắt sự kiện trên máy tính desktop / chuột
    btnRefuse.addEventListener('mouseenter', dodgeButton);
    btnRefuse.addEventListener('mouseover', dodgeButton);
    btnRefuse.addEventListener('pointerdown', dodgeButton);

    // Đề phòng trường hợp click lọt qua
    btnRefuse.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeButton(e);
    });
  }
}

/* ==========================================================================
   MÀN 4: FORM ĐẶT LỊCH HẸN & LỜI CẢM ƠN
   ========================================================================== */
function initScreen4() {
  const form = document.getElementById('date-booking-form');
  const dateInput = document.getElementById('date-input');
  const timeInput = document.getElementById('time-input');
  const wishInput = document.getElementById('wish-input');
  const locationInput = document.getElementById('location-input');
  const formCard = document.getElementById('date-form-card');
  const successCard = document.getElementById('booking-success-card');
  const summaryDetails = document.getElementById('booking-summary-details');

  // Đặt giá trị ngày mặc định là hôm nay
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // Dữ liệu cuộc hẹn đã lưu
  let savedBooking = null;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const dateVal = dateInput ? dateInput.value : '';
      const timeVal = timeInput ? timeInput.value : '';
      const wishVal = (wishInput && wishInput.value.trim()) ? wishInput.value.trim() : 'bất cứ nơi nào miễn là ăn cùng anh';
      const locationVal = (locationInput && locationInput.value.trim()) ? locationInput.value.trim() : 'bất cứ nơi nào miễn là có anh';

      // Định dạng ngày hiển thị đẹp (DD/MM/YYYY)
      let formattedDate = dateVal;
      if (dateVal.includes('-')) {
        const parts = dateVal.split('-');
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }

      savedBooking = {
        date: formattedDate,
        time: timeVal,
        wish: wishVal,
        location: locationVal
      };

      // Hiển thị tóm tắt trong thiệp thành công
      if (summaryDetails) {
        summaryDetails.innerHTML = `
          <div><strong>📅 Ngày hẹn:</strong> ${savedBooking.date}</div>
          <div><strong>⏰ Giờ đón:</strong> ${savedBooking.time}</div>
          <div><strong>🍜 Món em thích:</strong> ${savedBooking.wish}</div>
          <div><strong>📍 Địa điểm em thích:</strong> ${savedBooking.location}</div>
        `;
      }

      // Tự động gửi ngầm thông tin về Gmail của bạn qua FormSubmit
      sendEmailNotification(savedBooking);

      // Ẩn form, hiện thiệp kết thúc ngay lập tức không bắt bạn gái chờ
      if (formCard) formCard.classList.add('hidden');
      if (successCard) successCard.classList.remove('hidden');

      // Nổ pháo hoa chúc mừng
      if (typeof launchFullConfetti === 'function') {
        launchFullConfetti();
      }

      if (navigator.vibrate) {
        navigator.vibrate([100, 80, 200]);
      }
    });
  }
}

/**
 * Gửi email thông báo tự động về Gmail qua FormSubmit API
 */
function sendEmailNotification(booking) {
  // Lưu dự phòng trong localStorage trình duyệt
  try {
    localStorage.setItem('mid_autumn_booking', JSON.stringify(booking));
  } catch (err) {
    console.warn(err);
  }

  if (!RECEIVER_EMAIL) return;

  fetch(`https://formsubmit.co/ajax/${RECEIVER_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      _subject: '🏮 [TRUNG THU] Lịch hẹn từ công chúa của bạn! ❤️',
      _template: 'table',
      _captcha: 'false',
      '📅 Ngày hẹn': booking.date,
      '⏰ Giờ đón': booking.time,
      '🍜 Món em thích': booking.wish,
      '📍 Địa điểm em thích': booking.location,
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Đã gửi email lịch hẹn thành công:', data);
  })
  .catch(err => {
    console.error('❌ Lỗi khi gửi email qua FormSubmit:', err);
  });
}

/* ==========================================================================
   CANVAS SAO ĐÊM & ĐOM ĐÓM LƠ LỬNG (STARS & FIREFLIES)
   ========================================================================== */
function initStarField() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  });

  const stars = [];
  const starCount = 55;

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        // Chuyển động nhẹ như đom đóm
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.3 - 0.05
      });
    }
  }

  initStars();

  function animateStars() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Lấp lánh
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha > 0.95) {
        s.alpha = 0.95;
        s.twinkleDir = -1;
      } else if (s.alpha < 0.2) {
        s.alpha = 0.2;
        s.twinkleDir = 1;
      }

      // Trôi nhẹ
      s.x += s.vx;
      s.y += s.vy;
      if (s.y < 0) s.y = height;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 235, 170, ${s.alpha})`;
      ctx.shadowBlur = s.radius * 4;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
      ctx.fill();
    }

    requestAnimationFrame(animateStars);
  }

  animateStars();
}

/* ==========================================================================
   CANVAS HIỆU ỨNG PHÁO HOA GIẤY (CONFETTI SYSTEM)
   ========================================================================== */
let confettiParticles = [];
let confettiCtx = null;
let confettiCanvas = null;

function initConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  if (!confettiCanvas) return;
  confettiCtx = confettiCanvas.getContext('2d');

  function resize() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function renderConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;

      if (p.opacity <= 0 || p.y > confettiCanvas.height) {
        confettiParticles.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.globalAlpha = Math.max(0, p.opacity);
      confettiCtx.fillStyle = p.color;

      if (p.shape === 'circle') {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      } else {
        confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }

      confettiCtx.restore();
    }

    requestAnimationFrame(renderConfetti);
  }

  renderConfetti();
}

// Bắn pháo hoa giấy nổ tung toé
function launchFullConfetti() {
  const colors = ['#ff1744', '#ff5252', '#ffd54f', '#ffab00', '#ff4081', '#00e676', '#00b0ff', '#ffffff'];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.45;

  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 10 + 4;
    confettiParticles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      gravity: 0.22,
      size: Math.random() * 8 + 6,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    });
  }
}

// Pháo hoa nhỏ
function fireConfettiBurst(x, y, count = 25) {
  const colors = ['#ffd54f', '#ffca28', '#ff3d00', '#fff'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    confettiParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      gravity: 0.18,
      size: Math.random() * 6 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: 'rect'
    });
  }
}

// Hạt sáng lấp lánh khi chạm vào lòng hộp
function createSparkleBurstAround(x, y) {
  fireConfettiBurst(x, y, 18);
}
