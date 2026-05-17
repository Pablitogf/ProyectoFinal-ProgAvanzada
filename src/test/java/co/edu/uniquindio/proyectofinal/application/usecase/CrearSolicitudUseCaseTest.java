package co.edu.uniquindio.proyectofinal.application.usecase;

import co.edu.uniquindio.proyectofinal.application.dto.UsuarioDto;
import co.edu.uniquindio.proyectofinal.application.dto.request.CrearSolicitudDto;
import co.edu.uniquindio.proyectofinal.domain.model.entity.Solicitud;
import co.edu.uniquindio.proyectofinal.domain.model.entity.Usuario;
import co.edu.uniquindio.proyectofinal.domain.model.repository.SolicitudRepositorio;
import co.edu.uniquindio.proyectofinal.domain.model.repository.UsuarioRepositorio;
import co.edu.uniquindio.proyectofinal.domain.model.valueobject.Email;
import co.edu.uniquindio.proyectofinal.domain.model.valueobject.TipoSolicitud;
import co.edu.uniquindio.proyectofinal.domain.model.valueobject.TipoUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CrearSolicitudUseCaseTest {

    @Mock
    private SolicitudRepositorio solicitudRepositorio;

    @Mock
    private UsuarioRepositorio usuarioRepositorio;

    @InjectMocks
    private CrearSolicitudUseCase crearSolicitudUseCase;

    @Test
    void debeCrearYGuardarUnaSolicitudExitosamente() {
        String descripcion = "Mi internet no funciona y necesito soporte urgente";
        Usuario solicitante = new Usuario(
                "usuario-123",
                new Email("pablo@uniquindio.edu.co"),
                TipoUser.ESTUDIANTE
        );
        CrearSolicitudDto dto = new CrearSolicitudDto(descripcion, TipoSolicitud.HOMOLOGACION);
        UsuarioDto usuarioDto = new UsuarioDto("usuario-123");

        when(usuarioRepositorio.buscarPorId("usuario-123")).thenReturn(Optional.of(solicitante));
        when(solicitudRepositorio.guardar(any(Solicitud.class))).thenAnswer(i -> i.getArguments()[0]);

        Solicitud resultado = crearSolicitudUseCase.ejecutar(dto, usuarioDto);

        assertNotNull(resultado);
        verify(solicitudRepositorio, times(1)).guardar(any(Solicitud.class));
    }

    @Test
    void debeFallarCuandoUsuarioNoExiste() {
        CrearSolicitudDto dto = new CrearSolicitudDto(
                "Descripcion lo suficientemente larga para pruebas.",
                TipoSolicitud.HOMOLOGACION
        );
        when(usuarioRepositorio.buscarPorId("desconocido")).thenReturn(Optional.empty());

        assertThrows(
                IllegalArgumentException.class,
                () -> crearSolicitudUseCase.ejecutar(dto, new UsuarioDto("desconocido"))
        );
    }
}
