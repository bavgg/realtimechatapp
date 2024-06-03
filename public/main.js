// html elements
const formElement = document.getElementById('form');
const inputElement = document.getElementById('input');
const divMessagesContainer = document.getElementById('messages-container');
const codeElement = document.getElementById('code');
const usersContainerElement = document.getElementById('users-container');

// automatically focus the input element
inputElement.focus();

// socket
const socket = io();

// query parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');
const code = urlParams.get('code');

// utility functions
function createLiElement() {
  const div = document.createElement('li');
  return div;
}
// WARNING: side effect 
function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

`
<!-- -------------------------- client to server --------------------------- -->
`
// emit a message when the form is submitted
formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  if (inputElement.value) {
    socket.emit('clientChatMessage', inputElement.value);
    inputElement.value = '';
  }
});

socket.emit('joinsChat', { username, code });

`
<!-- ----------------------------- from server ----------------------------- -->
`
socket.on('serverChatMessage', msg => handleServerChatMessage(msg));
socket.on('serverWelcomeMessage', (msg) => handleWelcomeMessage(msg));
socket.on('serverDisconnectMessage', msg => handleDisconnectMessage(msg));
socket.on('serverBroadcastMessage', (msg) => handleBroadcastMessage(msg));
socket.on('serverInfoMessage', data => handleInfoMessage(data));

// WARNING function : side effects
function handleInfoMessage({ code, users }) {
  codeElement.innerText = code;
  if (users) {
    usersContainerElement.textContent  = '';
    users.map(user => {
      const p = document.createElement('p');
      p.textContent = user.username;
      usersContainerElement.appendChild(p);
    });
  }


  console.log(users);
}
function handleBroadcastMessage(msg) {
  const li = document.createElement('li');
  li.textContent = msg;
  divMessagesContainer.appendChild(li);

  scrollToBottom();
}
function handleDisconnectMessage(msg) {
  const li = document.createElement('li');
  li.textContent = msg;
  divMessagesContainer.appendChild(li);

  scrollToBottom();
}
function handleWelcomeMessage(msg) {
  const li = document.createElement('li');
  li.textContent = msg;
  divMessagesContainer.appendChild(li);

  scrollToBottom();
}
function handleServerChatMessage(msg) {
  const li = createLiElement();
  li.innerHTML = `
    <p>${msg.username} ${msg.time}</p>
    <p>${msg.message}</p>
  `;
  divMessagesContainer.appendChild(li);

  scrollToBottom();
}