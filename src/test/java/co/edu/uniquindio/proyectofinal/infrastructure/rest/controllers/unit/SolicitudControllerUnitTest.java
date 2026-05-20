package co.edu.uniquindio.proyectofinal.infrastructure.rest.controllers.unit;

import co.edu.uniquindio.proyectofinal.application.usecase.ObtenerSolicitudUseCase;
import co.edu.uniquindio.proyectofinal.infrastructure.rest.controllers.SolicitudController;
import co.edu.uniquindio.proyectofinal.infrastructure.rest.mapper.SolicitudMapper;
import co.edu.uniquindio.proyectofinal.infrastructure.security.JwtConfig;
import co.edu.uniquindio.proyectofinal.infrastructure.security.SecurityConfig;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = SolicitudController.class)
@Import({SecurityConfig.class, JwtConfig.class})
class SolicitudControllerUnitTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ObtenerSolicitudUseCase obtenerSolicitudUseCase;

    @MockBean
    private SolicitudMapper mapper;

    @MockBean private co.edu.uniquindio.proyectofinal.application.usecase.CrearSolicitudUseCase crearSolicitudUseCase;
    @MockBean private co.edu.uniquindio.proyectofinal.application.usecase.AsignarResponsableUseCase asignarResponsableUseCase;
    @MockBean private co.edu.uniquindio.proyectofinal.application.usecase.CambiarPrioridadUseCase cambiarPrioridadUseCase;
    @MockBean private co.edu.uniquindio.proyectofinal.application.usecase.CerrarSolicitudUseCase cerrarSolicitudUseCase;
    @MockBean private co.edu.uniquindio.proyectofinal.application.usecase.ClasificarSolicitudUseCase clasificarSolicitudUseCase;
    @MockBean private co.edu.uniquindio.proyectofinal.application.usecase.ConsultasAvanzadasSolicitudUseCase consultasAvanzadasSolicitudUseCase;

    @Test
    void testEndpointProtegidoConJWT() throws Exception {

        mockMvc.perform(get("/api/solicitudes/123")
                        .with(jwt()))
                .andExpect(status().isOk());
        when(obtenerSolicitudUseCase.ejecutar("123"))
                .thenReturn(null);

        when(mapper.toDetalleResponse(any()))
                .thenReturn(null);
    }

    @Test
    void testSinAuthDebeRetornar401() throws Exception {

        mockMvc.perform(get("/api/solicitudes/123"))
                .andExpect(status().isUnauthorized());
    }
}