package it.accenture.progettoEsami.model;

import java.sql.Date;
import java.sql.Time;
import java.util.LinkedList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="Esami")
public class Esame {
	      
	// Attributi dell'esame
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int codiceEsame;
	
	@Column (nullable = false)
	private String corso;
	
	@Column (nullable = false)
	private Date data;
	
	@Column (nullable = false)
	private Time orarioInizio; 
	
	@Column (nullable = false)
	private String professore;
	
	@Column
	private boolean aperto=true;
	
	@JsonIgnore
	@ManyToMany(mappedBy = "esami", cascade = CascadeType.ALL)
	private List<User> studenti = new LinkedList<>();

}
