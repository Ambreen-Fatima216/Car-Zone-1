const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const heroBg = document.querySelector(".hero-bg");
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSlides = document.querySelectorAll("[data-hero-slide]");
const heroDots = document.querySelectorAll("[data-hero-dot]");
const heroPrev = document.querySelector("[data-hero-prev]");
const heroNext = document.querySelector("[data-hero-next]");
const heroCurrent = document.querySelector("[data-hero-current]");
const heroTotal = document.querySelector("[data-hero-total]");
const serviceCards = document.querySelectorAll(".service-showcase-card");
const serviceDots = document.querySelectorAll("[data-service-dot]");
const servicePrev = document.querySelector("[data-service-prev]");
const serviceNext = document.querySelector("[data-service-next]");
const galleryCards = document.querySelectorAll("[data-gallery-card]");
const specTabs = document.querySelectorAll(".spec-tab");
const specSlides = document.querySelectorAll(".spec-slide");
const scrollTriggers = document.querySelectorAll("[data-scroll-target]");
const navbar = document.querySelector(".navbar");
const contactForm = document.querySelector(".contact-form");
const homeAmbientCanvas = document.getElementById("homeAmbientCanvas");
const revealTargets = document.querySelectorAll(
    ".section-heading, .message-card, .principle-card, .services-showcase, .interactive-grid, .advantage-card, .ev-grid, .specialized-services, .contact-card, .form-container, .site-footer, .reveal-on-load, .reveal-scroll"
);

window.addEventListener("load", () => {
    document.body.classList.add("is-ready");
});

if (cursorDot && cursorOutline && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let cursorReady = false;

    const renderCursor = () => {
        outlineX += (mouseX - outlineX) * 0.18;
        outlineY += (mouseY - outlineY) * 0.18;

        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;

        window.requestAnimationFrame(renderCursor);
    };

    const activateCursor = (x, y) => {
        if (cursorReady) {
            return;
        }

        cursorReady = true;
        mouseX = x;
        mouseY = y;
        outlineX = x;
        outlineY = y;
        document.body.classList.add("has-cursor");
    };

    window.addEventListener("mousemove", (event) => {
        activateCursor(event.clientX, event.clientY);
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    window.addEventListener("mouseenter", (event) => {
        activateCursor(event.clientX, event.clientY);
        document.body.classList.add("has-cursor");
    });

    window.addEventListener("mouseleave", () => {
        document.body.classList.remove("has-cursor");
        cursorDot.classList.remove("is-active");
        cursorOutline.classList.remove("is-active");
        cursorReady = false;
    });

    window.requestAnimationFrame(renderCursor);

    const interactiveElements = document.querySelectorAll(
        "a, button, input, textarea, select, .grid-card, .advantage-card, .metric, .service-showcase-card, .service-visual-container, .bento-item, .hotspot-btn, .filter-btn, .close-modal, .map-pin, .service-btn, .call-btn"
    );

    interactiveElements.forEach((element) => {
        element.addEventListener("mouseenter", () => {
            cursorDot.classList.add("is-active");
            cursorOutline.classList.add("is-active");
        });

        element.addEventListener("mouseleave", () => {
            cursorDot.classList.remove("is-active");
            cursorOutline.classList.remove("is-active");
        });
    });
}

if (menuBtn && navLinks) {
    const closeMenu = () => {
        navLinks.classList.remove("is-open");
        menuBtn.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
    };

    menuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("is-open");
        menuBtn.classList.toggle("is-open", isOpen);
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
}

if (navbar) {
    const syncNavbar = () => {
        navbar.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    syncNavbar();
    window.addEventListener("scroll", syncNavbar, { passive: true });
}

if (heroSlider && heroSlides.length > 0) {
    let activeSlideIndex = 0;
    let heroIntervalId = null;

    if (heroTotal) {
        heroTotal.textContent = String(heroSlides.length).padStart(2, "0");
    }

    const updateHeroSlider = (nextIndex) => {
        activeSlideIndex = (nextIndex + heroSlides.length) % heroSlides.length;

        heroSlides.forEach((slide, index) => {
            const isActive = index === activeSlideIndex;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        heroDots.forEach((dot, index) => {
            const isActive = index === activeSlideIndex;
            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-pressed", String(isActive));
        });

        if (heroCurrent) {
            heroCurrent.textContent = String(activeSlideIndex + 1).padStart(2, "0");
        }
    };

    const startHeroAutoplay = () => {
        window.clearInterval(heroIntervalId);
        heroIntervalId = window.setInterval(() => {
            updateHeroSlider(activeSlideIndex + 1);
        }, 4600);
    };

    const stopHeroAutoplay = () => {
        window.clearInterval(heroIntervalId);
        heroIntervalId = null;
    };

    heroPrev?.addEventListener("click", () => {
        updateHeroSlider(activeSlideIndex - 1);
        startHeroAutoplay();
    });

    heroNext?.addEventListener("click", () => {
        updateHeroSlider(activeSlideIndex + 1);
        startHeroAutoplay();
    });

    heroDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            updateHeroSlider(index);
            startHeroAutoplay();
        });
    });

    heroSlider.addEventListener("mouseenter", stopHeroAutoplay);
    heroSlider.addEventListener("mouseleave", startHeroAutoplay);
    heroSlider.addEventListener("focusin", stopHeroAutoplay);
    heroSlider.addEventListener("focusout", (event) => {
        if (!event.relatedTarget || !heroSlider.contains(event.relatedTarget)) {
            startHeroAutoplay();
        }
    });

    heroSlider.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            updateHeroSlider(activeSlideIndex - 1);
            startHeroAutoplay();
        }

        if (event.key === "ArrowRight") {
            updateHeroSlider(activeSlideIndex + 1);
            startHeroAutoplay();
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopHeroAutoplay();
        } else {
            startHeroAutoplay();
        }
    });

    updateHeroSlider(0);
    startHeroAutoplay();
}

