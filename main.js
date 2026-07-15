const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');
const heroSection = document.querySelector('.hero');
const menuToggleLabel = menuToggle?.querySelector('.menu-toggle__label');
const desktopNavigation = window.matchMedia('(min-width: 1101px)');

if (menuToggle && mainNav && siteHeader && heroSection) {
  let headerFrame = 0;

  const isFloatingNavigation = () => (
    desktopNavigation.matches && siteHeader.classList.contains('is-past-hero')
  );

  const setMenuOpen = (open, returnFocus = false) => {
    const floating = isFloatingNavigation();
    siteHeader.classList.toggle('is-menu-open', floating && open);
    mainNav.classList.toggle('open', !floating && open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute(
      'aria-label',
      open ? 'Close navigation menu' : 'Open navigation menu'
    );
    if (menuToggleLabel) menuToggleLabel.textContent = open ? 'Close' : 'Menu';
    if (returnFocus) menuToggle.focus({ preventScroll: true });
  };

  const syncHeaderState = () => {
    headerFrame = 0;
    const isPastHero = heroSection.getBoundingClientRect().bottom <= 0;
    const stateChanged = siteHeader.classList.contains('is-past-hero') !== isPastHero;
    siteHeader.classList.toggle('is-past-hero', isPastHero);
    if (stateChanged || !desktopNavigation.matches) setMenuOpen(false);
  };

  const requestHeaderSync = () => {
    if (!headerFrame) headerFrame = window.requestAnimationFrame(syncHeaderState);
  };

  menuToggle.addEventListener('click', () => {
    const currentlyOpen = isFloatingNavigation()
      ? siteHeader.classList.contains('is-menu-open')
      : mainNav.classList.contains('open');
    setMenuOpen(!currentlyOpen);
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('pointerdown', (event) => {
    if (siteHeader.classList.contains('is-menu-open') && !siteHeader.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const isOpen = siteHeader.classList.contains('is-menu-open')
      || mainNav.classList.contains('open');
    if (isOpen) setMenuOpen(false, true);
  });

  window.addEventListener('scroll', requestHeaderSync, { passive: true });
  window.addEventListener('resize', requestHeaderSync, { passive: true });
  desktopNavigation.addEventListener('change', syncHeaderState);
  syncHeaderState();
}

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const button = item.querySelector('button');
  button.addEventListener('click', () => {
    faqItems.forEach((other) => {
      if (other !== item) other.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});

const form = document.querySelector('.quote-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach((field) => {
      const isEmpty = !String(field.value || '').trim();
      field.classList.toggle('is-invalid', isEmpty);
      if (isEmpty) valid = false;
    });

    if (!valid) {
      form.querySelector('.is-invalid')?.focus();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const oldText = submitButton.textContent;
    submitButton.textContent = 'Request Received';
    submitButton.disabled = true;

    window.setTimeout(() => {
      submitButton.textContent = oldText;
      submitButton.disabled = false;
      form.reset();
    }, 1800);
  });

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('is-invalid'));
  });
}

const galleryTrack = document.querySelector('.gallery-track');
if (galleryTrack) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  const viewport = document.querySelector('.gallery-viewport');

  viewport.addEventListener('mousedown', (event) => {
    isDown = true;
    startX = event.pageX - viewport.offsetLeft;
    scrollLeft = viewport.scrollLeft;
    viewport.style.cursor = 'grabbing';
  });

  viewport.addEventListener('mouseleave', () => {
    isDown = false;
    viewport.style.cursor = '';
  });

  viewport.addEventListener('mouseup', () => {
    isDown = false;
    viewport.style.cursor = '';
  });

  viewport.addEventListener('mousemove', (event) => {
    if (!isDown) return;
    event.preventDefault();
    const x = event.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.2;
    viewport.scrollLeft = scrollLeft - walk;
  });
}

/*
 * Pool-card stack motion, matched to incredibles.dev's SUsps sequence.
 * Their fixed card stage, perspective, entry values, easing, scale/fade steps,
 * staggered exit and timeline overlap are reproduced without changing the
 * existing pool-card content or presentation styles.
 */
