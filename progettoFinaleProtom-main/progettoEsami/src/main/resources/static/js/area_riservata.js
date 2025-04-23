let currentPage = 1;
itemsPerPage = 10;
let allExams = [];

document.addEventListener("DOMContentLoaded", () => {
    // Verifica login e carica esami
    checkLogin(() => {
        console.log("Utente autenticato");
        caricaEsami();
    });

    // Pulsante Home
    document.getElementById("btn-home").addEventListener("click", () => {
        window.location.href = "disimpegno.html";
    });

    // Pulsante Logout (se presente)
    const logoutButton = document.getElementById("btn-logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

    // Gestione Modal Prenotazione
    const modal = document.getElementById("prenotazioneModal");
    const closeModalButton = document.getElementById("closeModal");

    // Nascondi la modal all'inizio
    if (modal) {
        modal.style.display = "none";
    }

    // Listener per chiudere la modal
    if (closeModalButton && modal) {
        closeModalButton.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    // Controllo ruolo utente (SEGRETERIA)
    checkLogin(user => {
        console.log("Utente loggato:", user);
        const isSegreteria = user.ruolo === "SEGRETERIA";

        document.getElementById("btn-crea").style.display = isSegreteria ? "block" : "none";
        document.getElementById("btn-modifica").style.display = isSegreteria ? "block" : "none";
        document.getElementById("btn-cancella").style.display = isSegreteria ? "block" : "none";

        if (isSegreteria) {
            document.getElementById("btn-crea").addEventListener("click", creaEsame);
            document.getElementById("btn-modifica").addEventListener("click", modificaEsame);
            document.getElementById("btn-cancella").addEventListener("click", cancellaEsame);
        }
    });

    updatePaginationControls();
});

// Funzione per caricare gli esami
function caricaEsami(forceReload = false) {
    if (allExams.length > 0 && !forceReload) {
        displayPage(currentPage);
        return;
    }

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

            allExams = data.sort((a, b) => a.codiceEsame - b.codiceEsame);
            updatePaginationControls();
            displayPage(currentPage);
        })
        .catch(err => console.error("Errore:", err));
}

function displayPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageExams = allExams.slice(start, end);
    popolaTabella(pageExams);

    // Aggiorna i controlli
    document.getElementById("page-info").textContent = `Pagina ${page}`;
    document.getElementById("prev-page").disabled = page === 1;
    document.getElementById("next-page").disabled = end >= allExams.length;
}

document.getElementById("items-per-page").addEventListener("change", (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    displayPage(currentPage);
});

function updatePaginationControls() {
    document.getElementById("prev-page").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
        }
    });

    document.getElementById("next-page").addEventListener("click", () => {
        if ((currentPage * itemsPerPage) < allExams.length) {
            currentPage++;
            displayPage(currentPage);
        }
    });
}

// Funzione per popolare la tabella
async function popolaTabella(esami) {
    const table = document.getElementById("esami-table");
    const utente = JSON.parse(sessionStorage.getItem("user"));

    if (!utente || !utente.matricola) {
        alert("Errore: utente non autenticato.");
        return;
    }

    const matricolaUtente = utente.matricola;

    // Pulisci la tabella (mantenendo l'header)
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Aggiungi ogni esame alla tabella
    for (const esame of esami) {
        const tr = document.createElement("tr");

        // Aggiungi celle con i dati dell'esame
        const campi = ['codiceEsame', 'corso', 'data', 'orarioInizio', 'professore'];
        campi.forEach(campo => {
            const td = document.createElement("td");
            td.innerText = esame[campo];
            tr.appendChild(td);
        });

        // Aggiungi pulsante prenotazione
        const tdPrenota = document.createElement("td");
        const prenotaButton = await creaPulsantePrenotazione(matricolaUtente, esame, caricaEsami);
        tdPrenota.appendChild(prenotaButton);
        tr.appendChild(tdPrenota);

        table.appendChild(tr);
    }
}

