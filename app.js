async function fetchData() {
	const response = await fetch("https://apple-seeds.herokuapp.com/api/users/");
	const dataUsers = await response.json();
	await Promise.all(
		dataUsers.map(async (el, i) => {
			const responseDataUser = await fetch(
				`https://apple-seeds.herokuapp.com/api/users/${i}`
			);
			const dataUser = await responseDataUser.json();
			console.log(dataUser);
			el.age = dataUser.age;
			el.city = dataUser.city;
			el.gender = dataUser.gender;
			el.hobby = dataUser.hobby;
		})
	);
	return dataUsers;
}

//listenrs
document.querySelector("#search-input").addEventListener("input", search);

//display data

async function display() {
	createTable();
}
async function createTable() {
	dataUsers = await fetchData();
	const tableEl = document.querySelector(".table");
	dataUsers.forEach((el, index) => {
		const rowEl = document.createElement("div");
		rowEl.classList.add("row", `row${index}`);
		const rowContent = `<span>${el.id}</span> <span contenteditable="true">${el.firstName}</span><span>${el.lastName}</span><span>${el.capsule}</span><span>${el.age}</span><span>${el.gender}</span><span>${el.hobby}</span><span>${el.city}</span> <button class="btn btn-del">Delete</button> <button class="btn btn-update">Update</button>`;
		rowEl.innerHTML = rowContent;
		tableEl.appendChild(rowEl);
		document
			.querySelectorAll(".btn-del")
			.forEach((btn) => btn.addEventListener("click", deleteRow));
		document
			.querySelectorAll(".btn-update")
			.forEach((btn) => btn.addEventListener("click", update));
	});
}
function search() {
	const search = document.querySelector("#search-input");
	const category = document.querySelector("#dropDown");
	filter(category.value, search.value);
}

function filter(category, value) {
	dataUsers.forEach((user, index) => {
		if (!document.querySelector(`.row${index}`)) return;
		if (!user[category].toString().toLowerCase().startsWith(value)) {
			document.querySelector(`.row${index}`).classList.add("hide");
		} else {
			document.querySelector(`.row${index}`).classList.remove("hide");
		}
	});
}

function deleteRow(e) {
	console.log(e.target.parentElement);
	e.target.parentElement.remove();
}
function update(e) {
	console.log(e.target);
}
