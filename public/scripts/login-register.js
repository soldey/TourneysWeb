let login_form;
let register_form;

(function() {
  document.addEventListener("DOMContentLoaded", () => {
    login_form = document.querySelector('#login-form');
    register_form = document.querySelector('#register-form');
  })
})();

document.addEventListener('DOMContentLoaded', () => {

  login_form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const login_formData = new FormData(e.target);
    const values = Object.fromEntries(login_formData);
    if (!values.login || !values.password) {
      alert('Нет логина или пароля');
      return;
    }
    InitializeLogin(values);
  });

  register_form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const register_formData = new FormData(e.target);
    const values = Object.fromEntries(register_formData);
    if (!values.login || !values.password) {
      alert('Нет логина или пароля');
      return;
    }
    InitializeRegister(values);
  });
})

const InitializeLogin = async (credentials) => {
  let body = {
    "email": credentials.login,
    "password": credentials.password,
  };

  const loginUrl = baseAPIurl + "auth/signin";
  PerformCallback(loginUrl, body);
}

const InitializeRegister = async (credentials) => {
  let body = {
    "email": credentials.login,
    "password": credentials.password,
    "role": "USER",
    "firstName": credentials.firstName,
    "lastName": credentials.lastName,
  };

  const registerUrl = baseAPIurl + "auth/signup";
  PerformCallback(registerUrl, body);
}

const PerformCallback = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if ((await response).status == 201) {
    let result = await response.json();
    document.cookie = "auth_token=" + result.token;
    const response_profile = await fetch(baseAPIurl + "auth/profile", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + getCookie('auth_token'),
      }
    });
    console.log(await response_profile.json());
    window.location.href = baseUrl;
    return;
  }
  alert((await response).json().error);
}
