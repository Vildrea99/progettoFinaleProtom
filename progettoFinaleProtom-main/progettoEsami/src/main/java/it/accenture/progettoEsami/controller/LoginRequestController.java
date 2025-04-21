package it.accenture.progettoEsami.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.accenture.progettoEsami.model.LoginRequest;
import it.accenture.progettoEsami.model.User;
import it.accenture.progettoEsami.repository.UserRepository;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("login")
public class LoginRequestController {

	@Autowired
	private UserRepository userRepository;

	@PostMapping
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
		String username = loginRequest.getUsername();
		String password = loginRequest.getPassword();

		User user = userRepository.findByUsername(username);

		if (user != null && user.getPassword().equals(password)) {

			session.setAttribute("user", user);
			return ResponseEntity.ok(user);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenziali errate");
		}
	}

	@GetMapping
	public ResponseEntity<String> loginGet() {
		return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
				.body("L'endpoint /login supporta solo richieste POST.");
	}

	@GetMapping("/me")
	public ResponseEntity<?> currentUser(HttpSession session) {
		User user = (User) session.getAttribute("user");
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Non autenticato");
		}
		return ResponseEntity.ok(user);
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpSession session) {
		session.invalidate(); // cancella la sessione
		return ResponseEntity.ok().build();
	}
}
