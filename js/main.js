/* ===== LOSERS - MAIN JAVASCRIPT ===== */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initScrollTop();
  initFadeAnimations();
  initThemeToggle();
  initHeroParticles();
  initHeroEntrance();
  initCountUp();
});

/* ---------- Dark Mode Toggle ---------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }

  toggleBtn.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem("theme", "dark");
    }
  });
}

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  // Scroll effect (throttled for performance)
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
          } else {
            navbar.classList.remove("scrolled");
          }
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      // Animate hamburger
      const spans = navToggle.querySelectorAll("span");
      navToggle.classList.toggle("active");
      if (navLinks.classList.contains("open")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
      } else {
        spans[0].style.transform = "";
        spans[1].style.opacity = "";
        spans[2].style.transform = "";
      }
    });

    // Close on link click
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        const spans = navToggle.querySelectorAll("span");
        spans[0].style.transform = "";
        spans[1].style.opacity = "";
        spans[2].style.transform = "";
      });
    });
  }
}

/* ---------- Scroll to Top ---------- */
function initScrollTop() {
  const scrollBtn = document.getElementById("scrollTop");
  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Fade-in Animations ---------- */
function initFadeAnimations() {
  const fadeEls = document.querySelectorAll(".fade-in");

  // Immediately reveal elements already in the viewport (no animation delay)
  fadeEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.style.transition = "none";
      el.classList.add("visible");
      // Force reflow then restore transition for future interactions
      el.offsetHeight;
      el.style.transition = "";
    }
  });

  // Animate remaining elements as they scroll into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  fadeEls.forEach((el) => {
    if (!el.classList.contains("visible")) {
      observer.observe(el);
    }
  });
}

/* ---------- Event Filtering ---------- */
function filterEvents(category, e) {
  const grid = document.getElementById("pastEventsGrid");
  if (!grid) return;

  const cards = grid.querySelectorAll(".event-card");
  const buttons = document.querySelectorAll(".tab-btn");

  // Update active tab
  buttons.forEach((btn) => btn.classList.remove("active"));
  if (e && e.target) e.target.classList.add("active");

  cards.forEach((card) => {
    const cardCategory = card.getAttribute("data-category");
    if (category === "all" || cardCategory === category) {
      card.style.display = "";
      card.style.animation = "fadeInUp 0.4s ease forwards";
    } else {
      card.style.display = "none";
    }
  });
}

/* ---------- Blog Filtering ---------- */
function filterBlog(category, e) {
  const grid = document.getElementById("blogGrid");
  if (!grid) return;

  const cards = grid.querySelectorAll(".blog-card");
  const buttons = document.querySelectorAll(".tab-btn");

  buttons.forEach((btn) => btn.classList.remove("active"));
  if (e && e.target) e.target.classList.add("active");

  cards.forEach((card) => {
    const cardCategory = card.getAttribute("data-category");
    if (category === "all" || cardCategory === category) {
      card.style.display = "";
      card.style.animation = "fadeInUp 0.4s ease forwards";
    } else {
      card.style.display = "none";
    }
  });
}

/* ---------- Gallery Filtering ---------- */
function filterGallery(category, e) {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const items = grid.querySelectorAll(".gallery-item");
  const buttons = document.querySelectorAll(".tab-btn");

  buttons.forEach((btn) => btn.classList.remove("active"));
  if (e && e.target) e.target.classList.add("active");

  items.forEach((item) => {
    const itemCategory = item.getAttribute("data-category");
    if (category === "all" || itemCategory === category) {
      item.style.display = "";
      item.style.animation = "fadeInUp 0.4s ease forwards";
    } else {
      item.style.display = "none";
    }
  });
}

/* ---------- Lightbox ---------- */
function openLightbox(element) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (!lightbox || !lightboxImg) return;

  // For SVG placeholders, create a data URL from the SVG
  const svg = element.querySelector("svg");
  if (svg) {
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    lightboxImg.src = url;
  } else {
    const img = element.querySelector("img");
    if (img) {
      lightboxImg.src = img.src;
    }
  }

  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

