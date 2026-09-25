(function () {
    "use strict";

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Navbar shadow and back-to-top button once the page is scrolled
    var nav = document.querySelector('.site-nav');
    var backToTop = document.querySelector('.back-to-top');
    function onScroll() {
        var y = window.scrollY;
        if (nav) nav.classList.toggle('is-scrolled', y > 40);
        if (backToTop) backToTop.classList.toggle('is-visible', y > 480);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Home hero slideshow. Autoplays unless the visitor prefers reduced motion,
    // and the pause button lets anyone stop it (WCAG 2.2.2).
    var hero = document.getElementById('hero-carousel');
    var toggle = document.querySelector('[data-carousel-toggle]');
    if (hero && window.bootstrap) {
        var carousel;
        var playing = !reduceMotion;

        function start(autoplay) {
            if (carousel) carousel.dispose();
            carousel = new bootstrap.Carousel(hero, {
                interval: autoplay ? 6000 : false,
                pause: autoplay ? 'hover' : false,
                touch: true
            });
            if (autoplay) carousel.cycle();
            if (toggle) {
                toggle.setAttribute('aria-label', autoplay ? 'Pause slideshow' : 'Play slideshow');
                toggle.innerHTML = autoplay ? '<i class="bi bi-pause-fill"></i>' : '<i class="bi bi-play-fill"></i>';
            }
        }

        start(playing);
        if (toggle) {
            toggle.addEventListener('click', function () {
                playing = !playing;
                start(playing);
            });
        }
    }

    // Keep the footer copyright year current
    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });
})();
