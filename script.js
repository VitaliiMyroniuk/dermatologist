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
const track = document.querySelector('.slider-track');
const slides = Array.from(document.querySelectorAll('.slide'));
const btnNext = document.querySelector('.arrow.right');
const btnPrev = document.querySelector('.arrow.left');
const dotsContainer = document.querySelector('.dots');

let slidesToShow = window.innerWidth <= 800 ? 1 : 3;
let index = slidesToShow; // бо додаємо клоновані елементи
let autoSlide;
let startX = 0;

// --- Cloning the first and the last slides for the smooth cycle ---
const firstClones = slides.slice(0, slidesToShow).map(s => s.cloneNode(true));
const lastClones = slides.slice(-slidesToShow).map(s => s.cloneNode(true));

firstClones.forEach(clone => track.appendChild(clone));
lastClones.forEach(clone => track.prepend(clone));

const allSlides = document.querySelectorAll('.slide');
const totalSlides = allSlides.length;

// --- Dots creation ---
slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        goToSlide(i + slidesToShow);
        resetTimer();
    });
    dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll('.dot');

// --- Start position ---
const slideWidth = allSlides[0].clientWidth;
track.style.transform = `translateX(-${slideWidth * index}px)`;

function goToSlide(i) {
    index = i;
    track.style.transition = 'transform 0.6s ease';
    track.style.transform = `translateX(-${slideWidth * index}px)`;
    updateDots();
}

function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    const activeIndex = (index - slidesToShow + slides.length) % slides.length;
    dots[activeIndex].classList.add('active');
}

function nextSlide() {
    index++;
    track.style.transition = 'transform 0.6s ease';
    track.style.transform = `translateX(-${slideWidth * index}px)`;
    updateDots();
}

function prevSlide() {
    index--;
    track.style.transition = 'transform 0.6s ease';
    track.style.transform = `translateX(-${slideWidth * index}px)`;
    updateDots();
}

// --- Smooth movement from the last to the first slide ---
track.addEventListener('transitionend', () => {
    if (index >= totalSlides - slidesToShow) {
        index = slidesToShow;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
    if (index <= 0) {
        index = totalSlides - slidesToShow * 2;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
});

// --- Auto scrolling ---
function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 5000);
}

function resetTimer() {
    clearInterval(autoSlide);
    startAutoSlide();
}

btnNext.addEventListener('click', () => {
    nextSlide();
    resetTimer();
});
btnPrev.addEventListener('click', () => {
    prevSlide();
    resetTimer();
});

// --- Swipe for mobile ---
track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
track.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -50) {
        nextSlide();
        resetTimer();
    }
    if (diff > 50) {
        prevSlide();
        resetTimer();
    }
});

// --- Resize ---
window.addEventListener('resize', () => {
    slidesToShow = window.innerWidth <= 800 ? 1 : 3;
    const newWidth = allSlides[0].clientWidth;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${newWidth * index}px)`;
});

startAutoSlide();
