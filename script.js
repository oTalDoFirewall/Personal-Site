// ============================================
// PORTFOLIO - SCRIPT (STABLE FIX)
// ============================================

const navLinks = document.querySelectorAll('.nav-link');

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ===============================
// CLICK HANDLER ÚNICO
// ===============================
document.addEventListener('click', (e) => {
    const link = e.target.closest('a.nav-link, a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');

    if (!href || href.startsWith('http') || href.startsWith('mailto')) return;

    if (href.includes('#')) {
        e.preventDefault();

        const [page, hash] = href.split('#');

        const targetPage = page || 'index.html';
        const targetHash = '#' + hash;

        const isSamePage = (targetPage === currentPage);

        if (isSamePage) {
            const target = document.querySelector(targetHash);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            return;
        }

        sessionStorage.setItem('scrollTarget', targetHash);
        window.location.href = targetPage;
    }
});


// ===============================
// RESTORE SCROLL ENTRE PÁGINAS
// ===============================
window.addEventListener('load', () => {
    const hash = sessionStorage.getItem('scrollTarget');
    if (!hash) return;

    sessionStorage.removeItem('scrollTarget');

    const target = document.querySelector(hash);
    if (!target) return;

    setTimeout(() => {
        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
        });

        history.replaceState(null, null, window.location.pathname + hash);
    }, 120);
});


// ===============================
// ACTIVE LINK (CONTROLADO)
// ===============================
function setActive(selector) {
    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        let normalized = href;

        if (href.startsWith('#')) {
            normalized = href;
        } else if (href.includes('#')) {
            normalized = '#' + href.split('#')[1];
        } else if (href.includes('.html')) {
            normalized = href;
        }

        const match =
            normalized === selector ||
            href === selector;

        link.classList.toggle('active', match);
    });
}


// ===============================
// SCROLL SPY (SÓ INDEX.HTML)
// ===============================
const sections = document.querySelectorAll('section[id]');

let observer = null;

if (currentPage === 'index.html' && sections.length > 0) {

    observer = new IntersectionObserver((entries) => {
        let bestMatch = null;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bestMatch = entry.target.id;
            }
        });

        if (bestMatch) {
            setActive('#' + bestMatch);
        }

    }, {
        threshold: 0.6
    });

    sections.forEach(section => observer.observe(section));
}


// ===============================
// ANIMAÇÕES DE CARDS
// ===============================
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card, .service-card, .project-card')
.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = '0.6s ease';
    cardObserver.observe(el);
});


// ===============================
// INIT ACTIVE STATE (FIXADO POR PÁGINA)
// ===============================
document.addEventListener('DOMContentLoaded', () => {

    if (currentPage === 'index.html' || currentPage === '') {
        setActive('index.html');

    } else if (currentPage === 'projects.html') {
        setActive('projects.html');

    } else {
        setActive(currentPage);
    }
});
