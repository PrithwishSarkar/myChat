const socket = io("https://mychat-61ej.onrender.com", {transports:["websocket"]});

const inputform = document.getElementById("send-container");
const msg = document.getElementById("msginput");
const msgarea = document.querySelector(".container");
let tone = new Audio("notification.mp3");
const btn = document.getElementById("submit");

function addnotif(text){
    const entry = document.createElement("div");
    entry.innerHTML = "<i><b>"+text+"</b></i>";
    entry.classList.add("center");
    msgarea.append(entry);
    entry.scrollIntoView({behavior: "smooth", block: "end"});
}
function addmsg(name, text, pos){
    const entry = document.createElement("div");
    let t=new Date().toLocaleTimeString("en-US",{hour12: true});
    console.log(t);
    entry.innerHTML = name===null? "<p>"+text+"</p><span>"+t+"</span>" : "<strong>"+name+":</strong><br><p>"+text+"</p><span>"+t+"</span>";
    entry.classList.add('message');
    entry.classList.add(pos);
    if(pos === "left"){
        
        tone.loop=false;
        tone.play();
    }
    msgarea.append(entry);
    entry.scrollIntoView({behavior: "smooth", block: "end"});
}

inputform.addEventListener('submit', (e)=>{
    e.preventDefault();
    const tmp=msginput.value;
    if(tmp === "")
        alert("Message cannot be empty!");
    else{
        addmsg(null, tmp, "right");
        socket.emit('send', tmp);
        msginput.value="";
    }
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