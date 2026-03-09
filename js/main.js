// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = '#1a2634';
        } else {
            navbar.style.background = 'var(--dark-color)';
        }
    });
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.background = 'rgba(255, 255, 255, 0.2)';
        }
    });
});

// Paystack payment function
function processPayment(amount, planName, emailInputId) {
    // REPLACE WITH YOUR LIVE KEY WHEN APPROVED
    const publicKey = 'pk_test_8347289d3007ac980c4339d8496b73244a55fb08';
    
    // Get customer email
    const emailInput = document.getElementById(emailInputId);
    const customerEmail = emailInput ? emailInput.value.trim() : '';
    
    if (!customerEmail) {
        alert('Please enter your email address');
        emailInput?.focus();
        return;
    }
    
    if (!customerEmail.includes('@') || !customerEmail.includes('.')) {
        alert('Please enter a valid email address');
        emailInput?.focus();
        return;
    }
    
    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;
    
    const handler = PaystackPop.setup({
        key: publicKey,
        email: customerEmail,
        amount: amount * 100,
        currency: 'KES',
        ref: 'CMD-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
        metadata: {
            plan_name: planName,
            site_name: 'CodeMaster',
            customer_email: customerEmail
        },
        callback: function(response) {
            button.innerHTML = originalText;
            button.disabled = false;
            
            // Store purchase in localStorage
            const purchases = JSON.parse(localStorage.getItem('purchased_courses') || '[]');
            purchases.push({
                course: planName,
                reference: response.reference,
                date: new Date().toISOString()
            });
            localStorage.setItem('purchased_courses', JSON.stringify(purchases));
            
            alert(`✅ Payment successful! Reference: ${response.reference}\n\nYou now have access to ${planName}. Check your email for details.`);
            window.location.href = `success.html?ref=${response.reference}&plan=${encodeURIComponent(planName)}`;
        },
        onClose: function() {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });
    
    handler.openIframe();
}

// Contact form handler
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // In a real app, you'd send this to a backend
    console.log('Form submitted:', Object.fromEntries(formData));
    
    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    
    return false;
}

// Course enrollment
function enrollCourse(courseName, price) {
    localStorage.setItem('pending_enrollment', JSON.stringify({
        course: courseName,
        price: price
    }));
    
    window.location.href = `../index.html#premium?course=${encodeURIComponent(courseName)}&price=${price}`;
}

// Check if user has access to course
function hasCourseAccess(courseName) {
    const purchases = JSON.parse(localStorage.getItem('purchased_courses') || '[]');
    return purchases.some(p => p.course === courseName);
}

// Load course lessons
function loadCourseLessons(courseId) {
    // This would come from your backend in a real app
    const lessons = {
        'html-css': [
            { number: 1, title: 'Introduction to HTML', duration: '15:30' },
            { number: 2, title: 'HTML Headings and Paragraphs', duration: '18:45' },
            { number: 3, title: 'HTML Lists and Links', duration: '22:10' },
            { number: 4, title: 'HTML Images and Multimedia', duration: '20:30' },
            { number: 5, title: 'Introduction to CSS', duration: '25:30' },
            { number: 6, title: 'CSS Box Model', duration: '28:20' },
            { number: 7, title: 'CSS Flexbox', duration: '32:15' },
            { number: 8, title: 'Build Your First Website', duration: '45:00' }
        ]
    };
    
    return lessons[courseId] || [];
}