if (serviceCards.length > 0) {
    let activeServiceIndex = 0;
    let serviceIntervalId = null;

    const updateServiceCarousel = (nextIndex, direction = "next") => {
        const previousIndex = activeServiceIndex;
        activeServiceIndex = (nextIndex + serviceCards.length) % serviceCards.length;

        serviceCards.forEach((card, index) => {
            card.classList.remove("is-active", "is-exit-left", "is-exit-right");

            if (index === activeServiceIndex) {
                card.classList.add("is-active");
            } else if (index === previousIndex) {
                card.classList.add(direction === "next" ? "is-exit-left" : "is-exit-right");
            }
        });

        serviceDots.forEach((dot, index) => {
            dot.classList.toggle("is-active", index === activeServiceIndex);
        });
    };

    const startServiceAutoplay = () => {
        window.clearInterval(serviceIntervalId);
        serviceIntervalId = window.setInterval(() => {
            updateServiceCarousel(activeServiceIndex + 1, "next");
        }, 5200);
    };

    servicePrev?.addEventListener("click", () => {
        updateServiceCarousel(activeServiceIndex - 1, "prev");
        startServiceAutoplay();
    });

    serviceNext?.addEventListener("click", () => {
        updateServiceCarousel(activeServiceIndex + 1, "next");
        startServiceAutoplay();
    });

    serviceDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            updateServiceCarousel(index, index > activeServiceIndex ? "next" : "prev");
            startServiceAutoplay();
        });
    });

    const serviceTrack = document.querySelector(".services-showcase");
    serviceTrack?.addEventListener("mouseenter", () => window.clearInterval(serviceIntervalId));
    serviceTrack?.addEventListener("mouseleave", startServiceAutoplay);

    updateServiceCarousel(0);
    startServiceAutoplay();
}

if (galleryCards.length > 0) {
    const activateGalleryCard = (activeCard) => {
        galleryCards.forEach((card) => {
            card.classList.toggle("active", card === activeCard);
        });
    };

    galleryCards.forEach((card) => {
        card.addEventListener("mouseenter", () => activateGalleryCard(card));
        card.addEventListener("focus", () => activateGalleryCard(card));
        card.addEventListener("click", () => activateGalleryCard(card));
    });
}

if (specTabs.length > 0 && specSlides.length > 0) {
    specTabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            const targetIndex = Number(tab.dataset.target ?? index);

            specTabs.forEach((button, buttonIndex) => {
                const isActive = buttonIndex === targetIndex;
                button.classList.toggle("is-active", isActive);
                button.setAttribute("aria-selected", String(isActive));
            });

            specSlides.forEach((slide, slideIndex) => {
                slide.classList.toggle("is-active", slideIndex === targetIndex);
            });
        });
    });
}

scrollTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
        const targetSelector = trigger.getAttribute("data-scroll-target");
        const target = targetSelector ? document.querySelector(targetSelector) : null;

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
});

