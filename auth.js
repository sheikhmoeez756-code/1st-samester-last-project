// ============================================
//  BagBag — Front-end demo auth (auth.js)
//  NOTE: Uses localStorage for demonstration only.
//  For real security, connect a backend + hashed passwords.
// ============================================

(function () {
    const USERS_KEY   = 'bagbag_users';
    const SESSION_KEY = 'bagbag_session';

    const getUsers  = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));
    const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    // Expose current-user helpers globally (used by the store navbar)
    window.BagBagAuth = {
        currentUser: () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'),
        logout: () => { localStorage.removeItem(SESSION_KEY); location.href = 'index.html'; }
    };

    // ---- Password show/hide toggles ----
    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            if (!input) return;
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            btn.innerHTML = show ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
        });
    });

    const showError = (msg) => {
        const box = document.getElementById('auth-error');
        if (box) { box.textContent = msg; box.classList.remove('d-none'); }
    };
    const clearError = () => document.getElementById('auth-error')?.classList.add('d-none');

    // ---- SIGN UP ----
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearError();
            const name     = document.getElementById('name').value.trim();
            const email    = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const confirm  = document.getElementById('confirm').value;

            if (name.length < 2)       return showError('Please enter your full name.');
            if (!validEmail(email))    return showError('Please enter a valid email address.');
            if (password.length < 6)   return showError('Password must be at least 6 characters.');
            if (password !== confirm)  return showError('Passwords do not match.');

            const users = getUsers();
            if (users.some(u => u.email === email)) return showError('An account with this email already exists.');

            users.push({ name, email, password });
            saveUsers(users);
            localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email }));

            const btn = signupForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="bi bi-check-lg me-2"></i> Account created!';
            setTimeout(() => location.href = 'index.html', 900);
        });
    }

    // ---- LOGIN ----
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearError();
            const email    = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            if (!validEmail(email)) return showError('Please enter a valid email address.');
            if (!password)          return showError('Please enter your password.');

            const user = getUsers().find(u => u.email === email);
            if (!user || user.password !== password) {
                return showError('Incorrect email or password.');
            }

            const remember = document.getElementById('remember')?.checked;
            localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email, remember }));

            const btn = loginForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="bi bi-check-lg me-2"></i> Welcome back!';
            setTimeout(() => location.href = 'index.html', 800);
        });
    }
})();
