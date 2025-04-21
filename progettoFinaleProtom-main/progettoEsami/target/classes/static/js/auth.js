//Funzione controllo sessione
function checkLogin(callback) {
    const user = sessionStorage.getItem("user");

    if (user) { //Controllo se l'utente è già loggato
        const parsedUser = JSON.parse(user);
        if (callback) callback(parsedUser); //Esegui il callback con l'utente loggato
    } else { //Se l'utente non è loggato
        fetch("/login/me", {
            method: "GET",
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    window.location.href = "/html/login.html"; // non autenticato → redirect
                    return;
                }
                return response.json();
            })
            .then(user => {
                if (user) {
                    sessionStorage.setItem("user", JSON.stringify(user)); //Salviamo l'utente
                    if (callback) callback(user); // Esegui il callback con i dati dell'utente
                }
            })
            .catch(() => {
                window.location.href = "/html/login.html";
            });
    }
};



// Funzione per il logout
function logout() {
    fetch("/login/logout", {
        method: "POST",
        credentials: "include"
    }).then(() => {
        sessionStorage.removeItem("user"); // Rimuovi i dati dell'utente dal sessionStorage
        window.location.href = "/html/home_page.html";
    });
}