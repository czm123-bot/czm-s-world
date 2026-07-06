document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('.link');
    links.forEach(link => {
        link.addEventListener('click', function() {
            const container = this.parentElement;
            const imgSources = container.querySelectorAll('.target-img');
            const webpSrc = this.getAttribute('data-img-webp');
            const jpgSrc = this.getAttribute('data-img-jpg');
            const currentDisplay = imgSources[1].style.display;

            if (currentDisplay === 'inline-block') {
                imgSources.forEach(img => {
                    img.style.display = 'none';
                });
            } else {
                imgSources[0].setAttribute('srcset', webpSrc);
                imgSources[1].setAttribute('src', jpgSrc);
                imgSources.forEach(img => {
                    img.style.display = 'inline-block';
                });
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && document.querySelector(targetId)) {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const preloadLinks = [
        'index.html',
        'Apian的历史.html',
        'Apian的惊喜.html',
        'Apian100%25_reason.html',
        '关于我们.html',
        'v.html',
        '其他.html',
        'TDCT.html'
    ];
    preloadLinks.forEach(link => {
        const preloadElem = document.createElement('link');
        preloadElem.rel = 'prefetch';
        preloadElem.href = link;
        preloadElem.as = 'document';
        document.head.appendChild(preloadElem);
    });

    function preloadImages() {
        const images = document.querySelectorAll('img[src], source[srcset]');
        const urls = new Set();
        images.forEach(el => {
            let src = el.getAttribute('src') || el.getAttribute('srcset');
            if (src) {
                if (src.includes(',')) {
                    src.split(',').forEach(s => {
                        const trimmed = s.trim().split(' ')[0];
                        if (trimmed) urls.add(trimmed);
                    });
                } else {
                    urls.add(src);
                }
            }
        });
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    preloadImages();

    class ParticleSystem {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d', { alpha: true, willReadFrequently: false });
            this.particles = [];
            this.maxParticles = 120;
            this.running = false;
            this.animationId = null;
            this.resizeHandler = this.resize.bind(this);
            window.addEventListener('resize', this.resizeHandler);
            this.resize();
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push(this.createParticle(true));
            }
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createParticle(randomAge) {
            return {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 0.8 + Math.random() * 2.8,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: 0.10 + Math.random() * 0.25,
                age: randomAge ? Math.random() * 300 : 0,
                maxAge: 300 + Math.random() * 400,
                phase: Math.random() * 2 * Math.PI
            };
        }

        update() {
            const w = this.canvas.width, h = this.canvas.height;
            for (let p of this.particles) {
                p.vx += (Math.random() - 0.5) * 0.012;
                p.vy += (Math.random() - 0.5) * 0.012;
                p.vx = Math.max(-0.4, Math.min(0.4, p.vx));
                p.vy = Math.max(-0.4, Math.min(0.4, p.vy));
                p.x += p.vx;
                p.y += p.vy;
                p.age++;
                if (p.age > p.maxAge) {
                    Object.assign(p, this.createParticle(false));
                    p.x = Math.random() * w;
                    p.y = Math.random() * h;
                }
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                p.x = Math.max(0, Math.min(w, p.x));
                p.y = Math.max(0, Math.min(h, p.y));
            }
        }

        draw() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let p of this.particles) {
                const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.age * 0.025 + p.phase));
                const r = p.radius * (0.8 + 0.2 * Math.sin(p.age * 0.03 + p.phase));
                ctx.beginPath();
                ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180, 200, 225, ${alpha})`;
                ctx.fill();
                if (r > 1.8) {
                    ctx.shadowColor = 'rgba(200, 215, 235, 0.10)';
                    ctx.shadowBlur = 8;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        }

        loop() {
            if (!this.running) return;
            this.update();
            this.draw();
            this.animationId = requestAnimationFrame(() => this.loop());
        }

        start() {
            if (this.running) return;
            this.running = true;
            this.loop();
        }

        stop() {
            this.running = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }

        destroy() {
            this.stop();
            window.removeEventListener('resize', this.resizeHandler);
            this.canvas = null;
            this.ctx = null;
        }
    }

    let particleCanvas = document.getElementById('particleCanvas');
    if (!particleCanvas) {
        particleCanvas = document.createElement('canvas');
        particleCanvas.id = 'particleCanvas';
        particleCanvas.className = 'particle-canvas';
        particleCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;';
        document.body.prepend(particleCanvas);
    }
    const ps = new ParticleSystem('particleCanvas');
    ps.start();
    window.__particleSystem = ps;

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            ps.stop();
        } else {
            ps.start();
        }
    });

    function initSpotTracking(selector, spotClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const spot = el.querySelector(spotClass);
            if (!spot) return;
            el.addEventListener('mouseenter', () => {
                spot.style.opacity = '0';
            });
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                spot.style.left = x + 'px';
                spot.style.top = y + 'px';
                spot.style.opacity = '1';
            });
            el.addEventListener('mouseleave', () => {
                spot.style.opacity = '0';
            });
        });
    }

    initSpotTracking('.nav a', '.light-spot');
    initSpotTracking('.glass-btn', '.light-spot');
    initSpotTracking('.glass-btn', '.btn-spot');
    initSpotTracking('.nav a', '.nav-spot');

    document.addEventListener('touchstart', ()=>{}, {passive: true});
    document.addEventListener('touchmove', ()=>{}, {passive: true});
    document.addEventListener('wheel', ()=>{}, {passive: true});
});