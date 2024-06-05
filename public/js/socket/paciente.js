import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";


const iEmail = document.getElementById("email");
const inputPassword = document.getElementById("inputPassword");

const results = document.getElementById("results");
const resultTitle = document.getElementById("resultTitle");
const resultSection = document.getElementById("resultSection");

let socket;

async function connect(userId) {
    try {
        //socket = io("http://localhost:3000", {
        socket = await io("https://automatic-meme-pv7j9j4j4vqf9pxp-3000.app.github.dev", {
            auth: {
                username: iEmail.value,
                serverOffset: 1,
                password: inputPassword.value,
                usuarioId: userId
            },
        });

        socket.on("disconnect", () => {
            console.log("Desconectado por el servidor");
            /* forgetPassword.classList.remove("hidden");
            discon(); */
        });

        socket.on("error", (err) => {
            console.log(err);
            /* discon(); */
        });

        socket.on("connect", () => {
            console.log("Conectado al servidor");
            console.log(socket.auth.usuarioId);
            /*  messages.innerHTML = "";
             ap.changeMessage(true, inputUsername.value); */
        });

        socket.on('message', (msg, serverOffset, clientUser) => {
            let item = `<li class="bg-slate-300 border border-black px-5 py-2 flex flex-col rounded-2xl text-end"><span class="text-xl text-wrap break-words">${msg}</span><small class="text-xs text-wrap break-words">${clientUser}</small> </li>`
            if (clientUser != userSpan.innerText) {
                item = `<li class="bg-slate-400 border border-black px-5 py-2 flex flex-col rounded-2xl"><span class="text-xl text-wrap break-words">${msg}</span><small class="text-xs text-wrap break-words">${clientUser}</small></li>`
            }
            console.log(`${clientUser}: ${msg}`);

            messages.insertAdjacentHTML('beforeend', item)
            socket.auth.serverOffset = serverOffset

            chat.scrollTop = chat.scrollHeight
        })
    }
    catch (error) {
        console.error(error);
    }
};

async function getResults(userId) {
    await fetch(`/api/results`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    }).then((res) => {
        if (!res.ok) {
            console.log('ERROR GETTING RESULTS??')
        }
        else
            return res.json();
    }).then((rs) => {
        console.log(rs);
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
                link.title = 'File Size: ' + Math.round(archivob64.length / 1024) + ' KB - PDF Version: ' + archivob64.match(/^.PDF-([0-9.]+)/)[1];

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

// Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
/* var bin = atob(b64);
console.log('File Size:', Math.round(bin.length / 1024), 'KB');
console.log('PDF Version:', bin.match(/^.PDF-([0-9.]+)/)[1]);
console.log('Create Date:', bin.match(/<xmp:CreateDate>(.+?)<\/xmp:CreateDate>/)[1]);
console.log('Modify Date:', bin.match(/<xmp:ModifyDate>(.+?)<\/xmp:ModifyDate>/)[1]);
console.log('Creator Tool:', bin.match(/<xmp:CreatorTool>(.+?)<\/xmp:CreatorTool>/)[1]);

// Embed the PDF into the HTML page and show it to the user
var obj = document.createElement('object');
obj.style.width = '100%';
obj.style.height = '842pt';
obj.type = 'application/pdf';
obj.data = 'data:application/pdf;base64,' + b64;
document.body.appendChild(obj);

// Insert a link that allows the user to download the PDF file
var link = document.createElement('a');
link.innerHTML = 'Download PDF file';
link.download = 'file.pdf';
link.href = 'data:application/octet-stream;base64,' + b64;
document.body.appendChild(link); */

export { connect, getResults };