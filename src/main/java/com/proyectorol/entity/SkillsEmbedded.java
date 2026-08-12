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
public class SkillsEmbedded {
    private Integer alerta;
    private Integer comunicacion;
    private Integer manipulacion;
    private Integer erudicion;
    private Integer subterfugio;
    private Integer supervivencia;
}
