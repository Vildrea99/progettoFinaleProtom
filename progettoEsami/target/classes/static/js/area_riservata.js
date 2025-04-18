document.addEventListener("DOMContentLoaded", () => {
    checkLogin(() => {
        console.log("Utente autenticato");
        caricaEsami();
    });

    document.getElementById("btn-home").addEventListener("click", () => {
        window.location.href = "disimpegno.html";
    });

    document.addEventListener("DOMContentLoaded", () => {
        const logoutButton = document.getElementById("btn-logout");
        if (logoutButton) {
            logoutButton.addEventListener("click", () => {
                logout(); // Richiama la funzione di logout
            });
        } else {
            console.error("Elemento con id 'btn-logout' non trovato.");
        }
    });


    document.getElementById("btn-modifica").addEventListener("click", () => {
        // Chiedi il codice dell'esame da modificare

        const codiceEsame = prompt("Inserisci il codice dell'esame da modificare:");

        if (!codiceEsame) {
            alert("Codice esame non inserito!");
            return;
        }

        // Trova la riga corrispondente nella tabella
        const rows = document.querySelectorAll("#esami-table tr");
        let esameTrovato = false;

        rows.forEach((row, index) => {
            if (index === 0) return; // Salta l'intestazione della tabella

            const codiceCell = row.cells[0]; // Prima cella della riga
            if (codiceCell && codiceCell.innerText === codiceEsame) {
                esameTrovato = true;


                // Mostra il fieldset e popola i campi con i dati dell'esame
                const fieldset = document.getElementById("datiDaModificare");
                fieldset.style.display = "block";

                // Popola i campi del fieldset
                document.querySelector("#datiDaModificare input[aria-label='readonly input example']").value = codiceEsame;
                document.querySelectorAll("#datiDaModificare .modifica")[1].value = row.cells[1].innerText; // Corso
                document.querySelectorAll("#datiDaModificare .modifica")[2].value = row.cells[2].innerText; // Data
                document.querySelectorAll("#datiDaModificare .modifica")[3].value = row.cells[3].innerText; // Orario
                document.querySelectorAll("#datiDaModificare .modifica")[4].value = row.cells[4].innerText; // Professore

                // Aggiungi un bottone per salvare le modifiche
                const salvaButton = document.createElement("button");
                salvaButton.innerText = "Salva Modifiche";
                salvaButton.classList.add("btn-save");
                salvaButton.addEventListener("click", () => {
                    // Aggiorna i valori nella tabella
                    row.cells[1].innerText = document.querySelectorAll("#datiDaModificare .form-control")[1].value; // Corso
                    row.cells[2].innerText = document.querySelectorAll("#datiDaModificare .form-control")[2].value; // Data
                    row.cells[3].innerText = document.querySelectorAll("#datiDaModificare .form-control")[3].value; // Orario
                    row.cells[4].innerText = document.querySelectorAll("#datiDaModificare .form-control")[4].value; // Professore

                    // Nascondi il fieldset
                    fieldset.style.display = "none";

                    // Rimuovi il bottone "Salva Modifiche"
                    salvaButton.remove();

                    alert("Esame modificato con successo!");
                });

                // Aggiungi il bottone al fieldset
                fieldset.appendChild(salvaButton);
            }
        });

        if (!esameTrovato) {
            alert("Esame con codice " + codiceEsame + " non trovato!");
        }
    });

    document.getElementById("btn-cancella").addEventListener("click", () => {
        // Chiedi il codice dell'esame da cancellare
        const codiceEsame = prompt("Inserisci il codice dell'esame da cancellare:");

        if (!codiceEsame) {
            alert("Codice esame non inserito!");
            return;
        }

        // Trova la riga corrispondente nella tabella
        const rows = document.querySelectorAll("#esami-table tr");
        let esameTrovato = false;

        rows.forEach((row, index) => {
            if (index === 0) return; // Salta l'intestazione della tabella

            const codiceCell = row.cells[0]; // Prima cella della riga
            if (codiceCell && codiceCell.innerText === codiceEsame) {
                esameTrovato = true;

                // Effettua una richiesta DELETE al server
                fetch(`/esami/${codiceEsame}`, {
                    method: "DELETE"
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Errore durante l'eliminazione dell'esame");
                        }
                        // Non chiamare response.json() se il server non restituisce un corpo
                        return response.text(); // Usa text() se il server restituisce una stringa vuota
                    })
                    .then(() => {
                        // Rimuovi la riga dalla tabella
                        row.remove();
                        alert("Esame con codice " + codiceEsame + " cancellato con successo!");
                    })
                    .catch(error => {
                        console.error("Errore:", error);
                        alert("Si è verificato un errore durante l'eliminazione dell'esame.");
                    });
            }
        });

        if (!esameTrovato) {
            alert("Esame con codice " + codiceEsame + " non trovato!");
        }
    });
});

