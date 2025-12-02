export function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

export function signIn() {
    localStorage.setItem('isAuthenticated', 'true');
}

export function signOut() {
    localStorage.removeItem('isAuthenticated');
}