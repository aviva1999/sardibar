const cartCount = document.querySelector(".cart-button strong");
const shopCartTotal = document.querySelector(".shop-cart-total");
let count = 0;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const touchLike = window.matchMedia("(max-width: 767px), (hover: none), (pointer: coarse)").matches;

document.querySelectorAll(".add-to-cart, .bundle-submit").forEach((button) => {
  button.addEventListener("click", () => {
    count += 1;
    if (cartCount) cartCount.textContent = count;
    if (shopCartTotal) shopCartTotal.textContent = count;
    button.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)" },
        { transform: "translate(-4px, -5px) rotate(-2deg)" },
        { transform: "translate(0, 0) rotate(0deg)" },
      ],
      { duration: 260, easing: "ease-out" },
    );
  });
});

const revealItems = [
  ...document.querySelectorAll(
    ".product-card, .blob-card, .bundle__panel, .shop-cart-card, .shop-promo, .club h2, .club p, .club-form, .footer",
  ),
];

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-index", String(index % 6));
});

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const updateScrollMotion = () => {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = window.scrollY / maxScroll;
  const heroShift = Math.min(76, window.scrollY * 0.16);
  const gallery = document.querySelector(".gallery");
  const bundle = document.querySelector(".bundle");
  let galleryShift = 0;
  let bundleTilt = 3;

  if (gallery) {
    const rect = gallery.getBoundingClientRect();
    const localProgress = 1 - Math.min(1, Math.max(0, rect.top / window.innerHeight));
    galleryShift = (localProgress - 0.5) * 34;
  }

  if (bundle) {
    const rect = bundle.getBoundingClientRect();
    const localProgress = 1 - Math.min(1, Math.max(0, rect.top / window.innerHeight));
    bundleTilt = 3 + (localProgress - 0.5) * 5;
  }

  document.body.style.setProperty("--scroll", progress.toFixed(4));
  document.body.style.setProperty("--hero-shift", `${heroShift.toFixed(1)}px`);
  document.body.style.setProperty("--gallery-shift", `${galleryShift.toFixed(1)}px`);
  document.body.style.setProperty("--bundle-tilt", `${bundleTilt.toFixed(2)}deg`);
};

if (!reduceMotion) {
  updateScrollMotion();
  window.addEventListener("scroll", updateScrollMotion, { passive: true });
  window.addEventListener("resize", updateScrollMotion);
}

document.querySelectorAll(".stepper").forEach((stepper) => {
  const value = stepper.querySelector("strong");
  const buttons = stepper.querySelectorAll("button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentValue = Number(value.textContent);
      const isPlus = button.textContent.trim() === "+";
      value.textContent = String(isPlus ? currentValue + 1 : Math.max(0, currentValue - 1));
      value.animate(
        [
          { transform: "translateY(0) scale(1)" },
          { transform: "translateY(-4px) scale(1.18)" },
          { transform: "translateY(0) scale(1)" },
        ],
        { duration: 220, easing: "ease-out" },
      );
    });
  });
});

document.querySelectorAll(".club-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button");
    button.textContent = "נרשמתם!";
    setTimeout(() => {
      button.textContent = "שלחו";
    }, 1800);
  });
});

document.querySelectorAll(".shop-filter").forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const filter = filterButton.dataset.filter;
    document.querySelectorAll(".shop-filter").forEach((button) => {
      button.classList.toggle("is-active", button === filterButton);
    });

    document.querySelectorAll("#shop-products .product-card").forEach((card) => {
      const categories = (card.dataset.category || "").split(" ");
      const isVisible = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-filtered-out", !isVisible);
    });
  });
});

const initSnackCursor = () => {
  if (reduceMotion || touchLike) return;

  const cursor = document.querySelector(".snack-cursor");
  if (!cursor) return;

  const colors = ["#FFCB30", "#FF6734", "#9AE2FF", "#FFF9E8", "#129027"];
  const particleTypes = ["snack-particle--cracker", "snack-particle--bubble", "snack-particle--dot"];
  const hoverTargets = document.querySelectorAll(
    "a, button, .product-card, .bundle-option, .stepper button, input",
  );
  const productCards = document.querySelectorAll(".product-card");
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let lastTrail = 0;
  let particleCount = 0;
  const maxParticles = 38;

  document.body.classList.add("has-snack-cursor");

  const createParticle = (x, y, burst = false) => {
    if (particleCount >= maxParticles) return;

    const particle = document.createElement("span");
    const size = burst ? 8 + Math.random() * 10 : 4 + Math.random() * 7;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    const dx = (Math.random() - 0.5) * (burst ? 90 : 46);
    const dy = (Math.random() - 0.9) * (burst ? 78 : 42);
    const life = burst ? 850 + Math.random() * 180 : 620 + Math.random() * 260;

    particle.className = `snack-particle ${type}`;
    particle.style.setProperty("--x", `${x}px`);
    particle.style.setProperty("--y", `${y}px`);
    particle.style.setProperty("--dx", `${dx}px`);
    particle.style.setProperty("--dy", `${dy}px`);
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--life", `${life}ms`);
    particle.style.setProperty("--spin", `${Math.random() * 180}deg`);
    particle.style.setProperty("--particle-color", color);
    particle.style.setProperty("--radius", Math.random() > 0.55 ? "3px" : "999px");

    particleCount += 1;
    document.body.appendChild(particle);
    window.setTimeout(() => {
      particle.remove();
      particleCount = Math.max(0, particleCount - 1);
    }, life + 80);
  };

  const burstCrumbs = () => {
    for (let i = 0; i < 7; i += 1) {
      createParticle(mouseX + (Math.random() - 0.5) * 18, mouseY + (Math.random() - 0.5) * 18, true);
    }
  };

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate3d(${cursorX + 12}px, ${cursorY + 12}px, 0)`;
    requestAnimationFrame(animateCursor);
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      const now = performance.now();

      if (now - lastTrail > 42) {
        createParticle(mouseX - 3, mouseY - 3);
        lastTrail = now;
      }

    },
    { passive: true },
  );

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      cursor.classList.add("is-hovering");
      target.classList.remove("is-cursor-wiggling");
      void target.offsetWidth;
      target.classList.add("is-cursor-wiggling");
    });

    target.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hovering");
      target.classList.remove("is-cursor-wiggling");
    });
  });

  productCards.forEach((card) => {
    card.addEventListener("mouseenter", burstCrumbs);
    card.addEventListener("mousemove", (event) => {
      if (Math.random() > 0.82) createParticle(event.clientX, event.clientY, true);
    });
  });

  window.addEventListener("blur", () => cursor.classList.remove("is-hovering"));
  animateCursor();
};

initSnackCursor();
