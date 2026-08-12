package com.proyectorol.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "characters")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CharacterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "character_level", nullable = false)
    private Integer level;

    @Column(nullable = false)
    private Integer experience;

    // --- RELACIONES CON TABLAS MAESTRAS (HOMEBREW) ---
    // Muchos personajes pueden elegir una misma Raza o Clase
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "race_id", nullable = false)
    private RaceEntity race;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity characterClass;

    // Relación Muchos a Uno: Varios personajes pertenecen a un Usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // Estándar SQL en singular
    private UserEntity user;

    // --- SECCIÓN DE OBJETOS EMBEBIDOS ---
    // En Java se ven como objetos anidados, pero en Oracle serán columnas normales de la tabla 'characters'

    @Embedded
    private StatsEmbedded stats;

    @Embedded
    private SkillsEmbedded skills;

    @Embedded
    private DerivedStatsEmbedded derivedStats;

    @Embedded
    private EconomyEmbedded economy;

    // Campos JSON para inventario y talentos (compatibles con Oracle DB CLOB)
    @Lob
    @Column(name = "inventory_json")
    private String inventoryJson;

    @Lob
    @Column(name = "talents_json")
    private String talentsJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.level == null) this.level = 1;
        if (this.experience == null) this.experience = 0;
    }
}