if (revealTargets.length > 0) {
    revealTargets.forEach((element, index) => {
        element.classList.add("reveal-in");
        element.style.setProperty("--reveal-delay", `${Math.min(index * 60, 420)}ms`);
    });

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18 }
        );

        revealTargets.forEach((element) => revealObserver.observe(element));
    } else {
        revealTargets.forEach((element) => element.classList.add("is-visible"));
    }
}

// Canvas-based reveal animation
const hero = document.querySelector('[data-hero-restoration]');
const overlay = document.getElementById('mask-overlay');
const canvas = document.getElementById('mask-canvas');

if (hero && overlay && canvas) {
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let mouse = { x: 0, y: 0, active: false };

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    function animate() {
        // Memory effect: 0.01 = stays revealed longer
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (mouse.active) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.beginPath();

            // Soft gradient edges for smooth reveal
            const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
            ctx.fill();
        }

        // Apply canvas as mask to fixed layer
        const maskURL = canvas.toDataURL();
        overlay.style.webkitMaskImage = `url(${maskURL})`;
        overlay.style.maskImage = `url(${maskURL})`;

        requestAnimationFrame(animate);
    }

    animate();
}

if (heroBg) {
    window.addEventListener("scroll", () => {
        const offset = Math.min(window.scrollY * 0.14, 120);
        heroBg.style.transform = `scale(1.04) translateY(${offset}px)`;
    }, { passive: true });
}

if (homeAmbientCanvas) {
    const ambientContext = homeAmbientCanvas.getContext("2d");

    if (ambientContext) {
        const ambientMouse = { x: null, y: null, radius: 150 };
        let ambientParticles = [];

        class AmbientParticle {
            constructor() {
                this.x = Math.random() * homeAmbientCanvas.width;
                this.y = Math.random() * homeAmbientCanvas.height;
                this.size = Math.random() * 2;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
            }

            draw() {
                ambientContext.fillStyle = "rgba(243, 200, 79, 0.5)";
                ambientContext.beginPath();
                ambientContext.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ambientContext.closePath();
                ambientContext.fill();
            }

            update() {
                if (ambientMouse.x === null || ambientMouse.y === null) {
                    this.returnToBase();
                    return;
                }

                const dx = ambientMouse.x - this.x;
                const dy = ambientMouse.y - this.y;
                const distance = Math.hypot(dx, dy) || 1;
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (ambientMouse.radius - distance) / ambientMouse.radius;
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;

                if (distance < ambientMouse.radius) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    this.returnToBase();
                }
            }

            returnToBase() {
                if (this.x !== this.baseX) {
                    this.x -= (this.x - this.baseX) / 10;
                }

                if (this.y !== this.baseY) {
                    this.y -= (this.y - this.baseY) / 10;
                }
            }
        }

        const resizeAmbientCanvas = () => {
            homeAmbientCanvas.width = window.innerWidth;
            homeAmbientCanvas.height = window.innerHeight;
            ambientParticles = [];

            for (let index = 0; index < 150; index += 1) {
                ambientParticles.push(new AmbientParticle());
            }
        };

        const connectAmbientParticles = () => {
            for (let first = 0; first < ambientParticles.length; first += 1) {
                for (let second = first; second < ambientParticles.length; second += 1) {
                    const dx = ambientParticles[first].x - ambientParticles[second].x;
                    const dy = ambientParticles[first].y - ambientParticles[second].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < 100) {
                        ambientContext.strokeStyle = `rgba(243, 200, 79, ${1 - (distance / 100) * 0.2})`;
                        ambientContext.lineWidth = 0.5;
                        ambientContext.beginPath();
                        ambientContext.moveTo(ambientParticles[first].x, ambientParticles[first].y);
                        ambientContext.lineTo(ambientParticles[second].x, ambientParticles[second].y);
                        ambientContext.stroke();
                    }
                }
            }
        };

        const animateAmbientCanvas = () => {
            ambientContext.clearRect(0, 0, homeAmbientCanvas.width, homeAmbientCanvas.height);

            ambientParticles.forEach((particle) => {
                particle.draw();
                particle.update();
            });

            connectAmbientParticles();
            window.requestAnimationFrame(animateAmbientCanvas);
        };

        window.addEventListener("mousemove", (event) => {
            ambientMouse.x = event.clientX;
            ambientMouse.y = event.clientY;
        });

        window.addEventListener("mouseleave", () => {
            ambientMouse.x = null;
            ambientMouse.y = null;
        });

        window.addEventListener("resize", resizeAmbientCanvas);

        resizeAmbientCanvas();
        animateAmbientCanvas();
    }
}
