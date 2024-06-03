const selUsers = document.getElementById("selUsers");

async function countResultsUsers(e) {
    console.log(e.target.value);

    await fetch("/api/upload", {
        method: "GET",
        body: formData,
        /* headers: {
            "Content-Type": "multipart/form-data",
        }, */
    })
        .then((res) => {
            if (res.ok) {
                alert("File uploaded successfully");
            }
        })
        .catch((err) => {
            alert(err);
        });
}

selUsers.addEventListener("change", countResultsUsers)

export {

}