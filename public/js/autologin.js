document.getElementById("paciente").addEventListener("click", () => {
    document.getElementById("email").value = 'paciente@mail.com';
    document.getElementById("inputPassword").value = 'sergio'
    setTimeout(() => { btnConnect.click(); }, 10);
})

document.getElementById("medico").addEventListener("click", () => {
    document.getElementById("email").value = 'medico@mail.com';
    document.getElementById("inputPassword").value = 'sergio'
    setTimeout(() => { btnConnect.click(); }, 10);
})

setTimeout(() => { document.getElementById("disconnectall").click(); console.log('Disconnecting...'); }, 40);

document.getElementById("email").value = 'paciente@mail.com';
document.getElementById("inputPassword").value = 'sergio'
setTimeout(() => { btnConnect.click(); }, 50);