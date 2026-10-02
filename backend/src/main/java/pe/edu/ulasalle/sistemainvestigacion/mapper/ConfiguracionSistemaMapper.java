package pe.edu.ulasalle.sistemainvestigacion.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.ActualizarCredencialesPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ConfiguracionSistemaDTO;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ConfiguracionSistemaMapper {
    ConfiguracionSistemaDTO toDto(ConfiguracionSistema entity);

    @Mapping(
            target = "googleClientId",
            source = "entity.googleClientId",
            qualifiedByName = "textoOCadenaVacia")
    @Mapping(
            target = "googleClientSecret",
            source = "entity.googleClientSecret",
            qualifiedByName = "textoOCadenaVacia")
    @Mapping(
            target = "googleRefreshToken",
            source = "entity.googleRefreshToken",
            qualifiedByName = "textoOCadenaVacia")
    @Mapping(target = "googleDriveFolderId", source = "entity.googleDriveFolderId")
    @Mapping(target = "googleDriveFolderName", source = "entity.googleDriveFolderName")
    @Mapping(target = "googleVerificado", source = "googleVerificado")
    @Mapping(target = "driveVerificado", source = "driveVerificado")
    ActualizarCredencialesPeticion toCredencialesPeticion(
            ConfiguracionSistema entity, Boolean googleVerificado, Boolean driveVerificado);

    @Named("textoOCadenaVacia")
    default String textoOCadenaVacia(String valor) {
        return valor != null ? valor : "";
    }
}
