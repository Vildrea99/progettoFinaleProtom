package it.accenture.progettoEsami.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.accenture.progettoEsami.model.Esame;
import it.accenture.progettoEsami.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
	
	User findByUsername(String username);


 

	 
	

}
