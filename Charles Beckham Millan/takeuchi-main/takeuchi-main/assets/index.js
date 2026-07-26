const slider = document.querySelector('.testimonial-slider');
const wrapper = document.querySelector('.testimonial-slider-wrapper');
const nextArrow = document.getElementById('next-arrow');

// 1. Clone cards
const cards = Array.from(wrapper.querySelectorAll('.testimonial-card'));
cards.forEach(card => {
    const clone = card.cloneNode(true);
    wrapper.appendChild(clone);
});

const getCardWidth = () => {
    const style = window.getComputedStyle(cards[0]);
    const marginRight = parseFloat(style.marginRight) || 0;
    return cards[0].offsetWidth + marginRight;
};

const resetToStart = () => {
    slider.style.scrollSnapType = 'none';
    slider.style.scrollBehavior = 'auto';

    slider.scrollTo({ left: 0 });

    requestAnimationFrame(() => {
        slider.style.scrollSnapType = 'x mandatory';
        slider.style.scrollBehavior = 'smooth';
    });
};

nextArrow.addEventListener('click', () => {
    const cardWidth = getCardWidth();
    const scrollEnd = cards.length * cardWidth;

    if (slider.scrollLeft >= (scrollEnd - 10)) {
        resetToStart();
        setTimeout(() => {
            slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }, 50);
    } else {
        slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
});

slider.addEventListener('scroll', () => {
    const cardWidth = getCardWidth();
    const scrollEnd = cards.length * cardWidth;

    if (slider.scrollLeft >= scrollEnd + (cardWidth / 2)) {
        slider.style.scrollSnapType = 'none';
        slider.style.scrollBehavior = 'auto';
        slider.scrollTo({ left: slider.scrollLeft - scrollEnd });
        slider.style.scrollSnapType = 'x mandatory';
        slider.style.scrollBehavior = 'smooth';
    }
}, { passive: true });




// hannie
// forms
document.querySelectorAll('.d-grid.gap-2 a[data-bs-toggle="tab"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetSelector = this.getAttribute('href');


        const tabTrigger = document.querySelector(`#contactTab button[data-bs-target="${targetSelector}"]`);
        if (tabTrigger) {
            const tab = new bootstrap.Tab(tabTrigger);
            tab.show();
        }


        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// calendar
document.querySelectorAll('.date-input').forEach(input => {
    input.addEventListener('click', (e) => {
        if ('showPicker' in HTMLInputElement.prototype) {
            input.showPicker();
        }
    });
});