const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const registerTitle = document.querySelector(".title-register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const forgotForm = document.querySelector(".forgot-form");
const forgotTitle = document.querySelector(".title-forgot");
const esito = document.getElementById("esito");

// Mostra form di login
function loginFunction() {
    loginForm.style.left = "50%";
    loginForm.style.opacity = 1;
    registerForm.style.left = "150%";
    registerForm.style.opacity = 0;
    forgotForm.style.left = "150%";
    forgotForm.style.opacity = 0;
    wrapper.style.height = loginForm.scrollHeight + 120 + 64 + "px";

    loginTitle.style.top = "50%";
    loginTitle.style.opacity = 1;
    registerTitle.style.top = "50px";
    registerTitle.style.opacity = 0;
    forgotTitle.style.opacity = 0;
}

// Mostra form di registrazione
function registerFunctionShow() {
    loginForm.style.left = "-50%";
    loginForm.style.opacity = 0;
    registerForm.style.left = "50%";
    registerForm.style.opacity = 1;
    forgotForm.style.left = "150%";
    forgotForm.style.opacity = 0;
    wrapper.style.height = registerForm.scrollHeight + 120 + 64 + "px";

    loginTitle.style.top = "-60px";
    loginTitle.style.opacity = 0;
    registerTitle.style.top = "50%";
    registerTitle.style.opacity = 1;
    forgotTitle.style.opacity = 0;
}

// Mostra form di recupero password
function forgotPasswordFunction() {
    loginForm.style.left = "-50%";
    loginForm.style.opacity = 0;
    registerForm.style.left = "-50%";
    registerForm.style.opacity = 0;
    forgotForm.style.left = "50%";
    forgotForm.style.opacity = 1;
    wrapper.style.height = "300px";

    loginTitle.style.opacity = 0;
    registerTitle.style.opacity = 0;
    forgotTitle.style.top = "50%";
    forgotTitle.style.opacity = 1;
}

// Registrazione
async function registerFunction() {
    // Esegui il controllo del nome prima della validazione
    await checkNameAvailability();

    // Esegui la validazione
    if (!validateRegistrationForm()) {
        return; // Interrompi l'esecuzione se la validazione fallisce
    }

    const data = {
        nome: document.getElementById("reg-nome").value,
        cognome: document.getElementById("reg-cognome").value,
        indirizzo: document.getElementById("reg-indirizzo").value,
        cf: document.getElementById("reg-CF").value,
        email: document.getElementById("reg-email").value,
        username: document.getElementById("reg-name").value,
        password: document.getElementById("reg-pass").value
    };

    fetch("/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) throw new Error("Errore nella registrazione");
            return response.json();
        })
        .then(result => {
            const esito = document.getElementById("esito");
            if (esito) {
                esito.innerText = result.message || "Registrazione completata!";
                esito.style.color = "green";
                registerForm.reset(); // Resetta il form
                setTimeout(() => {
                    loginFunction(); // Mostra il form di login
                }, 2000); // Attendi 2 secondi prima di reindirizzare
            } else {
                console.log("Esito:", result);
            }
        })
        .catch(error => {
            esito.innerText = "Errore: " + error.message;
            esito.style.color = "red";
        });
}

// Login
function login() {
    const username = document.getElementById("log-username").value;
    const password = document.getElementById("log-pass").value;

    const data = {username, password};

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Credenziali errate.");
                } else {
                    throw new Error("Errore del server.");
                }
            }
            return response.json(); // Il server restituisce una stringa
        })
        .then(user => {
            const esito = document.getElementById("esito");
            esito.innerText = "Login effettuato con successo"; // Mostra il messaggio di successo
            esito.style.color = "green"; // Colore verde per il successo

            sessionStorage.setItem("user", JSON.stringify(user))

            setTimeout(() => {

                window.location.href = "/html/disimpegno.html"; // Reindirizza alla home page
            }, 1000); // Attendi 1 secondo prima di reindirizzare
        })
        .catch(error => {
            const esito = document.getElementById("esito");
            esito.innerText = "Errore: " + error.message; // Mostra il messaggio di errore
            esito.style.color = "red"; // Colore rosso per l'errore
        });
}

// Collega i form agli handler
document.addEventListener("DOMContentLoaded", () => {
    if (registerForm) {
        registerForm.addEventListener("submit", event => {
            event.preventDefault();
            registerFunction();
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", event => {
            event.preventDefault();
            login();
        });
    }
});

//Variabile per il controllo della funzione sotto
let isNameAvailable = false;

