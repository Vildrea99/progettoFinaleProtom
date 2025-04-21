package it.accenture.progettoEsami.model;

import java.util.LinkedList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Entity
@Data
@Table(name = "Utenti", uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class User {

	// Enum per i ruoli degli utenti
	public enum Ruolo {
		STUDENTE, PROFESSORE, SEGRETERIA
	}

	// Attributi dell'utente
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int matricola;

	@Column(nullable = false)
	private String nome;

	@Column(nullable = false)
	private String cognome;

	private String indirizzo;

	@Column(length = 16, nullable = false)
	private String CF;
	
	@Column(length = 50, nullable = false)
	private String email;

	@Column(nullable = false)
	private String username;

	@Column(nullable = false )
	private String password;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private Ruolo ruolo;

	@JsonIgnore
	@OneToMany(mappedBy = "studente", cascade = CascadeType.ALL)
	private List<Prenotazioni> prenotazioni = new LinkedList<>(); 
}
