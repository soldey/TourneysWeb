let tournaments_form;
let dataContainer;

(function() {
    document.addEventListener("DOMContentLoaded", () => {
        tournaments_form = document.querySelector('#tournaments-form');
        dataContainer = document.querySelector('#tournaments-output');
    })
})();

const deleteItem = (item) => {
    const values = JSON.parse(localStorage.getItem('tournaments_key'));
    const filteredValues = values.filter((value) => value.id !== item.id);
    localStorage.setItem('tournaments_key', JSON.stringify(filteredValues));
    item.remove();
}

document.addEventListener('DOMContentLoaded', () => {
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

    tournaments_form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tournaments_formData = new FormData(e.target);
        const values = Object.fromEntries(tournaments_formData);
        if (!values.login || !values.password) {
            alert('Нет логина или пароля');
            return;
        }
        InitializeLogin(values);
    });

    dataContainer.addEventListener('DOMSubtreeModified', () => {
        const items = document.querySelectorAll('.tournament_item');

        let values = [];
        items.forEach((item) => {
            const name = item.getElementsByClassName('tournament_item_name')[0].innerText;
            const type = item.getElementsByClassName('tournament_item_type')[0].innerText;
            let owner = item.getElementsByClassName('tournament_item_owner');
            if (owner.length === 0) {
                owner = item.getElementsByClassName('tournament_item_poor_owner');
            }
            const id = item.id;
            owner = owner[0].innerText;
            values.push({name, type, owner, id});
        });

        localStorage.setItem('tournaments_key', JSON.stringify(values));
    })
})

const InitializeLogin = async (credentials) => {
    let body = {
        "email": credentials.login,
        "password": credentials.password,
    };

    const loginUrl = baseAPIurl + "auth/signin";
    const response = await fetch(loginUrl, {
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
        console.log(await response_profile.json())
        window.location.href = "http://localhost:8000/"
    }
    throw new Error((await response).message);
}


function getUser() {
    const url = "https://jsonplaceholder.typicode.com/users?id=" + (1 + Math.floor(Math.random() * 10));
    return fetch(url, {
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then((res) => {
            if (res.status == 200) {
                return res.json();
            }
            throw new Error(res.statusText);
        }).catch(() => {
        return {
            0: {
                name: undefined
            }
        }
    })
}