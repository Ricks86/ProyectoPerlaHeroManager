package com.proyectorol.controller;

import com.proyectorol.dto.UserDTO;
import com.proyectorol.entity.UserEntity;
import com.proyectorol.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping({"/api/v1/users", "/api/users"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Endpoint para registrar nuevos usuarios.
     * POST /api/v1/users/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO userDTO) {
        log.info("Petición POST /api/v1/users/register recibida para usuario: {}", userDTO.getUsername());
        try {
            UserDTO registeredUser = userService.registerUser(userDTO);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Endpoint para autenticar (login) usuarios y devolver una cookie HttpOnly SESSION_ID.
     * POST /api/v1/users/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO loginDTO, HttpServletResponse response) {
        log.info("Petición POST /api/v1/users/login recibida para usuario: {}", loginDTO.getUsername());
        try {
            UserEntity user = userService.authenticate(loginDTO.getUsername(), loginDTO.getPassword());

            // Crear cookie HttpOnly con la sesión
            String sessionId = UUID.randomUUID().toString();

            // AHORA SÍ: El servidor recordará quién es el dueño de esta cookie
            userService.saveSessionToken(user.getId(), sessionId);

            // TODO: Guardar este sessionId en la base de datos asociado al usuario para recordarlo después
            // userService.saveSessionToken(user.getId(), sessionId);

            Cookie sessionCookie = new Cookie("SESSION_ID", sessionId);
            sessionCookie.setHttpOnly(true);
            sessionCookie.setPath("/");
            sessionCookie.setMaxAge(24 * 60 * 60); // Válida por 24 horas

            response.addCookie(sessionCookie);

            // El JSON va limpio, sin exponer el token de seguridad
            Map<String, Object> responseBody = Map.of(
                    "message", "Login exitoso",
                    "username", user.getUsername(),
                    "role", user.getRole()
            );

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
