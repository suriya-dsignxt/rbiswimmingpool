document.addEventListener('DOMContentLoaded', () => {
    const previewWrapper = document.getElementById('preview-wrapper');
    const previewImage = document.querySelector('.design-preview');
    const widthControls = document.getElementById('width-controls');
    const themeControls = document.getElementById('theme-controls');
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    // Create a beautiful, subtle loading skeleton
    const skeleton = document.createElement('div');
    skeleton.className = 'preview-skeleton';
    skeleton.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(skeleton);

    // Image loading logic
    const imgUrl = 'RBI Swimming Pool.jpg';
    const tempImg = new Image();
    
    tempImg.onload = () => {
        // Once the image is fully loaded, hide loader and reveal layout
        skeleton.classList.add('fade-out');
        setTimeout(() => {
            skeleton.remove();
            previewImage.classList.add('loaded');
        }, 500);
    };

    tempImg.onerror = () => {
        // Fallback in case of loading error
        skeleton.remove();
        previewImage.classList.add('loaded');
        console.error('Failed to load preview image: ' + imgUrl);
    };

    tempImg.src = imgUrl;

    // View Width toggling
    widthControls.addEventListener('click', (e) => {
        const btn = e.target.closest('.control-btn');
        if (!btn) return;

        // Update active class
        widthControls.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update wrapper styling
        const viewMode = btn.dataset.view;
        previewWrapper.className = ''; // Clear existing view classes
        
        if (viewMode === 'fit') {
            previewWrapper.classList.add('view-fit');
        } else if (viewMode === 'desktop') {
            previewWrapper.classList.add('view-desktop');
        } else if (viewMode === 'retina') {
            previewWrapper.classList.add('view-retina');
        }
    });

    // Theme toggling
    themeControls.addEventListener('click', (e) => {
        const btn = e.target.closest('.control-btn');
        if (!btn) return;

        themeControls.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const theme = btn.dataset.theme;
        if (theme === 'dark') {
            document.body.className = 'theme-dark';
        } else {
            document.body.className = 'theme-light';
        }
    });

    // Scroll to Top visibility
    window.addEventListener('scroll', () => {
        if (window.scrollY > 800) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to Top action
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
