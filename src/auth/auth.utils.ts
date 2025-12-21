export function isAccountLocked(user: { lockUntil?: Date | null }): boolean {
  if (!user.lockUntil) return false; // never locked
  return user.lockUntil.getTime() > Date.now();
}
