package com.proyectorol.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.proyectorol.dto.CharacterDTO;
import com.proyectorol.entity.*;
import com.proyectorol.repository.CharacterRepository;
import com.proyectorol.repository.ClassRepository;
import com.proyectorol.repository.RaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CharacterService {

    private final CharacterRepository characterRepository;
    private final RaceRepository raceRepository;
    private final ClassRepository classRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public CharacterDTO createCharacter(CharacterDTO dto) {
        log.info("Creando nuevo personaje: {}", dto.getName());
        CharacterEntity entity = mapToEntity(dto);
        CharacterEntity savedEntity = characterRepository.save(entity);
        return mapToDTO(savedEntity);
    }

    @Transactional(readOnly = true)
    public List<CharacterDTO> getAllCharacters() {
        return characterRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CharacterDTO getCharacterById(Long id) {
        CharacterEntity entity = characterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personaje no encontrado con id: " + id));
        return mapToDTO(entity);
    }

    @Transactional
    public CharacterDTO updateCharacter(Long id, CharacterDTO dto) {
        log.info("Actualizando personaje con id: {}", id);
        CharacterEntity existingEntity = characterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personaje no encontrado con id: " + id));

        CharacterEntity updatedEntity = mapToEntity(dto);
        updatedEntity.setId(existingEntity.getId());
        updatedEntity.setCreatedAt(existingEntity.getCreatedAt());

        CharacterEntity savedEntity = characterRepository.save(updatedEntity);
        return mapToDTO(savedEntity);
    }

    @Transactional
    public void deleteCharacter(Long id) {
        log.info("Eliminando personaje con id: {}", id);
        if (!characterRepository.existsById(id)) {
            throw new RuntimeException("Personaje no encontrado con id: " + id);
        }
        characterRepository.deleteById(id);
    }

    private CharacterEntity mapToEntity(CharacterDTO dto) {
        String invJson = "";
        String talJson = "";
        try {
            if (dto.getInventory() != null) {
                invJson = objectMapper.writeValueAsString(dto.getInventory());
            }
            if (dto.getTalents() != null) {
                talJson = objectMapper.writeValueAsString(dto.getTalents());
            }
        } catch (JsonProcessingException e) {
            log.error("Error al serializar inventario o talentos a JSON", e);
        }

        // 1. BUSCAR LAS ENTIDADES MAESTRAS (Homebrew validado)
        RaceEntity raceEntity = raceRepository.findByName(dto.getRace())
                .orElseThrow(() -> new IllegalArgumentException("La raza especificada no existe en la base de datos."));

        ClassEntity classEntity = classRepository.findByName(dto.getCharacterClass())
                .orElseThrow(() -> new IllegalArgumentException("La clase especificada no existe en la base de datos."));

        // 2. CONSTRUIR EL PERSONAJE
        return CharacterEntity.builder()
                .name(dto.getName())
                .race(raceEntity)           // Inyectamos el objeto real
                .characterClass(classEntity) // Inyectamos el objeto real
                .level(dto.getLevel() != null ? dto.getLevel() : 1)
                .experience(dto.getExperience() != null ? dto.getExperience() : 0)

                // 3. OBJETOS EMBEBIDOS
                .stats(dto.getStats() != null ? StatsEmbedded.builder()
                                                .fue(dto.getStats().getFue())
                                                .des(dto.getStats().getDes())
                                                .con(dto.getStats().getCon())
                                                .intStat(dto.getStats().getIntStat())
                                                .sab(dto.getStats().getSab())
                                                .car(dto.getStats().getCar())
                                                .build() : new StatsEmbedded())

                .skills(dto.getSkills() != null ? SkillsEmbedded.builder()
                                                  .alerta(dto.getSkills().getAlerta())
                                                  .comunicacion(dto.getSkills().getComunicacion())
                                                  .manipulacion(dto.getSkills().getManipulacion())
                                                  .erudicion(dto.getSkills().getErudicion())
                                                  .subterfugio(dto.getSkills().getSubterfugio())
                                                  .supervivencia(dto.getSkills().getSupervivencia())
                                                  .build() : new SkillsEmbedded())

                .derivedStats(dto.getDerivedStats() != null ? DerivedStatsEmbedded.builder()
                                                              .hitDice(dto.getDerivedStats().getHitDice())
                                                              .maxHp(dto.getDerivedStats().getMaxHp())
                                                              .currentHp(dto.getDerivedStats().getCurrentHp())
                                                              .movement(dto.getDerivedStats().getMovement())
                                                              .defense(dto.getDerivedStats().getDefense())
                                                              .bonusChoice(dto.getDerivedStats().getBonusChoice())
                                                              .build() : new DerivedStatsEmbedded())

                .economy(dto.getEconomy() != null ? EconomyEmbedded.builder()
                                                    .startingGoldRoll(dto.getEconomy().getStartingGoldRoll())
                                                    .initialGoldInMo(dto.getEconomy().getInitialGoldInMo())
                                                    .remainingMo(dto.getEconomy().getRemainingCoins() != null ? dto.getEconomy().getRemainingCoins().getMo() : 0)
                                                    .remainingMp(dto.getEconomy().getRemainingCoins() != null ? dto.getEconomy().getRemainingCoins().getMp() : 0)
                                                    .remainingMc(dto.getEconomy().getRemainingCoins() != null ? dto.getEconomy().getRemainingCoins().getMc() : 0)
                                                    .build() : new EconomyEmbedded())

                // 4. JSONs
                .inventoryJson(invJson)
                .talentsJson(talJson)
                .build();
    }

    private CharacterDTO mapToDTO(CharacterEntity entity) {
        List<CharacterDTO.InventoryItemDTO> inv = Collections.emptyList();
        List<CharacterDTO.TalentDTO> tal = Collections.emptyList();
        try {
            if (entity.getInventoryJson() != null && !entity.getInventoryJson().isEmpty()) {
                inv = objectMapper.readValue(entity.getInventoryJson(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, CharacterDTO.InventoryItemDTO.class));
            }
            if (entity.getTalentsJson() != null && !entity.getTalentsJson().isEmpty()) {
                tal = objectMapper.readValue(entity.getTalentsJson(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, CharacterDTO.TalentDTO.class));
            }
        } catch (JsonProcessingException e) {
            log.error("Error al deserializar JSON de inventario o talentos", e);
        }

        return CharacterDTO.builder()
                .id(entity.getId())
                .name(entity.getName())

                // 1. Extraer el nombre de las Entidades Maestras (con protección contra nulos)
                .race(entity.getRace() != null ? entity.getRace().getName() : "Desconocida")
                .characterClass(entity.getCharacterClass() != null ? entity.getCharacterClass().getName() : "Desconocida")

                .level(entity.getLevel())
                .experience(entity.getExperience())

                // 2. Extraer datos del objeto embebido Stats
                .stats(entity.getStats() != null ? CharacterDTO.StatsDTO.builder()
                                                   .fue(entity.getStats().getFue())
                                                   .des(entity.getStats().getDes())
                                                   .con(entity.getStats().getCon())
                                                   .intStat(entity.getStats().getIntStat())
                                                   .sab(entity.getStats().getSab())
                                                   .car(entity.getStats().getCar())
                                                   .build() : null)

                // 3. Extraer datos del objeto embebido Skills
                .skills(entity.getSkills() != null ? CharacterDTO.SkillsDTO.builder()
                                                     .alerta(entity.getSkills().getAlerta())
                                                     .comunicacion(entity.getSkills().getComunicacion())
                                                     .manipulacion(entity.getSkills().getManipulacion())
                                                     .erudicion(entity.getSkills().getErudicion())
                                                     .subterfugio(entity.getSkills().getSubterfugio())
                                                     .supervivencia(entity.getSkills().getSupervivencia())
                                                     .build() : null)

                // 4. Extraer datos del objeto embebido DerivedStats y de las Entidades Maestras
                .derivedStats(CharacterDTO.DerivedStatsDTO.builder()
                        // Sacamos el hitDice y movement directamente de la base de datos maestra para máxima precisión
                        .hitDice(entity.getCharacterClass() != null ? entity.getCharacterClass().getHitDice() : "d6")
                        .movement(entity.getRace() != null ? entity.getRace().getMovement() : 12)

                        .maxHp(entity.getDerivedStats() != null ? entity.getDerivedStats().getMaxHp() : 0)
                        .currentHp(entity.getDerivedStats() != null ? entity.getDerivedStats().getCurrentHp() : 0)
                        .defense(entity.getDerivedStats() != null ? entity.getDerivedStats().getDefense() : 10)
                        .bonusChoice(entity.getDerivedStats() != null ? entity.getDerivedStats().getBonusChoice() : null)
                        .build())

                // 5. Extraer datos del objeto embebido Economy
                .economy(entity.getEconomy() != null ? CharacterDTO.EconomyDTO.builder()
                                                       .startingGoldRoll(entity.getEconomy().getStartingGoldRoll())
                                                       .initialGoldInMo(entity.getEconomy().getInitialGoldInMo())
                                                       .remainingCoins(CharacterDTO.CoinBalanceDTO.builder()
                                                                       .mo(entity.getEconomy().getRemainingMo())
                                                                       .mp(entity.getEconomy().getRemainingMp())
                                                                       .mc(entity.getEconomy().getRemainingMc())
                                                                       .build())
                                                       .build() : null)

                .inventory(inv)
                .talents(tal)
                .build();
    }
}
