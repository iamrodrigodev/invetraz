import bcrypt

class AdaptadorHashPassword:
    """Implementa PuertoHashPassword utilizando BCrypt."""

    def hash(self, password_plana: str) -> str:
        sal = bcrypt.gensalt(rounds=10)
        return bcrypt.hashpw(password_plana.encode("utf-8"), sal).decode("utf-8")

    def verificar(self, password_plana: str, password_hash: str) -> bool:
        try:
            return bcrypt.checkpw(
                password_plana.encode("utf-8"),
                password_hash.encode("utf-8"),
            )
        except Exception:
            return False
