import { useState, type FormEvent, type ReactNode } from "react";
import "./auth-flow.css";

type AuthPage = "sign-in" | "invitation" | "forgot" | "reset" | "setup";

function AuthHeader() {
  return (
    <header className="auth-header">
      <strong>tably.ng</strong>
    </header>
  );
}

function AuthIcon({ children }: { children: ReactNode }) {
  return <span className="auth-icon">{children}</span>;
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PasswordField({
  label,
  placeholder,
  autoComplete,
}: {
  label: string;
  placeholder: string;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="auth-field">
      <span>{label}</span>
      <span className="auth-password-input">
        <input
          required
          minLength={8}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => setVisible((current) => !current)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5Z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        </button>
      </span>
    </label>
  );
}

function BackToSignIn({ onClick }: { onClick: () => void }) {
  return (
    <button className="auth-back" type="button" onClick={onClick}>
      <span aria-hidden="true">←</span> Back to sign in
    </button>
  );
}

function CenteredAuthPage({
  children,
  onBack,
}: {
  children: ReactNode;
  onBack?: () => void;
}) {
  return (
    <main className="auth-centered-page">
      {onBack && <BackToSignIn onClick={onBack} />}
      <section className="auth-centered-content">{children}</section>
    </main>
  );
}

function SignInPage({
  onAuthenticated,
  onForgotPassword,
  onInvitation,
}: {
  onAuthenticated: () => void;
  onForgotPassword: () => void;
  onInvitation: () => void;
}) {
  function submit(event: FormEvent) {
    event.preventDefault();
    onAuthenticated();
  }

  return (
    <main className="auth-sign-in">
      <figure aria-label="Warm restaurant still life" />
      <section>
        <form onSubmit={submit}>
          <header>
            <h1>Welcome back</h1>
            <p>Sign in to manage your restaurant with Tably.</p>
          </header>
          <label className="auth-field">
            <span>Email address</span>
            <input
              required
              type="email"
              placeholder="you@restaurant.com"
              autoComplete="email"
            />
          </label>
          <PasswordField
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="auth-inline-action"
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>
          <button className="auth-primary auth-primary-dark" type="submit">
            Sign in
          </button>
          <button className="auth-invitation-note" type="button" onClick={onInvitation}>
            <LockIcon />
            <span>Access is invitation only.</span>
          </button>
        </form>
      </section>
    </main>
  );
}

function InvitationPage({ onAccept }: { onAccept: () => void }) {
  return (
    <CenteredAuthPage>
      <AuthIcon><MailIcon /></AuthIcon>
      <header className="auth-page-heading">
        <h1>You’re invited to Tably</h1>
        <p>You’ve been invited to manage a restaurant on Tably.ng.</p>
      </header>
      <ul className="auth-invitation-benefits">
        <li><AuthIcon><span aria-hidden="true">⌂</span></AuthIcon><span>Everything you need to run your restaurant, in one place.</span></li>
        <li><AuthIcon><span aria-hidden="true">↗</span></AuthIcon><span>Real-time orders, menu management and insights.</span></li>
        <li><AuthIcon><span aria-hidden="true">◎</span></AuthIcon><span>Built for restaurants. Designed for teams.</span></li>
      </ul>
      <button className="auth-primary" type="button" onClick={onAccept}>
        Accept invitation
      </button>
      <small className="auth-expiry">Invitation link expires in 7 days.</small>
    </CenteredAuthPage>
  );
}

function ForgotPasswordPage({
  onBack,
  onSubmitted,
}: {
  onBack: () => void;
  onSubmitted: () => void;
}) {
  return (
    <CenteredAuthPage onBack={onBack}>
      <AuthIcon><LockIcon /></AuthIcon>
      <header className="auth-page-heading">
        <h1>Forgot password?</h1>
        <p>Enter your email address and we’ll send you a link to reset your password.</p>
      </header>
      <form
        className="auth-centered-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitted();
        }}
      >
        <label className="auth-field">
          <span>Email address</span>
          <input required type="email" placeholder="you@restaurant.com" autoComplete="email" />
        </label>
        <button className="auth-primary auth-primary-dark" type="submit">Send reset link</button>
      </form>
    </CenteredAuthPage>
  );
}

