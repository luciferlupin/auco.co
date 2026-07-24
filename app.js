/**
 * AUCO — Clean Typography & Motion Animation Architecture
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. ROUTING & SMOOTH PAGE TRANSITIONS ---
  const pages = document.querySelectorAll('.page-view');
  const navLinks = document.querySelectorAll('.nav-link, .footer-nav-link, [data-target]');
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  function navigateTo(targetPageId) {
    const currentActive = document.querySelector('.page-view.active');
    
    if (currentActive && currentActive.id === targetPageId) return;

    if (currentActive) {
      currentActive.style.opacity = '0';
      currentActive.style.transform = 'translateY(-8px)';
      
      setTimeout(() => {
        currentActive.classList.remove('active');
        showNewPage(targetPageId);
      }, 250);
    } else {
      showNewPage(targetPageId);
    }
  }

  function showNewPage(targetPageId) {
    const activePage = document.getElementById(targetPageId);
    if (activePage) {
      activePage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        activePage.style.opacity = '1';
        activePage.style.transform = 'translateY(0)';
      }, 50);
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-target') === targetPageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    closeMobileMenu();
    triggerReveals();
  }

  function closeMobileMenu() {
    if (navMenu && mobileToggle) {
      navMenu.classList.remove('mobile-open');
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('mobile-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        navMenu.classList.add('mobile-open');
        mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const pageTarget = link.getAttribute('data-target');
      if (pageTarget) {
        e.preventDefault();
        navigateTo(pageTarget);
      }
    });
  });

  const logoLink = document.getElementById('nav-logo');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('page-home');
    });
  }

  // Header Scroll Backdrop
  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- 2. MOTION TYPOGRAPHY ENGINE (PRESERVES SPACING & ACCENT SPANS) ---
  function initMotionTypography() {
    const motionHeadings = document.querySelectorAll('.section-heading, .quote-text, .closing-text, .about-hero-title');

    motionHeadings.forEach(heading => {
      if (heading.classList.contains('motion-initialized')) return;
      heading.classList.add('motion-initialized');

      const childNodes = Array.from(heading.childNodes);
      heading.innerHTML = '';

      childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/\s+/);
          words.forEach((word) => {
            if (word === '') return;
            const lineWrap = document.createElement('span');
            lineWrap.className = 'motion-line';
            
            const wordSpan = document.createElement('span');
            wordSpan.className = 'motion-word';
            wordSpan.textContent = word;
            
            lineWrap.appendChild(wordSpan);
            heading.appendChild(lineWrap);
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const lineWrap = document.createElement('span');
          lineWrap.className = 'motion-line';

          const wordSpan = document.createElement('span');
          wordSpan.className = 'motion-word';
          wordSpan.appendChild(node.cloneNode(true));

          lineWrap.appendChild(wordSpan);
          heading.appendChild(lineWrap);
        }
      });

      const wordsInHeading = heading.querySelectorAll('.motion-word');
      wordsInHeading.forEach((w, index) => {
        w.style.transitionDelay = `${(index * 0.04).toFixed(2)}s`;
      });
    });
  }

  initMotionTypography();

  // --- 3. INTERSECTION OBSERVER FOR SCROLL MOTION REVEALS ---
  let observer;

  function initObserver() {
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      });

      triggerReveals();
    } else {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
  }

  function triggerReveals() {
    const reveals = document.querySelectorAll('.page-view.active .reveal');
    reveals.forEach(el => {
      if (observer) {
        observer.observe(el);
      } else {
        el.classList.add('visible');
      }
    });
  }

  initObserver();

  // --- 4. PRODUCT DATA & MODAL LOGIC ---
  const productData = {
    speaker: {
      title: "SonicPulse™ Speaker",
      category: "AUDIO",
      image: "assets/audio-system.png",
      description: "SonicPulse™ engineered drivers feature CNC-machined anodized aluminum housing with neodymium magnet assemblies. Enjoy studio-grade 360-degree spatial acoustic resonance across every cabin seat.",
      specs: [
        { label: "Driver Cone", value: "Carbon-Fiber Mesh Driver" },
        { label: "Frequency Spectrum", value: "18 Hz – 32,000 Hz" },
        { label: "Processing", value: "64-Bit Active DSP Stage" },
        { label: "Connectivity", value: "Ultra-Low Latency Bluetooth 5.3" }
      ]
    },
    led340: {
      title: "Ambient LED 340",
      category: "LIGHTING",
      image: "assets/led-lighting.png",
      description: "AuraLight™ 340 provides subtle, non-glare interior illumination with 340 individually controllable ultra-bright micro-LEDs contoured along factory dashboard and door panels.",
      specs: [
        { label: "LED Density", value: "340 Micro-Diodes" },
        { label: "Color Precision", value: "16.8M Soft Luminescence" },
        { label: "Light Pipeline", value: "Sub-millimeter Quartz Core" },
        { label: "Power Draw", value: "< 4.5 Watts Efficient Design" }
      ]
    },
    fascia: {
      title: "Digital Front Fascia",
      category: "INFOTAINMENT",
      image: "assets/smart-cockpit.png",
      description: "VisionHUD™ Front Fascia projects crisp, zero-distraction telemetry widgets, ambient climate controls, and high-definition cockpit navigation overlays.",
      specs: [
        { label: "Display Optics", value: "Micro-OLED Curved Glass" },
        { label: "Luminance", value: "Sunlight Readable (15,000 Nits)" },
        { label: "Integration", value: "Plug & Play CAN-Bus / OBD-II" },
        { label: "Latency", value: "Sub-5ms Real-Time Refresh" }
      ]
    },
    vacuum: {
      title: "AirClean Vacuum Cleaner",
      category: "AUCO CARE",
      image: "assets/vacuum-cleaner.png",
      description: "AUCO AirClean cordless high-suction vehicle vacuum cleaner engineered with brushless motor technology, dual HEPA filtration, and luxury matte aluminum chassis.",
      specs: [
        { label: "Suction Force", value: "18,000 Pa Brushless Power" },
        { label: "Filtration", value: "Dual Washable HEPA Stage" },
        { label: "Battery Life", value: "35 Min Continuous Runtime" },
        { label: "Charging", value: "USB-C Fast Charge (60 min)" }
      ]
    }
  };

  const productModal = document.getElementById('product-modal');
  const modalContent = document.getElementById('modal-body-content');
  const modalClose = document.getElementById('modal-close');

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = productData[id];
      if (item) {
        modalContent.innerHTML = `
          <span style="font-size: 0.68rem; letter-spacing: 0.15em; color: var(--text-subtle); font-weight: 500;">${item.category}</span>
          <h3 style="font-size: clamp(1.2rem, 2vw, 1.45rem); font-weight: 500; margin: 0.4rem 0 1rem; color: var(--text-main);">${item.title}</h3>
          <div style="border-radius: 12px; overflow: hidden; margin-bottom: 1.2rem; border: 1px solid var(--border-hairline);">
            <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 220px; object-fit: cover; display: block;">
          </div>
          <p style="font-size: clamp(0.85rem, 1.1vw, 0.9rem); color: var(--text-muted); line-height: 1.65; font-weight: 300; margin-bottom: 1.5rem;">${item.description}</p>
          <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.8rem;">
            ${item.specs.map(s => `
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border-hairline);">
                <span style="color: var(--text-muted);">${s.label}</span>
                <span style="color: var(--text-main); font-weight: 400;">${s.value}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-full modal-reserve-trigger">Reserve This Fitment</button>
        `;
        productModal.classList.add('open');

        modalContent.querySelector('.modal-reserve-trigger').addEventListener('click', () => {
          productModal.classList.remove('open');
          openPreorderModal();
        });
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => productModal.classList.remove('open'));
  }

  // Preorder Reservation Modal
  const preorderModal = document.getElementById('preorder-modal');
  const preorderBtn = document.getElementById('btn-preorder');
  const preorderBtnBottom = document.getElementById('btn-reserve-bottom');
  const preorderClose = document.getElementById('preorder-close');
  const preorderForm = document.getElementById('preorder-form');
  const preorderMessage = document.getElementById('preorder-message');

  function openPreorderModal() {
    if (preorderModal) preorderModal.classList.add('open');
  }

  if (preorderBtn) preorderBtn.addEventListener('click', openPreorderModal);
  if (preorderBtnBottom) preorderBtnBottom.addEventListener('click', openPreorderModal);
  if (preorderClose) preorderClose.addEventListener('click', () => preorderModal.classList.remove('open'));

  [productModal, preorderModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    }
  });

  if (preorderForm) {
    preorderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      preorderMessage.innerText = '✓ Reservation recorded. We will contact you with availability details.';
      setTimeout(() => {
        preorderForm.reset();
        preorderMessage.innerText = '';
        preorderModal.classList.remove('open');
      }, 2500);
    });
  }

  // Newsletter Submission
  const newsletterForm = document.getElementById('about-newsletter-form');
  const newsletterMessage = document.getElementById('newsletter-message');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterMessage.innerText = '✓ Thank you for subscribing.';
      setTimeout(() => {
        newsletterForm.reset();
        newsletterMessage.innerText = '';
      }, 3000);
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactStatus.innerText = '✓ Message sent successfully. Our team will get back to you shortly.';
      contactStatus.style.color = '#34c759';
      setTimeout(() => {
        contactForm.reset();
        contactStatus.innerText = '';
      }, 4000);
    });
  }

});
