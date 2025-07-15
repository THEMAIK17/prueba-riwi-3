export function renderLogin(){
    return `
    <main class="login-container">
        <h2>login</h2>
        <form  id="form-login">
            <input type="email"  id="login-email" placeholder="enter your email"required>
            <input type="password"  id="login-password" placeholder="enter your password" required>
            <button type="submit">get into</button>
            <div class="links">
                <a href="/register" data-link>  you don't have an account? register</a>
            </div>
        </form>
    </main>
    `;
}