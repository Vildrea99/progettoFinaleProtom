package it.accenture.progettoEsami.controller;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.accenture.progettoEsami.model.Esame;
import it.accenture.progettoEsami.model.EsameDTO;
import it.accenture.progettoEsami.service.EsamiService;

@RestController
@RequestMapping("esami")
public class EsameController {

	@Autowired
	private EsamiService esameService;

	@GetMapping
	public ResponseEntity<List<Esame>> getEsami() {
		return esameService.getAllEsame();
	}
	

	@GetMapping("/{id}")
	public ResponseEntity<Esame> getEsame(@PathVariable int id) {
		return esameService.getEsame(id);
	}

	@GetMapping("/professore/{professore}")
	public ResponseEntity<List<Esame>> getEsamebyProfessore(@PathVariable String professore) {
		return esameService.getEsamebyProfessore(professore);
	}

	@GetMapping("/corso/{corso}")
	public ResponseEntity<List<Esame>> getEsameByCorso(@PathVariable String corso) {
		return esameService.getEsamebyCorso(corso);
	}

	@GetMapping("/data/{data}")
	public ResponseEntity<List<Esame>> getEsamebyData(@PathVariable Date data) {
		return esameService.getEsamebyData(data);
	}
	
	@GetMapping("/ricerca/{corso}/{data}/{professore}")
	 public ResponseEntity<List<Esame>> getEsamebyCorsoAndDataAndProfessore(@PathVariable String corso, @PathVariable Date data, @PathVariable String professore) {
		return esameService.getEsamebyCorsoAndDataAndProfessore(corso, data, professore);
	}

	@PostMapping
	public ResponseEntity<Esame> creaEsame(@RequestBody EsameDTO esame) {
		return esameService.creaEsame(esame);
	}
 
	@PutMapping("/{id}") 
	public ResponseEntity<Esame> modificaEsame(@PathVariable int id, @RequestBody EsameDTO esame) {
		return esameService.modificaEsame(id, esame);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> cancellaEsame(@PathVariable int id){
		return esameService.cancellaEsame(id);
	}
	
	

}