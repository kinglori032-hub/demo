import fs from "fs";
import path from "path";

interface SessionData {
  token: string;
  createdAt: number;
}

const SESSION_FILE = path.join(process.cwd(), ".sessions.json");
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

// In-memory cache
let sessionsCache: Map<string, SessionData> = new Map();
let cacheLoaded = false;

function loadSessions(): Map<string, SessionData> {
  if (cacheLoaded && sessionsCache.size > 0) {
    return sessionsCache;
  }

  try {
    if (fs.existsSync(SESSION_FILE)) {
      const data = fs.readFileSync(SESSION_FILE, "utf-8");
      const sessions = JSON.parse(data);
      sessionsCache = new Map(Object.entries(sessions) as [string, SessionData][]);
      cacheLoaded = true;
      return sessionsCache;
    }
  } catch (error) {
    console.error("Failed to load sessions from file:", error);
  }

  cacheLoaded = true;
  return sessionsCache;
}

function saveSessions(): void {
  try {
    const sessionsObj = Object.fromEntries(sessionsCache);
    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionsObj, null, 2));
  } catch (error) {
    console.error("Failed to save sessions to file:", error);
  }
}

export function createSession(token: string): void {
  const sessions = loadSessions();
  const sessionData: SessionData = {
    token,
    createdAt: Date.now(),
  };
  sessions.set(token, sessionData);
  saveSessions();
}

export function getSession(token: string): SessionData | null {
  const sessions = loadSessions();
  const sessionData = sessions.get(token);

  if (!sessionData) return null;

  // Check if session expired
  if (Date.now() - sessionData.createdAt > SESSION_TIMEOUT) {
    sessions.delete(token);
    saveSessions();
    return null;
  }

  return sessionData;
}

export function deleteSession(token: string): void {
  const sessions = loadSessions();
  sessions.delete(token);
  saveSessions();
}

export function getAllSessions(): Map<string, SessionData> {
  return loadSessions();
}

export function clearExpiredSessions(): void {
  const sessions = loadSessions();
  let hasChanges = false;

  for (const [token, data] of sessions.entries()) {
    if (Date.now() - data.createdAt > SESSION_TIMEOUT) {
      sessions.delete(token);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    saveSessions();
  }
}
