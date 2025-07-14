export function renderRegister(){
    return `
    <main class="register-container">
        <form  id="form-register">
            <h2>create account</h2>
            <input type="text" id="register-name" placeholder="enter your full name" required>
            <input type="text" id="register-username" placeholder="enter your username" required>
            <input type="email"  id="register-email" placeholder="enter your email" required>
            <input type="password"  id="register-password" placeholder="enter your password" required>
            <button type="submit">register</button>
            <div class="links">
                <a href="/login" data-link>do you have an account? sign in </a>>
            </div>
        </form>
    </main>
    `;
}