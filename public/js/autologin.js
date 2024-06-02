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
/* 
const b64 = btoa("paciente@mail.com:sergio");

// Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
var bin = atob(b64);
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
document.body.appendChild(link);
 */