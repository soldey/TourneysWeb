(() => {
    const start = Date.now();
    window.addEventListener('load', () => {
        const end = Date.now();
        const loadTime = document.getElementById('loadtime')
        const getCookie = ((name) => {
            var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            if (match) return match[2];
        });
        const serverLoadTime = getCookie('response-time');

        loadTime.innerText = `Webpage was loaded in ${end - start}ms + ${serverLoadTime}ms`;
    });
})();