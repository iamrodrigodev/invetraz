import bcrypt

class PasswordService:
    @staticmethod
    def hash_password(password: str) -> str:
        """Genera un hash BCrypt de la contraseña."""
        salt = bcrypt.gensalt(rounds=10)
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    @staticmethod
    def verificar_password(password: str, hashed_password: str) -> bool:
        """Verifica una contraseña en texto plano contra un hash BCrypt."""
        try:
            return bcrypt.checkpw(
                password.encode("utf-8"),
                hashed_password.encode("utf-8"),
            )
        except Exception:
            return False
