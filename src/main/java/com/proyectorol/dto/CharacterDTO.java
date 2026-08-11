package com.proyectorol.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CharacterDTO {

    private Long id;

    @NotBlank(message = "El nombre del personaje no puede estar vacío")
    private String name;

    @NotBlank(message = "La raza es obligatoria")
    private String race;

    @NotBlank(message = "La clase es obligatoria")
    private String characterClass;

    @NotNull
    @Min(1)
    private Integer level;

    @NotNull
    @Min(0)
    private Integer experience;

    @NotNull
    private StatsDTO stats;

    @NotNull
    private SkillsDTO skills;

    @NotNull
    private DerivedStatsDTO derivedStats;

    @NotNull
    private EconomyDTO economy;

    private List<InventoryItemDTO> inventory;
    private List<TalentDTO> talents;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsDTO {
        private Integer fue;
        private Integer des;
        private Integer con;
        private Integer intStat; // 'int' es palabra reservada en Java
        private Integer sab;
        private Integer car;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillsDTO {
        private Integer alerta;
        private Integer comunicacion;
        private Integer manipulacion;
        private Integer erudicion;
        private Integer subterfugio;
        private Integer supervivencia;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DerivedStatsDTO {
        private String hitDice;
        private Integer maxHp;
        private Integer currentHp;
        private Integer movement;
        private Integer defense;
        private String bonusChoice; // "INS", "ATQ", "POD"
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EconomyDTO {
        private Integer startingGoldRoll;
        private Integer initialGoldInMo;
        private CoinBalanceDTO remainingCoins;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoinBalanceDTO {
        private Integer mo;
        private Integer mp;
        private Integer mc;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryItemDTO {
        private String id;
        private String name;
        private String category;
        private Double priceInMo;
        private Integer quantity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TalentDTO {
        private String name;
        private String origin; // "Raza" o "Clase"
        private String description;
    }
}
