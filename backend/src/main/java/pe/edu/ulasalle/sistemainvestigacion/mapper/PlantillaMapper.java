package pe.edu.ulasalle.sistemainvestigacion.mapper;

import com.google.api.client.util.DateTime;
import com.google.api.services.drive.model.File;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.PlantillaXlsxDto;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PlantillaMapper {

    @Mapping(target = "id", source = "file.id")
    @Mapping(target = "nombre", source = "file.name")
    @Mapping(target = "tipoMime", source = "file.mimeType")
    @Mapping(target = "enlaceWeb", source = "file.webViewLink")
    @Mapping(target = "enlaceDescarga", source = "file.webContentLink")
    @Mapping(target = "tamanoBytes", source = "file.size")
    @Mapping(
            target = "ultimaModificacion",
            source = "file.modifiedTime",
            qualifiedByName = "dateTimeToString")
    @Mapping(target = "frecuenciaUso", source = "frecuenciaUso")
    PlantillaXlsxDto toDto(File file, Long frecuenciaUso);

    @Named("dateTimeToString")
    default String dateTimeToString(DateTime dateTime) {
        return dateTime != null ? dateTime.toStringRfc3339() : null;
    }
}
