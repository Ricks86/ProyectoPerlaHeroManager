package com.proyectorol.repository;

import com.proyectorol.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    //Método clave para el login: buscar al usuario por su nombre exacto
    Optional<UserEntity> findByUsername(String username);

    // Método útil para el registro: verificar si el nombre ya está tomado
    boolean existsByUsername(String username);
}

