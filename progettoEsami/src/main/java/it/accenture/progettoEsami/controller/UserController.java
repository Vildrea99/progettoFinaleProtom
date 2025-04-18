package it.accenture.progettoEsami.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.accenture.progettoEsami.model.Esame;
import it.accenture.progettoEsami.model.User;
import it.accenture.progettoEsami.model.UserDTO;
import it.accenture.progettoEsami.service.UserService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;





@RestController
@RequestMapping("user")
public class UserController {
	
	@Autowired 
	private UserService userService;

	//Creazione utente (intefaccia con la registrazione)
	@PostMapping
	public ResponseEntity<User> creaUser(@RequestBody UserDTO userDto){
		return userService.creaUser(userDto);
	}
	
	//Restituisce una lista con tutti gli utenti
	@GetMapping
	public ResponseEntity <List<User>> getAllUser(){
		return userService.getAllUsers();
	}
	
	//Restituisce l'utente che ha la matricola indicata
	@GetMapping("/{id}")
	public ResponseEntity<User> getUserById(@RequestBody int id){
		return userService.getUser(id);
	}
	
	//Cerca il nome utente indicato e nel caso sia presente restituisce "Not available"
	@GetMapping("/username/{username}")
	public ResponseEntity<Map<String, Boolean>> getUserByUsername(@PathVariable String username) {
    	return userService.getUserByUsername(username);
	}
	
	//Permette la modifica dei dati di un utente
	@PutMapping("/{id}")
	public ResponseEntity<User> modificaUser(@PathVariable int id, @RequestBody UserDTO userDto){
		return userService.modificaUser(id, userDto);
	}
	
	//Cancella un utente dal database
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable int id){
		return userService.eliminaUser(id);
	}
	
	//Prenota un esame
	@PutMapping("/prenota/{matricola}/{codiceEsame}")      
	public ResponseEntity<Esame> prenotaEsame(@PathVariable int matricola, @PathVariable int codiceEsame){
		return userService.prenotaEsame(codiceEsame, matricola);
	}
	
	//Elimina una prenotazione
	@DeleteMapping("/prenota/{matricola}/{codiceEsame}")
	public ResponseEntity<Void>	cancellaPrenotazioneEsame(@PathVariable int matricola, @PathVariable int codiceEsame){
		return userService.cancellaPrenotazioneEsame(codiceEsame, matricola);
	}

}
