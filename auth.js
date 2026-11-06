// Client-side authentication for the academic demonstration.
// This hash is deterministic but not cryptographically secure. Real applications
// must authenticate on a backend and use server-side password hashing.
const AUTH_USERS_KEY = 'users';
const AUTH_SESSION_KEY = 'currentUserId';

function getUsers() {
  let stored = localStorage.getItem(AUTH_USERS_KEY);
  const isLegacyData = !stored && localStorage.getItem('studentUsers');
  if (isLegacyData) stored = localStorage.getItem('studentUsers');
  if (!stored) return [];

  try {
    const users = JSON.parse(stored);
    if (!Array.isArray(users)) {
      console.error('Stored user data is not a valid list.');
      return [];
    }
    const validUsers = users.filter(function (user) {
      return user && typeof user.id === 'string' &&
        typeof user.email === 'string' && typeof user.passwordHash === 'string';
    });
    if (isLegacyData) saveUsers(validUsers);
    return validUsers;
  } catch (error) {
    console.error('Unable to read stored user data.', error);
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Unable to save user data.', error);
    return false;
  }
}

function simpleHash(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return 'demo-fnv1a-' + (hash >>> 0).toString(16).padStart(8, '0');
}

function getCurrentUser() {
  let userId = localStorage.getItem(AUTH_SESSION_KEY);
  if (!userId) {
    userId = localStorage.getItem('studentCurrentUserId');
    if (userId) {
      try {
        localStorage.setItem(AUTH_SESSION_KEY, userId);
      } catch (error) {
        console.error('Unable to migrate the login session.', error);
      }
    }
  }
  if (!userId) return null;

  const user = getUsers().find(function (entry) {
    return entry.id === userId;
  });
  if (!user) return null;

  return { id: user.id, name: user.name, email: user.email };
}

function requireLogin() {
  if (!getCurrentUser()) {
    window.location.replace('login.html');
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem('studentCurrentUserId');
  window.location.replace('login.html');
}

function showAuthMessage(id, message, type) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = message;
  element.className = 'form-message ' + (type || '');
  element.hidden = !message;
}

function signup(event) {
  if (event) event.preventDefault();
  showAuthMessage('signup-error', '', '');
  showAuthMessage('signup-message', '', '');

  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;
  const confirmation = document.getElementById('signup-confirm').value;

  if (!name || !email || !password || !confirmation) {
    showAuthMessage('signup-error', 'All fields are required', 'error');
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showAuthMessage('signup-error', 'Enter a valid email address', 'error');
    return false;
  }
  if (password.length < 6) {
    showAuthMessage('signup-error', 'Password must be at least 6 characters', 'error');
    return false;
  }
  if (password !== confirmation) {
    showAuthMessage('signup-error', 'Passwords do not match', 'error');
    return false;
  }

  const users = getUsers();
  if (users.some(function (user) { return user.email.toLowerCase() === email; })) {
    showAuthMessage('signup-error', 'Email already registered', 'error');
    return false;
  }

  users.push({
    id: 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10),
    name: name,
    email: email,
    passwordHash: simpleHash(password)
  });
  if (!saveUsers(users)) {
    showAuthMessage('signup-error', 'Your account could not be saved. Check browser storage and try again.', 'error');
    return false;
  }

  showAuthMessage('signup-message', 'Account created', 'success');
  document.getElementById('signup-form').reset();
  window.setTimeout(function () { window.location.assign('login.html'); }, 1000);
  return true;
}

function login(event) {
  if (event) event.preventDefault();
  showAuthMessage('login-error', '', '');
  showAuthMessage('login-message', '', '');

  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  if (!email || !password) {
    showAuthMessage('login-error', 'All fields are required', 'error');
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showAuthMessage('login-error', 'Enter a valid email address', 'error');
    return false;
  }

  const user = getUsers().find(function (entry) {
    return entry.email.toLowerCase() === email && entry.passwordHash === simpleHash(password);
  });
  if (!user) {
    showAuthMessage('login-error', 'Invalid email or password', 'error');
    return false;
  }

  try {
    localStorage.setItem(AUTH_SESSION_KEY, user.id);
  } catch (error) {
    console.error('Unable to save the login session.', error);
    showAuthMessage('login-error', 'Your session could not be saved. Check browser storage and try again.', 'error');
    return false;
  }

  window.location.assign('index.html');
  return true;
}

function updateProfile(event) {
  if (event) event.preventDefault();
  showAuthMessage('profile-message', '', '');

  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.replace('login.html');
    return false;
  }

  const name = document.getElementById('profile-name').value.trim();
  if (!name) {
    showAuthMessage('profile-message', 'All fields are required', 'error');
    return false;
  }

  const users = getUsers();
  const user = users.find(function (entry) { return entry.id === currentUser.id; });
  if (!user) {
    showAuthMessage('profile-message', 'Your account could not be found. Please log in again.', 'error');
    return false;
  }
  user.name = name;
  if (!saveUsers(users)) {
    showAuthMessage('profile-message', 'Your profile could not be saved. Check browser storage and try again.', 'error');
    return false;
  }
  showAuthMessage('profile-message', 'Profile updated', 'success');
  updateUserGreeting();
  return true;
}

function changePassword(event) {
  if (event) event.preventDefault();
  showAuthMessage('password-message', '', '');

  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.replace('login.html');
    return false;
  }
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  if (!currentPassword || !newPassword) {
    showAuthMessage('password-message', 'All fields are required', 'error');
    return false;
  }
  const users = getUsers();
  const user = users.find(function (entry) { return entry.id === currentUser.id; });
  if (!user) {
    showAuthMessage('password-message', 'Your account could not be found. Please log in again.', 'error');
    return false;
  }
  if (simpleHash(currentPassword) !== user.passwordHash) {
    showAuthMessage('password-message', 'Current password is incorrect', 'error');
    return false;
  }
  if (newPassword.length < 6) {
    showAuthMessage('password-message', 'Password must be at least 6 characters', 'error');
    return false;
  }

  user.passwordHash = simpleHash(newPassword);
  if (!saveUsers(users)) {
    showAuthMessage('password-message', 'Your password could not be saved. Check browser storage and try again.', 'error');
    return false;
  }
  document.getElementById('password-form').reset();
  showAuthMessage('password-message', 'Password changed', 'success');
  return true;
}

function updateUserGreeting() {
  const greeting = document.getElementById('user-greeting');
  const user = getCurrentUser();
  if (greeting && user) greeting.textContent = 'Hello, ' + (user.name || user.email);
}

document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signup-form');
  if (signupForm) signupForm.addEventListener('submit', signup);

  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', login);

  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    const user = getCurrentUser();
    if (user) {
      document.getElementById('profile-name').value = user.name || '';
      document.getElementById('profile-email').value = user.email;
    }
    profileForm.addEventListener('submit', updateProfile);
  }

  const passwordForm = document.getElementById('password-form');
  if (passwordForm) passwordForm.addEventListener('submit', changePassword);

  const logoutButton = document.getElementById('logout-btn');
  if (logoutButton) logoutButton.addEventListener('click', logout);
  updateUserGreeting();
});
