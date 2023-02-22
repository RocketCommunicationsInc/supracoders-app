export const githubCheck = () => {
  return (
    window.location.hostname.includes('github') ||
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname === 'localhost'
  );
};
