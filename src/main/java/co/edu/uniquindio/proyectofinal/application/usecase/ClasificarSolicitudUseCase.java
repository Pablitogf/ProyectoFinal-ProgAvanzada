package co.edu.uniquindio.proyectofinal.application.usecase;

import co.edu.uniquindio.proyectofinal.application.dto.UsuarioDto;
import co.edu.uniquindio.proyectofinal.domain.model.entity.Solicitud;
import co.edu.uniquindio.proyectofinal.domain.model.entity.Usuario;
import co.edu.uniquindio.proyectofinal.domain.model.repository.SolicitudRepositorio;
import co.edu.uniquindio.proyectofinal.domain.model.repository.UsuarioRepositorio;
import co.edu.uniquindio.proyectofinal.domain.model.valueobject.Prioridad;
import co.edu.uniquindio.proyectofinal.domain.model.valueobject.TipoSolicitud;
import co.edu.uniquindio.proyectofinal.domain.ports.in.ClasificarSolicitudPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
public class ClasificarSolicitudUseCase implements ClasificarSolicitudPort {

    private final SolicitudRepositorio solicitudRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;

    @Override
    public Solicitud ejecutar(
            String solicitudId,
            Prioridad prioridad,
            TipoSolicitud tipoSolicitud,
            UsuarioDto usuarioDto
    ) {
        Solicitud solicitud = solicitudRepositorio
                .buscarPorId(solicitudId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

        Usuario usuario = usuarioRepositorio
                .buscarPorId(usuarioDto.id())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        solicitud.clasificar(prioridad, tipoSolicitud, usuario);

        return solicitudRepositorio.guardar(solicitud);
    }
}