async function fetchData() {
	const response = await fetch("https://apple-seeds.herokuapp.com/api/users/");
	const dataUsers = await response.json();
	for (let i = 0; i < dataUsers.length; i++) {
		const responseDataUser = await fetch(
			`https://apple-seeds.herokuapp.com/api/users/${i}`
		);
		const dataUser = await responseDataUser.json();
		dataUsers[i].age = dataUser.age;
		dataUsers[i].city = dataUser.city;
		dataUsers[i].gender = dataUser.gender;
		dataUsers[i].hobby = dataUser.hobby;
	}
	return dataUsers;
}

//listenrs
document.querySelector("#search-input").addEventListener("input", search);
async function display() {}

async function createTable() {
	dataUsers = await fetchData();
	const tableEl = document.querySelector(".table");
	console.log(dataUsers);
	dataUsers.forEach((el, index) => {
		const rowEl = document.createElement("div");
		rowEl.classList.add("row", `row${index}`);
		const rowContent = `<span>${el.id}</span> <span>${el.firstName}</span><span>${el.lastName}</span><span>${el.capsule}</span><span>${el.age}</span><span>${el.gender}</span><span>${el.hobby}</span><span>${el.city}</span>`;
		rowEl.innerHTML = rowContent;
		tableEl.appendChild(rowEl);
	});
}
function search(e) {
	const search = document.querySelector("#search-input");
	const category = document.querySelector("#dropDown");
	console.log(category.value);
	console.log(search.value);
	sortBy(category.value, search.value);
}

function sortBy(category, value) {
	if (category === "")
		// means we didnt select category
		category = "firstName"; // we set search by firstName default
	console.log(dataUsers[0][category]);
	console.log(typeof dataUsers[0][category]);
	dataUsers.forEach((user, index) => {
		console.log(user[category]);
		if (!user[category].toString().startsWith(value)) {
			document.querySelector(`.row${index}`).classList.add("hide");
		} else {
			document.querySelector(`.row${index}`).classList.remove("hide");
		}
	});
}
