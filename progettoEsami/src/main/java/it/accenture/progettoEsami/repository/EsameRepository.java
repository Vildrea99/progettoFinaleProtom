package it.accenture.progettoEsami.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.accenture.progettoEsami.model.Esame;
import java.sql.Date;

@Repository
public interface EsameRepository extends JpaRepository<Esame, Integer> {

	public List<Esame> findByData(Date data);

	public List<Esame> findByCorso(String corso);

	public List<Esame> findByProfessore(String professore);
	
	public List<Esame> findByCorsoAndDataAndProfessore(String corso, Date data, String professore);
	
	public List<Esame> findByAperto(boolean aperto);
	
	public List<Esame> findByCorsoAndData(String corso, Date data);
	
	public List<Esame> findByCorsoAndProfessore(String corso, String professore);
	
	public List<Esame> findByDataAndProfessore(Date data, String professore);
	
	 @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
       "FROM Esame e JOIN e.studenti u " +
       "WHERE e.codiceEsame = :codiceEsame AND u.matricola = :matricola")
    boolean isEsamePrenotato(@Param("codiceEsame") int codiceEsame, @Param("matricola") int matricola);
    
    

	 
}
