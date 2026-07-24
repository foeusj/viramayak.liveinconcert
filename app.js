/* ==========================================================================
   VIRAMAYAK 2026 - INTERACTIVE APP LOGIC
   Faculty of Engineering, University of Sri Jayewardenepura
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Background Music Audio Control (bg.wav)
  // ------------------------------------------------------------------------
  const bgMusic = document.getElementById('bg-music');
  const soundToggleBtn = document.getElementById('sound-toggle');

  function playBgMusic() {
    if (bgMusic) {
      bgMusic.play().then(() => {
        if (soundToggleBtn) {
          soundToggleBtn.classList.add('playing');
          soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
      }).catch(err => {
        console.log('Autoplay prevented by browser:', err);
      });
    }
  }

  function pauseBgMusic() {
    if (bgMusic) {
      bgMusic.pause();
      if (soundToggleBtn) {
        soundToggleBtn.classList.remove('playing');
        soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      }
    }
  }

  function toggleBgMusic() {
    if (bgMusic) {
      if (bgMusic.paused) {
        playBgMusic();
      } else {
        pauseBgMusic();
      }
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      toggleBgMusic();
    });
  }

  // ------------------------------------------------------------------------
  // 2. Intro Screen & Smooth Reveal
  // ------------------------------------------------------------------------
  const introScreen = document.getElementById('intro-screen');
  const enterBtn = document.getElementById('enter-btn');

  if (enterBtn && introScreen) {
    enterBtn.addEventListener('click', () => {
      introScreen.classList.add('hidden-intro');
      
      // Start background music (bg.wav) on enter experience
      playBgMusic();

      setTimeout(() => {
        document.body.style.overflow = 'auto';
      }, 500);
    });
  }

  // ------------------------------------------------------------------------
  // 3. Interactive 3D Auditorium Spatial Viewport Logic
  // ------------------------------------------------------------------------
  const audiModal = document.getElementById('audi-modal');
  const openAudiBtn = document.getElementById('open-audi-modal');
  const closeAudiBtn = document.getElementById('close-audi-modal');
  const audi3dScene = document.getElementById('audi-3d-scene');
  const audi3dCard = document.getElementById('audi-3d-card');
  const stageBeams = document.getElementById('stage-beams');
  const toggleBeamsBtn = document.getElementById('toggle-beams-btn');
  const reset3dBtn = document.getElementById('reset-3d-btn');

  if (openAudiBtn && audiModal) {
    openAudiBtn.addEventListener('click', () => {
      audiModal.classList.add('active');
    });
  }

  if (closeAudiBtn && audiModal) {
    closeAudiBtn.addEventListener('click', () => {
      audiModal.classList.remove('active');
    });
  }

  if (audiModal) {
    audiModal.addEventListener('click', (e) => {
      if (e.target === audiModal) {
        audiModal.classList.remove('active');
      }
    });
  }

  // Interactive 3D Mouse Parallax & Spatial Tilt
  if (audi3dScene && audi3dCard) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let currentRotateX = 0, currentRotateY = 0;

    function set3dTransform(rotateX, rotateY, scale = 1.08) {
      audi3dCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    }

    audi3dScene.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        currentRotateY += deltaX * 0.15;
        currentRotateX -= deltaY * 0.15;
        currentRotateX = Math.max(-25, Math.min(25, currentRotateX));
        currentRotateY = Math.max(-35, Math.min(35, currentRotateY));
        set3dTransform(currentRotateX, currentRotateY, 1.12);
        startX = e.clientX;
        startY = e.clientY;
      } else {
        const rect = audi3dScene.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateY = (x / (rect.width / 2)) * 16;
        const rotateX = -(y / (rect.height / 2)) * 14;
        set3dTransform(rotateX, rotateY, 1.08);
      }
    });

    audi3dScene.addEventListener('mouseleave', () => {
      if (!isDragging) {
        set3dTransform(0, 0, 1.0);
      }
    });

    audi3dScene.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    if (reset3dBtn) {
      reset3dBtn.addEventListener('click', () => {
        currentRotateX = 0;
        currentRotateY = 0;
        set3dTransform(0, 0, 1.0);
      });
    }

    if (toggleBeamsBtn && stageBeams) {
      let beamsVisible = true;
      toggleBeamsBtn.addEventListener('click', () => {
        beamsVisible = !beamsVisible;
        stageBeams.style.display = beamsVisible ? 'block' : 'none';
        showToast(beamsVisible ? '3D Stage Lights Enabled!' : '3D Stage Lights Disabled');
      });
    }
  }

  // ------------------------------------------------------------------------
  // 4. Live Countdown Timer (Target: Nov 30, 2026 18:00:00 IST)
  // ------------------------------------------------------------------------
  const targetDate = new Date('2026-11-30T18:00:00+05:30').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ------------------------------------------------------------------------
  // 5. Floating Music Notes & Glow Particles Background Canvas
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const musicNotes = ['🎵', '🎶', '🎼', '🎸', '🎹', '🎷', '🎤', '🥁', '✨'];
    const particles = [];
    const particleCount = Math.min(Math.floor(width / 35), 45);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 18 + 14;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.note = musicNotes[Math.floor(Math.random() * musicNotes.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.isOrb = Math.random() > 0.4;
        this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246,' : 'rgba(59, 130, 246,';
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;

        if (this.y < -50) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.isOrb) {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
          gradient.addColorStop(0, this.color + this.opacity + ')');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = this.opacity;
          ctx.font = `${this.size}px Outfit, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = '#8b5cf6';
          ctx.shadowBlur = 12;
          ctx.fillText(this.note, 0, 0);
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let p of particles) {
        p.update();
        p.draw();
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ------------------------------------------------------------------------
  // 6. Toast Notification Helper
  // ------------------------------------------------------------------------
  window.showToast = function(message) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-msg-text');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  };

  // ------------------------------------------------------------------------
  // 7. Share & Copy Link Functionality
  // ------------------------------------------------------------------------
  const shareBtn = document.getElementById('share-event-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Viramayak 2026 - Faculty of Engineering, USJ',
          text: 'Join Viramayak 2026 Concert on Nov 30 at USJ Engineering Faculty Auditorium!',
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Event link copied to clipboard!');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 8. Pixel-Perfect Smooth Navigation Scroll Handler
  // ------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // Higher scroll alignment for Venue and Socials
          let navbarOffset = 40;
          if (targetId === '#venue') {
            navbarOffset = 15; // Scroll significantly higher up for Venue
          } else if (targetId === '#socials') {
            navbarOffset = 20;
          } else if (targetId === '#about') {
            navbarOffset = 30;
          } else if (targetId === '#countdown') {
            navbarOffset = 160; // Scroll down more for countdown
          }

          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ------------------------------------------------------------------------
  // 9. Official Trailer Lightbox Modal Logic (Google Drive Video Player Embed)
  // ------------------------------------------------------------------------
  const trailerModal = document.getElementById('trailer-modal');
  const openTrailerNav = document.getElementById('open-trailer-nav');
  const openTrailerHero = document.getElementById('open-trailer-hero-btn');
  const closeTrailerBtn = document.getElementById('close-trailer-modal');
  const trailerIframe = document.getElementById('trailer-iframe');
  const trailerEmbedUrl = 'https://drive.google.com/file/d/1r4LiAOnLz2DdNeN7nPaDmtzBWWfsv0mc/preview';
  let wasMusicPlayingBeforeTrailer = false;

  function openTrailerModal() {
    if (trailerModal && trailerIframe) {
      // Pause background music if currently playing
      if (bgMusic && !bgMusic.paused) {
        wasMusicPlayingBeforeTrailer = true;
        pauseBgMusic();
      } else {
        wasMusicPlayingBeforeTrailer = false;
      }

      trailerIframe.src = trailerEmbedUrl;
      trailerModal.classList.add('active');
    }
  }

  function closeTrailerModal() {
    if (trailerModal && trailerIframe) {
      trailerModal.classList.remove('active');
      trailerIframe.src = '';

      // Resume background music if it was playing before
      if (wasMusicPlayingBeforeTrailer) {
        playBgMusic();
      }
    }
  }

  if (openTrailerNav) openTrailerNav.addEventListener('click', openTrailerModal);
  if (openTrailerHero) openTrailerHero.addEventListener('click', openTrailerModal);
  if (closeTrailerBtn) closeTrailerBtn.addEventListener('click', closeTrailerModal);

  if (trailerModal) {
    trailerModal.addEventListener('click', (e) => {
      if (e.target === trailerModal) closeTrailerModal();
    });
  }
});
