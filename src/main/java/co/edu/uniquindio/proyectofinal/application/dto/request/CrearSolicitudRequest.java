package co.edu.uniquindio.proyectofinal.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CrearSolicitudRequest(

        @NotNull
        Long tipoSolicitudId,

        @NotBlank
        @Size(min = 10, max = 1000)
        String descripcion,

        @NotBlank
        String canalOrigen,

        @NotBlank(message = "El ID del usuario es obligatorio")
        String usuarioId // <--- Agregado

) {}