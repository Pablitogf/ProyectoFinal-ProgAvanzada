package co.edu.uniquindio.proyectofinal.application.usecase;


import co.edu.uniquindio.proyectofinal.application.dto.UsuarioDto;
import co.edu.uniquindio.proyectofinal.application.dto.request.CrearSolicitudDto;
import co.edu.uniquindio.proyectofinal.domain.model.entity.Solicitud;
import co.edu.uniquindio.proyectofinal.domain.model.entity.Usuario;
import co.edu.uniquindio.proyectofinal.domain.model.repository.SolicitudRepositorio;
import co.edu.uniquindio.proyectofinal.domain.model.repository.UsuarioRepositorio;
import co.edu.uniquindio.proyectofinal.domain.ports.in.CrearSolicitudPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class CrearSolicitudUseCase implements CrearSolicitudPort {

    private final SolicitudRepositorio solicitudRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;

    @Override
    public Solicitud ejecutar(CrearSolicitudDto dto, UsuarioDto usuarioDto) {

        Usuario usuario = usuarioRepositorio
                .buscarPorId(usuarioDto.id())
                .orElseThrow(() ->
                        new IllegalArgumentException("Usuario no encontrado"));

        Solicitud solicitud = Solicitud.crear(
                dto.descripcion(),
                dto.tipo(),
                usuario
        );

        return solicitudRepositorio.guardar(solicitud);
    }
}