package it.accenture.progettoEsami.repository;

import it.accenture.progettoEsami.model.Prenotazioni;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrenotazioniRepository extends JpaRepository <Prenotazioni, Integer> {

    List<Prenotazioni> findAllByStudente_Matricola(int studenteMatricola);
}