//Funzione per controllo dell'unicità del nome utente
function checkNameAvailability() {
    const nome = document.getElementById("reg-name").value.trim();
    const nameCheck = document.getElementById("name-check");

    if (!nome) {
        nameCheck.innerText = "Il campo Nome è obbligatorio.";
        isNameAvailable = false;
        return;
    }

    fetch(`http://localhost:8080/user/username/${(nome)}`) //Localhost:8080 non funziona
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante il controllo del nome.");
            }
            return response.json();
        })
        .then(result => {
            if (result.available) {
                nameCheck.innerText = "Nome disponibile.";
                nameCheck.style.color = "green";
                isNameAvailable = true;
            } else {
                nameCheck.innerText = "Nome già presente nel database.";
                nameCheck.style.color = "red";
                isNameAvailable = false;
            }
        })
        .catch(error => {
            nameCheck.innerText = "Errore durante il controllo del nome.";
            nameCheck.style.color = "red";
        });
}

//Variabile per il controllo
let isNameValid = false;

//Funzione per il controllo della validità del nome
function nameCheck() {
    const nome = document.getElementById("reg-nome").value;
    const firstNameCheck = document.getElementById("firstName-check");

    if (!nome || nome.length < 2) {
        firstNameCheck.innerText = "Il nome deve contenere almeno 2 caratteri";
        firstNameCheck.style.color = "red";
        isNameValid = false;
    } else {
        firstNameCheck.innerText = "";
        isNameValid = true;
    }
}

let isSurnameValid = false;

//Funzione per il controllo della validità del cognome
function surnameCheck() {
    const cognome = document.getElementById("reg-cognome").value;
    const surnameCheckElement = document.getElementById("surname-check");
    if (!cognome || cognome.length < 2) {
        surnameCheckElement.innerText = "Il cognome deve contenere almeno 2 caratteri.";
        surnameCheckElement.style.color = "red";
        isSurnameValid = false;
    } else {
        surnameCheckElement.innerText = "";
        isSurnameValid = true;
    }
}

let isAddressValid = false;

//Funzione per il controllo della validità dell'indirizzo
function addressCheck() {
    const indirizzo = document.getElementById("reg-indirizzo").value;
    const addressCheckElement = document.getElementById("address-check");

    if (!indirizzo || indirizzo.length < 5) {
        addressCheckElement.innerText = "L'indirizzo deve contenere almeno 5 caratteri.";
        addressCheckElement.style.color = "red";
        isAddressValid = false;
    } else {
        addressCheckElement.innerText = "";
        isAddressValid = true;
    }
}

let isCfValid = false;

//Funzione per il controllo della validità del codice fiscale
function cfCheck() {
    const cf = document.getElementById("reg-CF").value;
    const cfCheckElement = document.getElementById("cf-check");
    const cfRegex = /^[A-Z0-9]{16}$/i; // Regex per validare il codice fiscale

    if (!cf || !cfRegex.test(cf)) {
        cfCheckElement.innerText = "Il codice fiscale deve essere di 16 caratteri alfanumerici.";
        cfCheckElement.style.color = "red";
        isCfValid = false;
    } else {
        cfCheckElement.innerText = "";
        isCfValid = true;
    }
}

let isEmailValid = false;

//Funzione per il controllo della validità dell'email
function emailCheck() {
    const email = document.getElementById("reg-email").value;
    const emailCheckElement = document.getElementById("email-check");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex per validare l'email

    if (!email || !emailRegex.test(email)) {
        emailCheckElement.innerText = "Inserisci un'email valida.";
        emailCheckElement.style.color = "red";
        isEmailValid = false;
    } else {
        emailCheckElement.innerText = "";
        isEmailValid = true;
    }
}

//Funzione per la validazione della registrazione
function validateRegistrationForm() {
    const password = document.getElementById("reg-pass").value;
    const agree = document.getElementById("agree").checked;

    const validation = document.getElementById("validation-check");

    if (!isNameValid) {
        return false;
    }

    if (!isSurnameValid) {
        return false;
    }

    if (!isAddressValid) {
        return false;
    }

    if (!isCfValid) {
        return false;
    }

    if (!isEmailValid) {
        return false;
    }

    if (!password || password.length < 8) {
        validation.innerText = "La password deve contenere almeno 8 caratteri.";
        validation.style.color = "red";
        return false;
    }

    if (!isNameAvailable) {
        return false;
    }

    if (!agree) {
        validation.innerText = "Devi accettare i termini e condizioni.";
        validation.style.color = "red";
        return false;
    }

    return true; // Tutti i controlli sono passati
}
