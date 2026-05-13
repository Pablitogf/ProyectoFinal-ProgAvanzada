package co.edu.uniquindio.proyectofinal.domain.ports.in;


import co.edu.uniquindio.proyectofinal.application.dto.UsuarioDto;
import co.edu.uniquindio.proyectofinal.application.dto.request.CrearSolicitudDto;
import co.edu.uniquindio.proyectofinal.domain.model.entity.Solicitud;

public interface CrearSolicitudPort {

    Solicitud ejecutar(CrearSolicitudDto dto, UsuarioDto usuarioDto);

}
