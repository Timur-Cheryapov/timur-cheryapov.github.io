// MP Bot Portfolio - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeApp();
});

function initializeApp() {
    // Component initializers
    initializeNavigation();
    initializeScrollEffects();
    initializeLightbox();
    initializeAnimations();
    initializeTooltips();
    initializeCodeCopy();
    initializeCodeCollapse();
    initializeMobileMenu();
    initializeBackToTop();
    initializeLoadingScreen();
    initializeTypingAnimation();
    
    // Add smooth loading
    setTimeout(() => {
        document.body.classList.add('loaded');
        hideLoadingScreen();
    }, 1500);
}

// Loading Screen
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
    }, 100);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgress = document.getElementById('scroll-progress');
    
    let lastScrollTop = 0;
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Update active link
            updateActiveNavLink(targetId);
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
    
    // Scroll effects
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollTop = scrollTop;
        
        // Update scroll progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
        
        // Update active section
        updateActiveSection();
        
    }, 16));
}

function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// Scroll Animations
function initializeScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .fade-in-up');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add animate-on-scroll class to cards and sections
    const cards = document.querySelectorAll('.feature-card, .overview-card, .achievement-card, .result-card, .challenge-card, .tech-item');
    cards.forEach(card => {
        card.classList.add('animate-on-scroll');
        observer.observe(card);
    });
}

// Lightbox
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxTriggers = document.querySelectorAll('[data-lightbox]');
    
    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.screenshot-overlay span') || 
                           this.querySelector('.diagram-overlay span');
            
            if (img && lightbox) {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                
                if (caption && lightboxCaption) {
                    lightboxCaption.textContent = caption.textContent;
                }
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Code Copy Functionality
function initializeCodeCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            const code = codeBlock.querySelector('code');
            
            if (code) {
                // Create temporary textarea
                const textarea = document.createElement('textarea');
                textarea.value = code.textContent;
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    document.execCommand('copy');
                    showCopyFeedback(this);
                } catch (err) {
                    console.error('Failed to copy code: ', err);
                }
                
                document.body.removeChild(textarea);
            }
        });
    });
}

function showCopyFeedback(button) {
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.color = '#10b981';
    
    setTimeout(() => {
        button.innerHTML = originalIcon;
        button.style.color = '';
    }, 2000);
}

// Code Collapse Functionality
function initializeCodeCollapse() {
    const collapseButtons = document.querySelectorAll('.collapse-btn');
    
    collapseButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            const codeBlock = this.closest('.code-block');
            const buttonText = this.querySelector('span');
            const buttonIcon = this.querySelector('i');
            
            if (codeBlock) {
                // Toggle collapsed state
                codeBlock.classList.toggle('collapsed');
                codeBlock.classList.toggle('expanded');
                
                // Update button text and icon
                if (codeBlock.classList.contains('collapsed')) {
                    buttonText.textContent = 'Expand';
                    buttonIcon.className = 'fas fa-chevron-down';
                } else {
                    buttonText.textContent = 'Collapse';
                    buttonIcon.className = 'fas fa-chevron-up';
                }
                
                // Smooth scroll adjustment if needed
                setTimeout(() => {
                    if (!codeBlock.classList.contains('collapsed')) {
                        // If expanding and user is below the code block, scroll to keep it in view
                        const rect = codeBlock.getBoundingClientRect();
                        if (rect.top < 100) { // If code block header is above viewport
                            codeBlock.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start',
                                inline: 'nearest'
                            });
                        }
                    }
                }, 300); // Wait for animation to complete
            }
        });
    });
    
    // Make code headers clickable (alternative way to toggle)
    const codeHeaders = document.querySelectorAll('.code-header');
    codeHeaders.forEach(header => {
        // Add a subtle visual cue that it's clickable
        header.style.cursor = 'pointer';
        
        header.addEventListener('click', function(e) {
            // Don't trigger if clicking on copy button
            if (e.target.closest('.copy-btn')) {
                return;
            }
            
            const collapseBtn = this.querySelector('.collapse-btn');
            if (collapseBtn) {
                collapseBtn.click();
            }
        });
    });
}

