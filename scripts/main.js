// scripts/main.js (New SPA-like version)

// Function to fetch and display page content
const loadPage = async (url) => {
    try {
        // Fetch the content of the page
        const response = await fetch(url);
        const text = await response.text();

        // Use DOMParser to parse the fetched HTML text
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Get the new page's title and main content
        const newTitle = doc.querySelector('title').innerText;
        const newContent = doc.querySelector('#main-content').innerHTML;

        // Update the current page's title and main content
        document.title = newTitle;
        document.querySelector('#main-content').innerHTML = newContent;

        // Scroll to the top of the page
        window.scrollTo(0, 0);

        // Update the active link in the sidebar
        updateActiveLink();

    } catch (error) {
        console.error('Error loading page:', error);
    }
};

// Function to update the active link in the sidebar
const updateActiveLink = () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const currentPath = window.location.pathname;

    sidebarLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');

        // Add active class to the link that matches the current URL
        if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
            link.classList.add('active');
        }
    });
};


// Main execution block
document.addEventListener("DOMContentLoaded", function() {
    
    // Load the sidebar initially
    fetch('partials/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;

            // Add click listeners to the newly loaded sidebar links
            document.querySelectorAll('.sidebar-nav a').forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevent default full page reload
                    const href = this.getAttribute('href');
                    
                    // Update the URL in the browser's history without reloading
                    history.pushState(null, '', href);
                    
                    // Load the new page content
                    loadPage(href);
                });
            });

            // Initial active link update
            updateActiveLink();
        });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        loadPage(window.location.pathname);
    });
});