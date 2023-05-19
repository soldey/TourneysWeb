
document.getElementById('team-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const teamName = document.getElementById('team-name').value;

    const body = {
      name: teamName,
    };

    const response = await fetch(baseAPIurl + 'team/apply', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        "Authorization": 'Bearer ' + getCookie('auth_token'),
      },
      body: JSON.stringify(body),
    });
    if ((await response).status == 201) {
      const result = await response.json();
      console.log(result);
      return;
    }
    const result = await response.json();
    console.log(result);
    alert(result.error);
  });