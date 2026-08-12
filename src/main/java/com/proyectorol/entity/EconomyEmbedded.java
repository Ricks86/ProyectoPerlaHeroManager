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
public class EconomyEmbedded {
    private Integer startingGoldRoll;
    private Integer initialGoldInMo;
    private Integer remainingMo;
    private Integer remainingMp;
    private Integer remainingMc;
}
