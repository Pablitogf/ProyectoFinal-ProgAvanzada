package co.edu.uniquindio.proyectofinal.application.usecase;

import co.edu.uniquindio.proyectofinal.application.dto.UsuarioDto;
import co.edu.uniquindio.proyectofinal.domain.model.entity.Solicitud;
import co.edu.uniquindio.proyectofinal.domain.model.entity.Usuario;
import co.edu.uniquindio.proyectofinal.domain.model.repository.SolicitudRepositorio;
import co.edu.uniquindio.proyectofinal.domain.model.repository.UsuarioRepositorio;
import co.edu.uniquindio.proyectofinal.domain.model.valueobject.Prioridad;
import co.edu.uniquindio.proyectofinal.domain.ports.in.CambiarPrioridadPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CambiarPrioridadUseCase implements CambiarPrioridadPort {

    private final SolicitudRepositorio solicitudRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;

    @Override
    public Solicitud ejecutar(
            String solicitudId,
            Prioridad nuevaPrioridad,
            UsuarioDto usuarioDto
    ) {
        Solicitud solicitud = solicitudRepositorio
                .buscarPorId(solicitudId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

        Usuario usuario = usuarioRepositorio
                .buscarPorId(usuarioDto.id())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        solicitud.cambiarPrioridad(nuevaPrioridad, usuario);

        return solicitudRepositorio.guardar(solicitud);
    }
}