function ResetPasswordPage({
  onBack,
  onReset,
}: {
  onBack: () => void;
  onReset: () => void;
}) {
  return (
    <CenteredAuthPage onBack={onBack}>
      <AuthIcon><LockIcon /></AuthIcon>
      <header className="auth-page-heading">
        <h1>Reset your password</h1>
        <p>Enter your new password below.</p>
      </header>
      <form
        className="auth-centered-form"
        onSubmit={(event) => {
          event.preventDefault();
          onReset();
        }}
      >
        <PasswordField label="New password" placeholder="Create a new password" autoComplete="new-password" />
        <PasswordField label="Confirm password" placeholder="Confirm your new password" autoComplete="new-password" />
        <button className="auth-primary" type="submit">Reset password</button>
      </form>
    </CenteredAuthPage>
  );
}

const setupSteps = ["Create password", "Your restaurant", "Location", "Review"];

function SetupPage({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  return (
    <main className="auth-setup-page">
      <ol className="auth-setup-progress" aria-label="Account setup progress">
        {setupSteps.map((label, index) => (
          <li key={label} className={index <= step ? "active" : ""}>
            <span>{index + 1}</span>
            <small>{label}</small>
          </li>
        ))}
      </ol>
      <section className="auth-setup-content">
        <header className="auth-page-heading">
          <h1>{setupSteps[step]}</h1>
          <p>
            {step === 0 && "Create a password to secure your account and get started."}
            {step === 1 && "Tell us which restaurant this workspace belongs to."}
            {step === 2 && "Add the primary location for this restaurant."}
            {step === 3 && "Review the workspace details before you continue."}
          </p>
        </header>
        <form
          className="auth-centered-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (step === setupSteps.length - 1) onComplete();
            else setStep((current) => current + 1);
          }}
        >
          {step === 0 && (
            <>
              <PasswordField label="Password" placeholder="Create a strong password" autoComplete="new-password" />
              <PasswordField label="Confirm password" placeholder="Confirm your password" autoComplete="new-password" />
            </>
          )}
          {step === 1 && (
            <>
              <label className="auth-field"><span>Restaurant name</span><input required defaultValue="Zuma Grill" /></label>
              <label className="auth-field"><span>Restaurant type</span><input required placeholder="Fine dining, casual, café…" /></label>
            </>
          )}
          {step === 2 && (
            <>
              <label className="auth-field"><span>Location name</span><input required defaultValue="Maitama branch" /></label>
              <label className="auth-field"><span>Address</span><input required placeholder="Street address, city" /></label>
            </>
          )}
          {step === 3 && (
            <dl className="auth-setup-review">
              <div><dt>Restaurant</dt><dd>Zuma Grill</dd></div>
              <div><dt>Location</dt><dd>Maitama branch</dd></div>
              <div><dt>Role</dt><dd>Restaurant manager</dd></div>
            </dl>
          )}
          <div className="auth-setup-actions">
            {step > 0 && <button type="button" onClick={() => setStep((current) => current - 1)}>Back</button>}
            <button className="auth-primary" type="submit">
              {step === setupSteps.length - 1 ? "Finish setup" : "Continue"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export function AuthFlow({
  onAuthenticated,
  nativeRuntime = false,
}: {
  onAuthenticated: () => void;
  nativeRuntime?: boolean;
}) {
  const [page, setPage] = useState<AuthPage>("sign-in");

  return (
    <section className={`auth-shell${nativeRuntime ? " auth-shell-native" : ""}`}>
      {!nativeRuntime && <AuthHeader />}
      {page === "sign-in" && (
        <SignInPage
          onAuthenticated={onAuthenticated}
          onForgotPassword={() => setPage("forgot")}
          onInvitation={() => setPage("invitation")}
        />
      )}
      {page === "invitation" && <InvitationPage onAccept={() => setPage("setup")} />}
      {page === "forgot" && (
        <ForgotPasswordPage onBack={() => setPage("sign-in")} onSubmitted={() => setPage("reset")} />
      )}
      {page === "reset" && (
        <ResetPasswordPage onBack={() => setPage("sign-in")} onReset={() => setPage("sign-in")} />
      )}
      {page === "setup" && <SetupPage onComplete={onAuthenticated} />}
    </section>
  );
}
