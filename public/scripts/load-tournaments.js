let dataContainer;

document.addEventListener('DOMContentLoaded', async () => {
  dataContainer = document.getElementById('tournament-list');

  const token = getCookie('auth_token');
  const response = await fetch(baseAPIurl + "tournament", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
    }
  });
  let items;
  console.log(await response);
  if ((await response).status == 200) {
    const result = await response.json();
    console.log(result);
    items = result.result;
  }
  console.log(items);
  let values = [];
  items.forEach((item) => {
    values.push({
      name: item.name,
      startDate: item.startDate,
      startTime: item.startTime,
      count: item.participants.length,
      type: item.type,
      id: item.id,
    });
  });

  localStorage.setItem('tournaments_key', JSON.stringify(values));

  if (localStorage.getItem('tournaments_key')) {
    const schedule = JSON.parse(localStorage.getItem('tournaments_key'));
    schedule.forEach((Tournament) => {
      addTournamentToMarkup(Tournament);
    });
  }
})

const addTournamentToMarkup = (Tournament) => {
  const markup = `
        <tr id=${Tournament.id}>
          <td>${Tournament.name}</td>
          <td>${Tournament.startDate} ${Tournament.startTime}</td>
          <td>${Tournament.count}</td>
          <td>${Tournament.type == "SOLO" ? "Solo" : "Team"}</td>
          <td><button onclick="joinTournament('${Tournament.id}')">Вступить</button></td>
        </tr>
      `;
  dataContainer.insertAdjacentHTML('beforeend', markup);
}

async function joinTournament(id) {
  const body = {
    id: id,
    type: "solo"
  }
  const response = await fetch(baseAPIurl + 'tournament/apply', {
    method: 'POST',
    headers: {
      "Content-type": 'application/json',
      "Authorization": 'Bearer ' + getCookie('auth_token')
    },
    body: JSON.stringify(body),
  });
  if ((await response).status == 201) {
    return;
  }
  const result = await response.json();
  alert(result.error);
}