// Close lightbox on background click
document.addEventListener("click", (e) => {
  const lightbox = document.getElementById("lightbox");
  if (lightbox && e.target === lightbox) {
    closeLightbox();
  }
});

// Close lightbox on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
  }
});

/* ---------- Form Handlers ---------- */
function handleJoinForm(e) {
  e.preventDefault();
  const form = document.getElementById("joinForm");
  const success = document.getElementById("formSuccess");

  if (form && success) {
    form.style.display = "none";
    success.style.display = "block";
    success.style.animation = "fadeInUp 0.5s ease forwards";
  }
}

function handleContactForm(e) {
  e.preventDefault();
  const form = document.getElementById("contactForm");
  const success = document.getElementById("contactSuccess");

  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const subject =
    document.getElementById("contactSubject").value || "General Inquiry";
  const message = document.getElementById("contactMessage").value;

  const mailtoSubject = encodeURIComponent("[Losers Community] " + subject);
  const mailtoBody = encodeURIComponent(
    "Name: " + name + "\nEmail: " + email + "\n\n" + message,
  );
  window.open(
    "mailto:taslimahmedtamim4u@gmail.com?subject=" +
      mailtoSubject +
      "&body=" +
      mailtoBody,
  );

  if (form && success) {
    form.style.display = "none";
    success.style.display = "block";
    success.style.animation = "fadeInUp 0.5s ease forwards";
  }
}

/* ---------- Hero Entrance Animation ---------- */
function initHeroEntrance() {
  // Use requestAnimationFrame to trigger after first paint instead of arbitrary timeout
  requestAnimationFrame(() => {
    document.querySelectorAll(".hero-animate").forEach((el) => {
      el.classList.add("active");
    });
    const scrollInd = document.querySelector(".hero-scroll-indicator");
    if (scrollInd) scrollInd.classList.add("active");
  });
}

/* ---------- Hero Particles ---------- */
function initHeroParticles() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w, h;
  let mouse = { x: -1000, y: -1000 };
  const particles = [];
  const PARTICLE_COUNT = 70;
  const CONNECT_DIST = 140;
  const MOUSE_RADIUS = 180;

  const colors = [
    { r: 16, g: 185, b: 129 }, // emerald
    { r: 52, g: 211, b: 153 }, // light emerald
    { r: 59, g: 130, b: 246 }, // blue
    { r: 245, g: 158, b: 11 }, // amber
  ];

  function resize() {
    const section = canvas.parentElement;
    w = canvas.width = section.offsetWidth;
    h = canvas.height = section.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2.2 + 0.8;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.baseAlpha = Math.random() * 0.5 + 0.3;
      this.alpha = this.baseAlpha;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.pulse += 0.02;
      this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.15;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.8;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
        this.alpha = Math.min(1, this.alpha + 0.3);
      }

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < -20) this.x = w + 20;
      if (this.x > w + 20) this.x = -20;
      if (this.y < -20) this.y = h + 20;
      if (this.y > h + 20) this.y = -20;
    }
    draw() {
      const { r, g, b } = this.color;
      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha * 0.12})`;
      ctx.fill();
      // Core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const opacity = (1 - dist / CONNECT_DIST) * 0.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    drawConnections();
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  function init() {
    resize();
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  window.addEventListener("resize", () => {
    resize();
  });

  // Track mouse over hero section
  canvas.parentElement.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  init();
  animate();
}

/* ---------- Count Up Animation ---------- */
function initCountUp() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"));
          animateCount(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => observer.observe(c));
}

function animateCount(el, target) {
  let current = 0;
  const duration = 2000;
  const step = target / (duration / 16);

  function tick() {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      return;
    }
    el.textContent = Math.floor(current).toLocaleString();
    requestAnimationFrame(tick);
  }
  tick();
}

/* ---------- CSS Animation Keyframes (injected) ---------- */
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
