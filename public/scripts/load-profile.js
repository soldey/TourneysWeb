let dataContainer;

const deleteItem = async (item) => {
  const token = getCookie("auth_token")
  const response = await fetch(baseAPIurl + "team/leave/" + item.id, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token,
    }
  });
  if (await response.status == 200) {
    const values = JSON.parse(localStorage.getItem('tournaments_key'));
    const filteredValues = values.filter((value) => value.id !== item.id);
    localStorage.setItem('tournaments_key', JSON.stringify(filteredValues));
    item.remove();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  dataContainer = document.getElementById('tournaments_output');
  console.log(dataContainer);


  const token = getCookie('auth_token');
  const response = await fetch(baseAPIurl + "team/mine", {
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
    items = result.teams;
  }
  console.log(items);
  let values = [];
  items.forEach((item) => {
    const name = item.name;
    const captain = item.captain;
    const count = item.members.length;
    const id = item.id;
    values.push({name, captain, count, id});
  });

  localStorage.setItem('tournaments_key', JSON.stringify(values));

  if (localStorage.getItem('tournaments_key')) {
    const schedule = JSON.parse(localStorage.getItem('tournaments_key'));
    schedule.forEach((Tournament) => {
      addTournamentToMarkup(Tournament);
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.delete_output_item_button')) {
      const item = e.target.closest('.tournament_item');
      deleteItem(item);
    }
  });
})

// dataContainer.addEventListener('DOMSubtreeModified', async () => {
// })

const addTournamentToMarkup = (Team) => {
  const markup = `
        <div class="tournament_item" id="${Team.id}">
          <div class="tournament_item_body">
            <h3>
              <span class="tournament_item_name">${Team.name}</span>
            </h3>
            <p>
              Капитан: <span class="tournament_item_type">${Team.captain.firstName + " " + Team.captain.lastName}</span>
            </p>
            <p>
              Количество участников: <span class='"tournament_item_count'}>${Team.count}</span>
            </p>
          </div>
          <p class="delete_output_item_button">
            Покинуть
          </p>
        </div>
      `;
  dataContainer.insertAdjacentHTML('beforeend', markup);
}
