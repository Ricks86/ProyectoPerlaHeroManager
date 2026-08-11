package com.proyectorol.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "atributos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttributesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fue", nullable = false)
    private Integer fue;

    @Column(name = "des", nullable = false)
    private Integer des;

    @Column(name = "con", nullable = false)
    private Integer con;

    @Column(name = "int_stat", nullable = false)
    private Integer intStat; // 'INT' es palabra reservada en SQL

    @Column(name = "sab", nullable = false)
    private Integer sab;

    @Column(name = "car", nullable = false)
    private Integer car;

    // Relación Uno a Uno bidireccional con Personaje
    @OneToOne(mappedBy = "atributos")
    private CharacterEntity personaje;
}
