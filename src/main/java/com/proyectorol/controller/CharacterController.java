package com.proyectorol.controller;

import com.proyectorol.dto.CharacterDTO;
import com.proyectorol.service.CharacterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = "*") // Permite llamadas desde cualquier cliente estático o puerto local
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService characterService;

    /**
     * Endpoint para recibir y guardar el objeto JSON del personaje creado en el Wizard.
     * POST /api/characters
     */
    @PostMapping
    public ResponseEntity<CharacterDTO> createCharacter(@Valid @RequestBody CharacterDTO characterDTO) {
        log.info("Recibida petición POST para guardar personaje: {}", characterDTO.getName());
        CharacterDTO createdCharacter = characterService.createCharacter(characterDTO);
        return new ResponseEntity<>(createdCharacter, HttpStatus.CREATED);
    }

    /**
     * Endpoint para obtener todos los personajes guardados.
     * GET /api/characters
     */
    @GetMapping
    public ResponseEntity<List<CharacterDTO>> getAllCharacters() {
        List<CharacterDTO> characters = characterService.getAllCharacters();
        return ResponseEntity.ok(characters);
    }

    /**
     * Endpoint para obtener un personaje por ID.
     * GET /api/characters/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CharacterDTO> getCharacterById(@PathVariable Long id) {
        CharacterDTO character = characterService.getCharacterById(id);
        return ResponseEntity.ok(character);
    }

    /**
     * Endpoint para actualizar un personaje por ID.
     * PUT /api/characters/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<CharacterDTO> updateCharacter(@PathVariable Long id, @Valid @RequestBody CharacterDTO characterDTO) {
        log.info("Recibida petición PUT para actualizar personaje con id: {}", id);
        CharacterDTO updatedCharacter = characterService.updateCharacter(id, characterDTO);
        return ResponseEntity.ok(updatedCharacter);
    }

    /**
     * Endpoint para eliminar un personaje por ID.
     * DELETE /api/characters/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharacter(@PathVariable Long id) {
        log.info("Recibida petición DELETE para eliminar personaje con id: {}", id);
        characterService.deleteCharacter(id);
        return ResponseEntity.noContent().build();
    }
}
