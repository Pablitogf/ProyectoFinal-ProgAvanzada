package co.edu.uniquindio.proyectofinal.infrastructure.rest.controllers;

import co.edu.uniquindio.proyectofinal.application.service.SecurityService;
import co.edu.uniquindio.proyectofinal.infrastructure.rest.dto.LoginRequest;
import co.edu.uniquindio.proyectofinal.infrastructure.rest.dto.TokenResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // Tu ruta base es /api/auth
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // ¡No olvides esto para el Wow!
public class SecurityController {

    private final SecurityService securityService;
    // 1. Asegúrate de tener acceso al servicio que guarda usuarios
    // private final UsuarioService usuarioService; 

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(securityService.login(request));
    }

    // 2. AGREGA ESTE MÉTODO PARA EL REGISTRO
    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Object usuario) {
        // Aquí deberías llamar a tu lógica de guardado
        // return ResponseEntity.ok(usuarioService.save(usuario));
        return ResponseEntity.ok("Usuario recibido en el backend");
    }
}