import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="brand-mark">S</div>
        <p className="eyebrow">SKILLVERSE ACADEMY</p>
        <h1>Admin Login</h1>
        <p className="muted">Sign in to manage your courses.</p>
        <LoginForm />
      </div>
    </main>
  );
}