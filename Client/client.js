const socket = io("https://mychat-61ej.onrender.com", {transports:["websocket"]});

const inputform = document.getElementById("send-container");
const msg = document.getElementById("msginput");
const msgarea = document.querySelector(".container");
let tone = new Audio("notification.mp3");

function addnotif(text){
    const entry = document.createElement("div");
    entry.innerHTML = "<i><b>"+text+"</b></i>";
    entry.classList.add("center");
    msgarea.append(entry);
}
function addmsg(name, text, pos){
    const entry = document.createElement("div");

    entry.innerHTML = name===null? text : "<strong>"+name+":</strong><br>"+text;
    entry.classList.add('message');
    entry.classList.add(pos);
    if(pos === "left"){
        tone.loop=false;
        tone.play();
    }
    msgarea.append(entry);
}

inputform.addEventListener('submit', (e)=>{
    e.preventDefault();
    const tmp=msginput.value;
    addmsg(null, tmp, "right");
    socket.emit('send', tmp);
    msginput.value="";
});

const user = prompt("Enter your name to join: ");
socket.emit('new-user-joined', user);

socket.on('user-joined', name =>{
    addnotif(`${name} joined the chat`);
})
socket.on('user-left', name =>{
    addnotif(`${name} left the chat`);
})
socket.on('receive', data =>{
    addmsg(data.name, data.message, "left");
})