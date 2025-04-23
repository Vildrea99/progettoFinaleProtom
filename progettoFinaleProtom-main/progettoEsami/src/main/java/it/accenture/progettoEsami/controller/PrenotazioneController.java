package it.accenture.progettoEsami.controller;

import it.accenture.progettoEsami.model.Prenotazioni;
import it.accenture.progettoEsami.service.PrenotazioniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("prenota")
public class PrenotazioneController {

    @Autowired
    private PrenotazioniService prenotazioniService;

    //Prenota un esame
    @PostMapping("/{matricola}/{codiceEsame}")
    public ResponseEntity<Prenotazioni> prenotaEsame(@PathVariable int matricola, @PathVariable int codiceEsame) {
        return prenotazioniService.prenotaEsame(matricola, codiceEsame);
    }
    //Restituisce una prenotazione di cui si ha il codice
    @GetMapping("/{codicePrenotazione}")
    public ResponseEntity<Prenotazioni> getPrenotazione(@PathVariable int codicePrenotazione) {
        return prenotazioniService.getPrenotazione(codicePrenotazione);
    }

    @GetMapping("/{matricola}/{codiceEsame}")
    public ResponseEntity<Prenotazioni> getPrenotazioneSenzaCodice(@PathVariable int matricola, @PathVariable int codiceEsame) {
        return prenotazioniService.getPrenotazioneSenzaCodice(matricola, codiceEsame);
    }

    //Restituisce tutte le prenotazioni legate a una matricola
    @GetMapping("/{matricola}")
    public ResponseEntity<List<Prenotazioni>> getPrenotazioniStudente(@PathVariable int matricola){
        return prenotazioniService.getPrenotazioniStudente(matricola);
    }

    //Elimina una prenotazione
    @DeleteMapping("/{codicePrenotazione}")
    public ResponseEntity<Void> cancellaPrenotazioneEsame(@PathVariable int codicePrenotazione) {
        return prenotazioniService.cancellaPrenotazioneEsame(codicePrenotazione);
    }
}
