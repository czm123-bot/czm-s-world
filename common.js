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
        '关于我们.html'
    ];
    preloadLinks.forEach(link => {
        const preloadElem = document.createElement('link');
        preloadElem.rel = 'prefetch';
        preloadElem.href = link;
        preloadElem.as = 'document';
        document.head.appendChild(preloadElem);
    });
});





