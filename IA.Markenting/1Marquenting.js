/**
 * Portfolio Interativo - JavaScript Principal
 * Funcionalidades avançadas com animações fluidas e interatividade
 */

// ============================================
// Utilitários
// ============================================

const Utils = {
    // Debounce para otimizar eventos
    debounce(func, wait = 100) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    
    // Throttle para limitar execuções
    throttle(func, limit = 100) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Lerp para animações suaves
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },
    
    // Mapear valor de um range para outro
    map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },
    
    // Clampar valor entre min e max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    // Verificar se elemento está na viewport
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight - threshold) &&
            rect.bottom >= threshold
        );
    },
    
    // Gerar ID único
    generateId() {
        return `_${Math.random().toString(36).substr(2, 9)}`;
    }
};

// ============================================
// Cursor Personalizado
// ============================================

class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.follower = document.getElementById('cursor-follower');
        
        if (!this.cursor || !this.follower) return;
        
        this.cursorPos = { x: 0, y: 0 };
        this.followerPos = { x: 0, y: 0 };
        this.isHovering = false;
        
        this.init();
    }
    
    init() {
        // Verificar se é dispositivo touch
        if ('ontouchstart' in window) {
            this.cursor.style.display = 'none';
            this.follower.style.display = 'none';
            return;
        }
        
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mousedown', () => this.onClick(true));
        document.addEventListener('mouseup', () => this.onClick(false));
        
        // Detectar elementos interativos
        const interactives = document.querySelectorAll('a, button, input, textarea, select, [data-cursor="hover"]');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => this.onHover(true));
            el.addEventListener('mouseleave', () => this.onHover(false));
        });
        
        this.animate();
    }
    
    onMouseMove(e) {
        this.cursorPos.x = e.clientX;
        this.cursorPos.y = e.clientY;
    }
    
    onHover(isHovering) {
        this.isHovering = isHovering;
        this.follower.classList.toggle('hover', isHovering);
    }
    
    onClick(isClicking) {
        this.follower.classList.toggle('click', isClicking);
    }
    
    animate() {
        // Cursor principal - segue instantaneamente
        this.cursor.style.left = `${this.cursorPos.x}px`;
        this.cursor.style.top = `${this.cursorPos.y}px`;
        
        // Follower - segue com delay suave
        this.followerPos.x = Utils.lerp(this.followerPos.x, this.cursorPos.x, 0.15);
        this.followerPos.y = Utils.lerp(this.followerPos.y, this.cursorPos.y, 0.15);
        
        this.follower.style.left = `${this.followerPos.x}px`;
        this.follower.style.top = `${this.followerPos.y}px`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Sistema de Partículas
// ============================================

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = this.getParticleCount();
        
        this.init();
    }
    
    getParticleCount() {
        const width = window.innerWidth;
        if (width < 768) return 30;
        if (width < 1024) return 50;
        return 80;
    }
    
    init() {
        this.resize();
        this.createParticles();
        
        window.addEventListener('resize', Utils.debounce(() => this.resize(), 250));
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recriar partículas ao redimensionar
        this.particleCount = this.getParticleCount();
        this.createParticles();
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
        this.ctx.fill();
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    updateParticle(particle) {
        // Movimento base
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Interação com mouse
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.x -= Math.cos(angle) * force * 2;
                particle.y -= Math.sin(angle) * force * 2;
            }
        }
        
        // Wrap around edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        this.connectParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Loader
// ============================================

class Loader {
    constructor() {
        this.loader = document.getElementById('loader');
        this.loaderBar = document.getElementById('loader-bar');
        this.loaderPercent = document.getElementById('loader-percent');
        this.progress = 0;
        
        if (this.loader) {
            this.init();
        }
    }
    
    init() {
        this.simulateLoading();
    }
    
    simulateLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                
                setTimeout(() => this.hide(), 500);
            }
            
            this.updateProgress();
        }, 100);
    }
    
    updateProgress() {
        const rounded = Math.round(this.progress);
        this.loaderBar.style.width = `${rounded}%`;
        this.loaderPercent.textContent = `${rounded}%`;
    }
    
    hide() {
        this.loader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        
        // Trigger animations after loader
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('loaderComplete'));
        }, 100);
    }
}

