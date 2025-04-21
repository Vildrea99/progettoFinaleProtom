package it.accenture.progettoEsami.service;

import it.accenture.progettoEsami.model.Esame;
import it.accenture.progettoEsami.model.Prenotazioni;
import it.accenture.progettoEsami.model.User;
import it.accenture.progettoEsami.repository.EsameRepository;
import it.accenture.progettoEsami.repository.PrenotazioniRepository;
import it.accenture.progettoEsami.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class PrenotazioniService {

    @Autowired
    private EsameRepository esameRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrenotazioniRepository prenotazioniRepository;

    // Prenota l'esame
    public ResponseEntity<Prenotazioni> prenotaEsame(int idEsame, int idStudente) {
        Esame esame = esameRepository.findById(idEsame).orElse(null);
        User studente = userRepository.findById(idStudente).orElse(null);
        Prenotazioni prenotazione = new Prenotazioni();

        if (esame != null && studente != null) {
            prenotazione.setStudente(studente);
            prenotazione.setEsami(esame);

            prenotazioniRepository.save(prenotazione);
            return ResponseEntity.ok(prenotazione);
        }
        return ResponseEntity.badRequest().body(null);
    }

    // Restituisce una prenotazione di cui si ha il codice
    public ResponseEntity<Prenotazioni> getPrenotazione(int codicePrenotazione) {
        Prenotazioni prenotazione = prenotazioniRepository.findById(codicePrenotazione).orElse(null);
        ResponseEntity<Prenotazioni> response;

        if (prenotazione != null) {
            return ResponseEntity.ok(prenotazione);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Restituisce tutte le prenotazioni legate a un utente
    public ResponseEntity<List<Prenotazioni>> getPrenotazioniStudente(int matricola){
        List<Prenotazioni> prenotazioni = new LinkedList<>();
        ResponseEntity<List<Prenotazioni>> response;

        prenotazioni = prenotazioniRepository.findAllByStudente_Matricola(matricola);

        if(prenotazioni.isEmpty()){
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(prenotazioni);
        }
    }

 ;   // Cancella la prenotazione di un esame
    public ResponseEntity<Void> cancellaPrenotazioneEsame(int idPrenotazione) {

        Prenotazioni prenotazione = prenotazioniRepository.findById(idPrenotazione).orElse(null);

        if (prenotazione != null) {
            prenotazioniRepository.delete(prenotazione);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}
