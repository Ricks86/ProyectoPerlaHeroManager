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
public class StatsEmbedded {
    private Integer fue;
    private Integer des;
    private Integer con;
    private Integer intStat; // Evita el conflicto con la palabra reservada 'int'
    private Integer sab;
    private Integer car;
}
