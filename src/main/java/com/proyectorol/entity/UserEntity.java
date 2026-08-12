package com.proyectorol.entity;

import com.proyectorol.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    // Lista para recibir el hash de BCrypt (60 caracteres)
    @Column(nullable = false, length = 100)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role; // Asegúrate de que tu Enum UserRole tenga los valores PLAYER y DM

    @Column(name = "session_token", length = 255)
    private String sessionToken;

    // Relación Uno a Muchos con Characters (Inglés unificado)
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterEntity> characters = new ArrayList<>();

    // Métodos helper para sincronizar relación bidireccional
    public void addCharacter(CharacterEntity character) {
        characters.add(character);
        character.setUser(this);
    }

    public void removeCharacter(CharacterEntity character) {
        characters.remove(character);
        character.setUser(null);
    }

    @PrePersist
    public void prePersist() {
        if (this.role == null) {
            this.role = UserRole.PLAYER; // Asignación segura del Enum por defecto
        }
    }
}
