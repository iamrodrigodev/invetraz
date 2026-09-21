package pe.edu.ulasalle.sistemainvestigacion.services;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorDrive;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.CarpetaPlantillasRespuestaDto;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.PlantillaXlsxDto;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ConfiguracionSistemaRepository;

@Slf4j
@Service
public class ServicioDrivePlantillas {

    private static final Pattern PATRON_CARPETA_URL =
            Pattern.compile("(?:folders/|id=)([a-zA-Z0-9_-]+)");

    private final ProveedorDrive proveedorDrive;
    private final ConfiguracionSistemaRepository configuracionRepository;

    public ServicioDrivePlantillas(
            ProveedorDrive proveedorDrive, ConfiguracionSistemaRepository configuracionRepository) {
        this.proveedorDrive = proveedorDrive;
        this.configuracionRepository = configuracionRepository;
    }

    public static String extraerIdCarpeta(String entrada) {
        if (entrada == null || entrada.isBlank()) {
            return "";
        }
        String limpia = entrada.trim();
        Matcher matcher = PATRON_CARPETA_URL.matcher(limpia);
        if (matcher.find()) {
            return matcher.group(1);
        }
        if (!limpia.contains("/") && !limpia.contains("?")) {
            return limpia;
        }
        return limpia;
    }

    @Transactional(readOnly = true)
    public CarpetaPlantillasRespuestaDto verificarCarpeta(String urlOId) {
        String folderId = extraerIdCarpeta(urlOId);
        if (folderId.isBlank()) {
            throw new ExcepcionDeNegocio(
                    "Por favor, ingresa un enlace o ID válido de la carpeta de Google Drive.");
        }

        File carpetaGoogle;
        try {
            Drive drive = proveedorDrive.obtenerCliente();
            carpetaGoogle =
                    drive.files().get(folderId).setFields("id, name, mimeType, trashed").execute();
        } catch (GoogleJsonResponseException e) {
            log.warn(
                    "Error al buscar carpeta en Drive: status={}, msg={}",
                    e.getStatusCode(),
                    e.getMessage());
            if (e.getStatusCode() == 404) {
                throw new ExcepcionDeNegocio(
                        "No se encontró la carpeta en Google Drive. Verifica el enlace o los"
                                + " permisos de acceso.");
            } else if (e.getStatusCode() == 403) {
                throw new ExcepcionDeNegocio(
                        "Acceso denegado a la carpeta de Google Drive. Asegúrate de que tu cuenta"
                                + " tenga permisos de lectura y que el scope de Drive esté"
                                + " habilitado.");
            }
            throw new ExcepcionDeNegocio("Error al consultar Google Drive: " + e.getMessage());
        } catch (Exception e) {
            log.error("Fallo inesperado al consultar carpeta Drive", e);
            throw new ExcepcionDeNegocio(
                    "No se pudo conectar con Google Drive. Revisa tu conexión o credenciales.");
        }

        if (Boolean.TRUE.equals(carpetaGoogle.getTrashed())) {
            throw new ExcepcionDeNegocio(
                    "La carpeta seleccionada se encuentra en la papelera de reciclaje de Google"
                            + " Drive.");
        }

        if (!"application/vnd.google-apps.folder".equals(carpetaGoogle.getMimeType())) {
            throw new ExcepcionDeNegocio(
                    "El enlace proporcionado no pertenece a una carpeta, sino a un archivo.");
        }

        return obtenerPlantillas(folderId, carpetaGoogle.getName());
    }