// ============================================
// Navegação
// ============================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        // Scroll handler
        window.addEventListener('scroll', Utils.throttle(() => this.onScroll(), 50));
        
        // Mobile toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobile());
        }
        
        // Nav links - smooth scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Close mobile menu on resize
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth > 768) {
                this.closeMobile();
            }
        }, 250));
        
        // Initial state
        this.onScroll();
    }
    
    onScroll() {
        const scrollY = window.scrollY;
        
        // Navbar background
        this.navbar.classList.toggle('scrolled', scrollY > 50);
        
        // Update active section
        this.updateActiveSection(scrollY);
        
        // Update scroll progress
        this.updateScrollProgress();
    }
    
    updateActiveSection(scrollY) {
        let currentSection = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    updateScrollProgress() {
        const scrollProgress = document.getElementById('scroll-progress');
        if (!scrollProgress) return;
        
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = `${scrollPercent}%`;
    }
    
    handleNavClick(e) {
        e.preventDefault();
        
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        this.closeMobile();
    }
    
    toggleMobile() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    closeMobile() {
        this.navToggle?.classList.remove('active');
        this.navMenu?.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// ============================================
// Theme Toggle
// ============================================

class ThemeManager {
    constructor() {
        this.toggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }
    
    init() {
        // Aplicar tema salvo
        document.body.setAttribute('data-theme', this.currentTheme);
        
        // Toggle handler
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
}

// ============================================
// Animações de Scroll
// ============================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-animate]');
        this.observer = null;
        
        this.init();
    }
    
    init() {
        // Intersection Observer para animações
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        
        this.animatedElements.forEach(el => {
            this.observer.observe(el);
        });
        
        // Trigger after loader complete
        window.addEventListener('loaderComplete', () => {
            // Animar elementos do hero imediatamente
            document.querySelectorAll('.hero [data-animate]').forEach(el => {
                setTimeout(() => {
                    el.classList.add('animated');
                }, parseInt(el.dataset.delay || 0));
            });
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                
                setTimeout(() => {
                    entry.target.classList.add('animated');
                    
                    // Skill bars animation
                    if (entry.target.classList.contains('skill-card')) {
                        this.animateSkillBar(entry.target);
                    }
                }, delay);
                
                // Unobserve após animar
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    animateSkillBar(card) {
        card.classList.add('animated');
    }
}

// ============================================
// Contadores Animados
// ============================================

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.observed = new Set();
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.observed.has(entry.target)) {
                        this.observed.add(entry.target);
                        this.animateCounter(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(target * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// ============================================
// Typing Effect
// ============================================

class TypingEffect {
    constructor() {
        this.element = document.getElementById('typing-code');
        this.code = `<span class="comment">// Criando experiências incríveis</span>

<span class="keyword">const</span> <span class="function">developer</span> = {
  <span class="property">name</span>: <span class="string">"João Silva"</span>,
  <span class="property">role</span>: <span class="string">"Full Stack"</span>,
  <span class="property">skills</span>: [
    <span class="string">"JavaScript"</span>,
    <span class="string">"React"</span>,
    <span class="string">"Node.js"</span>,
    <span class="string">"Python"</span>
  ],
  <span class="property">passion</span>: <span class="string">"Clean Code"</span>
};

<span class="function">developer</span>.<span class="function">create</span>(<span class="string">"magic"</span>);`;
        
        this.index = 0;
        this.speed = 20;
        
        if (this.element) {
            window.addEventListener('loaderComplete', () => {
                setTimeout(() => this.start(), 500);
            });
        }
    }
    
    start() {
        this.type();
    }
    
    type() {
        if (this.index < this.code.length) {
            // Adicionar caractere por caractere, mas preservar tags HTML
            const char = this.code.charAt(this.index);
            
            if (char === '<') {
                // Encontrar fim da tag
                const tagEnd = this.code.indexOf('>', this.index);
                const tag = this.code.substring(this.index, tagEnd + 1);
                this.element.innerHTML += tag;
                this.index = tagEnd + 1;
            } else {
                this.element.innerHTML += char;
                this.index++;
            }
            
            // Adicionar cursor
            const cursorSpan = '<span class="cursor">|</span>';
            const content = this.element.innerHTML;
            this.element.innerHTML = content.replace(/<span class="cursor">\|<\/span>/g, '') + cursorSpan;
            
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// ============================================
// Skills Tabs
// ============================================

class SkillsTabs {
    constructor() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.panels = document.querySelectorAll('.skills-panel');
        
        if (this.tabs.length) {
            this.init();
        }
    }
    
    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    }
    
    switchTab(selectedTab) {
        const tabId = selectedTab.dataset.tab;
        
        // Update tabs
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab === selectedTab);
        });
        
        // Update panels
        this.panels.forEach(panel => {
            const isActive = panel.id === `${tabId}-panel`;
            panel.classList.toggle('active', isActive);
            
            // Reanimar skill cards
            if (isActive) {
                panel.querySelectorAll('.skill-card').forEach((card, index) => {
                    card.classList.remove('animated');
                    setTimeout(() => {
                        card.classList.add('animated');
                    }, index * 50);
                });
            }
        });
    }
}

// ============================================
// Projects Filter
// ============================================

class ProjectsFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projects = document.querySelectorAll('.project-card');
        
        if (this.filterBtns.length) {
            this.init();
        }
    }
    
    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filter(btn));
        });
    }
    
    filter(selectedBtn) {
        const filter = selectedBtn.dataset.filter;
        
        // Update buttons
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn === selectedBtn);
        });
        
        // Filter projects with animation
        this.projects.forEach((project, index) => {
            const category = project.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                project.style.display = '';
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                project.style.opacity = '0';
                project.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    project.style.display = 'none';
                }, 300);
            }
        });
    }
}

