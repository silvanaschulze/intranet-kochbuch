import bcrypt

def passwort_hashen(passwort):
    return bcrypt.hashpw(passwort.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

