import * as co from "./socket/medic.js";

const chats = document.getElementById("chatlistMedic");
const chatsContainer = document.getElementById("chatsContainerMedic");
const chatContainer = document.getElementById("chatContainerMedic");

async function getChats() {
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
                        console.log(`Paciente ${chat.nombre} y su id es ${chat.usuarioId}`);
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

                    li.appendChild(div);
                    li.appendChild(p);

                    chats.append(li);
                });
            }
        });
};

export { getChats }
