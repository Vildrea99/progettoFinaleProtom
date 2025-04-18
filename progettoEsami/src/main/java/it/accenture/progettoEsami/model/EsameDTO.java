package it.accenture.progettoEsami.model;

import java.sql.Date;
import java.sql.Time;

import lombok.Data;

@Data 
public class EsameDTO {
	private String Corso;

	private Date data;

	private Time orarioInizio;

	private String professore;

}
