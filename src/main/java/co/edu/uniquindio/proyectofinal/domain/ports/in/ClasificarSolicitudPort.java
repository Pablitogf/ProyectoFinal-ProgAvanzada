package co.edu.uniquindio.proyectofinal.domain.ports.in;

import co.edu.uniquindio.proyectofinal.application.dto.UsuarioDto;
import co.edu.uniquindio.proyectofinal.domain.model.entity.Solicitud;
import co.edu.uniquindio.proyectofinal.domain.model.valueobject.Prioridad;
import co.edu.uniquindio.proyectofinal.domain.model.valueobject.TipoSolicitud;

public interface ClasificarSolicitudPort {

    Solicitud ejecutar(
            String solicitudId,
            Prioridad prioridad,
            TipoSolicitud tipoSolicitud,
            UsuarioDto usuarioDto
    );


}