function caricaEsami(forceReload = false) {
    fetch("/esami")
        .then(res => {
            if (!res.ok) throw new Error("Errore nel recupero dei dati");
            return res.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                console.error("Formato dei dati non valido.");
                return;
            }
            if (!data || data.length === 0) {
                console.warn("Nessun esame trovato.");
                return;
            }
            popolaTabella(data);
        })
        .catch(err => console.error("Errore:", err));
}


//FUNZIONI

// Funzione controllo sessione
document.addEventListener("DOMContentLoaded", () => checkLogin(() => {
    console.log("Utente autenticato");
}));

//Questo eventListener controlla che l'utente loggato sia un admin o meno e mostra le funzioni ad esso esclusive
document.addEventListener("DOMContentLoaded", () => {
    checkLogin(user => {
        console.log("Utente loggato:", user);

        // Controlla se l'utente è un admin
        if (user.ruolo === "SEGRETERIA") {
            // Mostra i pulsanti per creare, modificare e cancellare esami
            document.getElementById("btn-crea").style.display = "block";
            document.getElementById("btn-modifica").style.display = "block";
            document.getElementById("btn-cancella").style.display = "block";

            // Aggiungi gli event listener ai pulsanti
            document.getElementById("btn-crea").addEventListener("click", creaEsame);
            document.getElementById("btn-modifica").addEventListener("click", modificaEsame);
            document.getElementById("btn-cancella").addEventListener("click", cancellaEsame);
        } else {
            // Nascondi i pulsanti per gli utenti non admin
            document.getElementById("btn-crea").style.display = "none";
            document.getElementById("btn-modifica").style.display = "none";
            document.getElementById("btn-cancella").style.display = "none";
        }
    });
});


// Funzione per popolare la tabella
function popolaTabella(esami) {
    const table = document.getElementById("esami-table");

    // Svuota la tabella (tranne l'intestazione)
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    esami.forEach(esame => {
        let tr = document.createElement("tr");

        // Colonne base
        let tdCodice = document.createElement("td");
        tdCodice.innerText = esame.codiceEsame;
        tr.appendChild(tdCodice);

        let tdCorso = document.createElement("td");
        tdCorso.innerText = esame.corso;
        tr.appendChild(tdCorso);

        let tdData = document.createElement("td");
        tdData.innerText = esame.data;
        tr.appendChild(tdData);

        let tdOrario = document.createElement("td");
        tdOrario.innerText = esame.orarioInizio;
        tr.appendChild(tdOrario);

        let tdProf = document.createElement("td");
        tdProf.innerText = esame.professore;
        tr.appendChild(tdProf);

        // Colonna per il pulsante
        let tdPrenota = document.createElement("td");
        let prenotaButton = document.createElement("button");

        if (esame.prenotato) {
            // Se l'esame è già prenotato
            prenotaButton.innerText = "Cancella Prenotazione";
            prenotaButton.classList.add("btn", "btn-danger");
            prenotaButton.onclick = () => cancellaPrenotazione(esame.codiceEsame, prenotaButton);
        } else {
            // Se l'esame non è prenotato
            prenotaButton.innerText = "Prenota";
            prenotaButton.classList.add("btn", "btn-primary");
            prenotaButton.onclick = () => prenotaEsame(esame.codiceEsame, prenotaButton);
        }

        tdPrenota.appendChild(prenotaButton);
        tr.appendChild(tdPrenota);

        table.appendChild(tr);
    });
}


// Definizione della tabella
const table = document.getElementById("esami-table");

// Definizione delle intestazioni
const headers = ["Codice", "Corso", "Data", "Orario Inizio", "Professore", "Stato Prenotazione"];

// Creazione del contenitore dei bottoni
const buttonContainer = document.createElement("div");
buttonContainer.classList.add("button-container");
document.body.appendChild(buttonContainer);

// Chiamata fetch per ottenere i dati
fetch("/esami")
    .then(response => {
        if (!response.ok) {
            throw new Error("Errore nel recupero dei dati");
        }
        return response.json();
    })
    .then(data => {
        popolaTabella(data);
    })
    .catch(error => {
        console.error("Errore:", error);
    });





