package com.proyectorol.repository;

import com.proyectorol.entity.AttributeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AttributeRepository extends JpaRepository<AttributeEntity, Long> {
    Optional<AttributeEntity> findByCode(String code);
}
