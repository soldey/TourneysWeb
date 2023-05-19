document.addEventListener('DOMContentLoaded', () => {

  document.addEventListener('click', (e) => {
    if (e.target.closest('.nav__button-logout')) {
      performLogout('auth_token')
    }
  });
});

const performLogout = (name) => {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  window.location.replace(baseUrl);
}