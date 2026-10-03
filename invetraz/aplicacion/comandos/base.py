from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar("T")

class ComandoBase(ABC, Generic[T]):
    """Define el contrato de ejecución y validación de una acción de negocio."""

    def validar(self) -> None:
        """Hook opcional para validaciones previas de reglas de negocio."""
        pass

    @abstractmethod
    def ejecutar(self) -> T:
        """Ejecuta la transacción o caso de uso."""
        pass

    def run(self) -> T:
        """Punto de entrada estándar tipo Superset."""
        self.validar()
        return self.ejecutar()
