const locationData = {
    dubai: {
        label: "Dubai Workshop",
        title: "10 7A Street, Umm Ramool Dubai",
        description: "Ideal for premium bodywork, paint, detailing, diagnostics, and polished delivery.",
        focus: "Assessments, repair, detailing",
        mapStatus: "Dubai Workshop",
        mapUrl: "https://www.google.com/maps?q=25.2297,55.3672&z=14&output=embed",
        directions: "https://maps.google.com/?q=25.2297,55.3672"
    },
    sharjah: {
        label: "Sharjah Workshop",
        title: "19 St, Industrial Area 15, Sharjah",
        description: "Strong fit for workshop coordination, fleet support, inspections, and full-service care.",
        focus: "Fleet support, diagnostics, service",
        mapStatus: "Sharjah Workshop",
        mapUrl: "https://www.google.com/maps?q=25.3090,55.5136&z=14&output=embed",
        directions: "https://maps.google.com/?q=25.3090,55.5136"
    }
};

const locationButtons = document.querySelectorAll("[data-location-button]");
const locationLabel = document.getElementById("locationLabel");
const locationTitle = document.getElementById("locationTitle");
const locationDescription = document.getElementById("locationDescription");
const locationFocus = document.getElementById("locationFocus");
const locationMap = document.getElementById("locationMap");
const mapStatus = document.getElementById("mapStatus");
const directionsLink = document.getElementById("directionsLink");

const updateLocationPanel = (key) => {
    const data = locationData[key];

    if (!data) {
        return;
    }

    locationButtons.forEach((button) => {
        const isActive = button.dataset.locationButton === key;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    if (locationLabel) locationLabel.textContent = data.label;
    if (locationTitle) locationTitle.textContent = data.title;
    if (locationDescription) locationDescription.textContent = data.description;
    if (locationFocus) locationFocus.textContent = data.focus;
    if (locationMap) locationMap.src = data.mapUrl;
    if (mapStatus) mapStatus.textContent = data.mapStatus;
    if (directionsLink) directionsLink.href = data.directions;
};

locationButtons.forEach((button) => {
    button.addEventListener("click", () => updateLocationPanel(button.dataset.locationButton));
});

updateLocationPanel("dubai");

const contactPageForm = document.getElementById("contactForm");
const submitButton = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");
const bookingShell = document.querySelector(".booking-form-shell");

// Replace your existing contactPageForm submit event listener with this:
if (contactPageForm && submitButton && formStatus) {
    contactPageForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // 1. UI Loading State
        submitButton.disabled = true;
        submitButton.textContent = "Sending Request...";
        formStatus.textContent = "Please wait...";
        bookingShell?.classList.remove("is-success");

        // 2. Prepare Data
        const formData = new FormData(contactPageForm);
        const data = Object.fromEntries(formData); 
        // Note: Ensure your HTML inputs have 'name' attributes (name="name", name="email", etc.)

        try {
            // 3. Send to Backend
            const response = await fetch('https://car-zone-live.onrender.com/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to send');

            // 4. Success UI
            submitButton.textContent = "Request Sent";
            formStatus.textContent = "Success! The Car Zone team will follow up.";
            bookingShell?.classList.add("is-success");
            contactPageForm.reset();

        } catch (error) {
            // 5. Error Handling
            console.error(error);
            submitButton.textContent = "Error";
            formStatus.textContent = "Something went wrong. Please try again.";
        } finally {
            // 6. Reset UI after delay
            window.setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = "Send Request";
                bookingShell?.classList.remove("is-success");
                formStatus.textContent = ""; 
            }, 3000);
        }
    });
}
const tiltCards = document.querySelectorAll("[data-tilt-card]");

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    tiltCards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * 12;
            const rotateX = (0.5 - y) * 12;

            card.style.setProperty("--tilt-x", `${rotateX}deg`);
            card.style.setProperty("--tilt-y", `${rotateY}deg`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
        });
    });
}

const contactCanvas = document.getElementById("contactCanvas");
const contactCtx = contactCanvas?.getContext("2d");
let contactParticles = [];
const contactMouse = { x: null, y: null, radius: 150 };

function resizeContactCanvas() {
    if (!contactCanvas) {
        return;
    }

    contactCanvas.width = window.innerWidth;
    contactCanvas.height = window.innerHeight;
}

class ContactParticle {
    constructor() {
        this.x = Math.random() * contactCanvas.width;
        this.y = Math.random() * contactCanvas.height;
        this.size = Math.random() * 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }

    update() {
        const dx = contactMouse.x - this.x;
        const dy = contactMouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = contactMouse.radius;

        if (distance < maxDistance && distance > 0) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                const returnX = this.x - this.baseX;
                this.x -= returnX / 10;
            }
            if (this.y !== this.baseY) {
                const returnY = this.y - this.baseY;
                this.y -= returnY / 10;
            }
        }
    }

    draw() {
        contactCtx.fillStyle = "rgba(243, 200, 79, 0.5)";
        contactCtx.beginPath();
        contactCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        contactCtx.closePath();
        contactCtx.fill();
    }
}

function initContactParticles() {
    if (!contactCanvas || !contactCtx) {
        return;
    }

    resizeContactCanvas();
    contactParticles = [];

    for (let i = 0; i < 150; i += 1) {
        contactParticles.push(new ContactParticle());
    }
}

function connectContactParticles() {
    for (let a = 0; a < contactParticles.length; a += 1) {
        for (let b = a + 1; b < contactParticles.length; b += 1) {
            const dx = contactParticles[a].x - contactParticles[b].x;
            const dy = contactParticles[a].y - contactParticles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                contactCtx.strokeStyle = `rgba(243, 200, 79, ${1 - (distance / 100) * 0.2})`;
                contactCtx.lineWidth = 0.5;
                contactCtx.beginPath();
                contactCtx.moveTo(contactParticles[a].x, contactParticles[a].y);
                contactCtx.lineTo(contactParticles[b].x, contactParticles[b].y);
                contactCtx.stroke();
            }
        }
    }
}

function animateContactCanvas() {
    if (!contactCanvas || !contactCtx) {
        return;
    }

    contactCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
    contactParticles.forEach((particle) => {
        particle.update();
        particle.draw();
    });
    connectContactParticles();
    window.requestAnimationFrame(animateContactCanvas);
}

window.addEventListener("mousemove", (event) => {
    contactMouse.x = event.clientX;
    contactMouse.y = event.clientY;
});

window.addEventListener("resize", resizeContactCanvas);

initContactParticles();
animateContactCanvas();

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    service: String,
    location: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);