// Crea pulsante prenotazione
async function creaPulsantePrenotazione(matricolaUtente, esame, callback = () => {
}) {
    const button = document.createElement("button");
    const prenotazione = await verificaPrenotazione(matricolaUtente, esame.codiceEsame);

    if (prenotazione) {
        button.innerText = "Mostra Prenotazione";
        button.classList.add("btn", "btn-info");
        button.onclick = () => mostraDettagliPrenotazione(matricolaUtente, esame.codiceEsame);
    } else {
        button.innerText = "Prenota";
        button.classList.add("btn", "btn-primary");
        button.onclick = () => prenotaEsame(esame.codiceEsame, button, callback);
    }

    return button;
}

// Ordina tabella
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

            // Determina direzione ordinamento
            const sortDirection = currentSortColumn === column ?
                (currentSortDirection === 'asc' ? 'desc' : 'asc') : 'asc';

            currentSortColumn = column;
            currentSortDirection = sortDirection;

            // Ordina i dati
            data.sort((a, b) => {
                if (a[column] < b[column]) return sortDirection === 'asc' ? -1 : 1;
                if (a[column] > b[column]) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });

            popolaTabella(data);
            updateSortIndicators(column, sortDirection);
        })
        .catch(err => console.error("Errore:", err));
}

// Aggiorna indicatori ordinamento
function updateSortIndicators(column, direction) {
    document.querySelectorAll("thead span").forEach(ind => ind.innerHTML = "");
    const indicator = document.getElementById(`sort-${column}`);
    if (indicator) {
        indicator.innerHTML = direction === 'asc' ? "&#9650;" : "&#9660;";
    }
}

// Gestione esami (SEGRETERIA)
function creaEsame() {
    const fieldset = document.getElementById("creaEsameFieldset");
    fieldset.style.display = "block";

    const salvaButton = document.getElementById("salvaEsame");
    const nuovoSalvaButton = salvaButton.cloneNode(true);
    salvaButton.parentNode.replaceChild(nuovoSalvaButton, salvaButton);

    nuovoSalvaButton.addEventListener("click", () => {
        const nuovoEsame = {
            corso: document.getElementById("corsoEsame").value.trim(),
            data: new Date(document.getElementById("dataEsame").value).toISOString().split("T")[0],
            orarioInizio: document.getElementById("orarioEsame").value + ":00",
            professore: document.getElementById("professoreEsame").value.trim()
        };

        if (Object.values(nuovoEsame).some(v => !v)) {
            alert("Tutti i campi sono obbligatori!");
            return;
        }

        fetch("/esami", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(nuovoEsame)
        })
            .then(response => {
                if (!response.ok) throw new Error("Errore durante la creazione");
                return response.json();
            })
            .then(() => {
                alert("Esame creato con successo!");
                caricaEsami(true);
                fieldset.style.display = "none";
                document.getElementById("corsoEsame").value = "";
                document.getElementById("dataEsame").value = "";
                document.getElementById("orarioEsame").value = "";
                document.getElementById("professoreEsame").value = "";
            })
            .catch(error => console.error("Errore:", error));
    });
}

function cancellaEsame() {
    const fieldset = document.getElementById("cancellaEsameFieldset");
    fieldset.style.display = "block";

    document.getElementById("confermaCancellaEsame").addEventListener("click", () => {
        const codiceEsame = document.getElementById("codiceEsameCancella").value.trim();
        if (!codiceEsame) {
            alert("Codice esame non inserito!");
            return;
        }

        fetch(`/esami/${codiceEsame}`, {method: "DELETE"})
            .then(response => {
                if (!response.ok) throw new Error("Errore durante l'eliminazione");
                return response.text();
            })
            .then(() => {
                alert("Esame cancellato con successo!");
                caricaEsami(true);
                fieldset.style.display = "none";
            })
            .catch(error => {
                console.error("Errore:", error);
                alert("Errore durante l'eliminazione dell'esame.");
            });
    });
}

