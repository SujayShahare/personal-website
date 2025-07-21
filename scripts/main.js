
// function to fetch and display page content
const loadPage = async (url) => {
    try {
        let fullUrl = url;
        if (!url.endsWith('.html') && url !== '/' && !url.includes('#')) {
            fullUrl = url + '.html';
        } else if (url === '/') {
            fullUrl = '/index.html';
        }

        // fetch the content of the page
        const response = await fetch(fullUrl);
        const text = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        const newTitle = doc.querySelector('title').innerText;
        const newContent = doc.querySelector('#main-content').innerHTML;

        document.title = newTitle;
        document.querySelector('#main-content').innerHTML = newContent;

        // scroll to the target hash if it exists
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo(0, 0);
        }

        // update the active link in the sidebar
        updateActiveLink();

    } catch (error) {
        console.error('Error loading page:', error);
    }
};

// function to update the active link in the sidebar
const updateActiveLink = () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const profileLink = document.querySelector('#profile-link');
    const currentPath = window.location.pathname.replace(/\.html$/, '');

    sidebarLinks.forEach(link => link.classList.remove('active'));
    if (profileLink) profileLink.classList.remove('active');

    sidebarLinks.forEach(link => {
        const linkPath = link.getAttribute('href').replace(/\.html$/, '');
        if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
            link.classList.add('active');
        }
    });
    if (currentPath === '/' && profileLink) profileLink.classList.add('active');
};



document.addEventListener("DOMContentLoaded", function() {
    // load the sidebar initially
    fetch('partials/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;

            document.querySelectorAll('.sidebar-nav a, #profile-link').forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault(); 
                    let href = this.getAttribute('href');
                    
                    if (href.includes('#')) {
                        const [path, hash] = href.split('#');
                        const cleanPath = path.replace(/\.html$/, '') || '/';
                        history.pushState(null, '', `${cleanPath}#${hash}`);
                        loadPage(path || '/').then(() => {
                            const targetElement = document.querySelector(`#${hash}`);
                            if (targetElement) {
                                targetElement.scrollIntoView({ behavior: 'smooth' });
                            }
                        });
                    } else {
                        const cleanHref = href.replace(/\.html$/, '') || '/';
                        history.pushState(null, '', cleanHref);
                        loadPage(href === '/' ? '/index.html' : href);
                    }
                });
            });

            updateActiveLink();
        });



    window.addEventListener('popstate', function() {
        const path = window.location.pathname.replace(/\.html$/, '') + window.location.hash;
        const fullPath = path.includes('#') ? path.split('#')[0] + '.html' : (path === '/' ? '/index.html' : path + '.html');
        loadPage(fullPath);
    });
});