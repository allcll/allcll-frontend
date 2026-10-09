export function isValidSession() {
  return getSessionConfig() !== null;
}

export function getSessionConfig() {
  const session = localStorage.getItem('session') || '';
  const userId = localStorage.getItem('userId') || '';

  if (!session) {
    return null;
  }

  return { session, userId };
}
