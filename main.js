// ---- Footer year ----
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- Nav background/border on scroll ----
  const nav = document.getElementById('siteNav');
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Scroll-reveal animation via IntersectionObserver ----
  const revealEls = document.querySelectorAll('.reveal:not(.is-visible)');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: no IO support, just show everything
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Restart the demo chat animation each time it scrolls into view ----
  const chatBody = document.getElementById('chatBody');
  if (chatBody && 'IntersectionObserver' in window) {
    const messages = chatBody.querySelectorAll('.msg');
    const chatIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          messages.forEach((m) => {
            m.style.animation = 'none';
            // force reflow so the animation can be re-triggered
            void m.offsetWidth;
            m.style.animation = '';
          });
        }
      });
    }, { threshold: 0.4 });
    chatIO.observe(chatBody);
  }

  // ---- Mobile menu: simple in-page anchor scroll (links hidden on mobile via CSS,
  //      button reserved for future expandable menu; smooth scroll handled natively) ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
