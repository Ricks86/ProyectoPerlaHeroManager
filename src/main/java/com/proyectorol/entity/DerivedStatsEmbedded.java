package com.proyectorol.entity;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DerivedStatsEmbedded {
    private String hitDice;
    private Integer maxHp;
    private Integer currentHp;
    private Integer movement;
    private Integer defense;
    private String bonusChoice; // "INS", "ATQ", "POD"
}
