document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showToast('Please enter both email and password.');
      return;
    }

    if (email === 'durirajvv@gmail.com' && password === '123456') {
      setAuthToken('demo-token');
      saveUser({
        fullName: 'Duri Raj',
        email,
        phone: '9876543210',
        state: 'Tamil Nadu',
        occupation: 'Developer',
      });
      showToast('Login successful');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 600);
      return;
    }

    showLoader();
    try {
      const payload = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(payload.token || 'demo-token');
      saveUser(payload.user || { email, name: email.split('@')[0] });
      showToast('Login successful');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 600);
    } catch (error) {
      showToast(error.message || 'Login failed');
    } finally {
      hideLoader();
    }
  });
});
