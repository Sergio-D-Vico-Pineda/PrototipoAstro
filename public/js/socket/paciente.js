import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import * as ap from "../apareance.js";

const iEmail = document.getElementById("email");
const inputPassword = document.getElementById("inputPassword");

const results = document.getElementById("results");
const resultTitle = document.getElementById("resultTitle");
const resultSection = document.getElementById("resultSection");

const $receptorId = document.getElementById("receptorId");
const chatsContainer = document.getElementById("chatsContainer");
const chatContainer = document.getElementById("chatContainer");

const messages = document.getElementById("messages");
const btnSend = document.getElementById("btnSend");
const iMensaje = document.getElementById("message");

const btnBack = document.getElementById("btnBack");

let socket;

async function connect(receptorId) {
   const userId = document.getElementById("userId");
   try {
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
         $receptorId.innerText = receptorId;
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

async function getResults(userId = 0) {
   await fetch(`/api/results`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
   }).then((res) => res.json())
      .then((rs) => {
         results.innerHTML = "";
         if (rs.length > 0) {
            resultTitle.innerHTML = "Todos los resultados";
            resultSection.classList.add("h-80");
            results.classList.remove("hidden");
            for (const row of rs) {
               let div = document.createElement("div");

               div.classList.add("text-center", "cursor-pointer", "hover:bg-white", "bg-slate-400", "transition-colors", "rounded-xl");
               let p = document.createElement("span");
               p.classList.add("font-bold");
               p.textContent = row.tipoResultado + ' ⇓';
               let archivob64 = atob(row.archivo);

               let obj = document.createElement('object');
               obj.classList.add("rounded-xl", "w-full");
               obj.type = 'application/pdf';
               obj.data = 'data:application/pdf;base64,' + row.archivo;

               let link = document.createElement('a');
               link.classList.add("overflow-hidden");
               link.download = row.descripcion + '.pdf';
               link.href = 'data:application/octet-stream;base64,' + row.archivo;
               link.title = 'File Size: ' + Math.round(archivob64.length / 1024) + ' KB - PDF Version: ' + RegExp(/^.PDF-([0-9.]+)/).exec(archivob64)[1];

               link.append(obj)
               link.append(p)
               div.append(link)
               results.append(div);
            }
         } else if (rs.length === 0) {
            resultTitle.innerHTML = "No hay resultados";
            resultSection.classList.remove("h-80");
            results.classList.add("hidden");
         }
      })
}

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

   if (origen == 0 || (destino == userId.value && origen == $receptorId.innerText) || origen == userId.value) {
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
         receptorId: $receptorId.innerText,
         texto: iMensaje.value
      })
   }).then((res) => res.json())
      .then((data) => {
         if (data.rowsAffected > 0) {
            socket.emit("message", iMensaje.value, $receptorId.innerText);
            iMensaje.value = "";
            ap.btnState();
         } else {
            alert("Error al enviar el mensaje");
            iMensaje.value = "";
            ap.btnState();
         }
      });
})

export { connect, getResults, dis };