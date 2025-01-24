let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // التمرير للأسفل - إخفاء شريط التنقل
        navbar.style.top = '-70px';
    } else {
        // التمرير للأعلى - إظهار شريط التنقل
        navbar.style.top = '0';
    }
    lastScrollTop = scrollTop;
});
document.getElementById('menu-toggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    if (sidebar.style.right === '0px') {
        sidebar.style.right = '-250px';
        mainContent.style.marginRight = '0';
    } else {
        sidebar.style.right = '0px';
        mainContent.style.marginRight = '250px';
    }
});

document.querySelectorAll('.sidebar ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.main-content div').forEach(section => {
            section.classList.remove('active');
        });
        const target = this.getAttribute('href').substring(1);
        document.getElementById(target).classList.add('active');
    });
});

// // Set default active section
// document.getElementById('dashboard').classList.add('active');