    @Transactional
    public CarpetaPlantillasRespuestaDto vincularCarpeta(String urlOId) {
        String folderId = extraerIdCarpeta(urlOId);
        if (folderId.isBlank()) {
            throw new ExcepcionDeNegocio(
                    "Por favor, ingresa un enlace o ID válido de la carpeta de Google Drive.");
        }

        ConfiguracionSistema config =
                configuracionRepository
                        .findFirstByOrderByIdAsc()
                        .orElseThrow(
                                () ->
                                        new ExcepcionDeNegocio(
                                                "Primero debes configurar las credenciales maestras"
                                                        + " de Google."));

        try {
            CarpetaPlantillasRespuestaDto verificada = verificarCarpeta(folderId);
            config.setGoogleDriveFolderId(verificada.carpetaId());
            config.setGoogleDriveFolderName(verificada.carpetaNombre());
            configuracionRepository.save(config);

            return verificada;
        } catch (ExcepcionDeNegocio e) {
            log.warn(
                    "Se guardará la carpeta Drive {} aunque no pudo verificarse: {}",
                    folderId,
                    e.getMessage());
            config.setGoogleDriveFolderId(folderId);
            config.setGoogleDriveFolderName(null);
            configuracionRepository.save(config);

            return CarpetaPlantillasRespuestaDto.builder()
                    .carpetaConfigurada(true)
                    .carpetaId(folderId)
                    .carpetaNombre(null)
                    .plantillas(Collections.emptyList())
                    .build();
        }
    }

    @Transactional(readOnly = true)
    public CarpetaPlantillasRespuestaDto obtenerPlantillasConfiguradas() {
        var configOpt = configuracionRepository.findFirstByOrderByIdAsc();
        if (configOpt.isEmpty()
                || configOpt.get().getGoogleDriveFolderId() == null
                || configOpt.get().getGoogleDriveFolderId().isBlank()) {
            return CarpetaPlantillasRespuestaDto.builder()
                    .carpetaConfigurada(false)
                    .carpetaId(null)
                    .carpetaNombre(null)
                    .plantillas(Collections.emptyList())
                    .build();
        }

        ConfiguracionSistema config = configOpt.get();
        try {
            return obtenerPlantillas(
                    config.getGoogleDriveFolderId(), config.getGoogleDriveFolderName());
        } catch (ExcepcionDeNegocio e) {
            log.warn(
                    "La carpeta Drive configurada {} no pudo consultarse: {}",
                    config.getGoogleDriveFolderId(),
                    e.getMessage());
            return CarpetaPlantillasRespuestaDto.builder()
                    .carpetaConfigurada(true)
                    .carpetaId(config.getGoogleDriveFolderId())
                    .carpetaNombre(config.getGoogleDriveFolderName())
                    .plantillas(Collections.emptyList())
                    .build();
        }
    }

    private CarpetaPlantillasRespuestaDto obtenerPlantillas(String folderId, String folderNombre) {
        String q =
                String.format(
                        "'%s' in parents and trashed = false and (mimeType ="
                            + " 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
                            + " or mimeType = 'application/vnd.google-apps.spreadsheet')",
                        folderId);

        List<PlantillaXlsxDto> plantillas = new ArrayList<>();
        try {
            Drive drive = proveedorDrive.obtenerCliente();
            FileList fileList =
                    drive.files()
                            .list()
                            .setQ(q)
                            .setFields(
                                    "files(id, name, mimeType, size, modifiedTime, webViewLink,"
                                            + " webContentLink)")
                            .setOrderBy("name")
                            .execute();

            if (fileList.getFiles() != null) {
                for (File f : fileList.getFiles()) {
                    plantillas.add(
                            PlantillaXlsxDto.builder()
                                    .id(f.getId())
                                    .nombre(f.getName())
                                    .tipoMime(f.getMimeType())
                                    .enlaceWeb(f.getWebViewLink())
                                    .enlaceDescarga(f.getWebContentLink())
                                    .tamanoBytes(f.getSize())
                                    .ultimaModificacion(
                                            f.getModifiedTime() != null
                                                    ? f.getModifiedTime().toStringRfc3339()
                                                    : null)
                                    .build());
                }
            }
        } catch (Exception e) {
            log.warn(
                    "Error al listar archivos xlsx de la carpeta Drive {}: {}",
                    folderId,
                    e.getMessage());
            throw new ExcepcionDeNegocio(
                    "Error al consultar archivos en la carpeta de Google Drive: " + e.getMessage());
        }

        return CarpetaPlantillasRespuestaDto.builder()
                .carpetaConfigurada(true)
                .carpetaId(folderId)
                .carpetaNombre(folderNombre)
                .plantillas(plantillas)
                .build();
    }
}
