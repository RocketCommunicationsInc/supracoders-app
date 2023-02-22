export const githubCheck = () => {
  return (
    window.location.hostname.includes('github') ||
    window.location.hostname.includes('netlify') ||
    window.location.hostname === 'localhost'
  );
};
