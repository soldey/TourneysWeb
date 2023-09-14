let dataContainer;

document.addEventListener('DOMContentLoaded', async () => {
  dataContainer = document.getElementById('stat-list');

  const token = getCookie('auth_token');
  const response = await fetch(baseAPIurl + "monitor/all?page=1&take=50", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
    }
  });
  let items = [];
  console.log(await response);
  if ((await response).status == 200) {
    const result = await response.json();
    console.log(result);
    items = result.result;
  }
  console.log(items);
  let values = [];
  for (let i = 0; i < items.length; i++) {
    values.push({
      i: i,
      endpoint: items[i].endpoint,
      count: items[i].count,
      id: items[i].id,
    });
  }

  localStorage.setItem('stats_key', JSON.stringify(values));

  if (localStorage.getItem('stats_key')) {
    const schedule = JSON.parse(localStorage.getItem('stats_key'));
    schedule.forEach((Stat) => {
      addTournamentToMarkup(Stat);
    });
  }
})

const addTournamentToMarkup = (Stat) => {
  const markup = `
        <tr id=${Stat.id}>
          <td>${Stat.i}</td>
          <td><a href='${Stat.endpoint}'>${Stat.endpoint}</a></td>
          <td>${Stat.count}</td>
        </tr>
      `;
  dataContainer.insertAdjacentHTML('beforeend', markup);
}
