from typing import Optional
from pydantic import BaseModel, Field

class LoginPeticion(BaseModel):
    email: str
    password: str

class LoginRespuesta(BaseModel):
    email: str

class VerificarAutenticacionRespuesta(BaseModel):
    autenticado: bool
    email: Optional[str] = None

class VerificarPasswordPeticion(BaseModel):
    password: str

class CambiarPasswordPeticion(BaseModel):
    passwordActual: str = Field(alias="passwordActual")
    passwordNueva: str = Field(alias="passwordNueva")
