package com.proyectorol.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "habilidades")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "alerta", nullable = false)
    private Integer alerta;

    @Column(name = "comunicacion", nullable = false)
    private Integer comunicacion;

    @Column(name = "manipulacion", nullable = false)
    private Integer manipulacion;

    @Column(name = "erudicion", nullable = false)
    private Integer erudicion;

    @Column(name = "subterfugio", nullable = false)
    private Integer subterfugio;

    @Column(name = "supervivencia", nullable = false)
    private Integer supervivencia;

    // Relación Uno a Uno bidireccional con Personaje
    @OneToOne(mappedBy = "habilidades")
    private CharacterEntity personaje;
}
