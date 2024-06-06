import * as ap from "../apareance.js";
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const selUsers = document.getElementById("selUsers");

const chats = document.getElementById("chatlistMedic");
const chatsContainer = document.getElementById("chatsContainerMedic");
const chatContainer = document.getElementById("chatContainerMedic");

const btnBack = document.getElementById("btnBackMedic");

const iMensaje = document.getElementById("messageMedic");
const btnSend = document.getElementById("btnSendMedic");

const chat = document.getElementById("chatMedic");
const messages = document.getElementById("messagesMedic");
const $receptorIdMedic = document.getElementById("receptorIdMedic");

const iEmail = document.getElementById("email");
const inputPassword = document.getElementById("inputPassword");

let socket;

async function connect(receptorId) {
   const userId = document.getElementById("userId");
   try {
      //socket = io("http://192.168.1.138:3000", {
      //socket = io("https://automatic-meme-pv7j9j4j4vqf9pxp-3000.app.github.dev/", {
      socket = io("http://localhost:3000", {
         auth: {
            username: iEmail.value,
            serverOffset: 1,
            password: inputPassword.value,
            usuarioId: userId.value
         },
      });

      socket.on("disconnect", () => {
         console.log("Desconectado por el servidor");
      });

      socket.on("error", (err) => {
         console.log(err);
      });

      socket.on("connect", async () => {
         console.log("Conectado al servidor");
         $receptorIdMedic.innerText = receptorId;
         /* console.log('USUARIO EMISOR: ', userId.value, 'USUARIO RECEPTOR: ', receptorId); */
         messages.innerHTML = "";

         await fetch(`/api/getmessages`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               emisorId: userId.value,
               receptorId: receptorId
            })
         }).then((res) => {
            return res.json();
         }).then((data) => {
            console.log(data);
            data.forEach((msg) => {
               sendmsg(msg.textoEncriptado, msg.emisorId, msg.receptorId, msg.nombre);
            })
         });
      });

      socket.on('message', (msg, serverOffset, clientUser, origen, destino) => {
         sendmsg(msg, origen, destino, clientUser);
      })
   }
   catch (error) {
      console.error(error);
   }
};

async function getUsers() {
   await fetch("/api/pacientes", {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   })
      .then((res) => res.json())
      .then((data) => {
         if (data.length > 0) {
            selUsers.disabled = false;
            selUsers.innerHTML = "";
            data.forEach((user) => {
               let option = document.createElement("option");
               option.value = user.usuarioId;
               option.textContent = user.nombre;
               selUsers.appendChild(option);
            });
         }
      });
}

async function getChatsMedic() {
   fetch("/api/chatsmedic")
      .then((res) => res.json())
      .then((data) => {
         if (data.length > 0) {
            chats.innerHTML = "";
            data.forEach((chat) => {
               let li = document.createElement("li");
               li.classList.add(
                  "bg-slate-300",
                  "px-5",
                  "py-2",
                  "flex",
                  "items-center",
                  "justify-around",
                  "rounded-lg",
                  "cursor-pointer",
                  "hover:bg-slate-500",
                  "transition-colors",
               );
               li.addEventListener("click", () => {
                  alert(`Medico ${chat.nombre} y su id es ${chat.usuarioId}`);
                  chatsContainer.classList.add("hidden");
                  chatContainer.classList.remove("hidden");
                  co.connect(chat.usuarioId);
               });

               let div = document.createElement("div");
               div.classList.add("bg-white", "rounded-full", "p-1");

               let p = document.createElement("p");
               p.classList.add("text-center", "text-white", "flex-grow");
               p.textContent = chat.nombre;

               div.innerHTML = `<svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 256 256"><path fill="currentColor" d="M230.93 220a8 8 0 0 1-6.93 4H32a8 8 0 0 1-6.92-12c15.23-26.33 38.7-45.21 66.09-54.16a72 72 0 1 1 73.66 0c27.39 8.95 50.86 27.83 66.09 54.16a8 8 0 0 1 .01 8"></path></svg>`;
               div.innerHTML += `<small class="text-sm">${chat.usuarioId}</small>`

               li.appendChild(div);
               li.appendChild(p);

               chats.append(li);
            });
         }
      });
};

function back() {
   chatsContainer.classList.remove("hidden");
   chatContainer.classList.add("hidden");
   socket.disconnect();
}

function dis() {
   socket.disconnect();
}

function sendmsg(msg, origen, destino, clientUser) {
   let item;

   if (origen == 0 || (destino == userId.value && origen == $receptorIdMedic.innerText) || origen == userId.value) {
      if (origen == userId.value) {
         item = `<li class="bg-slate-300 border border-black px-5 py-2 flex flex-col rounded-2xl text-end"><span class="text-xl text-wrap break-words">${msg}</span><small class="text-xs text-wrap break-words">${clientUser}</small> </li>`
         /* console.log(`${origen} - ${destino}: ${msg}`); */
      } else {
         item = `<li class="bg-slate-400 border border-black px-5 py-2 flex flex-col rounded-2xl"><span class="text-xl text-wrap break-words">${msg}</span><small class="text-xs text-wrap break-words">${clientUser}</small></li>`
         /* console.log(`${destino} - ${origen}: ${msg}`); */
      }

      messages.insertAdjacentHTML('beforeend', item)
      chat.scrollTop = chat.scrollHeight
   }
}

btnBack.addEventListener("click", back);

iMensaje.addEventListener("input", ap.btnState);

btnSend.addEventListener("click", async (e) => {
   e.preventDefault()

   if (iMensaje.value == "") {
      alert("Por favor, ingresa un mensaje");
      return;
   }

   await fetch("/api/sendmessage", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         emisorId: userId.value,
         receptorId: $receptorIdMedic.innerText,
         texto: iMensaje.value
      })
   }).then((res) => res.json())
      .then((data) => {
         if (data.rowsAffected > 0) {
            socket.emit("message", iMensaje.value, $receptorIdMedic.innerText);
            iMensaje.value = "";
            ap.btnState();
         } else {
            alert("Error al enviar el mensaje");
            iMensaje.value = "";
            ap.btnState();
         }
      });
})

export { getUsers, getChatsMedic, connect, dis }