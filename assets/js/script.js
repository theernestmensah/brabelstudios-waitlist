// BrAbel Studios - Interactive JavaScript
// Mobile Navigation, Scroll Effects, and Animations

// ============= VIDEO PRELOADER =============
(function () {
    const preloader = document.getElementById('preloader');
    const video = document.getElementById('preloader-video');
    const spinner = document.querySelector('.loader-spinner');

    if (!preloader) return;

    // Lock scroll while loading
    document.body.classList.add('preloading');

    function dismiss() {
        preloader.classList.add('hidden');
        document.body.classList.remove('preloading');
        // Remove from DOM after transition ends
        preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    }

    if (video) {
        // Play once then dismiss
        video.addEventListener('ended', dismiss);

        // Safety net: if video stalls or errors, show spinner & auto-dismiss after 3s
        video.addEventListener('error', () => {
            if (spinner) { video.style.display = 'none'; spinner.style.display = 'block'; }
            setTimeout(dismiss, 3000);
        });

        // Also cap max wait time at video duration + 500ms buffer
        video.addEventListener('loadedmetadata', () => {
            const cap = (video.duration * 1000) + 500;
            setTimeout(dismiss, cap);
        });

        // Fallback if metadata never loads (e.g. on slow connections)
        setTimeout(dismiss, 8000);

        video.play().catch(() => {
            // Autoplay blocked — show spinner and dismiss
            if (spinner) { video.style.display = 'none'; spinner.style.display = 'block'; }
            setTimeout(dismiss, 3000);
        });
    } else {
        // No video element — just dismiss
        setTimeout(dismiss, 500);
    }
})();

// ============= MOBILE NAVIGATION =============
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');

        // Animate hamburger to X
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                span.style.transform = '';
                span.style.opacity = '';
            }
        });
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    });
});

// ============= SCROLL EFFECTS =============
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for background blur
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ============= ACTIVE NAV LINK =============
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        if (href === currentPage ||
            (currentPage === '' && href === 'index.html') ||
            (currentPage === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

setActiveNavLink();

// ============= INTERSECTION OBSERVER FOR ANIMATIONS =============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInElements = document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card, .process-step, .pricing-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeInElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ============= SMOOTH SCROLLING FOR ANCHOR LINKS =============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============= DYNAMIC MOCKUP BACKGROUNDS =============
// Generate gradient backgrounds for mockups and portfolio images
function generateGradientBackground(element, hue1, hue2) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, `hsl(${hue1}, 70%, 60%)`);
    gradient.addColorStop(1, `hsl(${hue2}, 70%, 50%)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some visual elements
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 200 + 50;

        const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        circleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        circleGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = circleGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    element.style.backgroundImage = `url(${canvas.toDataURL()})`;
}

// Apply to mockups
const mockup1 = document.getElementById('mockup1');
const mockup2 = document.getElementById('mockup2');
const mockup3 = document.getElementById('mockup3');

if (mockup1) generateGradientBackground(mockup1, 260, 290);
if (mockup2) generateGradientBackground(mockup2, 195, 220);
if (mockup3) generateGradientBackground(mockup3, 330, 260);

// Apply to portfolio previews
const portfolio1 = document.getElementById('portfolio1');
const portfolio2 = document.getElementById('portfolio2');
const portfolio3 = document.getElementById('portfolio3');

if (portfolio1) generateGradientBackground(portfolio1, 260, 195);
if (portfolio2) generateGradientBackground(portfolio2, 195, 260);
if (portfolio3) generateGradientBackground(portfolio3, 330, 290);

// ============= FORM VALIDATION (for contact page) =============
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const errorElement = input.parentElement.querySelector('.error-message');
            if (errorElement) errorElement.remove();
            input.style.borderColor = '';
        });

        // Validate
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                showError(input, 'This field is required');
            }
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    showError(input, 'Please enter a valid email address');
                }
            }
        });

        if (isValid) {
            // Show loading state then do a normal POST
            const submitBtn = contactForm.querySelector('.btn-primary');
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            // Native submit — FormSubmit.co handles the redirect via _next
            contactForm.submit();
        }
    });
}

function showError(input, message) {
    const error = document.createElement('span');
    error.className = 'error-message';
    error.textContent = message;
    error.style.cssText = 'color: #ff5f56; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
    input.parentElement.appendChild(error);
    input.style.borderColor = '#ff5f56';

    input.addEventListener('input', () => {
        error.remove();
        input.style.borderColor = '';
    });
}

// ============= PARALLAX EFFECT FOR HERO ORBS =============
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;

        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ============= NUMBER COUNTER ANIMATION =============
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stats when they come into view
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            if (number) {
                entry.target.textContent = '0' + text.replace(/\d+/, '');
                setTimeout(() => {
                    const suffix = text.replace(/\d+/, '');
                    entry.target.textContent = suffix;
                    animateCounter(entry.target, number);
                    entry.target.textContent = number + suffix;
                }, 200);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ============= PRICING TOGGLE (for pricing page) =============
const pricingToggle = document.getElementById('pricingToggle');
const monthlyPrices = document.querySelectorAll('[data-monthly]');
const yearlyPrices = document.querySelectorAll('[data-yearly]');

if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
        const isYearly = pricingToggle.checked;

        monthlyPrices.forEach(price => {
            price.style.display = isYearly ? 'none' : 'block';
        });

        yearlyPrices.forEach(price => {
            price.style.display = isYearly ? 'block' : 'none';
        });
    });
}

// ============= PORTFOLIO FILTER (for portfolio page) =============
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter items
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ============= CURSOR CUSTOM (Optional Enhancement) =============
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-primary);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease, opacity 0.2s ease;
    opacity: 0;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

// Enlarge cursor on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-card');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.background = 'rgba(139, 92, 246, 0.2)';
    });

    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'transparent';
    });
});

// Hide custom cursor on mobile
if (window.innerWidth <= 768) {
    cursor.style.display = 'none';
}

// ============= PAGE LOAD ANIMATION & PRELOADER =============
window.addEventListener('load', () => {
    // Handle Video Preloader
    const preloader = document.getElementById('preloader');

    // Ensure content is visible behind preloader (reverses the CSS opacity: 0 if set previously)
    document.body.style.opacity = '1';

    if (preloader) {
        // Optional: Ensure video acts as expected
        const video = document.getElementById('preloader-video');
        if (video) {
            video.play().catch(e => console.log('Autoplay prevented:', e));
        }

        // Hide preloader after a delay (e.g., to let video loop once or ensure smooth transition)
        // You can adjust the timeout (2000ms = 2 seconds)
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');

            // Cleanup after transition
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 2000);
    }
});

// ============= DYNAMIC COPYRIGHT YEAR =============
document.querySelectorAll('.footer-bottom p').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/\d{4}/, new Date().getFullYear());
});

// ============= CONSOLE MESSAGE =============
console.log('%c👋 Welcome to BrAbel Studios!', 'font-size: 20px; font-weight: bold; color: #8b5cf6;');
console.log('%cBuilt with ❤️ and modern web technologies', 'font-size: 14px; color: #64748b;');
