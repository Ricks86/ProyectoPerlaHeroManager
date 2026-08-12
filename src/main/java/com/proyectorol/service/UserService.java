package com.proyectorol.service;

import com.proyectorol.dto.UserDTO;
import com.proyectorol.entity.UserEntity;
import com.proyectorol.enums.UserRole;
import com.proyectorol.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Registra un nuevo usuario en la aplicación.
     * Verifica que el username no exista y encripta la contraseña con BCrypt.
     */
    @Transactional
    public UserDTO registerUser(UserDTO dto) {
        log.info("Intento de registro para el usuario: {}", dto.getUsername());

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya está registrado.");
        }

        // Hashear la contraseña con BCrypt
        String hashedPassword = BCrypt.hashpw(dto.getPassword(), BCrypt.gensalt());

        UserEntity userEntity = UserEntity.builder()
                .username(dto.getUsername())
                .password(hashedPassword)
                .role(dto.getRole() != null ? dto.getRole() : UserRole.PLAYER)
                .build();

        UserEntity savedUser = userRepository.save(userEntity);
        log.info("Usuario registrado exitosamente con ID: {}", savedUser.getId());

        return mapToDTO(savedUser);
    }

    /**
     * Autentica a un usuario verificando su nombre de usuario y comparando la contraseña plana con BCrypt.
     */
    @Transactional(readOnly = true)
    public UserEntity authenticate(String username, String rawPassword) {
        log.info("Intento de autenticación para el usuario: {}", username);

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario o contraseña incorrectos."));

        if (!BCrypt.checkpw(rawPassword, user.getPassword())) {
            log.warn("Fallo de autenticación: contraseña incorrecta para usuario: {}", username);
            throw new IllegalArgumentException("Usuario o contraseña incorrectos.");
        }

        log.info("Autenticación exitosa para usuario: {}", username);
        return user;
    }

    public UserDTO mapToDTO(UserEntity entity) {
        return UserDTO.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .password(null) // No exponer el hash en la respuesta DTO
                .role(entity.getRole())
                .build();
    }
}
