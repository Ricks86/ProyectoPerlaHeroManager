package com.proyectorol.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ref_talents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TalentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String category; // "Raza", "Clase", "General"

    @Column(length = 2000, nullable = false)
    private String description;
}
