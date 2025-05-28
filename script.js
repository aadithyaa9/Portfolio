document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const burger = document.querySelector('.burger');
    const typedRoleSpan = document.getElementById('typed-role');
    const currentYearSpan = document.getElementById('current-year');
    const backToTopButton = document.getElementById('back-to-top');
    const themeToggleButton = document.getElementById('theme-toggle');
    const preloader = document.getElementById('preloader');
    const scrollElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-in-left, .scroll-slide-in-right, .project-card, .skill-card, .timeline-item');


    // --- Preloader ---
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('loaded');
            setTimeout(() => { if(preloader) preloader.style.display = 'none'; }, 500);
        }
        // Trigger initial scroll animations check after load if elements are already in view
        checkScrollAnimations();
    });

    // --- Theme Toggle ---
    const sunIcon = '<i class="fas fa-sun"></i>';
    const moonIcon = '<i class="fas fa-moon"></i>';

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            if(themeToggleButton) themeToggleButton.innerHTML = moonIcon;
            localStorage.setItem('portfolioTheme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            if(themeToggleButton) themeToggleButton.innerHTML = sunIcon;
            localStorage.setItem('portfolioTheme', 'dark');
        }
        // Re-initialize particles with correct colors if theme changes
        initParticlesJS(theme);
    }

    const savedTheme = localStorage.getItem('portfolioTheme') || 'dark'; // Default to dark
    applyTheme(savedTheme);

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            applyTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    // --- Sticky Header ---
    const headerHeight = header ? header.offsetHeight : 70;
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > headerHeight) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }
        if (backToTopButton) {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
        checkScrollAnimations(); // Check animations on scroll
    });

    // --- Mobile Navigation ---
    if (burger && navLinksContainer) {
        burger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            document.body.style.overflow = navLinksContainer.classList.contains('nav-active') ? 'hidden' : '';
        });
    }
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer && navLinksContainer.classList.contains('nav-active')) {
                navLinksContainer.classList.remove('nav-active');
                if(burger) burger.classList.remove('toggle');
                document.body.style.overflow = '';
            }
        });
    });

    // --- Typed Text Animation for Hero Section ---
    const roles = ["IoT Enthusiast", "Full Stack Developer", "Problem Solver", "Tech Innovator"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRole() {
        if (!typedRoleSpan) return;
        const currentRole = roles[roleIndex];
        let typeSpeed = isDeleting ? 60 : 120;

        if (isDeleting) {
            typedRoleSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedRoleSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 1800; isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; typeSpeed = 400;
        }
        setTimeout(typeRole, typeSpeed);
    }
    if (typedRoleSpan) typeRole();

    // --- Intersection Observer for Active Nav Link & Scroll Animations ---
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = { root: null, rootMargin: `-${headerHeight + 50}px 0px 0px 0px`, threshold: 0.4 };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));

    // --- Scroll Reveal Animations (Function to check visibility) ---
    function checkScrollAnimations() {
        const triggerBottom = window.innerHeight / 5 * 4.5; // Adjust trigger point

        scrollElements.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            if(boxTop < triggerBottom) {
                el.classList.add('visible');
            } else if (!el.classList.contains('hero-section') && !el.closest('.hero-section')) { // Don't remove 'visible' from hero section elements that animate once
                // Optional: remove 'visible' to re-animate if they scroll out and back in
                // This line below could be uncommented if you want animations to replay on scroll up then down
                // el.classList.remove('visible');
            }
        });
    }
    checkScrollAnimations(); // Initial check

    // --- Footer Current Year ---
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    // --- Back to Top Button Action ---
    if (backToTopButton) backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // --- Particles.js Initialization ---
    function initParticlesJS(theme) {
        const particleColor = theme === 'light' ? "#5c0099" : "#c770f0"; // Primary color based on theme
        const lineColor = theme === 'light' ? "rgba(92, 0, 153, 0.4)" : "rgba(199, 112, 240, 0.2)";
        const particleDiv = document.getElementById('particles-js');
        if (!particleDiv) return;

        particlesJS('particles-js', {
            "particles": {
                "number": {"value": 50, "density": {"enable": true, "value_area": 800}},
                "color": {"value": particleColor },
                "shape": {"type": "circle"},
                "opacity": {"value": 0.4, "random": true, "anim": {"enable": true, "speed": 0.8, "opacity_min": 0.1, "sync": false}},
                "size": {"value": 2.5, "random": true, "anim": {"enable": false}},
                "line_linked": {"enable": true, "distance": 150, "color": lineColor, "opacity": 0.3, "width": 1},
                "move": {"enable": true, "speed": 1.5, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false}
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {"onhover": {"enable": true, "mode": "grab"}, "onclick": {"enable": false, "mode": "push"}, "resize": true},
                "modes": {"grab": {"distance": 120, "line_linked": {"opacity": 0.6}}, "push": {"particles_nb": 4}}
            },
            "retina_detect": true
        });
    }
    // Call initially with the detected/saved theme
    initParticlesJS(localStorage.getItem('portfolioTheme') || 'dark');
});