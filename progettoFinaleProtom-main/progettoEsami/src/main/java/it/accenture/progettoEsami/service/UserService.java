package it.accenture.progettoEsami.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import it.accenture.progettoEsami.model.Prenotazioni;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import it.accenture.progettoEsami.model.User;
import it.accenture.progettoEsami.model.User.Ruolo;
import it.accenture.progettoEsami.model.UserDTO;
import it.accenture.progettoEsami.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

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
		ResponseEntity<User> response;

		if (user == null) {
			return response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		return response = ResponseEntity.ok(user);


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
		ResponseEntity<User> response;

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

	// Restituisce tutti gli esami associati alla matricola indicata
	public List<Prenotazioni> getEsamiPrenotati(int matricola) {
		return userRepository.findById(matricola).orElse(null).getPrenotazioni();
	}


/*
AGGIUNGERE GLI ENDPOINT PER LE PRENOTAZIONI.
AGGIUSTARE I BOTTONI DI PRENOTAZIONE E CANCELLAZIONE
AGGIUSTARE IL BOTTONE DI MODIFICA UTENTE
CONTROLLARE IL BOTTONDE DI MODIFICA ESAME
 */
}
