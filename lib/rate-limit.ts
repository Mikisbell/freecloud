const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  rateLimitStore.forEach((val, key) => {
    if (now > val.resetTime) rateLimitStore.delete(key);
  });
}

export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60_000): boolean {
  cleanup();
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= limit;
}
