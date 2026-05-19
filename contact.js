const emailBtn = document.getElementById('email-btn');
const contactModal = document.getElementById('contact-modal');
const closeBtn = document.getElementById('close-modal');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Open modal
emailBtn.addEventListener('click', () => {
  contactModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

// Close modal
function closeModal() {
  contactModal.classList.remove('active');
  document.body.style.overflow = '';
  formStatus.textContent = '';
  formStatus.className = 'contact-form__status';
}

closeBtn.addEventListener('click', closeModal);

// Close modal when clicking overlay
contactModal.querySelector('.contact-modal__overlay').addEventListener('click', closeModal);

// Prevent closing when clicking content
contactModal.querySelector('.contact-modal__content').addEventListener('click', (e) => {
  e.stopPropagation();
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('active')) {
    closeModal();
  }
});

// Handle form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  formStatus.textContent = '';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    contactForm.querySelector('[name="name"]').value,
        email:   contactForm.querySelector('[name="email"]').value,
        subject: contactForm.querySelector('[name="subject"]').value,
        message: contactForm.querySelector('[name="message"]').value,
      })
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      formStatus.textContent = 'Message sent! Thanks for reaching out.';
      formStatus.className = 'contact-form__status success';
      contactForm.reset();
      setTimeout(() => { closeModal(); }, 2000);
    } else {
      throw new Error(data.error || 'Form submission failed');
    }
  } catch (error) {
    formStatus.textContent = 'Error sending message. Please try again.';
    formStatus.className = 'contact-form__status error';
    console.error('Error:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});
