/* ============================================================
   SIGN IN PAGE  —  signin.js
   • Email + password validation
   • Show / hide password toggle
   • Loading spinner on submit
   • Success toast → redirect to index.html
   ============================================================ */

(function () {
  'use strict';

  /* ---- elements ---- */
  const form       = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passInput  = document.getElementById('password');
  const submitBtn  = document.getElementById('submitBtn');
  const eyeBtn     = document.getElementById('eyeBtn');
  const eyeOpen    = eyeBtn.querySelector('.si-eye__open');
  const eyeClosed  = eyeBtn.querySelector('.si-eye__closed');
  const errEmail   = document.getElementById('errEmail');
  const errPass    = document.getElementById('errPassword');
  const toast      = document.getElementById('siToast');
  const fieldEmail = document.getElementById('fieldEmail');
  const fieldPass  = document.getElementById('fieldPassword');

  /* ================================================================
     1. SHOW / HIDE PASSWORD
     ================================================================ */
  eyeBtn.addEventListener('click', function () {
    const isPassword = passInput.type === 'password';
    passInput.type    = isPassword ? 'text' : 'password';
    eyeOpen.style.display   = isPassword ? 'none'  : '';
    eyeClosed.style.display = isPassword ? ''      : 'none';
    eyeBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });

  /* ================================================================
     2. INLINE VALIDATION HELPERS
     ================================================================ */
  function setError(field, errEl, msg) {
    field.classList.add('has-error');
    errEl.textContent = msg;
  }

  function clearError(field, errEl) {
    field.classList.remove('has-error');
    errEl.textContent = '';
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  /* Clear error on input */
  emailInput.addEventListener('input', function () {
    if (fieldEmail.classList.contains('has-error')) {
      clearError(fieldEmail, errEmail);
    }
  });

  passInput.addEventListener('input', function () {
    if (fieldPass.classList.contains('has-error')) {
      clearError(fieldPass, errPass);
    }
  });

  /* ================================================================
     3. FORM SUBMIT
     ================================================================ */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;

    /* — Validate email — */
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      setError(fieldEmail, errEmail, 'Please enter your email.');
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      setError(fieldEmail, errEmail, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(fieldEmail, errEmail);
    }

    /* — Validate password — */
    const passVal = passInput.value;
    if (!passVal) {
      setError(fieldPass, errPass, 'Please enter your password.');
      valid = false;
    } else if (passVal.length < 6) {
      setError(fieldPass, errPass, 'Password must be at least 6 characters.');
      valid = false;
    } else {
      clearError(fieldPass, errPass);
    }

    if (!valid) return;

    /* — Show loading state — */
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    /* — Simulate auth (1.4 s) then show toast and redirect — */
    setTimeout(function () {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      /* Show success toast */
      toast.classList.add('show');

      /* Redirect after toast fades */
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 1800);
    }, 1400);
  });

  /* ================================================================
     4. SOCIAL BUTTONS — placeholder interaction
     ================================================================ */
  document.querySelectorAll('.si-social').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const provider = btn.classList.contains('si-social--google') ? 'Google' : 'Facebook';
      alert('OAuth with ' + provider + ' is not wired up in this demo.');
    });
  });

})();
