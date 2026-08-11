package com.proyectorol.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.proyectorol.dto.CharacterDTO;
import com.proyectorol.entity.CharacterEntity;
import com.proyectorol.repository.CharacterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CharacterService {

    private final CharacterRepository characterRepository;
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

        return CharacterEntity.builder()
                .name(dto.getName())
                .race(dto.getRace())
                .characterClass(dto.getCharacterClass())
                .level(dto.getLevel() != null ? dto.getLevel() : 1)
                .experience(dto.getExperience() != null ? dto.getExperience() : 0)

                // Stats
                .fue(dto.getStats() != null ? dto.getStats().getFue() : 10)
                .des(dto.getStats() != null ? dto.getStats().getDes() : 10)
                .con(dto.getStats() != null ? dto.getStats().getCon() : 10)
                .intStat(dto.getStats() != null ? dto.getStats().getIntStat() : 10)
                .sab(dto.getStats() != null ? dto.getStats().getSab() : 10)
                .car(dto.getStats() != null ? dto.getStats().getCar() : 10)

                // Skills
                .habAlerta(dto.getSkills() != null ? dto.getSkills().getAlerta() : 0)
                .habComunicacion(dto.getSkills() != null ? dto.getSkills().getComunicacion() : 0)
                .habManipulacion(dto.getSkills() != null ? dto.getSkills().getManipulacion() : 0)
                .habErudicion(dto.getSkills() != null ? dto.getSkills().getErudicion() : 0)
                .habSubterfugio(dto.getSkills() != null ? dto.getSkills().getSubterfugio() : 0)
                .habSupervivencia(dto.getSkills() != null ? dto.getSkills().getSupervivencia() : 0)

                // Derived Stats
                .hitDice(dto.getDerivedStats() != null ? dto.getDerivedStats().getHitDice() : "d6")
                .maxHp(dto.getDerivedStats() != null ? dto.getDerivedStats().getMaxHp() : 6)
                .currentHp(dto.getDerivedStats() != null ? dto.getDerivedStats().getCurrentHp() : 6)
                .movement(dto.getDerivedStats() != null ? dto.getDerivedStats().getMovement() : 12)
                .defense(dto.getDerivedStats() != null ? dto.getDerivedStats().getDefense() : 10)
                .bonusChoice(dto.getDerivedStats() != null ? dto.getDerivedStats().getBonusChoice() : "INS")

                // Economy
                .startingGoldRoll(dto.getEconomy() != null ? dto.getEconomy().getStartingGoldRoll() : 0)
                .initialGoldInMo(dto.getEconomy() != null ? dto.getEconomy().getInitialGoldInMo() : 0)
                .remainingMo(dto.getEconomy() != null && dto.getEconomy().getRemainingCoins() != null ? dto.getEconomy().getRemainingCoins().getMo() : 0)
                .remainingMp(dto.getEconomy() != null && dto.getEconomy().getRemainingCoins() != null ? dto.getEconomy().getRemainingCoins().getMp() : 0)
                .remainingMc(dto.getEconomy() != null && dto.getEconomy().getRemainingCoins() != null ? dto.getEconomy().getRemainingCoins().getMc() : 0)

                .inventoryJson(invJson)
                .talentsJson(talJson)
                .build();
    }

    private CharacterDTO mapToDTO(CharacterEntity entity) {
        List<CharacterDTO.InventoryItemDTO> inv = null;
        List<CharacterDTO.TalentDTO> tal = null;
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
                .race(entity.getRace())
                .characterClass(entity.getCharacterClass())
                .level(entity.getLevel())
                .experience(entity.getExperience())
                .stats(CharacterDTO.StatsDTO.builder()
                        .fue(entity.getFue())
                        .des(entity.getDes())
                        .con(entity.getCon())
                        .intStat(entity.getIntStat())
                        .sab(entity.getSab())
                        .car(entity.getCar())
                        .build())
                .skills(CharacterDTO.SkillsDTO.builder()
                        .alerta(entity.getHabAlerta())
                        .comunicacion(entity.getHabComunicacion())
                        .manipulacion(entity.getHabManipulacion())
                        .erudicion(entity.getHabErudicion())
                        .subterfugio(entity.getHabSubterfugio())
                        .supervivencia(entity.getHabSupervivencia())
                        .build())
                .derivedStats(CharacterDTO.DerivedStatsDTO.builder()
                        .hitDice(entity.getHitDice())
                        .maxHp(entity.getMaxHp())
                        .currentHp(entity.getCurrentHp())
                        .movement(entity.getMovement())
                        .defense(entity.getDefense())
                        .bonusChoice(entity.getBonusChoice())
                        .build())
                .economy(CharacterDTO.EconomyDTO.builder()
                        .startingGoldRoll(entity.getStartingGoldRoll())
                        .initialGoldInMo(entity.getInitialGoldInMo())
                        .remainingCoins(CharacterDTO.CoinBalanceDTO.builder()
                                .mo(entity.getRemainingMo())
                                .mp(entity.getRemainingMp())
                                .mc(entity.getRemainingMc())
                                .build())
                        .build())
                .inventory(inv)
                .talents(tal)
                .build();
    }
}