// ============================================
// Contact Form
// ============================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.feedback = document.getElementById('form-feedback');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input animations
        const inputs = this.form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => this.onFocus(input));
            input.addEventListener('blur', () => this.onBlur(input));
        });
    }
    
    onFocus(input) {
        input.parentElement.classList.add('focused');
    }
    
    onBlur(input) {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('.btn-submit');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simular envio
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Sucesso simulado
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        this.showFeedback('success', 'Mensagem enviada com sucesso! Entrarei em contato em breve.');
        this.form.reset();
        
        // Limpar feedback após 5 segundos
        setTimeout(() => this.hideFeedback(), 5000);
    }
    
    showFeedback(type, message) {
        this.feedback.className = `form-feedback ${type}`;
        this.feedback.textContent = message;
    }
    
    hideFeedback() {
        this.feedback.className = 'form-feedback';
    }
}

// ============================================
// Smooth Scroll para links internos
// ============================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// Parallax Effects (opcional, leve)
// ============================================

class ParallaxEffects {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        
        if (this.elements.length) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('scroll', Utils.throttle(() => this.update(), 16));
    }
    
    update() {
        const scrollY = window.scrollY;
        
        this.elements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const offset = scrollY * speed;
            el.style.transform = `translateY(${offset}px)`;
        });
    }
}

// ============================================
// Inicialização
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Prevenir scroll durante loading
    document.body.classList.add('no-scroll');
    
    // Inicializar componentes
    new Loader();
    new CustomCursor();
    new ParticleSystem();
    new Navigation();
    new ThemeManager();
    new ScrollAnimations();
    new CounterAnimation();
    new TypingEffect();
    new SkillsTabs();
    new ProjectsFilter();
    new ContactForm();
    new SmoothScroll();
    
    // Log de inicialização
    console.log('%c🚀 Portfolio Loaded Successfully!', 'color: #6366f1; font-size: 14px; font-weight: bold;');
});

// ============================================
// Service Worker (opcional - para PWA)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Descomente para habilitar PWA
        // navigator.serviceWorker.register('/sw.js');
    });
}
