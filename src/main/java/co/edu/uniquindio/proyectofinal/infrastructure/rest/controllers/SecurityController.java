package co.edu.uniquindio.proyectofinal.infrastructure.rest.controllers;

import co.edu.uniquindio.proyectofinal.application.service.SecurityService;
import co.edu.uniquindio.proyectofinal.infrastructure.rest.dto.LoginRequest;
import co.edu.uniquindio.proyectofinal.infrastructure.rest.dto.TokenResponse;
import co.edu.uniquindio.proyectofinal.infrastructure.rest.dto.RegistroRequestDto;

// 🟢 IMPORTS CORREGIDOS CON TU RUTA REAL DE PROYECTO
import co.edu.uniquindio.proyectofinal.infrastructure.persistence.jpa.entity.UsuarioEntity;
import co.edu.uniquindio.proyectofinal.infrastructure.security.entity.SecurityUserEntity;
import co.edu.uniquindio.proyectofinal.infrastructure.security.entity.RolSeguridadEnum;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SecurityController {

    private final SecurityService securityService;
    private final PasswordEncoder passwordEncoder;

    @PersistenceContext
    private final EntityManager entityManager;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(securityService.login(request));
    }

    @PostMapping("/registrar")
    @Transactional
    public ResponseEntity<?> registrar(@Valid @RequestBody RegistroRequestDto request) {

        // 1. Guardar datos de negocio en la tabla 'usuarios'
        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setId(request.getEmail());
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());

        // 🟢 SOLUCIÓN AL NULL POINTER: Seteamos el password del DTO.
        // El @PrePersist de tu UsuarioEntity lo recibirá y lo encriptará automáticamente.
        usuario.setPassword(request.getPassword());

        usuario.setRolUser(request.getRolUser() != null ? request.getRolUser() : "OPERADOR");
        entityManager.persist(usuario);

        // 2. Guardar credenciales en la tabla 'security_users' para el Login
        SecurityUserEntity securityUser = new SecurityUserEntity();
        securityUser.setEmail(request.getEmail());

        // Encriptamos para la tabla de seguridad independiente
        securityUser.setPassword(passwordEncoder.encode(request.getPassword()));

        // Asignación segura del Rol mapeando el String al Enum
        try {
            securityUser.setRol(RolSeguridadEnum.valueOf(usuario.getRolUser()));
        } catch (IllegalArgumentException e) {
            // ⚠️ NOTA SI SIGUE ROJO "OPERADOR": Si en tu RolSeguridadEnum lo escribiste diferente
            // (por ejemplo: ROLE_OPERADOR), cambia este .OPERADOR por tu valor exacto.
            securityUser.setRol(RolSeguridadEnum.ADMIN);
        }

        entityManager.persist(securityUser);

        return ResponseEntity.ok("Usuario registrado y sincronizado con éxito.");
    }
}