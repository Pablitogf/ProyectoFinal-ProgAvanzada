package co.edu.uniquindio.proyectofinal.application.dto.request;

import co.edu.uniquindio.proyectofinal.domain.model.valueobject.TipoSolicitud;

public record CrearSolicitudDto(
        String descripcion,
        TipoSolicitud tipo
) {
}