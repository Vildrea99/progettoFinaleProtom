 package it.accenture.progettoEsami.service;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import it.accenture.progettoEsami.model.Esame;
import it.accenture.progettoEsami.model.EsameDTO;
import it.accenture.progettoEsami.model.User;
import it.accenture.progettoEsami.model.UserDTO;
import it.accenture.progettoEsami.repository.EsameRepository;
import it.accenture.progettoEsami.repository.UserRepository;

@Service
public class EsamiService {

	@Autowired
	private EsameRepository esameRepository;

	@Autowired
	private UserRepository userRepository;

	// Crea Esame
	public ResponseEntity<Esame> creaEsame(EsameDTO esameDTO) {

		Esame esame = new Esame();
		esame.setCorso(esameDTO.getCorso());
		esame.setData(esameDTO.getData());
		esame.setOrarioInizio(esameDTO.getOrarioInizio());
		esame.setProfessore(esameDTO.getProfessore());

		esameRepository.save(esame);

		return ResponseEntity.ok(esame);
	}

	// Cerca esame per id
	public ResponseEntity<Esame> getEsame(int id) {
		Esame esame = esameRepository.findById(id).orElse(null);
		ResponseEntity<Esame> response = null;

		if (esame == null) {
			response = ResponseEntity.notFound().build();
		} else {
			response = ResponseEntity.ok(esame);
		}

		return response;
	}

	// Restituisce tutti gli esami
	public ResponseEntity<List<Esame>> getAllEsame() {
		return ResponseEntity.ok(esameRepository.findAll());

	}

	// Restituisce gli esami in base alla data
	public ResponseEntity<List<Esame>> getEsamebyData(Date data) {
		List<Esame> esami = esameRepository.findByData(data);
		ResponseEntity<List<Esame>> response = null;

		if (esami.isEmpty()) {
			response = ResponseEntity.notFound().build();
		} else {
			response = ResponseEntity.ok(esami);
		}

		return response;
	}

	// Restituisce gli esami in base al corso
	public ResponseEntity<List<Esame>> getEsamebyCorso(String corso) {
		List<Esame> esami = esameRepository.findByCorso(corso);
		ResponseEntity<List<Esame>> response = null;

		if (esami.isEmpty()) {
			response = ResponseEntity.notFound().build();
		} else {
			response = ResponseEntity.ok(esami);
		}

		return response;
	}

	// Restituisce gli esami in base al professore
	public ResponseEntity<List<Esame>> getEsamebyProfessore(String professore) {
		List<Esame> esami = esameRepository.findByProfessore(professore);
		ResponseEntity<List<Esame>> response = null;

		if (esami.isEmpty()) {
			response = ResponseEntity.notFound().build();
		} else {
			response = ResponseEntity.ok(esami);
		}

		return response;
	}

	public ResponseEntity<List<Esame>> getEsamebyCorsoAndDataAndProfessore(String corso, Date data, String professore) {
    List<Esame> esami;
    
    //Data di riferimento
    Date referenceDate = Date.valueOf("1999-01-01");

    // Check the provided parameters and build the appropriate query
    if (!corso.equals("nope") && !data.equals(referenceDate) && !professore.equals("nope")) {
        // All parameters are provided
        esami = esameRepository.findByCorsoAndDataAndProfessore(corso, data, professore);
    } else if (!corso.equals("nope") && !data.equals(referenceDate)) {
        // Only corso and data are provided
        esami = esameRepository.findByCorsoAndData(corso, data);
    } else if (!corso.equals("nope") && !professore.equals("nope")) {
        // Only corso and professore are provided
        esami = esameRepository.findByCorsoAndProfessore(corso, professore);
    } else if (!data.equals(referenceDate) && !professore.equals("nope")) {
        // Only data and professore are provided
        esami = esameRepository.findByDataAndProfessore(data, professore);
    } else if (!corso.equals("nope")) {
        // Only corso is provided
        esami = esameRepository.findByCorso(corso);
    } else if (!data.equals(referenceDate)) {
        // Only data is provided
        esami = esameRepository.findByData(data);
    } else if (!professore.equals("nope")) {
        // Only professore is provided
        esami = esameRepository.findByProfessore(professore);
    } else {
        // No parameters provided
        return ResponseEntity.badRequest().build();
    }
    
    

    // Controlla se la lista è vuota
    if (esami == null || esami.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(esami);
}

	// Restituisce tutti gli esami associati alla matricola indicata
	public List<Esame> getEsamiPrenotati(int matricola) {
		return userRepository.findEsamiByMatricola(matricola);
	}

	// Restituisce un booleano che controlla il caso
	// sia presente l'esame associato con la matricola indicata
	public boolean isEsamePrenotato(int matricola, int codiceEsame) {
		return esameRepository.isEsamePrenotato(matricola, codiceEsame);
	}

	// Cancella esame
	public ResponseEntity<Void> cancellaEsame(int id) {
		Esame esame = esameRepository.findById(id).orElse(null);
		ResponseEntity<Void> response = null;

		if (esame != null) {
			esameRepository.delete(esame);
			response = ResponseEntity.noContent().build();
		} else {
			response = ResponseEntity.notFound().build();
		}
		return response;
	}

	// Modifica esame tramite id
	public ResponseEntity<Esame> modificaEsame(int id, EsameDTO esameDTO) {
		Esame esameMod = esameRepository.findById(id).orElse(null);
		ResponseEntity<Esame> response = null;

		if (esameMod != null) {
			if (esameDTO.getCorso() != null) {
				esameMod.setCorso(esameDTO.getCorso());
			}
			if (esameDTO.getData() != null) {
				esameMod.setData(esameDTO.getData());
			}
			if (esameDTO.getOrarioInizio() != null) {
				esameMod.setOrarioInizio(esameDTO.getOrarioInizio());
			}
			if (esameDTO.getProfessore() != null) {
				esameMod.setProfessore(esameDTO.getProfessore());
			}

			esameRepository.save(esameMod);

			response = ResponseEntity.ok(esameMod);

		} else {
			response = ResponseEntity.notFound().build();
		}
		return response;
	}

}
