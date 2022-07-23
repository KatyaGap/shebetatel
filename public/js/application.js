const registerForm = document.querySelector('#registerForm');
const loginForm = document.querySelector('#loginForm');
const addForm = document.querySelector('#addForm');
const add1Form = document.querySelector('#add1Form');
const postList = document.querySelector('#postList');

// регистрация
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData);
  const response = await fetch('/register', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result.message === 'aaa') {
    window.location.href = 'http://localhost:3000';
  } else {
    registerForm.reset();
    registerForm.insertAdjacentHTML(
      'afterend',
      `<p id="mess">${result.message}</p>`
    );
    const mess = document.getElementById('mess');
    setTimeout(() => {
      mess.remove();
    }, 3 * 1000);
  }
});

// логин
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData);
  const response = await fetch('/login', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result.message === 200) {
    window.location.href = 'http://localhost:3000';
  } else {
    loginForm.reset();
    loginForm.insertAdjacentHTML(
      'afterend',
      `<p id="mess2">${result.message}</p>`
    );
    const mess2 = document.getElementById('mess2');
    setTimeout(() => {
      mess2.remove();
    }, 3 * 1000);
  }
});

// добавление поста на главной странице
add1Form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('/', {
    method: 'post',
    body: new FormData(add1Form),
  });
  if (response.ok) {
    const result = await response.json();
    postList.insertAdjacentHTML(
      'afterbegin',
      `<div id='div-${result.card.id}' class="card" style="width: 18rem;" >
<img src="${result.card.image}" class="card-img-top">
<div class="card-body">
<h5 class="card-title">${result.user.name} щебечет:</h5>
<p class="card-text">${result.card.text}</p>
<p class="card-text">${result.card.date}</p>
<button data-like=${result.card.id} class="btn btn-info" type="click">❤️</button>
<span id='span-${result.card.id}' class="likes">0</span>
<br></div></div>`
    );
    add1Form.reset();
  }
});

// добавление карточки в личном кабинете
addForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('/post', {
    method: 'post',
    body: new FormData(addForm),
  });
  if (response.ok) {
    const result = await response.json();
    postList.insertAdjacentHTML(
      'afterbegin',
      `<div id='div-${result.card.id}' class="card" style="width: 18rem;" >
<img src="${result.card.image}" class="card-img-top">
<div class="card-body">
<h5 class="card-title">${result.user.name} щебечет:</h5>
<p class="card-text">${result.card.text}</p>
<p class="card-text">${result.card.date}</p>
<span id='span-${result.card.id}' class="likes">❤️ 0</span>
<br>
<button data-delete=${result.card.id} class="btn btn-info" type="click">Удалить!</button>
<button data-edit=${result.card.id} class="btn btn-info" type="click">Изменить!</button>
</div>
</div>`
    );
    addForm.reset();
  }
});

// лайки
postList?.addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target.dataset.like) {
    const id = e.target.dataset.like;
    const span = document.getElementById(`span-${id}`);
    const response = await fetch(`/likes/${id}`);
    if (response.ok) {
      const result = await response.json();
      span.textContent = result.length;
    }
  }
});

// удаление карточки
postList?.addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target.dataset.delete) {
    const id = e.target.dataset.delete;
    const div = document.getElementById(`div-${id}`);
    const response = await fetch(`/post/${id}`, {
      method: 'delete',
    });
    if (response.ok) {
      div.remove();
    }
  }
});

// редактирование карточки
// отлавливаем нажатие на кнопку редактирования
postList?.addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target.dataset.edit) {
    const id = e.target.dataset.edit;
    const div = document.getElementById(`div-${id}`);
    const response = await fetch(`/post/${id}`);
    if (response.ok) {
      const result = await response.json();
      div.innerHTML = `
<form id="editForm">
<input type="text" required class="form-control" name="text" placeholder="enter new text">
<button data-update=${result.id} type="click" class="btn btn-info">edit schebet</button>
</form>
</div>
</div>`;
    }
  }
});

// новая редакция карточки
postList?.addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target.dataset.update) {
    const id = e.target.dataset.update;
    const div = document.getElementById(`div-${id}`);
    const editForm = document.querySelector('#editForm');
    const formData = new FormData(editForm);
    const data = Object.fromEntries(formData);
    const response = await fetch(`/post/${id}`, {
      method: 'put',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const result = await response.json();
      div.innerHTML = `<div id='div-${result.id}' class="card" style="width: 18rem;" >
<img src="${result.image}" class="card-img-top">
<div class="card-body">
<h5 class="card-title">${result.user_name}</h5>
<p class="card-text">${result.text}</p>
<p class="card-text">${result.date}</p>
<span id='span-${result.id}' class="likes">❤️ ${result.likes}</span>
<br>
<button data-delete=${result.id} class="btn btn-info" type="click">Удалить!</button>
<button data-edit=${result.id} class="btn btn-info" type="click">Изменить</button>
</div>
</div>`;
    }
  }
});