function creaEsame() {
    const fieldset = document.getElementById("creaEsameFieldset");
    fieldset.style.display = "block";

    const salvaButton = document.getElementById("salvaEsame");
    
    // Clona il bottone per rimuovere tutti i listener
    const nuovoSalvaButton = salvaButton.cloneNode(true);
    salvaButton.parentNode.replaceChild(nuovoSalvaButton, salvaButton);

    nuovoSalvaButton.addEventListener("click", () => {
        // Ottieni i valori dai campi di input
        const corso = document.getElementById("corsoEsame").value.trim();
        const data = new Date(document.getElementById("dataEsame").value).toISOString().split("T")[0];
        const orarioInizio = document.getElementById("orarioEsame").value + ":00";
        const professore = document.getElementById("professoreEsame").value.trim();



        // Validazione dei dati
        if (!corso || !data || !orarioInizio || !professore) {
            alert("Tutti i campi sono obbligatori!");
            return;
        }

        const nuovoEsame = {
            corso,
            data,
            orarioInizio,
            professore
        };

        // Effettua la richiesta POST per creare l'esame
        fetch("/esami", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuovoEsame)
        })
            .then(response => {
                console.log("Response status:", response.status);
                console.log("Payload inviato:", JSON.stringify(nuovoEsame));
                if (!response.ok) {
                    throw new Error("Errore durante la creazione dell'esame");
                }
                return response.json();
            })
            .then(() => {
                alert("Esame creato con successo!");
                caricaEsami(true); // Ricarica la tabella
                fieldset.style.display = "none"; // Nascondi il fieldset
                document.getElementById("corsoEsame").value = "";
                document.getElementById("dataEsame").value = "";
                document.getElementById("orarioEsame").value = "";
                document.getElementById("professoreEsame").value = "";
            })
            .catch(error => {
                console.error("Errore:", error);
            });
    });
}

