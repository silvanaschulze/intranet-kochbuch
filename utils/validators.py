import re

def email_validieren(email):
    """Valida o formato de um endereço de email."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def passwort_validieren(passwort):
    """
    Valida se a senha atende aos requisitos de segurança:
    - Pelo menos 8 caracteres
    - Pelo menos 1 letra maiúscula
    - Pelo menos 1 número
    - Pelo menos 1 caractere especial
    """
    if len(passwort) < 8:
        return False
    
    # Verificar letra maiúscula
    if not re.search(r'[A-Z]', passwort):
        return False
    
    # Verificar número
    if not re.search(r'[0-9]', passwort):
        return False
    
    # Verificar caractere especial
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', passwort):
        return False
    
    return True
