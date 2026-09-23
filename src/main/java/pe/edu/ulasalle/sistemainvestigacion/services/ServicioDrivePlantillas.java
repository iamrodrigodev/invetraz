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
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;
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
        return limpia;
    }

    @Transactional
    public CarpetaPlantillasRespuestaDto verificarCarpeta(String urlOId) {
        String folderId = extraerIdCarpeta(urlOId);
        if (folderId.isBlank()) {
            throw new ExcepcionDeNegocio(MensajesDeError.CARPETA_DRIVE_ID_INVALIDO);
        }

        var configOpt = configuracionRepository.findFirstByOrderByIdAsc();
        if (configOpt.isEmpty()) {
            throw new ExcepcionDeNegocio(MensajesDeError.CREDENCIALES_GOOGLE_NO_CONFIGURADAS);
        }

        ConfiguracionSistema config = configOpt.get();
        if (!Boolean.TRUE.equals(config.getGoogleVerificado())) {
            if (Boolean.TRUE.equals(config.getDriveVerificado())) {
                config.setDriveVerificado(false);
                configuracionRepository.save(config);
            }
            throw new ExcepcionDeNegocio(MensajesDeError.CREDENCIALES_GOOGLE_NO_VERIFICADAS);
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
                throw new ExcepcionDeNegocio(MensajesDeError.CARPETA_DRIVE_NO_ENCONTRADA);
            } else if (e.getStatusCode() == 403) {
                throw new ExcepcionDeNegocio(MensajesDeError.ACCESO_DENEGADO_DRIVE);
            }
            throw new ExcepcionDeNegocio(MensajesDeError.ERROR_CONSULTA_DRIVE);
        } catch (Exception e) {
            log.error("Fallo inesperado al consultar carpeta Drive", e);
            throw new ExcepcionDeNegocio(MensajesDeError.ERROR_CONEXION_DRIVE);
        }

        if (Boolean.TRUE.equals(carpetaGoogle.getTrashed())) {
            throw new ExcepcionDeNegocio(MensajesDeError.CARPETA_DRIVE_EN_PAPELERA);
        }

        if (!"application/vnd.google-apps.folder".equals(carpetaGoogle.getMimeType())) {
            throw new ExcepcionDeNegocio(MensajesDeError.ENLACE_DRIVE_NO_ES_CARPETA);
        }

        config.setGoogleDriveFolderId(folderId);
        config.setGoogleDriveFolderName(carpetaGoogle.getName());
        config.setDriveVerificado(true);
        configuracionRepository.save(config);

        return obtenerPlantillas(folderId, carpetaGoogle.getName());
    }

    @Transactional
    public CarpetaPlantillasRespuestaDto vincularCarpeta(String urlOId) {
        String folderId = extraerIdCarpeta(urlOId);
        if (folderId.isBlank()) {
            throw new ExcepcionDeNegocio(MensajesDeError.CARPETA_DRIVE_ID_INVALIDO);
        }

        ConfiguracionSistema config =
                configuracionRepository
                        .findFirstByOrderByIdAsc()
                        .orElseThrow(
                                () ->
                                        new ExcepcionDeNegocio(
                                                MensajesDeError
                                                        .CREDENCIALES_GOOGLE_NO_CONFIGURADAS));

        if (!Boolean.TRUE.equals(config.getGoogleVerificado())) {
            log.warn(
                    "Se guardará la carpeta Drive {} sin verificar porque Google Cloud no está"
                            + " verificado",
                    folderId);
            config.setGoogleDriveFolderId(folderId);
            config.setGoogleDriveFolderName(null);
            config.setDriveVerificado(false);
            configuracionRepository.save(config);

            return CarpetaPlantillasRespuestaDto.builder()
                    .carpetaConfigurada(true)
                    .carpetaId(folderId)
                    .carpetaNombre(null)
                    .plantillas(Collections.emptyList())
                    .driveVerificado(false)
                    .build();
        }

        try {
            CarpetaPlantillasRespuestaDto verificada = verificarCarpeta(folderId);
            config.setGoogleDriveFolderId(verificada.carpetaId());
            config.setGoogleDriveFolderName(verificada.carpetaNombre());
            config.setDriveVerificado(true);
            configuracionRepository.save(config);

            return CarpetaPlantillasRespuestaDto.builder()
                    .carpetaConfigurada(true)
                    .carpetaId(verificada.carpetaId())
                    .carpetaNombre(verificada.carpetaNombre())
                    .plantillas(verificada.plantillas())
                    .driveVerificado(true)
                    .build();
        } catch (ExcepcionDeNegocio e) {
            log.warn(
                    "Se guardará la carpeta Drive {} aunque no pudo verificarse: {}",
                    folderId,
                    e.getMessage());
            config.setGoogleDriveFolderId(folderId);
            config.setGoogleDriveFolderName(null);
            config.setDriveVerificado(false);
            configuracionRepository.save(config);

            return CarpetaPlantillasRespuestaDto.builder()
                    .carpetaConfigurada(true)
                    .carpetaId(folderId)
                    .carpetaNombre(null)
                    .plantillas(Collections.emptyList())
                    .driveVerificado(false)
                    .build();
        }
    }

    @Transactional
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
                    .driveVerificado(false)
                    .build();
        }

        ConfiguracionSistema config = configOpt.get();
        if (!Boolean.TRUE.equals(config.getGoogleVerificado())) {
            if (Boolean.TRUE.equals(config.getDriveVerificado())) {
                config.setDriveVerificado(false);
                configuracionRepository.save(config);
            }
            return CarpetaPlantillasRespuestaDto.builder()
                    .carpetaConfigurada(true)
                    .carpetaId(config.getGoogleDriveFolderId())
                    .carpetaNombre(config.getGoogleDriveFolderName())
                    .plantillas(Collections.emptyList())
                    .driveVerificado(false)
                    .build();
        }

        try {
            CarpetaPlantillasRespuestaDto res =
                    obtenerPlantillas(
                            config.getGoogleDriveFolderId(), config.getGoogleDriveFolderName());
            if (!Boolean.TRUE.equals(config.getDriveVerificado())) {
                config.setDriveVerificado(true);
                configuracionRepository.save(config);
            }
            return res;
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
                    .driveVerificado(false)
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
            throw new ExcepcionDeNegocio(MensajesDeError.ERROR_LISTAR_ARCHIVOS_DRIVE);
        }

        return CarpetaPlantillasRespuestaDto.builder()
                .carpetaConfigurada(true)
                .carpetaId(folderId)
                .carpetaNombre(folderNombre)
                .plantillas(plantillas)
                .driveVerificado(true)
                .build();
    }
}