function cancellaEsame() {
    const fieldset = document.getElementById("cancellaEsameFieldset");
    fieldset.style.display = "block";

    const confermaButton = document.getElementById("confermaCancellaEsame");
    confermaButton.addEventListener("click", () => {
        // Ottieni il valore del codice esame
        const codiceEsame = document.getElementById("codiceEsameCancella").value.trim();

        if (!codiceEsame) {
            alert("Codice esame non inserito!");
            return;
        }

        // Effettua la richiesta DELETE
        fetch(`/esami/${codiceEsame}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore durante l'eliminazione dell'esame");
                }
                return response.text(); // Usa text() se il server restituisce una stringa vuota
            })
            .then(() => {
                alert("Esame cancellato con successo!");
                caricaEsami(true); // Ricarica la tabella
                fieldset.style.display = "none"; // Nascondi il fieldset
            })
            .catch(error => {
                console.error("Errore:", error);
                alert("Si è verificato un errore durante l'eliminazione dell'esame.");
            });
    });
}

function modificaEsame() {
    // Mostra il fieldset per la modifica
    const fieldset = document.getElementById("modificaEsameFieldset");
    fieldset.style.display = "block";

    const cercaButton = document.getElementById("cercaEsame");
    cercaButton.addEventListener("click", () => {
        // Ottieni il codice dell'esame
        const codiceEsame = document.getElementById("codiceEsameModifica").value.trim();

        if (!codiceEsame) {
            alert("Codice esame non inserito!");
            return;
        }

        // Recupera i dati dell'esame
        fetch(`/esami/${codiceEsame}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore nel recupero dei dati dell'esame");
                }
                return response.json();
            })
            .then(esame => {
                if (!esame) {
                    alert("Esame con codice " + codiceEsame + " non trovato!");
                    return;
                }

                // Popola i campi del fieldset con i dati dell'esame
                document.getElementById("corsoEsameModifica").value = esame.corso;
                document.getElementById("dataEsameModifica").value = esame.data;
                document.getElementById("orarioEsameModifica").value = esame.orarioInizio;
                document.getElementById("professoreEsameModifica").value = esame.professore;

                // Aggiungi un listener al pulsante "Salva"
                const salvaButton = document.getElementById("salvaModificaEsame");
                salvaButton.addEventListener("click", () => {
                    // Ottieni i nuovi valori dai campi
                    const nuovoCorso = document.getElementById("corsoEsameModifica").value.trim();
                    const nuovaData = document.getElementById("dataEsameModifica").value.trim();
                    const nuovoOrario = document.getElementById("orarioEsameModifica").value.trim();
                    const nuovoProfessore = document.getElementById("professoreEsameModifica").value.trim();

                    // Validazione dei dati
                    if (!nuovaData || !/^\d{4}-\d{2}-\d{2}$/.test(nuovaData)) {
                        alert("Formato data non valido! Usa il formato YYYY-MM-DD.");
                        return;
                    }

                    if (!nuovoOrario || !/^\d{2}:\d{2}$/.test(nuovoOrario)) {
                        alert("Formato orario non valido! Usa il formato HH:MM.");
                        return;
                    }

                    const datiAggiornati = {
                        corso: nuovoCorso,
                        data: nuovaData,
                        orarioInizio: nuovoOrario,
                        professore: nuovoProfessore
                    };

                    // Effettua la richiesta PUT
                    fetch(`/esami/${codiceEsame}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datiAggiornati)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("Errore durante l'aggiornamento dell'esame");
                            }
                            return response.json();
                        })
                        .then(() => {
                            alert("Esame modificato con successo!");
                            caricaEsami(true); 
                            
                            fieldset.style.display = "none"; // Nascondi il fieldset
                        })
                        .catch(error => {
                            console.error("Errore:", error);
                        });
                });
            })
            .catch(error => {
                console.error("Errore:", error);
            });
    });
}





function cercaTutto(e) {
    e.preventDefault();
    const params = new URLSearchParams(); 

    let data = document.getElementById("dataRicerca").value;
    let corso = document.getElementById("corsoRicerca").value;
    let professore = document.getElementById("professoreRicerca").value.trim();

    if (!data) data = "1999-01-01";
    if (!corso) corso = "nope";
    if (!professore) professore = "nope";

    const url = `/esami/ricerca/${corso}/${data}/${professore}`;
    console.log("URL generato:", url);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante la ricerca per corso");
            }
            return response.text(); // Usa text() per gestire risposte vuote
        })
        .then(text => {
            const data = text ? JSON.parse(text) : []; // Parsa solo se il testo non è vuoto
            if (!Array.isArray(data) || data.length === 0) {
                alert("Nessun esame trovato per i criteri specificati.");
                return;
            }
            popolaTabella(data); // Aggiorna la tabella con i risultati
        })
        .catch(error => {
            console.error("Errore durante la ricerca per corso:", error);
        });
}



function prenotaEsame(codiceEsame, button) {
    // Ottieni l'utente loggato dalla sessione
    const utente = JSON.parse(sessionStorage.getItem("user"));

    if (!utente || !utente.matricola) {
        alert("Errore: utente non autenticato.");
        return;
    }

    const matricolaUtente = utente.matricola;

    // Crea il payload per la prenotazione
    const prenotazione = {
        codiceEsame: codiceEsame,
        matricolaUtente: matricolaUtente
    };

    // Effettua la richiesta POST per creare la prenotazione
    fetch(`/user/prenota/${matricolaUtente}/${codiceEsame}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(prenotazione)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante la prenotazione dell'esame");
            }
            return response.json();
        })
        .then(() => {
            alert("Esame prenotato con successo!");

            // Trasforma il bottone in "Cancella Prenotazione"
            button.innerText = "Cancella Prenotazione";
            button.classList.remove("btn-primary");
            button.classList.add("btn-danger");
            button.onclick = () => cancellaPrenotazione(codiceEsame, button);
        })
        .catch(error => {
            console.error("Errore durante la prenotazione:", error);
            alert("Si è verificato un errore durante la prenotazione dell'esame.");
        });
}

function cancellaPrenotazione(codiceEsame, button) {
    // Ottieni l'utente loggato dalla sessione
    const utente = JSON.parse(sessionStorage.getItem("user"));

    if (!utente || !utente.matricola) {
        alert("Errore: utente non autenticato.");
        return;
    }

    const matricolaUtente = utente.matricola;

    // Effettua la richiesta DELETE per cancellare la prenotazione
    fetch(`/user/prenota/${matricolaUtente}/${codiceEsame}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante la cancellazione della prenotazione");
            }
            return response.text(); 
        })
        .then(() => {
            alert("Prenotazione cancellata con successo!");

            // Trasforma il bottone in "Prenota"
            button.innerText = "Prenota";
            button.classList.remove("btn-danger");
            button.classList.add("btn-primary");
            button.onclick = () => prenotaEsame(codiceEsame, button);
        })
        .catch(error => {
            console.error("Errore durante la cancellazione della prenotazione:", error);
            alert("Si è verificato un errore durante la cancellazione della prenotazione.");
        });
}