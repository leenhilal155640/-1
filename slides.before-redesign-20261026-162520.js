/* -------------------------------------------------
   Momk Interactive Presentation JavaScript
   Scene-based navigation, animations, motif evolution,
   touch/swipe support, accessibility, and print handling
   ------------------------------------------------- */

(() => {
  "use strict";

  /* -------------------------------------------------
     DOM Elements & Setup
     ------------------------------------------------- */
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;

  const slideCounter = document.getElementById('slideCounter');
  const progressBar = document.getElementById('progressBar');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const style = document.documentElement.style;

  /* -- Reduced motion variable -- */
  style.setProperty('--reduced', reducedMotion.matches ? '0s' : 'initial');

  /* -------------------------------------------------
     State
     ------------------------------------------------- */
  let currentSlide = 0;
  let isNavigating = false; /* prevents double-navigation */

  /* -------------------------------------------------
     Show slide function
     ------------------------------------------------- */
  function showSlide(n) {
    if (isNavigating) return;
    if (n >= totalSlides) n = 0;
    if (n < 0) n = totalSlides - 1;

    currentSlide = n;
    isNavigating = true;

    /* -- Remove active from all slides -- */
    slides.forEach(s => {
      s.classList.remove('active');
      /* reset animation state for re-run */
      s.style.animation = 'none';
      s.offsetHeight; /* trigger reflow to restart animations */
    });

    /* -- Add active to current -- */
    const activeSlide = slides[currentSlide];
    activeSlide.classList.add('active');
    activeSlide.style.animation = null; /* restart */

    /* -- Trigger scene-specific entrance animations -- */
    triggerSceneAnimations(activeSlide);

    /* -- Update progress bar -- */
    updateProgress(currentSlide + 1);

    /* -- Update counter -- */
    if (slideCounter) {
      slideCounter.textContent = `الشريحة ${currentSlide + 1} من ${totalSlides}`;
    }

    /* -- Reset navigation flag after transition -- */
    setTimeout(() => { isNavigating = false; }, 1000);
  }

  /* -------------------------------------------------
     Trigger Scene-Specific Animations
     ------------------------------------------------- */
  function triggerSceneAnimations(slide) {
    /* remove previous animation classes to avoid duplication */
    slide.querySelectorAll('.animated').forEach(el => el.classList.remove('animated'));

    /* -- Determine scene type from data attribute -- */
    const scene = slide.getAttribute('data-scene');

    switch (scene) {
      case 'opening':
        triggerOpeningScene(slide);
        break;
      case 'problem':
        triggerProblemScene(slide);
        break;
      case 'solution':
        triggerSolutionScene(slide);
        break;
      case 'audience':
        triggerAudienceScene(slide);
        break;
      case 'services':
        triggerFeaturesScene(slide);
        break;
      case 'interface':
        triggerInterfaceScene(slide);
        break;
      case 'technologies':
        triggerTechScene(slide);
        break;
      case 'special':
        triggerSpecialScene(slide);
        break;
      case 'future':
        triggerFutureScene(slide);
        break;
      case 'conclusion':
        triggerConclusionScene(slide);
        break;
    }
  }

  /* -- Opening Scene: Typed reveal + motif growth -- */
  function triggerOpeningScene(slide) {
    const title = slide.querySelector('.scene-title');
    const subtitle = slide.querySelector('.scene-subtitle');
    const tagline = slide.querySelector('.scene-tagline');
    const motif = slide.querySelector('.motif-circle');

    if (title) title.classList.add('animated');
    if (subtitle) subtitle.classList.add('animated');
    if (tagline) tagline.classList.add('animated');
    if (motif) {
      motif.style.transform = 'scale(1)';
      motif.style.transition = 'transform var(--transition-slow) var(--reduced)';
    }
  }

  /* -- Problem Scene: Title fade-up + points stagger -- */
  function triggerProblemScene(slide) {
    const title = slide.querySelector('.problem-title');
    const points = slide.querySelectorAll('.reveal-points li');

    if (title) title.classList.add('animated');
    points.forEach((li, i) => {
      li.style.transitionDelay = `${0.1 * i}s`;
      li.classList.add('animated');
    });
  }

  /* -- Solution Scene: State transitions -- */
  function triggerSolutionScene(slide) {
    const fromState = slide.querySelector('.from-state');
    const toState = slide.querySelector('.to-state');

    if (fromState) fromState.classList.add('animated');
    if (toState) toState.classList.add('animated');
  }

  /* -- Audience Scene: Card entrance -- */
  function triggerAudienceScene(slide) {
    const cards = slide.querySelectorAll('.audience-card');

    cards.forEach((card, i) => {
      card.style.transitionDelay = `${0.1 * i}s`;
      card.classList.add('animated');
    });
  }

  /* -- Features Scene: Feature card entrance -- */
  function triggerFeaturesScene(slide) {
    const cards = slide.querySelectorAll('.feature-card');

    cards.forEach((card, i) => {
      card.style.transitionDelay = `${0.1 * i * 0.1}s`;
      card.classList.add('animated');
    });
  }

  /* -- Interface Scene: Screen zoom -- */
  function triggerInterfaceScene(slide) {
    const screen = slide.querySelector('.mockup-screen');
    if (screen) screen.classList.add('animated');
  }

  /* -- Tech Scene: Grid grow -- */
  function triggerTechScene(slide) {
    const cards = slide.querySelectorAll('.tech-card');

    cards.forEach((card, i) => {
      card.style.transitionDelay = `${0.15 * i}s`;
      card.classList.add('animated');
    });
  }

  /* -- Special Scene -- */
  function triggerSpecialScene(slide) {
    const title = slide.querySelector('.special-vision .vision-core h3');
    if (title) title.classList.add('animated');
  }

  /* -- Future Scene -- */
  function triggerFutureScene(slide) {
    const title = slide.querySelector('.future-vision .future-title');
    if (title) title.classList.add('animated');
  }

  /* -- Conclusion Scene: Scale in -- */
  function triggerConclusionScene(slide) {
    const title = slide.querySelector('.conclusion-title');
    if (title) title.classList.add('animated');
  }

  /* -------------------------------------------------
     Navigation Functions
     ------------------------------------------------- */
  function nextSlide() { showSlide(currentSlide + 1); }
  function prevSlide() { showSlide(currentSlide - 1); }

  /* -------------------------------------------------
     Event Listeners
     ------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    /* -- Buttons -- */
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    /* -- Keyboard Navigation -- */
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    });

    /* -- Touch/Swipe Support -- */
    let startX = 0;
    let endX = 0;
    const swipeThreshold = 30;

    document.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', e => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });

    function handleSwipe() {
      const diff = startX - endX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide(); /* swipe left = next */
        } else {
          prevSlide(); /* swipe right = previous */
        }
      }
    }

    /* -------------------------------------------------
       Initial show
       ------------------------------------------------- */
    showSlide(0);
  });

  /* -------------------------------------------------
     Progress Bar Update
     ------------------------------------------------- */
  function updateProgress(current) {
    const percent = (current / totalSlides) * 100;
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
  }

  /* -------------------------------------------------
     Print Handling
     ------------------------------------------------- */
  /* -- Window onbeforeprint -- */
  window.onbeforeprint = () => {
    /* Hide navigation, counter, progress bar, and motif layer */
    const elementsToHide = [
      '.nav-btn',
      '.slide-counter',
      '.progress-bar',
      '.visual-motif-layer'
    ];

    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        /* Save original display for later */
        if (!el.dataset.originalDisplay) {
          el.dataset.originalDisplay = el.style.display;
        }
        el.style.display = 'none';
      });
    });

    /* Disable complex animations */
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      *,
      *::before,
      *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(styleElement);
  };

  /* -- Window onafterprint -- */
  window.onafterprint = () => {
    /* Restore display states */
    const elementsToRestore = [
      '.nav-btn',
      '.slide-counter',
      '.progress-bar',
      '.visual-motif-layer'
    ];

    elementsToRestore.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.dataset.originalDisplay) {
          el.style.display = el.dataset.originalDisplay;
          el.removeAttribute('data-original-display');
        }
      });
    });

    /* Remove the print style */
    const printStyle = document.querySelector('style');
    if (printStyle && printStyle.textContent.includes('animation-duration: 0s')) {
      printStyle.remove();
    }

    /* Re-apply reduced motion if needed */
    style.setProperty('--reduced', reducedMotion.matches ? '0s' : 'initial');
  };
})();