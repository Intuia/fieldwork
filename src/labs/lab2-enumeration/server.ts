export interface LoginResponse {
  status: number;
  body: string;
  timing: number;
}

export interface RegistrationResponse {
  status: number;
  body: string;
  timing: number;
}

const EXISTING_USERS = ['admin', 'alice', 'bob', 'support'];
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 's3cure!';

// ── Vulnerable endpoints ──────────────────────────────

export function vulnerableLogin(username: string, password: string): LoginResponse {
  const lowerUser = username.toLowerCase().trim();

  if (!EXISTING_USERS.includes(lowerUser)) {
    return { status: 200, body: 'Unknown user', timing: 45 };
  }

  if (lowerUser === VALID_USERNAME && password === VALID_PASSWORD) {
    return { status: 302, body: 'Redirecting to dashboard', timing: 115 };
  }

  // User exists but wrong password — longer timing because the server
  // actually checked the password hash
  return { status: 200, body: 'Incorrect password', timing: 120 };
}

export function vulnerableRegistration(username: string): RegistrationResponse {
  const lowerUser = username.toLowerCase().trim();

  if (EXISTING_USERS.includes(lowerUser)) {
    return { status: 409, body: 'Username already taken', timing: 90 };
  }

  return { status: 201, body: 'Account created successfully', timing: 150 };
}

export function vulnerableRecovery(username: string): LoginResponse {
  const lowerUser = username.toLowerCase().trim();

  if (!EXISTING_USERS.includes(lowerUser)) {
    return { status: 200, body: 'No account found with that username', timing: 30 };
  }

  return { status: 200, body: 'Recovery email sent to a]***@example.com', timing: 180 };
}

// ── Hardened endpoints ────────────────────────────────

export function hardenedLogin(username: string, password: string): LoginResponse {
  const lowerUser = username.toLowerCase().trim();

  if (lowerUser === VALID_USERNAME && password === VALID_PASSWORD) {
    return { status: 302, body: 'Redirecting to dashboard', timing: 115 };
  }

  // Same response regardless of whether the user exists or the password is wrong
  return { status: 200, body: 'Invalid credentials', timing: 118 };
}

export function hardenedRegistration(_username: string): RegistrationResponse {
  return {
    status: 200,
    body: 'If this username is available, a confirmation email was sent',
    timing: 145,
  };
}

export function hardenedRecovery(_username: string): LoginResponse {
  return {
    status: 200,
    body: 'If an account exists, a recovery email was sent',
    timing: 170,
  };
}
