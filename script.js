/* Navigation toggle */
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle.addEventListener('click', () => navList.classList.toggle('open'));

/* Smooth scrolling for anchor links */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({behavior: 'smooth', block: 'start'});
            // close nav on mobile
            navList.classList.remove('open');
        }
    });
});

/* Slider logic */
(function () {
    const track = document.getElementById('sliderTrack');
    const slides = Array.from(track.children);
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    let idx = 0;
    let timer = null;

    function update() {
        // determine slides per view based on viewport
        const vp = window.innerWidth;
        const perView = vp <= 800 ? 1 : 3;
        // width of each slide element (including margin-right)
        const slideWidth = slides[0].getBoundingClientRect().width + 12;
        const maxIdx = Math.max(0, slides.length - perView);
        if (idx > maxIdx) idx = 0;
        if (idx < 0) idx = maxIdx;
        const offset = -idx * slideWidth;
        track.style.transform = `translateX(${offset}px)`;
    }

    function startAuto() {
        timer = setInterval(() => {
            idx++;
            update();
        }, 4000);
    }

    function stopAuto() {
        clearInterval(timer);
        timer = null;
    }

    prev.addEventListener('click', () => {
        stopAuto();
        idx--;
        update();
        startAuto();
    });
    next.addEventListener('click', () => {
        stopAuto();
        idx++;
        update();
        startAuto();
    });
    window.addEventListener('resize', () => {
        update();
    });
    // init
    setTimeout(() => {
        update();
        startAuto();
    }, 100);
})();
