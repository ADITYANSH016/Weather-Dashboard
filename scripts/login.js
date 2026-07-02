import { validateUser } from './auth-utils.js';

const loginForm = document.getElementById('loginForm');
const message = document.getElementById('loginMessage');

async function loadUsers() {
  const response = await fetch('./data/users.json');
  if (!response.ok) {
    throw new Error('Unable to load user data.');
  }
  const data = await response.json();
  return data.users;
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '').trim();

  try {
    const users = await loadUsers();
    const result = validateUser(users, email, password);

    if (!result.success) {
      message.textContent = result.message;
      return;
    }

    localStorage.setItem('weatherUser', JSON.stringify(result.user));
    window.location.href = './dashboard.html';
  } catch (error) {
    message.textContent = 'There was a problem loading your account. Please try again.';
    console.error(error);
  }
});
