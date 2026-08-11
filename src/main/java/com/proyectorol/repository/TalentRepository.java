package com.proyectorol.repository;

import com.proyectorol.entity.TalentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TalentRepository extends JpaRepository<TalentEntity, Long> {
    Optional<TalentEntity> findByName(String name);
}
