document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const state = document.getElementById('state').value.trim();
    const occupation = document.getElementById('occupation').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!fullName || !email || !phone || !state || !occupation || !password || !confirmPassword) {
      showToast('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.');
      return;
    }

    showLoader();
    try {
      const payload = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, phone, state, occupation, password }),
      });
      setAuthToken(payload.token || 'demo-token');
      saveUser(payload.user || { fullName, email, phone, state, occupation });
      showToast('Registration successful');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 600);
    } catch (error) {
      showToast(error.message || 'Registration failed');
    } finally {
      hideLoader();
    }
  });
});
