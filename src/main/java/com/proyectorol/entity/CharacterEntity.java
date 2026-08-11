package com.proyectorol.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "personajes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CharacterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "raza", nullable = false)
    private String raza;

    @Column(name = "clase", nullable = false)
    private String clase;

    @Column(name = "nivel", nullable = false)
    private Integer nivel;

    @Column(name = "xp", nullable = false)
    private Integer xp;

    @Column(name = "pv_actuales", nullable = false)
    private Integer pvActuales;

    @Column(name = "pv_maximos", nullable = false)
    private Integer pvMaximos;

    @Column(name = "defensa", nullable = false)
    private Integer defensa;

    @Column(name = "movimiento", nullable = false)
    private Integer movimiento;

    @Column(name = "oro", nullable = false)
    private Integer oro;

    @Column(name = "bono_homebrew")
    private String bonoHomebrew; // INS, ATQ, POD

    // Relación Muchos a Uno: Varios personajes pertenecen a un Usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private UserEntity usuario;

    // Relación Uno a Uno: Atributos del personaje
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "atributos_id", referencedColumnName = "id")
    private AttributesEntity atributos;

    // Relación Uno a Uno: Habilidades del personaje
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "habilidades_id", referencedColumnName = "id")
    private SkillsEntity habilidades;

    // Campos JSON para inventario y talentos (compatibles con Oracle DB CLOB)
    @Lob
    @Column(name = "inventario_json", length = 4000)
    private String inventarioJson;

    @Lob
    @Column(name = "talentos_json", length = 4000)
    private String talentosJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.nivel == null) this.nivel = 1;
        if (this.xp == null) this.xp = 0;
        if (this.oro == null) this.oro = 0;
    }
}
