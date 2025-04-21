package it.accenture.progettoEsami.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table
public class Prenotazioni {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int codicePrenotazione;

    @ManyToOne
    @JoinColumn(name = "matricola")
    private User studente;

    @ManyToOne
    @JoinColumn(name = "codiceEsame")
    private Esame esami;

    private Date dataPrenotazione;
    
}