const poolTypesSection = document.querySelector('.pool-types');
const poolList = poolTypesSection?.querySelector('.pool-list');
const poolCards = poolList ? Array.from(poolList.querySelectorAll('.pool-card')) : [];

if (poolTypesSection && poolList && poolCards.length) {
  const stackMedia = window.matchMedia('(prefers-reduced-motion: no-preference)');

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const cubicInOut = (value) => {
    const t = clamp(value);
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  const quadraticIn = (value) => {
    const t = clamp(value);
    return t * t;
  };

  let stackActive = false;
  let targetScrollY = window.scrollY;
  let renderedScrollY = window.scrollY;
  let animationFrame = 0;
  let resizeTimer = 0;
  let previousFrameTime = 0;
  let geometry = null;

  const setCardMotion = (card, { y, z, rotateX, scale, fade }) => {
    card.style.setProperty('--pool-stack-y', `${y.toFixed(3)}px`);
    card.style.setProperty('--pool-stack-z', `${z.toFixed(3)}px`);
    card.style.setProperty('--pool-stack-rotate-x', `${rotateX.toFixed(4)}deg`);
    card.style.setProperty('--pool-stack-scale', scale.toFixed(6));
    card.style.setProperty('--pool-stack-fade', fade.toFixed(5));
  };

  const entryMotionAt = (timelineTime, cardIndex, flightDistance) => {
    const yProgress = cubicInOut((timelineTime - cardIndex) / 1.5);
    const threeDProgress = cubicInOut((timelineTime - cardIndex) / 1.2);
    let scale = 1;
    let fade = 0;

    for (let incomingIndex = cardIndex + 1; incomingIndex < poolCards.length; incomingIndex += 1) {
      scale -= 0.125 * clamp(timelineTime - incomingIndex);
      fade += 0.1 * clamp((timelineTime - incomingIndex - 0.75) / 0.5);
    }

    return {
      y: flightDistance * (1 - yProgress),
      z: 750 * (1 - threeDProgress),
      rotateX: 90 * (1 - threeDProgress),
      scale,
      fade,
    };
  };

  const timelineTimeAtScroll = (scrollY) => {
    if (!geometry) return 0;
    const progress = clamp(
      (scrollY - geometry.enterStart) / (geometry.enterEnd - geometry.enterStart)
    );
    return progress * geometry.entryDuration;
  };

  const measureStack = () => {
    if (!stackActive) return false;

    const viewportHeight = window.innerHeight;
    const cardWidth = poolList.getBoundingClientRect().width;
    poolTypesSection.style.setProperty('--pool-stack-card-width', `${cardWidth}px`);
    const cardHeight = poolCards[0].offsetHeight;
    const cardFitsViewport = cardHeight <= viewportHeight - 24;
    const listRect = poolList.getBoundingClientRect();
    const sectionRect = poolTypesSection.getBoundingClientRect();
    const listTop = listRect.top + window.scrollY;
    const listBottom = listRect.bottom + window.scrollY;
    const sectionBottom = sectionRect.bottom + window.scrollY;
    const exitDuration = Math.max(1.35, 1 + 0.075 * (poolCards.length - 1));

    poolTypesSection.style.setProperty('--pool-stack-card-height', `${cardHeight}px`);

    geometry = {
      viewportHeight,
      flightDistance: viewportHeight * 0.5 + cardHeight,
      enterStart: listTop - viewportHeight,
      enterEnd: listBottom - viewportHeight,
      entryDuration: poolCards.length + 0.5,
      exitStart: sectionBottom - viewportHeight * 1.5,
      exitEnd: sectionBottom + viewportHeight,
      exitDuration,
    };

    targetScrollY = window.scrollY;
    renderedScrollY = window.scrollY;
    renderStack(renderedScrollY);
    return cardFitsViewport;
  };

  const renderStack = (scrollY) => {
    if (!stackActive || !geometry) return;

    const entryTime = timelineTimeAtScroll(scrollY);
    const exitProgress = clamp(
      (scrollY - geometry.exitStart) / (geometry.exitEnd - geometry.exitStart)
    );
    const exitTime = exitProgress * geometry.exitDuration;
    const sectionFadeProgress = quadraticIn((exitTime - 0.15) / 0.75);

    poolTypesSection.style.opacity = String(1 - sectionFadeProgress);

    poolCards.forEach((card, cardIndex) => {
      const motion = entryMotionAt(entryTime, cardIndex, geometry.flightDistance);
      const exitDelay = cardIndex * 0.075;

      if (exitTime > exitDelay) {
        const exitTweenStartScroll = geometry.exitStart
          + (exitDelay / geometry.exitDuration) * (geometry.exitEnd - geometry.exitStart);
        const exitTweenStartTime = timelineTimeAtScroll(exitTweenStartScroll);
        const exitStartY = entryMotionAt(
          exitTweenStartTime,
          cardIndex,
          geometry.flightDistance
        ).y;
        const exitTweenProgress = quadraticIn(exitTime - exitDelay);
        motion.y = exitStartY
          + (-geometry.flightDistance - exitStartY) * exitTweenProgress;
      }

      setCardMotion(card, motion);
    });
  };

  const runAnimationFrame = (time) => {
    if (!stackActive) {
      animationFrame = 0;
      return;
    }

    const frameDelta = previousFrameTime ? Math.min(2, (time - previousFrameTime) / (1000 / 60)) : 1;
    previousFrameTime = time;

    // Equivalent to the reference's Lenis lerp: 0.1 at 60fps.
    const interpolation = 1 - Math.pow(0.9, frameDelta);
    renderedScrollY += (targetScrollY - renderedScrollY) * interpolation;

    if (Math.abs(targetScrollY - renderedScrollY) < 0.1) {
      renderedScrollY = targetScrollY;
    }

    renderStack(renderedScrollY);

    if (renderedScrollY !== targetScrollY) {
      animationFrame = window.requestAnimationFrame(runAnimationFrame);
    } else {
      animationFrame = 0;
      previousFrameTime = 0;
    }
  };

  const requestStackRender = () => {
    if (!stackActive) return;
    targetScrollY = window.scrollY;
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(runAnimationFrame);
    }
  };

  const wrapCards = () => {
    poolCards.forEach((card) => {
      const item = document.createElement('div');
      const wrapper = document.createElement('span');
      item.className = 'pool-stack-item';
      wrapper.className = 'pool-stack-wrapper';
      card.before(item);
      item.append(wrapper);
      wrapper.append(card);
    });
  };

  const unwrapCards = () => {
    poolCards.forEach((card) => {
      const item = card.closest('.pool-stack-item');
      if (item) item.replaceWith(card);
    });
  };

  const activateStack = () => {
    if (stackActive) return;

    wrapCards();
    poolTypesSection.classList.add('pool-stack-active');
    stackActive = true;
    targetScrollY = window.scrollY;
    renderedScrollY = window.scrollY;

    window.requestAnimationFrame(() => {
      if (!measureStack()) deactivateStack();
    });
  };

  const deactivateStack = () => {
    if (!stackActive) return;

    stackActive = false;
    geometry = null;
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    previousFrameTime = 0;
    poolTypesSection.classList.remove('pool-stack-active');
    poolTypesSection.style.removeProperty('opacity');
    poolTypesSection.style.removeProperty('--pool-stack-card-width');
    poolTypesSection.style.removeProperty('--pool-stack-card-height');
    poolCards.forEach((card) => {
      card.style.removeProperty('--pool-stack-y');
      card.style.removeProperty('--pool-stack-z');
      card.style.removeProperty('--pool-stack-rotate-x');
      card.style.removeProperty('--pool-stack-scale');
      card.style.removeProperty('--pool-stack-fade');
    });
    unwrapCards();
  };

  const syncStackMode = () => {
    const cardFitsViewport = poolCards[0].offsetHeight <= window.innerHeight - 24;
    if (stackMedia.matches && cardFitsViewport) activateStack();
    else deactivateStack();
  };

  window.addEventListener('scroll', requestStackRender, { passive: true });
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (stackActive) {
        if (!stackMedia.matches || !measureStack()) deactivateStack();
      } else {
        syncStackMode();
      }
    }, 200);
  }, { passive: true });
  stackMedia.addEventListener('change', syncStackMode);

  syncStackMode();
  window.addEventListener('load', () => {
    if (stackActive && !measureStack()) deactivateStack();
  }, { once: true });
}