function modificaEsame() {
    const fieldset = document.getElementById("modificaEsameFieldset");
    fieldset.style.display = "block";

    document.getElementById("cercaEsame").addEventListener("click", () => {
        const codiceEsame = document.getElementById("codiceEsameModifica").value.trim();
        if (!codiceEsame) {
            alert("Codice esame non inserito!");
            return;
        }

        fetch(`/esami/${codiceEsame}`)
            .then(response => {
                if (!response.ok) throw new Error("Errore nel recupero dati");
                return response.json();
            })
            .then(esame => {
                if (!esame) {
                    alert("Esame non trovato!");
                    return;
                }

                document.getElementById("corsoEsameModifica").value = esame.corso;
                document.getElementById("dataEsameModifica").value = esame.data;
                document.getElementById("orarioEsameModifica").value = esame.orarioInizio;
                document.getElementById("professoreEsameModifica").value = esame.professore;

                const salvaButton = document.getElementById("salvaModificaEsame");
                const nuovoSalvaButton = salvaButton.cloneNode(true);
                salvaButton.parentNode.replaceChild(nuovoSalvaButton, salvaButton);

                nuovoSalvaButton.addEventListener("click", () => {
                    const datiAggiornati = {
                        corso: document.getElementById("corsoEsameModifica").value.trim(),
                        data: document.getElementById("dataEsameModifica").value.trim(),
                        orarioInizio: document.getElementById("orarioEsameModifica").value.trim(),
                        professore: document.getElementById("professoreEsameModifica").value.trim()
                    };

                    fetch(`/esami/${codiceEsame}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(datiAggiornati)
                    })
                        .then(response => {
                            if (!response.ok) throw new Error("Errore durante l'aggiornamento");
                            return response.json();
                        })
                        .then(() => {
                            alert("Esame modificato con successo!");
                            caricaEsami(true);
                            fieldset.style.display = "none";
                        })
                        .catch(error => console.error("Errore:", error));
                });
            })
            .catch(error => console.error("Errore:", error));
    });
}

// Ricerca esami
function cercaTutto(e) {
    e.preventDefault();
    const data = document.getElementById("dataRicerca").value || "1999-01-01";
    const corso = document.getElementById("corsoRicerca").value || "nope";
    const professore = document.getElementById("professoreRicerca").value.trim() || "nope";

    fetch(`/esami/ricerca/${corso}/${data}/${professore}`)
        .then(response => {
            if (!response.ok) throw new Error("Errore durante la ricerca");
            return response.text();
        })
        .then(text => {
            const data = text ? JSON.parse(text) : [];
            if (!Array.isArray(data) || data.length === 0) {
                alert("Nessun esame trovato");
                return;
            }
            popolaTabella(data);
        })
        .catch(error => console.error("Errore:", error));
}

// Gestione prenotazioni
function mostraDettagliPrenotazione(matricola, codiceEsame) {
    fetch(`/prenota/${matricola}/${codiceEsame}`)
        .then(response => {
            if (!response.ok) throw new Error("Errore nel recupero dettagli");
            return response.json();
        })
        .then(prenotazione => {
            const modal = document.getElementById("prenotazioneModal");
            document.getElementById("modalCodicePrenotazione").innerText = prenotazione.codicePrenotazione;
            document.getElementById("modalCodiceEsame").innerText = prenotazione.esami.codiceEsame;
            document.getElementById("modalCorso").innerText = prenotazione.esami.corso;
            document.getElementById("modalData").innerText = new Date(prenotazione.dataPrenotazione).toLocaleString();

            document.getElementById("btnCancellaPrenotazione").onclick =
                () => cancellaPrenotazione(prenotazione.codicePrenotazione);

            modal.style.display = "block";
        })
        .catch(error => {
            console.error("Errore:", error);
            alert("Impossibile recuperare i dettagli");
        });
}

async function verificaPrenotazione(matricola, codiceEsame) {
    try {
        const response = await fetch(`/prenota/${matricola}/${codiceEsame}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Errore:", error);
        return null;
    }
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
        },
        body: JSON.stringify({
            matricola: matricolaUtente,
            codiceEsame: codiceEsame
        }) // Aggiunto il body per chiarezza
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante la prenotazione");
            }
            return response.json();
        })
        .then(() => {
            alert("Esame prenotato con successo!");
            caricaEsami();
        })
        .catch(error => {
            console.error("Errore:", error);
            alert("Errore durante la prenotazione");
        });
}

function cancellaPrenotazione(codicePrenotazione) {
    fetch(`/prenota/${codicePrenotazione}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    })
        .then(response => {
            if (!response.ok) throw new Error("Errore durante la cancellazione");
            alert("Prenotazione cancellata con successo!");
            document.getElementById("prenotazioneModal").style.display = "none";
            caricaEsami();
        })
        .catch(error => {
            console.error("Errore:", error);
            alert("Errore durante la cancellazione");
        });
}