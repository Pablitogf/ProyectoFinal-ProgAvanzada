    /**
     * Controlador REST para la gestión de solicitudes, encargado de adaptar las peticiones HTTP
     * al lenguaje del dominio y orquestar la ejecución mediante casos de uso.
     */
    package co.edu.uniquindio.proyectofinal.infrastructure.rest.controllers;

    import co.edu.uniquindio.proyectofinal.application.dto.request.AsignarResponsableRequest;
    import co.edu.uniquindio.proyectofinal.application.dto.request.CambiarPrioridadRequest;
    import co.edu.uniquindio.proyectofinal.application.dto.request.CerrarSolicitudRequest;
    import co.edu.uniquindio.proyectofinal.application.dto.request.ClasificarSolicitudRequest;
    import co.edu.uniquindio.proyectofinal.application.dto.UsuarioDto;
    import co.edu.uniquindio.proyectofinal.application.dto.request.CrearSolicitudDto;
    import co.edu.uniquindio.proyectofinal.application.dto.request.CrearSolicitudRequest;
    import co.edu.uniquindio.proyectofinal.application.dto.response.SolicitudDetalleResponse;
    import co.edu.uniquindio.proyectofinal.application.usecase.AsignarResponsableUseCase;
    import co.edu.uniquindio.proyectofinal.application.usecase.CambiarPrioridadUseCase;
    import co.edu.uniquindio.proyectofinal.application.usecase.CerrarSolicitudUseCase;
    import co.edu.uniquindio.proyectofinal.application.usecase.ClasificarSolicitudUseCase;
    import co.edu.uniquindio.proyectofinal.application.usecase.ConsultasAvanzadasSolicitudUseCase;
    import co.edu.uniquindio.proyectofinal.application.usecase.CrearSolicitudUseCase;
    import co.edu.uniquindio.proyectofinal.application.usecase.ObtenerSolicitudUseCase;
    import co.edu.uniquindio.proyectofinal.domain.model.entity.Solicitud;
    import co.edu.uniquindio.proyectofinal.domain.model.entity.Usuario;
    import co.edu.uniquindio.proyectofinal.domain.model.valueobject.Prioridad;
    import co.edu.uniquindio.proyectofinal.domain.model.valueobject.TipoSolicitud;
    import co.edu.uniquindio.proyectofinal.infrastructure.rest.mapper.SolicitudMapper;
    import jakarta.validation.Valid;
    import lombok.RequiredArgsConstructor;
    import org.springframework.data.domain.Page;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.PathVariable;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.PutMapping;
    import org.springframework.web.bind.annotation.RequestBody;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestParam;
    import org.springframework.web.bind.annotation.RestController;
    import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

    import java.net.URI;
    import java.util.List;
    import java.util.Map;

    @RestController
    @RequestMapping("/api/solicitudes")
    @RequiredArgsConstructor
    public class SolicitudController {

        private final CrearSolicitudUseCase crearSolicitudUseCase;
        private final ObtenerSolicitudUseCase obtenerSolicitudUseCase;
        private final AsignarResponsableUseCase asignarResponsableUseCase;
        private final CambiarPrioridadUseCase cambiarPrioridadUseCase;
        private final CerrarSolicitudUseCase cerrarSolicitudUseCase;
        private final ClasificarSolicitudUseCase clasificarSolicitudUseCase;
        private final ConsultasAvanzadasSolicitudUseCase consultasAvanzadasSolicitudUseCase;
        private final SolicitudMapper mapper;

        @PostMapping("/{id}/crear")
        public ResponseEntity<SolicitudDetalleResponse> crear(@Valid @RequestBody CrearSolicitudRequest request) {
            TipoSolicitud tipo = tipoDesdeCatalogo(request.tipoSolicitudId());
            CrearSolicitudDto dto = new CrearSolicitudDto(request.descripcion(), tipo);
            UsuarioDto usuarioDto = new UsuarioDto(request.usuarioId());
            Solicitud solicitud = crearSolicitudUseCase.ejecutar(dto, usuarioDto);

            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest().path("/{id}")
                    .buildAndExpand(solicitud.getId()).toUri();

            return ResponseEntity.created(location).body(mapper.toDetalleResponse(solicitud));
        }

        @GetMapping("/{id}")
        public ResponseEntity<SolicitudDetalleResponse> obtener(@PathVariable String id) {
            return ResponseEntity.ok(mapper.toDetalleResponse(obtenerSolicitudUseCase.ejecutar(id)));
        }

        @PutMapping("/{id}/clasificar")
        public ResponseEntity<SolicitudDetalleResponse> clasificar(
                @PathVariable String id,
                @Valid @RequestBody ClasificarSolicitudRequest request) {

            TipoSolicitud tipo = tipoDesdeCatalogo(request.tipoSolicitudId());
            Prioridad prioridad = Prioridad.valueOf(request.prioridad().toUpperCase());
            UsuarioDto coordinador = new UsuarioDto(request.coordinadorId());

            Solicitud solicitud = clasificarSolicitudUseCase.ejecutar(id, prioridad, tipo, coordinador);
            return ResponseEntity.ok(mapper.toDetalleResponse(solicitud));
        }

        @PutMapping("/{id}/asignar")
        public ResponseEntity<SolicitudDetalleResponse> asignar(
                @PathVariable String id,
                @Valid @RequestBody AsignarResponsableRequest request) {

            Usuario responsable = new Usuario(request.responsableId(), null, null);
            Usuario quienAsigna = new Usuario(request.usuarioId(), null, null);

            Solicitud solicitud = asignarResponsableUseCase.ejecutar(id, responsable, quienAsigna);
            return ResponseEntity.ok(mapper.toDetalleResponse(solicitud));
        }

        @PutMapping("/{id}/priorizar")
        public ResponseEntity<SolicitudDetalleResponse> priorizar(
                @PathVariable String id,
                @Valid @RequestBody CambiarPrioridadRequest request) {

            Prioridad prioridad = Prioridad.valueOf(request.nivelPrioridad().toUpperCase());
            UsuarioDto coordinador = new UsuarioDto(request.coordinadorId());

            Solicitud solicitud = cambiarPrioridadUseCase.ejecutar(id, prioridad, coordinador);
            return ResponseEntity.ok(mapper.toDetalleResponse(solicitud));
        }

        @PutMapping("/{id}/cerrar")
        public ResponseEntity<SolicitudDetalleResponse> cerrar(
                @PathVariable String id,
                @Valid @RequestBody CerrarSolicitudRequest request) {

            Usuario responsable = new Usuario(request.usuarioId().toString(), null, null);
            Solicitud solicitud = cerrarSolicitudUseCase.ejecutar(id, responsable);
            return ResponseEntity.ok(mapper.toDetalleResponse(solicitud));
        }

        @GetMapping("/consultas/homologaciones/inferencia")
        public ResponseEntity<List<SolicitudDetalleResponse>> homologacionesPorInferencia() {
            List<SolicitudDetalleResponse> response = consultasAvanzadasSolicitudUseCase
                    .homologacionesOrdenadasPorInferencia()
                    .stream()
                    .map(mapper::toDetalleResponse)
                    .toList();
            return ResponseEntity.ok(response);
        }

        @GetMapping("/consultas/homologaciones/jpql")
        public ResponseEntity<List<SolicitudDetalleResponse>> homologacionesPorJpql() {
            List<SolicitudDetalleResponse> response = consultasAvanzadasSolicitudUseCase
                    .homologacionesOrdenadasPorJpql()
                    .stream()
                    .map(mapper::toDetalleResponse)
                    .toList();
            return ResponseEntity.ok(response);
        }

        @GetMapping("/consultas/filtro")
        public ResponseEntity<List<SolicitudDetalleResponse>> consultarPorCodigoOSolicitante(
                @RequestParam(required = false) String codigo,
                @RequestParam(required = false) String solicitanteId) {
            List<SolicitudDetalleResponse> response = consultasAvanzadasSolicitudUseCase
                    .buscarPorCodigoOSolicitante(codigo, solicitanteId)
                    .stream()
                    .map(mapper::toDetalleResponse)
                    .toList();
            return ResponseEntity.ok(response);
        }

        @GetMapping("/consultas/paginadas")
        public ResponseEntity<Page<SolicitudDetalleResponse>> consultarPaginadas(
                @RequestParam(defaultValue = "0") int pagina,
                @RequestParam(defaultValue = "10") int tamano) {
            Page<SolicitudDetalleResponse> response = consultasAvanzadasSolicitudUseCase
                    .listarNoCerradasPaginado(pagina, tamano)
                    .map(mapper::toDetalleResponse);
            return ResponseEntity.ok(response);
        }

        @GetMapping("/consultas/reporte-estados")
        public ResponseEntity<Map<String, Long>> reporteEstadosNativo() {
            return ResponseEntity.ok(consultasAvanzadasSolicitudUseCase.reporteNativoCantidadPorEstado());
        }

        /**
         * Convierte el id de catálogo (1..n) al enum {@link TipoSolicitud} en el orden declarado.
         */
        private static TipoSolicitud tipoDesdeCatalogo(Long tipoSolicitudId) {
            if (tipoSolicitudId == null) {
                throw new IllegalArgumentException("tipoSolicitudId es obligatorio.");
            }
            int indice = tipoSolicitudId.intValue() - 1;
            TipoSolicitud[] valores = TipoSolicitud.values();
            if (indice < 0 || indice >= valores.length) {
                throw new IllegalArgumentException(
                        "El tipoSolicitudId " + tipoSolicitudId + " no existe en el catalogo.");
            }
            return valores[indice];
        }
    }