// Tooltips
function initializeTooltips() {
    const tooltip = document.getElementById('tech-tooltip');
    const techItems = document.querySelectorAll('.tech-item[data-info]');
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function(e) {
            const info = this.getAttribute('data-info');
            if (info && tooltip) {
                tooltip.textContent = info;
                tooltip.classList.add('visible');
                positionTooltip(e, tooltip);
            }
        });
        
        item.addEventListener('mousemove', function(e) {
            if (tooltip.classList.contains('visible')) {
                positionTooltip(e, tooltip);
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.classList.remove('visible');
            }
        });
    });
}

function positionTooltip(e, tooltip) {
    const x = e.clientX + 10;
    const y = e.clientY - 10;
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    
    // Adjust if tooltip goes off screen
    const rect = tooltip.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        tooltip.style.left = (x - rect.width - 20) + 'px';
    }
    if (rect.top < 0) {
        tooltip.style.top = (y + 20) + 'px';
    }
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', throttle(function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 16));
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Typing Animation
function initializeTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid rgba(255, 255, 255, 0.7)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRight = element.style.borderRight === 'none' 
                        ? '2px solid rgba(255, 255, 255, 0.7)' 
                        : 'none';
                }, 500);
            }
        };
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 2000);
    });
}

// Enhanced Animations
function initializeAnimations() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero) {
        window.addEventListener('scroll', throttle(function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            if (heroContent) {
                heroContent.style.transform = `translateY(${parallax}px)`;
            }
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${parallax * 0.8}px)`;
            }
        }, 16));
    }
    
    // Hover effects for cards
    const cards = document.querySelectorAll('.feature-card, .overview-card, .achievement-card, .result-card, .tech-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Number counter animation for results and stats
    const numberElements = document.querySelectorAll('.result-number, .stat-number');
    
    const numberObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                numberObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    numberElements.forEach(number => {
        numberObserver.observe(number);
    });
}

function animateNumber(element) {
    const finalText = element.textContent;
    
    // Check if the content contains letters - if so, don't animate numbers
    if (/[a-zA-Z]/.test(finalText)) {
        // For text content (like "SSE", "AES-256"), just add a fade-in animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
        return;
    }
    
    // Only animate if it's purely numeric (with optional symbols like % or +)
    const numericValue = parseInt(finalText.replace(/\D/g, ''));
    
    if (isNaN(numericValue) || numericValue === 0) {
        // For non-numeric content, just add a fade-in animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
        return;
    }
    
    const suffix = finalText.replace(/[\d.]/g, '');
    let current = 0;
    const increment = numericValue / 60; // 60 frames for 1 second at 60fps
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Demo Video Functionality
function initializeDemoVideo() {
    const videoPlaceholder = document.getElementById('demo-video-placeholder');
    const video = videoPlaceholder?.querySelector('video');
    const overlay = videoPlaceholder?.querySelector('.video-overlay');
    
    if (video && overlay) {
        // Hide overlay when clicking on it or the video
        overlay.addEventListener('click', function() {
            video.play();
        });
        
        // Hide overlay when video starts playing
        video.addEventListener('play', function() {
            overlay.classList.add('hidden');
        });
        
        // Show overlay when video is paused or ended
        video.addEventListener('pause', function() {
            overlay.classList.remove('hidden');
        });
        
        video.addEventListener('ended', function() {
            overlay.classList.remove('hidden');
        });
        
        // Ensure overlay is visible initially
        video.addEventListener('loadeddata', function() {
            if (video.paused) {
                overlay.classList.remove('hidden');
            }
        });
    }
}

// Performance Optimization: Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance Optimization: Debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // You could send this to an error tracking service
});

// Unhandled Promise Rejection
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Tab navigation improvements
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Touch Device Detection
function detectTouch() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }
}

// Initialize touch detection
detectTouch();

// Theme Toggle (Optional - for future enhancement)
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// Analytics (placeholder for Google Analytics or similar)
function trackEvent(category, action, label) {
    // Integrate with your analytics platform
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track important interactions
document.addEventListener('click', function(e) {
    const element = e.target.closest('a, button');
    if (element) {
        if (element.href && element.href.includes('github.com')) {
            trackEvent('External Link', 'GitHub', element.href);
        }
        if (element.classList.contains('btn-primary')) {
            trackEvent('CTA', 'Primary Button Click', element.textContent.trim());
        }
    }
});

// Lazy Loading for Images (if needed)
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize all deferred components
setTimeout(() => {
    initializeDemoVideo();
    initializeThemeToggle();
    initializeLazyLoading();
}, 100);

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 