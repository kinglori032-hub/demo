type SessionData = {
  token: string;
  createdAt: number;
  expiresAt: number;
};

const sessions = new Map<string, SessionData>();

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export function createSession(token: string): SessionData {
  const session: SessionData = {
    token,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TIMEOUT,
  };

  sessions.set(token, session);

  return session;
}

export function getSession(token: string): SessionData | null {
  const session = sessions.get(token);

  if (!session) {
    return null;
  }

  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }

  return session;
}

export function deleteSession(token: string): boolean {
  return sessions.delete(token);
}

export function clearExpiredSessions(): void {
  const now = Date.now();

  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  }
}

export function getSessionCount(): number {
  clearExpiredSessions();
  return sessions.size;
}