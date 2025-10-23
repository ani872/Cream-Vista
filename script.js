const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');


const flavorWrapper = document.querySelector('.cards-wrapper');
const flavorCards = document.querySelectorAll('.flavor-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const sliderDotsContainer = document.querySelector('.slider-dots');


const reviewWrapper = document.querySelector('.reviews-wrapper');
const reviewCards = document.querySelectorAll('.review-card');
const reviewPrevBtn = document.querySelector('.review-prev-btn');
const reviewNextBtn = document.querySelector('.review-next-btn');
const reviewDotsContainer = document.querySelector('.review-dots');


const toast = document.getElementById('toast');


let flavorCurrentIndex = 0;
let reviewCurrentIndex = 0;
let cardsPerView = 3;
let reviewsPerView = 3;
let isFlavorDragging = false;
let isReviewDragging = false;
let flavorStartX = 0;
let reviewStartX = 0;
let flavorAutoplayInterval;
let reviewAutoplayInterval;


hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});


navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});


window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});


function getFlavorCardsPerView() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 968) return 2;
    return 3;
}

function updateFlavorSlider() {
    cardsPerView = getFlavorCardsPerView();
    const cardWidth = flavorCards[0].offsetWidth;
    const gap = 30;
    const totalGap = (window.innerWidth <= 968 && window.innerWidth > 640) ? 20 : 30;
    const offset = (cardWidth + totalGap) * flavorCurrentIndex;
    
    flavorWrapper.style.transform = `translateX(-${offset}px)`;
    updateFlavorDots();
    updateFlavorButtons();
}

function createFlavorDots() {
    sliderDotsContainer.innerHTML = '';
    const maxIndex = Math.max(0, flavorCards.length - cardsPerView);
    const totalDots = maxIndex + 1;
    
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToFlavorSlide(i));
        sliderDotsContainer.appendChild(dot);
    }
}

function updateFlavorDots() {
    const dots = sliderDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === flavorCurrentIndex);
    });
}

function updateFlavorButtons() {
    const maxIndex = Math.max(0, flavorCards.length - cardsPerView);
    prevBtn.disabled = flavorCurrentIndex === 0;
    nextBtn.disabled = flavorCurrentIndex >= maxIndex;
}

function goToFlavorSlide(index) {
    const maxIndex = Math.max(0, flavorCards.length - cardsPerView);
    flavorCurrentIndex = Math.max(0, Math.min(index, maxIndex));
    updateFlavorSlider();
    restartFlavorAutoplay();
}

function nextFlavorSlide() {
    const maxIndex = Math.max(0, flavorCards.length - cardsPerView);
    if (flavorCurrentIndex < maxIndex) {
        flavorCurrentIndex++;
    } else {
        flavorCurrentIndex = 0; 
    }
    updateFlavorSlider();
}

function prevFlavorSlide() {
    if (flavorCurrentIndex > 0) {
        flavorCurrentIndex--;
        updateFlavorSlider();
    }
}


prevBtn.addEventListener('click', () => {
    prevFlavorSlide();
    restartFlavorAutoplay();
});

nextBtn.addEventListener('click', () => {
    nextFlavorSlide();
    restartFlavorAutoplay();
});


flavorWrapper.addEventListener('mousedown', startFlavorDrag);
flavorWrapper.addEventListener('touchstart', startFlavorDrag);
document.addEventListener('mousemove', flavorDrag);
document.addEventListener('touchmove', flavorDrag);
document.addEventListener('mouseup', endFlavorDrag);
document.addEventListener('touchend', endFlavorDrag);

function startFlavorDrag(e) {
    isFlavorDragging = true;
    flavorStartX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    flavorWrapper.style.cursor = 'grabbing';
    stopFlavorAutoplay();
}

function flavorDrag(e) {
    if (!isFlavorDragging) return;
    e.preventDefault();
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const diff = flavorStartX - currentX;
    
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            nextFlavorSlide();
        } else {
            prevFlavorSlide();
        }
        isFlavorDragging = false;
    }
}

function endFlavorDrag() {
    if (isFlavorDragging) {
        isFlavorDragging = false;
        flavorWrapper.style.cursor = 'grab';
        restartFlavorAutoplay();
    }
}


function startFlavorAutoplay() {
    flavorAutoplayInterval = setInterval(() => {
        nextFlavorSlide();
    }, 4000);
}

function stopFlavorAutoplay() {
    clearInterval(flavorAutoplayInterval);
}

function restartFlavorAutoplay() {
    stopFlavorAutoplay();
    setTimeout(startFlavorAutoplay, 2000);
}


function getReviewCardsPerView() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 968) return 2;
    return 3;
}

function updateReviewSlider() {
    reviewsPerView = getReviewCardsPerView();
    const cardWidth = reviewCards[0].offsetWidth;
    const gap = 30;
    const totalGap = (window.innerWidth <= 968 && window.innerWidth > 640) ? 20 : 30;
    const offset = (cardWidth + totalGap) * reviewCurrentIndex;
    
    reviewWrapper.style.transform = `translateX(-${offset}px)`;
    updateReviewDots();
    updateReviewButtons();
}

function createReviewDots() {
    reviewDotsContainer.innerHTML = '';
    const maxIndex = Math.max(0, reviewCards.length - reviewsPerView);
    const totalDots = maxIndex + 1;
    
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToReviewSlide(i));
        reviewDotsContainer.appendChild(dot);
    }
}

function updateReviewDots() {
    const dots = reviewDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === reviewCurrentIndex);
    });
}

