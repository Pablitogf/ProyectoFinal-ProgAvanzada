package co.edu.uniquindio.proyectofinal.infrastructure.rest.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroRequestDto {
    private String id;
    private String nombre;
    private String email;
    private String password;
    private String rolUser;
}