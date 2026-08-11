package com.proyectorol.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ref_classes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "hit_dice", nullable = false)
    private String hitDice; // "d8", "d4", "d6"

    @Column(name = "max_hp_bonus", nullable = false)
    private Integer maxHpBonus; // 8, 4, 6

    @Column(length = 1000)
    private String weaponArmorProficiency;

    @Column(length = 1000)
    private String description;

    @Column(name = "talent_names_csv")
    private String talentNamesCsv; // Ej. "Lucha con X,Ataques Múltiples"
}
