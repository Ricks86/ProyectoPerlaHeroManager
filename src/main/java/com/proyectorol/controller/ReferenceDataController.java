package com.proyectorol.controller;

import com.proyectorol.entity.ClassEntity;
import com.proyectorol.entity.RaceEntity;
import com.proyectorol.entity.TalentEntity;
import com.proyectorol.enums.AttributeDefinition;
import com.proyectorol.repository.ClassRepository;
import com.proyectorol.repository.RaceRepository;
import com.proyectorol.repository.TalentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/reference")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ReferenceDataController {

    private final TalentRepository talentRepository;
    private final RaceRepository raceRepository;
    private final ClassRepository classRepository;

    @GetMapping("/talents")
    public ResponseEntity<List<TalentEntity>> getAllTalents() {
        return ResponseEntity.ok(talentRepository.findAll());
    }

    @GetMapping("/races")
    public ResponseEntity<List<RaceEntity>> getAllRaces() {
        return ResponseEntity.ok(raceRepository.findAll());
    }

    @GetMapping("/classes")
    public ResponseEntity<List<ClassEntity>> getAllClasses() {
        return ResponseEntity.ok(classRepository.findAll());
    }

    @GetMapping("/attributes")
    public List<AttributeDefinition> getAttributeDictionary() {
        return Arrays.asList(AttributeDefinition.values());
    }
}
