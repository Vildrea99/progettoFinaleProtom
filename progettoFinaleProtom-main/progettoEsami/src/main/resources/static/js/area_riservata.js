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

    document.addEventListener("DOMContentLoaded", () => {
        const modal = document.getElementById("prenotazioneModal");
        const closeModalButton = document.getElementById("closeModal");

        if (modal && closeModalButton) {
            closeModalButton.addEventListener("click", () => {
                modal.classList.remove("show");
                modal.style.display = "none";
            });
        }

        const btnCancellaPrenotazione = document.getElementById("btnCancellaPrenotazione");
        if (btnCancellaPrenotazione) {
            btnCancellaPrenotazione.addEventListener("click", () => {
                const codicePrenotazione = document.getElementById("modalCodicePrenotazione").innerText;
                console.log("Codice prenotazione da cancellare:", codicePrenotazione);
                cancellaPrenotazione(codicePrenotazione);
            });
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        const modal = document.getElementById("prenotazioneModal");
        if (modal) {
            modal.style.display = "none";
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        const closeModalButton = document.querySelector(".close");
        const modal = document.getElementById("prenotazioneModal");

        if (closeModalButton && modal) {
            closeModalButton.addEventListener("click", () => {
                modal.classList.remove("show");
                modal.style.display = "none";
            });
        }
    });
});


//FUNZIONI

//Funzione per caricare gli esami nella tabella
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
            data.sort((a, b) => a.codiceEsame - b.codiceEsame);


            popolaTabella(data);
        })
        .catch(err => console.error("Errore:", err));
}


// Event Listener per il controllo sessione
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

    // Ottieni l'utente loggato dalla sessione
    const utente = JSON.parse(sessionStorage.getItem("user"));

    if (!utente || !utente.matricola) {
        alert("Errore: utente non autenticato.");
        return;
    }

    const matricolaUtente = utente.matricola;

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

        // Colonna per il pulsante prenota
        let tdPrenota = document.createElement("td");
        let prenotaButton = document.createElement("button");

        // Controlla se l'esame è prenotato dall'utente
        fetch(`/prenota/${matricolaUtente}/${esame.codiceEsame}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    // No booking found
                    prenotaButton.innerText = "Prenota";
                    prenotaButton.classList.add("btn", "btn-primary");
                    prenotaButton.onclick = () => prenotaEsame(esame.codiceEsame, prenotaButton);
                } else {
                    throw new Error("Errore durante il controllo della prenotazione");
                }
            })
            .then(prenotazione => {
                if (prenotazione) {
                    prenotaButton.innerText = "Mostra Prenotazione";
                    prenotaButton.classList.add("btn", "btn-info");
                    prenotaButton.onclick = () => mostraDettagliPrenotazione(matricolaUtente, esame.codiceEsame);
                }
            })
            .catch(error => {
                console.error("Errore durante il controllo della prenotazione:", error);
            });

        tdPrenota.appendChild(prenotaButton);
        tr.appendChild(tdPrenota);

        table.appendChild(tr);
    });
}


// Definizione della tabella
const table = document.getElementById("esami-table");

// Definizione delle intestazioni
const headers = ["Codice", "Corso", "Data", "Orario Inizio", "Professore", "Stato Prenotazione"];

let currentSortColumn = null;
let currentSortDirection = 'asc';

//Funzione per ordinare la tabella
function sortTable(column) {
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

            // Toggle sort direction if the same column is clicked
            if (currentSortColumn === column) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortDirection = 'asc';
            }
            currentSortColumn = column;

            // Sort data by the selected column
            data.sort((a, b) => {
                if (a[column] < b[column]) return currentSortDirection === 'asc' ? -1 : 1;
                if (a[column] > b[column]) return currentSortDirection === 'asc' ? 1 : -1;
                return 0;
            });

            // Update the table with sorted data
            popolaTabella(data);

            // Update the sort indicators
            updateSortIndicators(column, currentSortDirection);
        })
        .catch(err => console.error("Errore:", err));
}

//Funzione per aggiornare gli indici di ordinamento
function updateSortIndicators(column, direction) {
    // Reset all indicators
    const indicators = document.querySelectorAll("thead span");
    indicators.forEach(indicator => {
        indicator.innerHTML = ""; // Clear the content
    });

    // Set the indicator for the current column
    const currentIndicator = document.getElementById(`sort-${column}`);
    if (currentIndicator) {
        currentIndicator.innerHTML = direction === 'asc' ? "&#9650;" : "&#9660;"; // Up or Down arrow
    }
}


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
                const nuovoSalvaButton = salvaButton.cloneNode(true);
                salvaButton.parentNode.replaceChild(nuovoSalvaButton, salvaButton);

                nuovoSalvaButton.addEventListener("click", () => {
                    // Ottieni i nuovi valori dai campi
                    const nuovoCorso = document.getElementById("corsoEsameModifica").value.trim();
                    const nuovaData = document.getElementById("dataEsameModifica").value.trim();
                    const nuovoOrario = document.getElementById("orarioEsameModifica").value.trim();
                    const nuovoProfessore = document.getElementById("professoreEsameModifica").value.trim();

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


function mostraDettagliPrenotazione(matricola, codiceEsame) {
    fetch(`/prenota/${matricola}/${codiceEsame}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nel recupero dei dettagli della prenotazione");
            }
            return response.json();
        })
        .then(prenotazione => {
            const modal = document.getElementById("prenotazioneModal");
            document.getElementById("modalCodicePrenotazione").innerText = prenotazione.esami.codiceEsame;
            document.getElementById("modalCorso").innerText = prenotazione.esami.corso;
            document.getElementById("modalData").innerText = new Date(prenotazione.dataPrenotazione).toLocaleString();

            modal.style.display = "block"; // Mostra la modal
            modal.classList.add("show");
        })
        .catch(error => {
            console.error("Errore:", error);
            alert("Impossibile recuperare i dettagli della prenotazione.");
        });
}

function prenotaEsame(codiceEsame, button) {
    const utente = JSON.parse(sessionStorage.getItem("user"));

    if (!utente || !utente.matricola) {
        alert("Errore: utente non autenticato.");
        return;
    }

    const matricolaUtente = utente.matricola;

    fetch(`/prenota/${matricolaUtente}/${codiceEsame}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante la prenotazione dell'esame");
            }
            return response.json();
        })
        .then(prenotazione => {
            alert("Esame prenotato con successo!");
            button.innerText = "Show Prenotazione";
            button.classList.remove("btn-primary");
            button.classList.add("btn-info");
            button.onclick = () => mostraDettagliPrenotazione(matricolaUtente, codiceEsame);
        })
        .catch(error => {
            console.error("Errore:", error);
            alert("Si è verificato un errore durante la prenotazione dell'esame.");
        });
}

function cancellaPrenotazione(codicePrenotazione, button) {
    const utente = JSON.parse(sessionStorage.getItem("user"));

    if (!utente || !utente.matricola) {
        alert("Errore: utente non autenticato.");
        return;
    }

    const matricolaUtente = utente.matricola;


    fetch(`/prenota/${codicePrenotazione}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante la cancellazione della prenotazione");
            }
            alert("Prenotazione cancellata con successo!");
            const modal = document.getElementById("prenotazioneModal");
            modal.classList.remove("show");
            modal.style.display = "none";
            caricaEsami(); // Ricarica la tabella degli esami
        })
        .catch(error => {
            console.error("Errore:", error);
            alert("Si è verificato un errore durante la cancellazione della prenotazione.");
        });
}
