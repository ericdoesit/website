const emailBtn = document.getElementById('email-btn');
const contactModal = document.getElementById('contact-modal');
const closeBtn = document.getElementById('close-modal');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

function getFocusable() {
  return Array.from(contactModal.querySelectorAll(
    'button:not([disabled]), input:not([tabindex="-1"]):not([disabled]), textarea:not([disabled])'
  ));
}

// Open modal
emailBtn.addEventListener('click', () => {
  contactModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const nameInput = contactForm.querySelector('[name="name"]');
    if (nameInput) nameInput.focus();
  });
});

// Close modal
function closeModal() {
  contactModal.classList.remove('active');
  document.body.style.overflow = '';
  formStatus.textContent = '';
  formStatus.className = 'contact-form__status';
  emailBtn.focus();
}

closeBtn.addEventListener('click', closeModal);

// Close modal when clicking overlay
contactModal.querySelector('.contact-modal__overlay').addEventListener('click', closeModal);

// Prevent closing when clicking content
contactModal.querySelector('.contact-modal__content').addEventListener('click', (e) => {
  e.stopPropagation();
});

// ESC to close, Tab to trap focus within modal
document.addEventListener('keydown', (e) => {
  if (!contactModal.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeModal();
    return;
  }

  if (e.key === 'Tab') {
    const focusable = getFocusable();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
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
        _honey:  contactForm.querySelector('[name="_honey"]').value,
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
