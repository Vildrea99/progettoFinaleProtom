package it.accenture.progettoEsami.model;

import java.util.LinkedList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
	@ManyToMany
	@JoinTable
	(name = "prenotazioni", joinColumns = @JoinColumn(name = "matricola"),
	inverseJoinColumns = @JoinColumn(name = "codiceEsame"))
	private List<Esame> esami = new LinkedList<>(); 
}
