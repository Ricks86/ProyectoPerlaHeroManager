package com.proyectorol.repository;

import com.proyectorol.entity.RaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RaceRepository extends JpaRepository<RaceEntity, Long> {
    Optional<RaceEntity> findByName(String name);
}
