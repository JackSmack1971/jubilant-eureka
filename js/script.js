document.addEventListener('DOMContentLoaded', () => {
    try {
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        const mainNav = document.querySelector('.main-nav');
        const navLinks = document.querySelectorAll('.nav-link');

        if (mobileNavToggle && mainNav) {
            mobileNavToggle.addEventListener('click', () => {
                mainNav.classList.toggle('is-open');
                mobileNavToggle.classList.toggle('is-active');
                // Set aria-expanded based on current state
                const isExpanded = mobileNavToggle.classList.contains('is-active');
                mobileNavToggle.setAttribute('aria-expanded', isExpanded);
            });

            // Close nav when a link is clicked (for smooth scrolling)
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mainNav.classList.contains('is-open')) {
                        mainNav.classList.remove('is-open');
                        mobileNavToggle.classList.remove('is-active');
                        mobileNavToggle.setAttribute('aria-expanded', false);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Navigation initialization failed:', error);
    }
});
