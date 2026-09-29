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

    // Slideshows: any .carousel with data-autoplay="<ms between slides>".
    // Each autoplays unless the visitor prefers reduced motion, and its pause
    // button lets anyone stop it (WCAG 2.2.2).
    if (window.bootstrap) {
        document.querySelectorAll('.carousel[data-autoplay]').forEach(function (el) {
            var interval = parseInt(el.getAttribute('data-autoplay'), 10);
            var toggle = el.querySelector('[data-carousel-toggle]');
            var carousel;
            var playing = !reduceMotion;

            function start(autoplay) {
                if (carousel) carousel.dispose();
                carousel = new bootstrap.Carousel(el, {
                    interval: autoplay ? interval : false,
                    pause: autoplay ? 'hover' : false,
                    touch: true
                });
                if (autoplay) carousel.cycle();
                if (toggle) {
                    toggle.setAttribute('aria-label', autoplay ? 'Pause slideshow' : 'Play slideshow');
                    toggle.innerHTML = autoplay ? '<i class="bi bi-pause-fill"></i>' : '<i class="bi bi-play-fill"></i>';
                }
            }

            // Hidden slides never trigger lazy loading on their own, so fetch
            // them once the first photo is in, before they fade in blank.
            var first = el.querySelector('.carousel-item.active img');
            function warm() {
                el.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
                    img.loading = 'eager';
                });
            }
            if (!first || first.complete) warm();
            else first.addEventListener('load', warm, { once: true });

            start(playing);
            if (toggle) {
                toggle.addEventListener('click', function () {
                    playing = !playing;
                    start(playing);
                });
            }
        });
    }

    // Keep the footer copyright year current
    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });
})();
