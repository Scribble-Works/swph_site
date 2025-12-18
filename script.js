// EduTech Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initScrollToTop();
    initCounterAnimation();
    initNavbarScroll();
    initFormValidation();
    initSmoothScroll();
    initAnimateOnScroll();
});

// Scroll to Top Button
function initScrollToTop() {
    // Create scroll to top button if it doesn't exist
    if (!document.querySelector('.scroll-to-top')) {
        const scrollBtn = document.createElement('div');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<span class="material-icons">arrow_upward</span>';
        document.body.appendChild(scrollBtn);
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        const scrollBtn = document.querySelector('.scroll-to-top');
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Animation speed
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.innerText);
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target.toLocaleString();
        }
    };
    
    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('shadow');
        } else {
            navbar.classList.remove('shadow');
        }
    });
}

// Form Validation
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!firstName || !lastName || !email || !subject || !message) {
                showAlert('Please fill in all required fields', 'danger');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Please enter a valid email address', 'danger');
                return;
            }
            
            // Simulate form submission
            showLoadingSpinner(contactForm);
            
            setTimeout(() => {
                hideLoadingSpinner(contactForm);
                showAlert('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
                contactForm.reset();
            }, 2000);
        });
    }
}

// Show Alert Message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const form = document.getElementById('contactForm');
    if (form) {
        form.insertAdjacentElement('beforebegin', alertDiv);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
        
        // Scroll to alert
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Show Loading Spinner
function showLoadingSpinner(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Sending...
    `;
}

// Hide Loading Spinner
function hideLoadingSpinner(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
        <span class="material-icons align-middle me-2">send</span>
        Send Message
    `;
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty anchors and bootstrap toggles
            if (href === '#' || this.getAttribute('data-bs-toggle')) {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animate on Scroll
function initAnimateOnScroll() {
    const animatedElements = document.querySelectorAll('.feature-card, .course-card, .testimonial-card, .team-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('loading');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// Course Filter (for courses page)
function filterCourses() {
    const searchInput = document.querySelector('input[placeholder="Search courses..."]');
    const categorySelect = document.querySelectorAll('.form-select')[0];
    const levelSelect = document.querySelectorAll('.form-select')[1];
    
    if (!searchInput) return;
    
    const filterHandler = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect?.value || 'all';
        const selectedLevel = levelSelect?.value || 'all';
        
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
            const badges = Array.from(card.querySelectorAll('.badge')).map(b => b.textContent.toLowerCase());
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || badges.some(b => b.includes(selectedCategory.toLowerCase()));
            const matchesLevel = selectedLevel === 'all' || badges.some(b => b.includes(selectedLevel.toLowerCase()));
            
            const cardParent = card.closest('.col-lg-4');
            if (matchesSearch && matchesCategory && matchesLevel) {
                cardParent.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                cardParent.style.display = 'none';
            }
        });
    };
    
    searchInput.addEventListener('input', filterHandler);
    categorySelect?.addEventListener('change', filterHandler);
    levelSelect?.addEventListener('change', filterHandler);
}

// Initialize course filtering if on courses page
if (window.location.pathname.includes('courses')) {
    document.addEventListener('DOMContentLoaded', filterCourses);
}

// Enroll Button Handler
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn') && e.target.closest('.btn').textContent.includes('Enroll Now')) {
        e.preventDefault();
        showEnrollModal(e.target.closest('.course-card'));
    }
});

// Show Enrollment Modal
function showEnrollModal(courseCard) {
    const courseTitle = courseCard.querySelector('.card-title').textContent;
    const coursePrice = courseCard.querySelector('.text-primary.fs-5')?.textContent || courseCard.querySelector('.fw-bold.text-primary')?.textContent;
    
    const modal = `
        <div class="modal fade" id="enrollModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Enroll in Course</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <h6 class="fw-bold mb-3">${courseTitle}</h6>
                        <p class="mb-3">Price: <span class="text-primary fw-bold">${coursePrice}</span></p>
                        <form>
                            <div class="mb-3">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email Address</label>
                                <input type="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Payment Method</label>
                                <select class="form-select">
                                    <option>Credit Card</option>
                                    <option>PayPal</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="completeEnrollment()">Complete Enrollment</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('enrollModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Show modal
    const enrollModal = new bootstrap.Modal(document.getElementById('enrollModal'));
    enrollModal.show();
    
    // Clean up when modal is closed
    document.getElementById('enrollModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Complete Enrollment
window.completeEnrollment = function() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('enrollModal'));
    modal.hide();
    
    // Show success message
    setTimeout(() => {
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-5';
        successAlert.style.zIndex = '9999';
        successAlert.innerHTML = `
            <strong>Success!</strong> You have successfully enrolled in the course. Check your email for details.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(successAlert);
        
        setTimeout(() => {
            successAlert.remove();
        }, 5000);
    }, 300);
};

// Add hover effect to cards
document.addEventListener('mouseover', function(e) {
    const card = e.target.closest('.card');
    if (card && (card.classList.contains('feature-card') || card.classList.contains('course-card'))) {
        card.style.transition = 'all 0.3s ease';
    }
});

// Mobile Menu Toggle
const navbarToggler = document.querySelector('.navbar-toggler');
if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
        this.classList.toggle('active');
    });
}

// Add loading class to elements as they enter viewport
const observeElements = () => {
    const elements = document.querySelectorAll('.card, .btn, .badge');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    elements.forEach(el => observer.observe(el));
};

// Initialize on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Log page views (for analytics - you can replace this with actual analytics)
console.log(`Page loaded: ${window.location.pathname}`);
console.log('EduTech Website v1.0 - All systems operational');
