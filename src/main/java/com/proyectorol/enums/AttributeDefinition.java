package com.proyectorol.enums;

import lombok.Getter;

@Getter
public enum AttributeDefinition {
    FUE("Fuerza", "Capacidad física y potencia de impacto.", "Resistir la paralización..."),
    DES("Destreza", "Agilidad, reflejos y coordinación motora.", "Evitar caer por un pozo..."),
    CON("Constitución", "Resistencia física, vitalidad y salud corporal.", "Resistir un veneno..."),
    INT("Inteligencia", "Razonamiento, memoria y aptitud mágica arcana.", "Resistir el control mental..."),
    SAB("Sabiduría", "Percepción, fuerza de voluntad y salud mental.", "Resistirse a una ilusión..."),
    CAR("Carisma", "Presencia personal, liderazgo y encanto.", "Cualquier efecto de control mental...");

    private final String name;
    private final String description;
    private final String instinctUses;

    AttributeDefinition(String name, String description, String instinctUses) {
        this.name = name;
        this.description = description;
        this.instinctUses = instinctUses;
    }
}
