package com.proyectorol.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ref_races")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RaceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Integer movement;

    @Column(length = 1000)
    private String description;

    @Column(name = "talent_names_csv")
    private String talentNamesCsv; // Ej. "Vista Aguda,Infravisión"
}
