
document.getElementById('tournament-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('tournament-name').value;
    const startDate = document.getElementById('tournament-startDate').value;
    const startTime = document.getElementById('tournament-startTime').value;
    const type = document.getElementById('tournament-type').value.toString().toUpperCase();

    const body = {
      name: name,
      startDate: startDate,
      startTime: startTime,
      type: type,
    };

    const response = await fetch(baseAPIurl + 'tournament', {
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