
document.getElementById('password-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;

    const body = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    const response = await fetch(baseAPIurl + 'auth/change-password', {
      method: 'PATCH',
      headers: {
        "Content-type": "application/json",
        "Authorization": 'Bearer ' + getCookie('auth_token'),
      },
      body: JSON.stringify(body),
    });
    if ((await response).status == 200) {
      const result = await response.json();

      document.cookie = "auth_token=" + result.token;
      return;
    }
    const result = await response.json();
    console.log(result);
    alert(result.error);
  });