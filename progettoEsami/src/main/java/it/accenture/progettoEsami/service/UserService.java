package it.accenture.progettoEsami.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import it.accenture.progettoEsami.model.Esame;
import it.accenture.progettoEsami.model.User;
import it.accenture.progettoEsami.model.User.Ruolo;
import it.accenture.progettoEsami.model.UserDTO;
import it.accenture.progettoEsami.repository.EsameRepository;
import it.accenture.progettoEsami.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private EsameRepository esameRepository;

	// Crea Utente
	public ResponseEntity<User> creaUser(UserDTO userDTO) {

		User user = new User();
		user.setNome(userDTO.getNome());
		user.setCognome(userDTO.getCognome());
		user.setIndirizzo(userDTO.getIndirizzo());
		user.setCF(userDTO.getCF());
		user.setEmail(userDTO.getEmail());
		user.setUsername(userDTO.getUsername());
		user.setPassword(userDTO.getPassword());

		user.setRuolo(Ruolo.STUDENTE);

		userRepository.save(user);

		return ResponseEntity.ok(user);
	}

	// Cerca utente per id
	public ResponseEntity<User> getUser(int id) {
		User user = userRepository.findById(id).orElse(null);
		ResponseEntity<User> response = null;

		if (user == null) {
			response = new ResponseEntity<User>(HttpStatus.NOT_FOUND);
		}
		response = ResponseEntity.ok(user);

		return response;
	}

	// Restituisce l'utente per username
	public ResponseEntity<Map<String, Boolean>> getUserByUsername(String username) {
		User user = userRepository.findByUsername(username);
		Map<String, Boolean> response = new HashMap<>();
		response.put("available", user == null); // true se il nome utente è disponibile
		return ResponseEntity.ok(response);
	}

	// Modifica utente
	public ResponseEntity<User> modificaUser(int id, UserDTO userDTO) {
		User userMod = userRepository.findById(id).orElse(null);
		ResponseEntity<User> response = null;

		if (userMod != null) {
			if (userDTO.getNome() != null) {
				userMod.setNome(userDTO.getNome());
			}
			if (userDTO.getCognome() != null) {
				userMod.setCognome(userDTO.getCognome());
			}
			if (userDTO.getIndirizzo() != null) {
				userMod.setIndirizzo(userDTO.getIndirizzo());
			}
			if (userDTO.getCF() != null) {
				userMod.setCF(userDTO.getCF());
			}
			if (userDTO.getEmail() != null) {
				userMod.setEmail(userDTO.getEmail());
			}
			if (userDTO.getUsername() != null) {
				userMod.setUsername(userDTO.getUsername());
			}
			if (userDTO.getPassword() != null) {
				userMod.setPassword(userDTO.getPassword());
			}

			userRepository.save(userMod);

			response = ResponseEntity.ok(userMod);

		} else {
			response = new ResponseEntity<User>(HttpStatus.NOT_FOUND);
		}
		return response;
	}

	// Elimina utente
	public ResponseEntity<Void> eliminaUser(int id) {
		User user = userRepository.findById(id).orElse(null);
		ResponseEntity<Void> response = null;

		if (user != null) {
			userRepository.delete(user);
			response = ResponseEntity.noContent().build();
		} else {
			response = new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
		return response;
	}

	// Restituisce tutti gli utenti
	public ResponseEntity<List<User>> getAllUsers() {
		return ResponseEntity.ok(userRepository.findAll());

	}

	// Prenota l'esame
	public ResponseEntity<Esame> prenotaEsame(int idEsame, int idStudente) {
		Esame esame = esameRepository.findById(idEsame).orElse(null);
		User studente = userRepository.findById(idStudente).orElse(null);

		ResponseEntity<Esame> response = null;
		if (esame != null && studente != null) {
			esame.getStudenti().add(studente);
			studente.getEsami().add(esame);
			response = ResponseEntity.ok(esame);

			esameRepository.save(esame);
			userRepository.save(studente);
		} else {
			response = new ResponseEntity<Esame>(HttpStatus.NOT_FOUND);
		}
		return response;

	}

	// Cancella la prenotazione di un esame
	public ResponseEntity<Void> cancellaPrenotazioneEsame(int idEsame, int idStudente) {
		Esame esame = esameRepository.findById(idEsame).orElse(null);
		User studente = userRepository.findById(idStudente).orElse(null);

		if (esame != null && studente != null) {
			// Rimuove lo studente dalla lista degli studenti dell'esame
			esame.getStudenti().remove(studente);
			// Rimuove l'esame dalla lista degli esami dello studente
			studente.getEsami().remove(esame);

			// Salva le modifiche
			esameRepository.save(esame);
			userRepository.save(studente);

			return ResponseEntity.noContent().build();
		} else {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
	}

}
