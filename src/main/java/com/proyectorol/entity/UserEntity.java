package com.proyectorol.entity;

import com.proyectorol.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
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

    @Column(nullable = false, length = 100)
    private String password; // Texto plano por ahora según requerimiento

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role; // DM o JUGADOR

    // Relación Uno a Muchos con Personajes
    @Builder.Default
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterEntity> personajes = new ArrayList<>();

    // Métodos helper para sincronizar relación bidireccional
    public void addPersonaje(CharacterEntity personaje) {
        personajes.add(personaje);
        personaje.setUsuario(this);
    }

    public void removePersonaje(CharacterEntity personaje) {
        personajes.remove(personaje);
        personaje.setUsuario(null);
    }
}
