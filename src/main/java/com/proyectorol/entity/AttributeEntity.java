package com.proyectorol.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ref_attributes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttributeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String code; // "FUE", "DES", "CON", "INT", "SAB", "CAR"

    @Column(nullable = false)
    private String name; // "Fuerza", "Destreza", etc.

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String instinctUses;
}
