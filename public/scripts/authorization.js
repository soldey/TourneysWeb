
window.onload = async function() {
  const token = getCookie('auth_token');
  console.log(token);
  const response = await fetch(baseAPIurl + 'auth/profile', {
    method: "GET",
    headers: {
      "Authorization": 'Bearer ' + token
    }
  });
  if ((await response).status == 200) {
    return;
  }
  const result = await response.json();
  alert(result.error + " | Redirecting...");
  window.location.replace(baseUrl + "/login");
};
