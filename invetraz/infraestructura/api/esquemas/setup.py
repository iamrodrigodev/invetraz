from pydantic import BaseModel, Field

class EstadoSetupRespuesta(BaseModel):
    adminConfigurado: bool = Field(alias="adminConfigurado", serialization_alias="adminConfigurado")

class CrearAdminPeticion(BaseModel):
    email: str
    password: str