function updateReviewButtons() {
    const maxIndex = Math.max(0, reviewCards.length - reviewsPerView);
    reviewPrevBtn.disabled = reviewCurrentIndex === 0;
    reviewNextBtn.disabled = reviewCurrentIndex >= maxIndex;
}

function goToReviewSlide(index) {
    const maxIndex = Math.max(0, reviewCards.length - reviewsPerView);
    reviewCurrentIndex = Math.max(0, Math.min(index, maxIndex));
    updateReviewSlider();
    restartReviewAutoplay();
}

function nextReviewSlide() {
    const maxIndex = Math.max(0, reviewCards.length - reviewsPerView);
    if (reviewCurrentIndex < maxIndex) {
        reviewCurrentIndex++;
    } else {
        reviewCurrentIndex = 0;
    }
    updateReviewSlider();
}

function prevReviewSlide() {
    if (reviewCurrentIndex > 0) {
        reviewCurrentIndex--;
        updateReviewSlider();
    }
}


reviewPrevBtn.addEventListener('click', () => {
    prevReviewSlide();
    restartReviewAutoplay();
});

reviewNextBtn.addEventListener('click', () => {
    nextReviewSlide();
    restartReviewAutoplay();
});


reviewWrapper.addEventListener('mousedown', startReviewDrag);
reviewWrapper.addEventListener('touchstart', startReviewDrag);
document.addEventListener('mousemove', reviewDrag);
document.addEventListener('touchmove', reviewDrag);
document.addEventListener('mouseup', endReviewDrag);
document.addEventListener('touchend', endReviewDrag);

function startReviewDrag(e) {
    isReviewDragging = true;
    reviewStartX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    reviewWrapper.style.cursor = 'grabbing';
    stopReviewAutoplay();
}

function reviewDrag(e) {
    if (!isReviewDragging) return;
    e.preventDefault();
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const diff = reviewStartX - currentX;
    
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            nextReviewSlide();
        } else {
            prevReviewSlide();
        }
        isReviewDragging = false;
    }
}

function endReviewDrag() {
    if (isReviewDragging) {
        isReviewDragging = false;
        reviewWrapper.style.cursor = 'grab';
        restartReviewAutoplay();
    }
}

// Review slider autoplay
function startReviewAutoplay() {
    reviewAutoplayInterval = setInterval(() => {
        nextReviewSlide();
    }, 5000);
}

function stopReviewAutoplay() {
    clearInterval(reviewAutoplayInterval);
}

function restartReviewAutoplay() {
    stopReviewAutoplay();
    setTimeout(startReviewAutoplay, 2000);
}


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevFlavorSlide();
        restartFlavorAutoplay();
    } else if (e.key === 'ArrowRight') {
        nextFlavorSlide();
        restartFlavorAutoplay();
    }
});


const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Message sent successfully! We will contact you soon.');
        contactForm.reset();
    });
}


const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Reservation confirmed! We look forward to seeing you.');
        reservationForm.reset();
    });
}


const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thank you for subscribing to our scoop club!');
        newsletterForm.reset();
    });
}


const footerNewsletter = document.getElementById('footerNewsletter');
if (footerNewsletter) {
    footerNewsletter.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Successfully subscribed to our newsletter!');
        footerNewsletter.reset();
    });
}


const addCartButtons = document.querySelectorAll('.add-cart');
addCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const flavor = e.target.getAttribute('data-flavor');
        showToast(`${flavor} ice cream added to cart!`);
        
        
        e.target.style.transform = 'scale(0.9)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 200);
    });
});


function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);


const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});


let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        
        updateFlavorSlider();
        updateReviewSlider();
        
       
        createFlavorDots();
        createReviewDots();
    }, 250);
});


const floatingElements = document.querySelectorAll('.float-element');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    floatingElements.forEach((element, index) => {
        const speed = (index + 1) * 0.5;
        const yPos = -(scrolled * speed / 100);
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.05}deg)`;
    });
});


const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}


function initializeSliders() {
    
    cardsPerView = getFlavorCardsPerView();
    createFlavorDots();
    updateFlavorSlider();
    startFlavorAutoplay();
    flavorWrapper.style.cursor = 'grab';
    
   
    reviewsPerView = getReviewCardsPerView();
    createReviewDots();
    updateReviewSlider();
    startReviewAutoplay();
    reviewWrapper.style.cursor = 'grab';
    
  
    const flavorSection = document.querySelector('.flavors');
    const reviewSection = document.querySelector('.reviews');
    
    if (flavorSection) {
        flavorSection.addEventListener('mouseenter', stopFlavorAutoplay);
        flavorSection.addEventListener('mouseleave', startFlavorAutoplay);
    }
    
    if (reviewSection) {
        reviewSection.addEventListener('mouseenter', stopReviewAutoplay);
        reviewSection.addEventListener('mouseleave', startReviewAutoplay);
    }
}


window.addEventListener('DOMContentLoaded', () => {
    initializeSliders();
    
    
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroTitle) {
        setTimeout(() => heroTitle.style.opacity = '1', 100);
    }
    if (heroSubtitle) {
        setTimeout(() => heroSubtitle.style.opacity = '1', 300);
    }
    if (heroButtons) {
        setTimeout(() => heroButtons.style.opacity = '1', 500);
    }
    if (heroImage) {
        setTimeout(() => heroImage.style.opacity = '1', 700);
    }
});


const images = document.querySelectorAll('img');
images.forEach(img => {
    img.addEventListener('contextmenu', (e) => e.preventDefault());
    img.setAttribute('draggable', 'false');
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
