/* ==========================================================================
   BHAGAT TRADING COMPANY - LOGISTICS & INTERACTION LOGIC (app.js)
   Clean, Concise & Premium Produce Supply Architecture
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Navigation, Sticky Offset & Smooth Scroll System
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  // Dynamic sticky navbar height helper
  const getNavOffset = () => {
    return navbar ? navbar.offsetHeight : 68;
  };

  // Sticky navbar shadow update on scroll
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveSection();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll handler accounting for sticky navbar height
  function scrollToElement(targetEl, updateHash = true) {
    if (!targetEl) return;
    const navOffset = getNavOffset();
    const elementTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
    // 14px breathing room so section title is well framed below sticky navbar
    const scrollTarget = Math.max(0, elementTop - navOffset - 14);

    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });

    if (updateHash && targetEl.id && history.pushState) {
      history.pushState(null, '', `#${targetEl.id}`);
    }

    // Close mobile menu if open
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  }

  // Intercept all in-page anchor links for smooth scrolling with offset
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const targetEl = document.querySelector(hash);
      if (targetEl) {
        e.preventDefault();
        scrollToElement(targetEl);
      }
    });
  });

  // Handle cross-page navigation with anchor hash (e.g., coming from logistics.html to index.html#network)
  if (window.location.hash) {
    const initialTarget = document.querySelector(window.location.hash);
    if (initialTarget) {
      // Delay slightly for DOM layout and sticky navbar measurement
      setTimeout(() => {
        scrollToElement(initialTarget, false);
        highlightActiveSection();
      }, 100);
    }
  }

  // Active section scroll indicator
  function highlightActiveSection() {
    const scrollY = window.pageYOffset;
    const navOffset = getNavOffset();

    // Bottom of page check -> activate Contact (#inquiry)
    if (window.innerHeight + scrollY >= document.body.offsetHeight - 60) {
      setActiveNavLink('#inquiry');
      return;
    }

    // Top of page check -> activate Overview (#home)
    if (scrollY < 100) {
      setActiveNavLink('#home');
      return;
    }

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - navOffset - 30;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        setActiveNavLink(`#${sectionId}`);
      }
    });
  }

  function setActiveNavLink(targetHash) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href === targetHash || href.endsWith(targetHash)) {
        link.classList.add('active');
      } else if (href.startsWith('#') || href.includes('index.html#')) {
        link.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Animated Logistics Map & Distribution Network System
  // --------------------------------------------------------------------------
  const btnDomestic = document.getElementById('btn-tab-domestic');
  const btnExport = document.getElementById('btn-tab-export');
  const mapCard = document.getElementById('network-map-card');
  const mapLayerDomestic = document.getElementById('map-layer-domestic');
  const mapLayerExport = document.getElementById('map-layer-export');
  const mapStatusText = document.getElementById('map-status-text');
  const legendDomesticItem = document.getElementById('legend-domestic-item');
  const legendExportItem = document.getElementById('legend-export-item');
  const mapCanvasContainer = document.getElementById('map-canvas-container');
  const tooltip = document.getElementById('map-tooltip');
  const ttName = document.getElementById('tt-name');
  const ttCode = document.getElementById('tt-code');
  const ttCorridor = document.getElementById('tt-corridor');
  const ttTransit = document.getElementById('tt-transit');
  const ttProduce = document.getElementById('tt-produce');

  // Progressive route reveal on viewport entry
  if (mapCard && 'IntersectionObserver' in window) {
    const mapObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mapCard.classList.add('in-view');
            mapObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    mapObserver.observe(mapCard);
  } else if (mapCard) {
    mapCard.classList.add('in-view');
  }

  // Switch between Domestic and Export network views
  function switchNetworkView(mode) {
    clearHighlights();
    hideTooltip();

    if (mode === 'domestic') {
      if (btnDomestic) btnDomestic.classList.add('active');
      if (btnExport) btnExport.classList.remove('active');
      if (mapCard) {
        mapCard.classList.remove('mode-export');
        mapCard.classList.add('mode-domestic');
      }
      if (mapStatusText) mapStatusText.textContent = '16 Domestic Mandis Active';
      if (legendDomesticItem) legendDomesticItem.style.opacity = '1';
      if (legendExportItem) legendExportItem.style.opacity = '0.55';
    } else {
      if (btnExport) btnExport.classList.add('active');
      if (btnDomestic) btnDomestic.classList.remove('active');
      if (mapCard) {
        mapCard.classList.remove('mode-domestic');
        mapCard.classList.add('mode-export');
      }
      if (mapStatusText) mapStatusText.textContent = '9 Export Markets via JNPT Sea Port';
      if (legendExportItem) legendExportItem.style.opacity = '1';
      if (legendDomesticItem) legendDomesticItem.style.opacity = '0.45';
    }
  }

  if (btnDomestic) {
    btnDomestic.addEventListener('click', () => switchNetworkView('domestic'));
  }
  if (btnExport) {
    btnExport.addEventListener('click', () => switchNetworkView('export'));
  }

  // Click on world inset to toggle export view
  const worldInset = document.getElementById('world-map-inset-card');
  if (worldInset) {
    worldInset.addEventListener('click', (e) => {
      e.stopPropagation();
      switchNetworkView('export');
    });
  }

  // Initialize legend opacity for default Domestic view
  if (legendDomesticItem && legendExportItem) {
    legendDomesticItem.style.opacity = '1';
    legendExportItem.style.opacity = '0.55';
  }

  // Interactive Destination Tooltip & Route Highlighting
  function showNodeTooltip(node) {
    if (!tooltip || !mapCanvasContainer || !node) return;
    const { name, code, corridor, transit, produce, id } = node.dataset;

    if (ttName) ttName.textContent = name || '';
    if (ttCode) ttCode.textContent = code || '';
    if (ttCorridor) ttCorridor.textContent = corridor || 'Direct Logistics Lane';
    if (ttTransit) ttTransit.textContent = transit || 'Scheduled Transit';
    if (ttProduce) ttProduce.textContent = produce || 'Fresh Graded Produce';

    const containerRect = mapCanvasContainer.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    let left = nodeRect.left - containerRect.left + (nodeRect.width / 2);
    let top = nodeRect.top - containerRect.top;

    // Clamp horizontally to avoid off-screen clipping on narrow mobile screens (360px - 430px)
    const tooltipHalfWidth = 115;
    const padding = 12;
    if (left - tooltipHalfWidth < padding) {
      left = tooltipHalfWidth + padding;
    } else if (left + tooltipHalfWidth > containerRect.width - padding) {
      left = containerRect.width - tooltipHalfWidth - padding;
    }

    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.top = `${Math.round(top)}px`;
    tooltip.classList.add('active');
    tooltip.setAttribute('aria-hidden', 'false');

    // Highlight node & route (domestic route or inset export route)
    node.classList.add('highlighted');
    if (id) {
      const domesticRoute = document.getElementById(`route-${id}`);
      const exportRoute = document.getElementById(`inset-route-${id}`);
      if (domesticRoute) domesticRoute.classList.add('highlighted');
      if (exportRoute) exportRoute.classList.add('highlighted');
    }
  }

  function hideTooltip() {
    if (tooltip) {
      tooltip.classList.remove('active');
      tooltip.setAttribute('aria-hidden', 'true');
    }
  }

  function clearHighlights() {
    document.querySelectorAll('.map-node.highlighted').forEach((el) => el.classList.remove('highlighted'));
    document.querySelectorAll('.logistics-route.highlighted').forEach((el) => el.classList.remove('highlighted'));
    document.querySelectorAll('.summary-chip.active').forEach((el) => el.classList.remove('active'));
  }

  // Attach hover, focus and tap events to map SVG destination nodes (both domestic and export)
  const mapNodes = document.querySelectorAll('.map-node, .gateway-pin');
  mapNodes.forEach((node) => {
    node.setAttribute('tabindex', '0');
    node.setAttribute('role', 'button');
    const label = `${node.dataset.name || ''} ${node.dataset.code || ''}`;
    node.setAttribute('aria-label', label);

    const activateNode = () => {
      clearHighlights();
      showNodeTooltip(node);
      const id = node.dataset.id;
      if (id) {
        const matchingChip = document.querySelector(`.summary-chip[data-id="${id}"]`);
        if (matchingChip) matchingChip.classList.add('active');
      }
    };

    node.addEventListener('mouseenter', activateNode);
    node.addEventListener('mouseleave', () => {
      clearHighlights();
      hideTooltip();
    });

    node.addEventListener('focus', activateNode);
    node.addEventListener('blur', () => {
      clearHighlights();
      hideTooltip();
    });

    // Touch / click event for mobile interaction
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      activateNode();
    });
  });

  // Attach click / tap interaction to summary chips beneath each map
  const summaryChips = document.querySelectorAll('.summary-chip');
  summaryChips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = chip.dataset.id;
      if (!id) return;

      const targetNode = document.querySelector(`.map-node[data-id="${id}"], .gateway-pin[data-id="${id}"]`);
      if (targetNode) {
        clearHighlights();
        showNodeTooltip(targetNode);
        chip.classList.add('active');
      }
    });
  });

  // Dismiss tooltip and highlights when tapping outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.map-node') && !e.target.closest('.gateway-pin') && !e.target.closest('.summary-chip')) {
      clearHighlights();
      hideTooltip();
    }
  });

  // --------------------------------------------------------------------------
  // 3. Product "Inquire Now" Click Pre-selection
  // --------------------------------------------------------------------------
  const quoteButtons = document.querySelectorAll('.request-quote-btn');
  const commoditySelect = document.getElementById('commodity-select');

  quoteButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const productName = btn.getAttribute('data-product');
      if (commoditySelect && productName) {
        // Map product to dropdown value
        Array.from(commoditySelect.options).forEach((opt) => {
          if (opt.text.toLowerCase().includes(productName.toLowerCase()) || 
              productName.toLowerCase().includes(opt.value.toLowerCase())) {
            opt.selected = true;
          }
        });

        commoditySelect.focus();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Trade Tender & Inquiry Form Handling (Direct WhatsApp Bridge)
  // --------------------------------------------------------------------------
  const inquiryForm = document.getElementById('trade-inquiry-form');
  const toast = document.getElementById('toast-message');

  function showToast(message, duration = 3500) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const entityName = document.getElementById('entity-name').value.trim();
      const contactPhone = document.getElementById('contact-phone').value.trim();
      const commodity = document.getElementById('commodity-select').value;
      const volume = document.getElementById('volume-select').value;
      const destination = document.getElementById('destination-input').value.trim();
      const specs = document.getElementById('special-specs').value.trim();

      // Build structured message for Bhagat Trading Company desk
      const waMessage = 
`*BHAGAT TRADING COMPANY - WHOLESALE INQUIRY*
---------------------------------------
*Name / Business:* ${entityName}
*Phone / WhatsApp:* ${contactPhone}
*Produce:* ${commodity}
*Volume:* ${volume}
*Destination City/Mandi:* ${destination}
${specs ? `*Notes:* ${specs}` : ''}
---------------------------------------
_Submitted via Bhagat Trading Co._`;

      showToast('Connecting to WhatsApp (+91 93595 73798)...');

      const encodedMsg = encodeURIComponent(waMessage);
      const waUrl = `https://wa.me/919359573798?text=${encodedMsg}`;

      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 600);

      inquiryForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 5. Stat Counter Animation
  // --------------------------------------------------------------------------
  const counterElement = document.getElementById('hero-clients-counter');
  let animationTriggered = false;

  function runCounter() {
    if (animationTriggered || !counterElement) return;
    animationTriggered = true;

    let count = 0;
    const target = 100;
    const duration = 1200; // ms
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        clearInterval(timer);
        counterElement.textContent = '100+';
      } else {
        counterElement.textContent = Math.floor(count) + '+';
      }
    }, 16);
  }

  if (counterElement && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(counterElement);
  } else if (counterElement) {
    runCounter();
  }
});
