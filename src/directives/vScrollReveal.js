// Scroll Reveal Vue Custom Directive using native IntersectionObserver
export const vScrollReveal = {
  mounted(el, binding) {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-revealed');
      return;
    }

    el.classList.add('scroll-reveal-init');

    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: binding.value?.threshold || 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('is-revealed');
          obs.unobserve(el); // Only animate once
        }
      });
    }, options);

    observer.observe(el);
  }
};
