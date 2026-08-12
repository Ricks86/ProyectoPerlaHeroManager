package com.proyectorol.repository;

import com.proyectorol.entity.CharacterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CharacterRepository extends JpaRepository<CharacterEntity, Long> {
    List<CharacterEntity> findByNameContainingIgnoreCase(String name);
    List<CharacterEntity> findByCharacterClass_Name(String className);
    List<CharacterEntity> findByRace_Name(String raceName);
}
