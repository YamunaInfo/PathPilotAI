async function loadProfile() {
  showLoader();
  try {
    const profile = await apiRequest('/api/profile');
    const user = profile.user || profile;
    saveUser(user);
    document.getElementById('profileName').textContent = user.fullName || user.name || 'PathPilot User';
    document.getElementById('profileEmail').textContent = user.email || 'No email provided';
    document.getElementById('profilePhone').textContent = user.phone || 'Add a phone number';
    document.getElementById('profileState').textContent = user.state || 'Add your state';
    document.getElementById('profileOccupation').textContent = user.occupation || 'Add your occupation';
  } catch (error) {
    const storedUser = getStoredUser();
    document.getElementById('profileName').textContent = storedUser.fullName || 'PathPilot User';
    document.getElementById('profileEmail').textContent = storedUser.email || 'No email provided';
    document.getElementById('profilePhone').textContent = storedUser.phone || 'Add a phone number';
    document.getElementById('profileState').textContent = storedUser.state || 'Add your state';
    document.getElementById('profileOccupation').textContent = storedUser.occupation || 'Add your occupation';
    showToast(error.message || 'Could not load profile');
  } finally {
    hideLoader();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProfile();

  document.getElementById('editProfileBtn')?.addEventListener('click', () => {
    showToast('Profile editing is ready for backend integration.');
  });

  document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
    showToast('Password change flow is ready for backend integration.');
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    clearAuth();
    window.location.href = 'login.html';
  });
});
