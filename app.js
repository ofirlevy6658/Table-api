async function fetchData() {
	const response = await fetch("https://apple-seeds.herokuapp.com/api/users/");
	const dataUsers = await response.json();
	await Promise.all(
		dataUsers.map(async (el, i) => {
			const responseDataUser = await fetch(
				`https://apple-seeds.herokuapp.com/api/users/${i}`
			);
			const dataUser = await responseDataUser.json();
			el.age = dataUser.age;
			el.city = dataUser.city;
			el.gender = dataUser.gender;
			el.hobby = dataUser.hobby;
		})
	);
	return dataUsers;
}

//global
const usersEl = [];
let dataUsers = [];
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
		rowEl.setAttribute("data-row", index);
		const rowContent = `<span >${el.id}</span> <span class="editable">${el.firstName}</span><span class="editable" >${el.lastName}</span><span class="editable">${el.capsule}</span><span class="editable">${el.age}</span><span class="editable">${el.gender}</span><span class="editable">${el.hobby}</span><span class="editable">${el.city}</span> <button class="btn btn-del">Delete</button> <button class="btn btn-update">Update</button>`;
		rowEl.innerHTML = rowContent;
		usersEl.push(rowEl);
		tableEl.appendChild(usersEl[index]);
	});
}

document.querySelector(".table").addEventListener("click", tableEventListner);
function tableEventListner(e) {
	if (e.target.innerHTML == "Delete") deleteRow(e);
	else if (e.target.innerHTML == "Update") edit(e);
}

function search() {
	const search = document.querySelector("#search-input");
	const category = document.querySelector("#dropDown");
	filter(category.value, search.value);
}

function filter(category, value) {
	dataUsers.forEach((user, index) => {
		if (!document.querySelector(`.row${index}`)) return;
		if (!user[category].toString().toLowerCase().includes(value)) {
			document.querySelector(`.row${index}`).classList.add("hide");
		} else {
			document.querySelector(`.row${index}`).classList.remove("hide");
		}
	});
}

function deleteRow(e) {
	e.target.parentElement.remove();
}
function edit(e) {
	const rowClass = e.target.parentElement.classList[1];
	editToggle(rowClass, true);
	const btns = document.querySelectorAll(`.${rowClass} button`);
	btns[0].textContent = "cancel";
	btns[1].textContent = "confirm";
	btns[0].classList.remove("btn-del");
	btns[1].classList.remove("btn-update");
	btns.forEach((el) => el.addEventListener("click", update));
}
function editToggle(row, bool) {
	document
		.querySelectorAll(`.${row} .editable`)
		.forEach((el) => el.setAttribute("contenteditable", bool));
}

function update(e) {
	const rowEl = e.target.parentElement;
	const rowIndex = [rowEl.getAttribute("data-row")];
	const rowClass = rowEl.classList[1];
	editToggle(rowClass, false);
	if (e.target.innerText === "cancel") {
		const el = dataUsers[rowIndex];
		const rowContent = `<span >${el.id}</span> <span class="editable">${el.firstName}</span><span class="editable" >${el.lastName}</span><span class="editable">${el.capsule}</span><span class="editable">${el.age}</span><span class="editable">${el.gender}</span><span class="editable">${el.hobby}</span><span class="editable">${el.city}</span> <button class="btn btn-del">Delete</button> <button class="btn btn-update">Update</button>`;
		rowEl.innerHTML = rowContent;
		usersEl[rowIndex] = rowEl;
	}
	if (e.target.innerText === "confirm") {
		const editContectEl = document.querySelectorAll(`.${rowClass} .editable`);
		dataUsers[rowIndex].firstName = editContectEl[0].innerText;
		dataUsers[rowIndex].lastName = editContectEl[1].innerText;
		dataUsers[rowIndex].capsule = editContectEl[2].innerText;
		dataUsers[rowIndex].age = editContectEl[3].innerText;
		dataUsers[rowIndex].gender = editContectEl[4].innerText;
		dataUsers[rowIndex].hobby = editContectEl[5].innerText;
		dataUsers[rowIndex].city = editContectEl[6].innerText;
		e.stopPropagation();
		e.target.classList.add("btn-update");
		console.log(e.target);
		e.target.textContent = "Update";
	}
}
