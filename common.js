(function() {
    var overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(20,25,40,0.92);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Microsoft YaHei",sans-serif;transition:opacity 0.8s ease;';
    overlay.innerHTML = '<div style="font-size:2.2rem;font-weight:300;letter-spacing:6px;background:linear-gradient(90deg,#fff,#aab,#fff);background-size:200% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shine 2s ease-in-out infinite;">加载中</div><style>@keyframes shine{0%{background-position:200% 0;}100%{background-position:-200% 0;}}</style>';
    document.body.prepend(overlay);

    function removeOverlay() {
        overlay.style.opacity = '0';
        setTimeout(function() {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 900);
    }

    function loadScript(src, callback) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = function() { callback(true); };
        s.onerror = function() { callback(false); };
        document.head.appendChild(s);
    }

    function injectSVGFilters() {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('style', 'position:absolute;width:0;height:0;');
        svg.setAttribute('aria-hidden', 'true');

        var filter1 = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter1.id = 'liquid-distort';
        filter1.setAttribute('x', '-10%');
        filter1.setAttribute('y', '-10%');
        filter1.setAttribute('width', '120%');
        filter1.setAttribute('height', '120%');
        var turb = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
        turb.setAttribute('type', 'fractalNoise');
        turb.setAttribute('baseFrequency', '0.015');
        turb.setAttribute('numOctaves', '3');
        turb.setAttribute('seed', '2');
        turb.setAttribute('result', 'noise');
        var anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        anim.setAttribute('attributeName', 'baseFrequency');
        anim.setAttribute('values', '0.015;0.018;0.015');
        anim.setAttribute('dur', '8s');
        anim.setAttribute('repeatCount', 'indefinite');
        turb.appendChild(anim);
        filter1.appendChild(turb);
        var disp = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
        disp.setAttribute('in', 'SourceGraphic');
        disp.setAttribute('in2', 'noise');
        disp.setAttribute('scale', '6');
        disp.setAttribute('xChannelSelector', 'R');
        disp.setAttribute('yChannelSelector', 'G');
        disp.setAttribute('result', 'displaced');
        filter1.appendChild(disp);
        var blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        blur.setAttribute('in', 'displaced');
        blur.setAttribute('stdDeviation', '0.5');
        blur.setAttribute('result', 'blurred');
        filter1.appendChild(blur);
        var merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        merge.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')).setAttribute('in', 'blurred');
        merge.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')).setAttribute('in', 'SourceGraphic');
        filter1.appendChild(merge);
        svg.appendChild(filter1);

        var filter2 = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter2.id = 'chromatic-distort';
        filter2.setAttribute('x', '-20%');
        filter2.setAttribute('y', '-20%');
        filter2.setAttribute('width', '140%');
        filter2.setAttribute('height', '140%');

        var m1 = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
        m1.setAttribute('type', 'matrix');
        m1.setAttribute('values', '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0');
        m1.setAttribute('result', 'redChannel');
        filter2.appendChild(m1);
        var o1 = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
        o1.setAttribute('in', 'redChannel');
        o1.setAttribute('dx', '2');
        o1.setAttribute('dy', '0');
        o1.setAttribute('result', 'redOffset');
        filter2.appendChild(o1);

        var m2 = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
        m2.setAttribute('type', 'matrix');
        m2.setAttribute('values', '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0');
        m2.setAttribute('result', 'greenChannel');
        filter2.appendChild(m2);
        var o2 = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
        o2.setAttribute('in', 'greenChannel');
        o2.setAttribute('dx', '0');
        o2.setAttribute('dy', '1');
        o2.setAttribute('result', 'greenOffset');
        filter2.appendChild(o2);

        var m3 = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
        m3.setAttribute('type', 'matrix');
        m3.setAttribute('values', '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0');
        m3.setAttribute('result', 'blueChannel');
        filter2.appendChild(m3);
        var o3 = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
        o3.setAttribute('in', 'blueChannel');
        o3.setAttribute('dx', '-2');
        o3.setAttribute('dy', '0');
        o3.setAttribute('result', 'blueOffset');
        filter2.appendChild(o3);

        var merge2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        merge2.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')).setAttribute('in', 'redOffset');
        merge2.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')).setAttribute('in', 'greenOffset');
        merge2.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')).setAttribute('in', 'blueOffset');
        filter2.appendChild(merge2);
        svg.appendChild(filter2);

        document.body.prepend(svg);
    }

    function applyGlassLayers() {
        var glasses = document.querySelectorAll('.glass');
        glasses.forEach(function(el) {
            var layers = ['bg-layer', 'chromatic', 'reflection', 'aura-outer'];
            layers.forEach(function(cls) {
                if (!el.querySelector('.' + cls)) {
                    var div = document.createElement('div');
                    div.className = cls;
                    el.prepend(div);
                }
            });
        });
    }

    function initParticleSystem() {
        var canvas = document.getElementById('particleCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'particleCanvas';
            canvas.className = 'particle-canvas';
            canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;';
            document.body.prepend(canvas);
        }
        var ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
        var particles = [];
        var maxParticles = 120;
        var running = true;
        var animationId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 0.8 + Math.random() * 2.8,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: 0.10 + Math.random() * 0.25,
                age: Math.random() * 300,
                maxAge: 300 + Math.random() * 400,
                phase: Math.random() * 2 * Math.PI
            };
        }
        for (var i = 0; i < maxParticles; i++) particles.push(createParticle());

        function update() {
            var w = canvas.width,
                h = canvas.height;
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.vx += (Math.random() - 0.5) * 0.012;
                p.vy += (Math.random() - 0.5) * 0.012;
                p.vx = Math.max(-0.4, Math.min(0.4, p.vx));
                p.vy = Math.max(-0.4, Math.min(0.4, p.vy));
                p.x += p.vx;
                p.y += p.vy;
                p.age++;
                if (p.age > p.maxAge) {
                    Object.assign(p, createParticle());
                    p.x = Math.random() * w;
                    p.y = Math.random() * h;
                }
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                p.x = Math.max(0, Math.min(w, p.x));
                p.y = Math.max(0, Math.min(h, p.y));
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                var alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.age * 0.025 + p.phase));
                var r = p.radius * (0.8 + 0.2 * Math.sin(p.age * 0.03 + p.phase));
                ctx.beginPath();
                ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(180, 200, 225, ' + alpha + ')';
                ctx.fill();
                if (r > 1.8) {
                    ctx.shadowColor = 'rgba(200, 215, 235, 0.10)';
                    ctx.shadowBlur = 8;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        }

        function loop() {
            if (!running) return;
            update();
            draw();
            animationId = requestAnimationFrame(loop);
        }
        loop();

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                running = false;
                cancelAnimationFrame(animationId);
            } else {
                running = true;
                loop();
            }
        });
    }

    function initSpotTracking(selector, spotClass) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(el) {
            var spot = el.querySelector(spotClass);
            if (!spot) return;
            el.addEventListener('mouseenter', function() {
                spot.style.opacity = '0';
            });
            el.addEventListener('mousemove', function(e) {
                var rect = this.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                spot.style.left = x + 'px';
                spot.style.top = y + 'px';
                spot.style.opacity = '1';
            });
            el.addEventListener('mouseleave', function() {
                spot.style.opacity = '0';
            });
        });
    }

    function startEntryAnimation() {
        var glasses = document.querySelectorAll('.glass');
        if (glasses.length === 0) {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.8s ease';
            setTimeout(function() {
                document.body.style.opacity = '1';
            }, 100);
            return;
        }
        if (typeof gsap !== 'undefined') {
            gsap.from('body', { duration: 0.6, opacity: 0, ease: 'power2.out' });
            gsap.from('.glass', {
                duration: 1.4,
                scale: 0.85,
                opacity: 0,
                ease: 'power3.out',
                stagger: 0.12,
                clearProps: 'scale,opacity'
            });
        } else {
            glasses.forEach(function(el, i) {
                el.style.opacity = '0';
                el.style.transform = 'scale(0.85)';
                setTimeout(function() {
                    el.style.transition = 'opacity 1.4s ease, transform 1.4s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'scale(1)';
                }, 100 + i * 120);
            });
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.8s ease';
            setTimeout(function() {
                document.body.style.opacity = '1';
            }, 100);
        }
    }

    function finalize() {
        injectSVGFilters();
        applyGlassLayers();
        initParticleSystem();
        initSpotTracking('.nav a', '.light-spot');
        initSpotTracking('.glass-btn', '.light-spot');
        initSpotTracking('.glass-btn', '.btn-spot');
        initSpotTracking('.nav a', '.nav-spot');
        document.addEventListener('touchstart', function() {}, { passive: true });
        document.addEventListener('touchmove', function() {}, { passive: true });
        document.addEventListener('wheel', function() {}, { passive: true });
        startEntryAnimation();
        removeOverlay();
    }

    function detectPerformance() {
        var isWebGL2 = false;
        try {
            var canvas = document.createElement('canvas');
            isWebGL2 = !!(canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2'));
        } catch (e) {}
        var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        var isHighPerf = isWebGL2 && (window.devicePixelRatio <= 2 || !isMobile);
        return isHighPerf;
    }

    function loadLibraries() {
        var useThree = detectPerformance();
        var loadGSAP = true;
        var loadCount = 0;
        var total = useThree ? 2 : 2;

        function onLoadComplete() {
            loadCount++;
            if (loadCount >= total) {
                finalize();
            }
        }

        if (loadGSAP) {
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', function(success) {
                if (!success) console.warn('GSAP加载失败，入场动画降级');
                onLoadComplete();
            });
        } else {
            onLoadComplete();
        }

        if (useThree) {
            var importMap = document.createElement('script');
            importMap.type = 'importmap';
            importMap.textContent = JSON.stringify({
                imports: {
                    'three': 'https://unpkg.com/three@0.160.0/build/three.module.js',
                    'three/addons/': 'https://unpkg.com/three@0.160.0/examples/jsm/'
                }
            });
            document.head.appendChild(importMap);

            var mainScript = document.createElement('script');
            mainScript.type = 'module';
            mainScript.textContent = `
                import * as THREE from 'three';
                import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
                const cards = document.querySelectorAll('.glass');
                if (cards.length > 0) {
                    const loader = new RGBELoader();
                    const hdrUrl = 'https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr';
                    loader.load(hdrUrl, function(texture) {
                        texture.mapping = THREE.EquirectangularReflectionMapping;
                        cards.forEach(function(card) {
                            const rect = card.getBoundingClientRect();
                            const w = rect.width;
                            const h = rect.height;
                            const scene = new THREE.Scene();
                            scene.background = null;
                            scene.environment = texture;
                            const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
                            camera.position.set(0, 0, 5);
                            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
                            renderer.setSize(w, h);
                            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                            renderer.toneMapping = THREE.ACESFilmicToneMapping;
                            renderer.toneMappingExposure = 1.2;
                            const canvas = renderer.domElement;
                            canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
                            card.prepend(canvas);
                            const geometry = new THREE.PlaneGeometry(2.2, 2.8);
                            const material = new THREE.MeshPhysicalMaterial({
                                color: 0xffffff,
                                metalness: 0,
                                roughness: 0.02,
                                clearcoat: 0.8,
                                clearcoatRoughness: 0.1,
                                transparent: true,
                                opacity: 0.25,
                                envMap: texture,
                                envMapIntensity: 1.2,
                                ior: 1.5,
                                thickness: 1.5,
                                transmission: 0.95,
                                attenuationColor: 0xffffff,
                                attenuationDistance: 0.5,
                                dispersion: 0.2,
                            });
                            const mesh = new THREE.Mesh(geometry, material);
                            scene.add(mesh);
                            const light = new THREE.PointLight(0xffffff, 0.6);
                            light.position.set(1, 1, 3);
                            scene.add(light);
                            let targetRotX = 0, targetRotY = 0;
                            card.addEventListener('mousemove', function(e) {
                                const rect = this.getBoundingClientRect();
                                const x = (e.clientX - rect.left) / rect.width - 0.5;
                                const y = (e.clientY - rect.top) / rect.height - 0.5;
                                targetRotX = y * 0.15;
                                targetRotY = x * 0.15;
                                light.position.set(x * 0.8, y * 0.8, 2.5);
                            });
                            card.addEventListener('mouseleave', function() {
                                targetRotX = 0;
                                targetRotY = 0;
                                light.position.set(1, 1, 3);
                            });
                            function animate() {
                                requestAnimationFrame(animate);
                                mesh.rotation.x += (targetRotX - mesh.rotation.x) * 0.08;
                                mesh.rotation.y += (targetRotY - mesh.rotation.y) * 0.08;
                                renderer.render(scene, camera);
                            }
                            animate();
                            const ro = new ResizeObserver(function() {
                                const nr = card.getBoundingClientRect();
                                renderer.setSize(nr.width, nr.height);
                                camera.aspect = nr.width / nr.height;
                                camera.updateProjectionMatrix();
                            });
                            ro.observe(card);
                        });
                    }, undefined, function() {
                        console.warn('HDR加载失败，Three.js降级');
                    });
                }
            `;
            document.head.appendChild(mainScript);
            onLoadComplete();
        } else {
            loadScript('https://glassify.saviru.me/cdn/glassify.js', function(success) {
                if (success) {
                    var cards = document.querySelectorAll('.glass');
                    cards.forEach(function(el) {
                        el.classList.add('glassify');
                    });
                } else {
                    console.warn('GlassiFy加载失败，使用纯CSS方案');
                }
                onLoadComplete();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadLibraries);
    } else {
        loadLibraries();
    }
})();