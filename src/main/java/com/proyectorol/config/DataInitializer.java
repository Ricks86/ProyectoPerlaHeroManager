package com.proyectorol.config;

import com.proyectorol.entity.AttributeEntity;
import com.proyectorol.entity.ClassEntity;
import com.proyectorol.entity.RaceEntity;
import com.proyectorol.entity.TalentEntity;
import com.proyectorol.repository.AttributeRepository;
import com.proyectorol.repository.ClassRepository;
import com.proyectorol.repository.RaceRepository;
import com.proyectorol.repository.TalentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TalentRepository talentRepository;
    private final RaceRepository raceRepository;
    private final ClassRepository classRepository;
    private final AttributeRepository attributeRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Inicializando datos de referencia oficial 'Vieja Escuela' en H2 Database...");

        seedTalents();
        seedRaces();
        seedClasses();
        seedAttributes();

        log.info("Sembrado de datos de referencia completado con éxito.");
    }

    private void seedTalents() {
        if (talentRepository.count() > 0) return;

        saveTalent("Adaptable", "Raza", "De alguna forma tienes facilidad para adaptarte a cualquier ambiente y entorno. Ganas un modificador adicional de +1 a tu rasgo de Instintos.");
        saveTalent("Afín a la Piedra", "Raza", "Tienes ventaja en cualquier prueba de Erudición relacionada con el trabajo sobre piedra. También puedes hacer una prueba de Alerta para detectar trampas hechas sobre roca.");
        saveTalent("Ataques Múltiples", "Clase", "Al abatir a un enemigo puedes realizar inmediatamente otro ataque. De esta forma puedes encadenar tantos ataques EXTRA como nivel tengas.");
        saveTalent("Certero", "Raza", "Tienes un bono adicional de +1 en todos los ataques de proyectiles.");
        saveTalent("Dedos Ágiles", "Clase", "Tienes ventaja en las pruebas de Manipulación que requieran precisión (por ejemplo abrir cerraduras o sustraer las posesiones de otra persona).");
        saveTalent("Emboscar", "Clase", "Tienes ventaja en las pruebas de Subterfugio basadas en moverse en silencio y en ocultarse en las sombras. Añade 1d6 al daño cuando ataques a un blanco desprevenido.");
        saveTalent("Escurridizo", "Raza", "Tienes ventaja en las pruebas de Subterfugio relacionadas con moverse en silencio.");
        saveTalent("Ímpetu Emprendedor", "Raza", "Vives la vida con intensidad. Ganas un trasfondo adicional.");
        saveTalent("Infravisión", "Raza", "Ves en la oscuridad hasta 20 metros. La visión se basa en el calor desprendido por los objetos.");
        saveTalent("Lucha con X", "Clase", "Sustituye X por: arma de mano y escudo o dos armas de mano o armas a dos manos o armas de proyectiles. Peleando de esa forma ganas +1 al ataque y al daño.");
        saveTalent("Sensibilidad Mágica", "Clase", "Puedes gastar puntos de poder (Pod) para realizar conjuros.");
        saveTalent("Transferir Esencia", "Clase", "Puedes convertir 3 puntos de vida en un punto de poder (Pod).");
        saveTalent("Vista Aguda", "Raza", "Tienes ventaja en las pruebas de Alerta basadas en la vista.");
    }

    private void saveTalent(String name, String category, String description) {
        talentRepository.save(TalentEntity.builder()
                .name(name)
                .category(category)
                .description(description)
                .build());
    }

    private void seedRaces() {
        if (raceRepository.count() > 0) return;

        raceRepository.save(RaceEntity.builder()
                .name("Elfo")
                .movement(12)
                .description("Ganas los talentos Vista Aguda e Infravisión. Tu movimiento (Mov) es de 12.")
                .talentNamesCsv("Vista Aguda,Infravisión")
                .build());

        raceRepository.save(RaceEntity.builder()
                .name("Enano")
                .movement(9)
                .description("Ganas los talentos Afín a la Piedra e Infravisión. Tu movimiento (Mov) es de 9.")
                .talentNamesCsv("Afín a la Piedra,Infravisión")
                .build());

        raceRepository.save(RaceEntity.builder()
                .name("Mediano")
                .movement(9)
                .description("Ganas los talentos Escurridizo y Certero. Tu movimiento (Mov) es de 9.")
                .talentNamesCsv("Escurridizo,Certero")
                .build());

        raceRepository.save(RaceEntity.builder()
                .name("Humano")
                .movement(12)
                .description("Ganas los talentos Ímpetu Emprendedor y Adaptable. Tu movimiento (Mov) es de 12.")
                .talentNamesCsv("Ímpetu Emprendedor,Adaptable")
                .build());
    }

    private void seedClasses() {
        if (classRepository.count() > 0) return;

        classRepository.save(ClassEntity.builder()
                .name("Guerrero")
                .hitDice("d8")
                .maxHpBonus(8)
                .weaponArmorProficiency("Puedes usar cualquier arma y armadura.")
                .description("Ganas los talentos Lucha con X y Ataques Múltiples. Puedes usar cualquier arma y armadura. Dado de Aguante (DA): d8.")
                .talentNamesCsv("Lucha con X,Ataques Múltiples")
                .build());

        classRepository.save(ClassEntity.builder()
                .name("Hechicero")
                .hitDice("d4")
                .maxHpBonus(4)
                .weaponArmorProficiency("Solo puedes usar dagas, bastones y hondas. No puedes usar ninguna armadura.")
                .description("Ganas los talentos Sensibilidad Mágica y Transferir Esencia. Solo puedes usar dagas, bastones y hondas. No puedes usar ninguna armadura. Dado de Aguante (DA): d4.")
                .talentNamesCsv("Sensibilidad Mágica,Transferir Esencia")
                .build());

        classRepository.save(ClassEntity.builder()
                .name("Bribón")
                .hitDice("d6")
                .maxHpBonus(6)
                .weaponArmorProficiency("Puedes usar cualquier arma pero solo armaduras ligeras (cuero).")
                .description("Ganas los talentos Emboscar y Dedos Ágiles. Puedes usar cualquier arma pero solo armaduras ligeras (cuero). Dado de Aguante (DA): d6.")
                .talentNamesCsv("Emboscar,Dedos Ágiles")
                .build());
    }

    private void seedAttributes() {
        if (attributeRepository.count() > 0) return;

        attributeRepository.save(AttributeEntity.builder()
                .code("FUE")
                .name("Fuerza")
                .description("Capacidad física y potencia de impacto.")
                .instinctUses("Resistir la paralización, resistir la petrificación, etc. Añade modificador a ataques cuerpo a cuerpo y daño.")
                .build());

        attributeRepository.save(AttributeEntity.builder()
                .code("DES")
                .name("Destreza")
                .description("Agilidad, reflejos y coordinación motora.")
                .instinctUses("Evitar caer por un pozo, esquivar un proyectil en el último segundo, esquivar un arma de aliento o bola de fuego. Suma a Defensa y proyectiles.")
                .build());

        attributeRepository.save(AttributeEntity.builder()
                .code("CON")
                .name("Constitución")
                .description("Resistencia física, vitalidad y salud corporal.")
                .instinctUses("Resistir un veneno, sobreponerse a una enfermedad, evitar un contagio, etc. Suma modificador a los Puntos de Vida por nivel.")
                .build());

        attributeRepository.save(AttributeEntity.builder()
                .code("INT")
                .name("Inteligencia")
                .description("Razonamiento, memoria y aptitud mágica arcana.")
                .instinctUses("Resistir el control mental sutil o la influencia no evidente. Otorga Puntos de Poder (Pod) adicionales para Hechiceros.")
                .build());

        attributeRepository.save(AttributeEntity.builder()
                .code("SAB")
                .name("Sabiduría")
                .description("Percepción, fuerza de voluntad y salud mental.")
                .instinctUses("Resistirse a una ilusión, evitar mirar un glifo o símbolo mágico, etc. Mide la Salud Mental del aventurero.")
                .build());

        attributeRepository.save(AttributeEntity.builder()
                .code("CAR")
                .name("Carisma")
                .description("Presencia personal, liderazgo y encanto.")
                .instinctUses("Cualquier efecto de control mental directo o intento evidente de influencia.")
                .build());
    }
}
