package co.edu.uniquindio.proyectofinal.domain.ports.in;


import co.edu.uniquindio.proyectofinal.application.dto.UsuarioDto;
import co.edu.uniquindio.proyectofinal.domain.model.entity.Solicitud;
import co.edu.uniquindio.proyectofinal.domain.model.valueobject.Prioridad;

public interface CambiarPrioridadPort {

    Solicitud ejecutar(
            String solicitudId,
            Prioridad nuevaPrioridad,
            UsuarioDto usuarioDto
    );



}