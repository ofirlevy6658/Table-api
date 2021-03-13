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
let usersEl = [];

//listenrs
document.querySelector("#search-input").addEventListener("input", search);
document.querySelector("#reset").addEventListener("click", reset);
//display data

async function display() {
	if (localStorage.length == 0) {
		const dataUsers = await fetchData();
		localStorage.setItem("dataUsers", JSON.stringify(dataUsers));
	}
	createTable(getLocalStorage());
}
async function createTable(dataLocalArr) {
	const tableEl = document.querySelector(".table");
	tableEl.innerHTML = "";
	dataLocalArr.forEach((el, index) => {
		let rowEl = document.createElement("div");
		rowEl.classList.add("row", `row${index}`);
		rowEl.setAttribute("data-rowid", el.id); // check it from index to new
		rowEl.setAttribute("data-row", index); // check it from index to new
		let rowContent = `<span >${el.id}</span> <span class="editable">${el.firstName}</span><span class="editable" >${el.lastName}</span><span class="editable">${el.capsule}</span><span class="editable">${el.age}</span><span class="editable">${el.gender}</span><span class="editable">${el.hobby}</span><span class="editable">${el.city}</span> <button class="btn btn-del" data-id="${el.id}">Delete</button> <button class="btn btn-update">Update</button>`;
		rowEl.innerHTML = rowContent;
		usersEl.push(rowEl);
		tableEl.appendChild(usersEl[index]);
	});
}

function getLocalStorage() {
	const localData = JSON.parse(localStorage.getItem("dataUsers"));
	const dataLocalArr = localData.map((el) => el);
	return dataLocalArr;
}
async function reset() {
	localStorage.clear();
	location.reload();
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
	const dataUsers = getLocalStorage();
	dataUsers.forEach((user) => {
		if (!document.querySelector(`[data-rowid="${user.id}"]`)) return;
		if (!user[category].toString().toLowerCase().includes(value)) {
			document.querySelector(`[data-rowid="${user.id}"]`).classList.add("hide");
		} else {
			document
				.querySelector(`[data-rowid="${user.id}"]`)
				.classList.remove("hide");
		}
	});
}

function deleteRow(e) {
	const dataUsers = getLocalStorage();
	const idToDel = e.target.getAttribute("data-id");
	const filterArr = dataUsers.filter((el) => el.id != idToDel);
	localStorage.setItem("dataUsers", JSON.stringify(filterArr));
	e.target.parentElement.remove();
}
function edit(e) {
	// sort();
	const rowClass = e.target.parentElement.classList[1];
	editToggle(rowClass, true);
	const btns = document.querySelectorAll(`.${rowClass} button`);
	btns[0].textContent = "cancel";
	btns[1].textContent = "confirm";
	btns[0].classList.add("cancel");
	btns[0].classList.remove("btn-del");
	btns[1].classList.remove("btn-update");
	btns.forEach((el) => el.addEventListener("click", update));
}
function editToggle(row, bool) {
	document
		.querySelectorAll(`.${row} .editable`)
		.forEach((el) => el.setAttribute("contenteditable", bool));
}

// const usersEl = [];
// let dataUsers = [];
// function sort(criteria) {
// const tableEl = document.querySelector(".table");
// dataUsers.sort((a, b) => {
// 	return a.age > b.age ? 1 : -1;
// });
// console.log(dataUsers);
// createTable(dataUsers);
// console.log(dataUsers);
// usersEl.forEach((el, index) => {
// 	tableEl.appendChild(el);
// });
// }

function update(e) {
	const dataUsers = getLocalStorage();
	const rowEl = e.target.parentElement;
	const rowIndex = [rowEl.getAttribute("data-row")];
	const rowClass = rowEl.classList[1];
	editToggle(rowClass, false);
	if (e.target.innerText === "cancel") {
		const el = dataUsers[rowIndex];
		const rowContent = `<span >${el.id}</span> <span class="editable">${el.firstName}</span><span class="editable" >${el.lastName}</span><span class="editable">${el.capsule}</span><span class="editable">${el.age}</span><span class="editable">${el.gender}</span><span class="editable">${el.hobby}</span><span class="editable">${el.city}</span> <button class="btn btn-del" data-id="${el.id}">Delete</button> <button class="btn btn-update">Update</button>`;
		rowEl.innerHTML = rowContent;
		usersEl[rowIndex] = rowEl;
	}
	if (e.target.innerText === "confirm") {
		const dataUsers = getLocalStorage();
		const editContectEl = document.querySelectorAll(`.${rowClass} .editable`);
		dataUsers[rowIndex].firstName = editContectEl[0].innerText;
		dataUsers[rowIndex].lastName = editContectEl[1].innerText;
		dataUsers[rowIndex].capsule = editContectEl[2].innerText;
		dataUsers[rowIndex].age = editContectEl[3].innerText;
		dataUsers[rowIndex].gender = editContectEl[4].innerText;
		dataUsers[rowIndex].hobby = editContectEl[5].innerText;
		dataUsers[rowIndex].city = editContectEl[6].innerText;
		localStorage.setItem("dataUsers", JSON.stringify(dataUsers));
		e.stopPropagation();
		e.target.classList.add("btn-update");
		console.log(document.querySelector("cancel"));
		e.target.textContent = "Update";
	}
}
