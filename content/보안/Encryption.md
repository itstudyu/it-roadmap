# Encryption (암호화)

## 📝 정의

Encryption(암호화)는 **데이터를 암호화 키를 사용해 읽을 수 없는 형태로 변환**하는 과정으로, 데이터 보안의 핵심 기술입니다.

### 핵심 개념

- **무엇인가?**: 데이터를 암호문으로 변환
- **왜 필요한가?**: 데이터 유출 시 보호
- **어떻게 작동하나?**: 평문 + 키 → 암호문 / 암호문 + 키 → 평문

### 암호화가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 암호화 없이
DB에 비밀번호 평문 저장
→ 해커가 DB 탈취
→ 모든 비밀번호 유출
→ 대규모 피해! 😱
```

**암호화의 해결**:
```
✅ 데이터 보호:
비밀번호 → 암호화 저장
해커가 DB 탈취해도
→ 암호문만 보임 (해독 불가)
→ 안전! ✅
```

**비유**:
- **암호화 없음** = 일기장 그대로
- **암호화** = 암호로 쓴 일기

## 💡 대칭키 암호화 (AES)

### 암호화/복호화
```python
from cryptography.fernet import Fernet

# 키 생성
key = Fernet.generate_key()
cipher = Fernet(key)

# 암호화
plaintext = b"Secret message"
ciphertext = cipher.encrypt(plaintext)
print(ciphertext)
# → b'gAAAAABh...' (암호문)

# 복호화
decrypted = cipher.decrypt(ciphertext)
print(decrypted)
# → b'Secret message'
```

### 파일 암호화
```python
def encrypt_file(filename, key):
    """파일 암호화"""
    cipher = Fernet(key)
    
    with open(filename, 'rb') as f:
        data = f.read()
    
    encrypted = cipher.encrypt(data)
    
    with open(f"{filename}.encrypted", 'wb') as f:
        f.write(encrypted)

def decrypt_file(filename, key):
    """파일 복호화"""
    cipher = Fernet(key)
    
    with open(filename, 'rb') as f:
        encrypted = f.read()
    
    decrypted = cipher.decrypt(encrypted)
    
    with open(filename.replace('.encrypted', ''), 'wb') as f:
        f.write(decrypted)

# 사용
key = Fernet.generate_key()
encrypt_file('document.pdf', key)
decrypt_file('document.pdf.encrypted', key)
```

## 💡 비대칭키 암호화 (RSA)

### 키 생성
```python
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

# 개인키/공개키 생성
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)
public_key = private_key.public_key()

# 암호화 (공개키 사용)
message = b"Secret message"
ciphertext = public_key.encrypt(
    message,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

# 복호화 (개인키 사용)
plaintext = private_key.decrypt(
    ciphertext,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)
```

### 디지털 서명
```python
from cryptography.hazmat.primitives import serialization

# 서명 생성 (개인키)
signature = private_key.sign(
    message,
    padding.PSS(
        mgf=padding.MGF1(hashes.SHA256()),
        salt_length=padding.PSS.MAX_LENGTH
    ),
    hashes.SHA256()
)

# 서명 검증 (공개키)
try:
    public_key.verify(
        signature,
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    print("✅ Signature valid")
except:
    print("❌ Signature invalid")
```

## 💡 해시 (단방향)

### 비밀번호 해싱
```python
import bcrypt

# 비밀번호 해싱
password = b"my_password"
hashed = bcrypt.hashpw(password, bcrypt.gensalt())
print(hashed)
# → b'$2b$12$...' (복호화 불가)

# 비밀번호 확인
if bcrypt.checkpw(password, hashed):
    print("✅ Password correct")
else:
    print("❌ Password incorrect")
```

### SHA-256 해시
```python
import hashlib

data = b"Hello, World!"
hash_value = hashlib.sha256(data).hexdigest()
print(hash_value)
# → '315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3'

# 파일 해시 (무결성 확인)
def file_hash(filename):
    """파일 SHA-256 해시"""
    sha256 = hashlib.sha256()
    
    with open(filename, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b''):
            sha256.update(chunk)
    
    return sha256.hexdigest()

# 사용
hash1 = file_hash('document.pdf')
# 파일 전송 후
hash2 = file_hash('received.pdf')

if hash1 == hash2:
    print("✅ File integrity verified")
```

## 💡 실전 예시

### 데이터베이스 암호화
```python
from cryptography.fernet import Fernet

class EncryptedDB:
    def __init__(self, key):
        self.cipher = Fernet(key)
    
    def encrypt_field(self, value):
        """필드 암호화"""
        return self.cipher.encrypt(value.encode()).decode()
    
    def decrypt_field(self, encrypted):
        """필드 복호화"""
        return self.cipher.decrypt(encrypted.encode()).decode()
    
    def save_user(self, name, ssn):
        """사용자 저장 (SSN 암호화)"""
        encrypted_ssn = self.encrypt_field(ssn)
        
        db.users.insert({
            'name': name,
            'ssn': encrypted_ssn  # 암호화됨
        })
    
    def get_user_ssn(self, user_id):
        """사용자 SSN 조회 (복호화)"""
        user = db.users.find_one({'id': user_id})
        
        return self.decrypt_field(user['ssn'])

# 사용
key = Fernet.generate_key()
encrypted_db = EncryptedDB(key)

encrypted_db.save_user('John', '123-45-6789')
```

### HTTPS 통신
```python
# 클라이언트
import requests

# TLS/SSL로 암호화된 통신
response = requests.get('https://api.example.com/data')

# 서버
from flask import Flask

app = Flask(__name__)

# SSL 인증서로 HTTPS 서버 실행
app.run(ssl_context=('cert.pem', 'key.pem'))
```

## 💡 End-to-End 암호화

```python
class E2EEncryption:
    """종단간 암호화"""
    
    def __init__(self):
        # 각 사용자가 자신의 키쌍 보유
        self.users = {}
    
    def register_user(self, user_id):
        """사용자 등록 (키쌍 생성)"""
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048
        )
        public_key = private_key.public_key()
        
        self.users[user_id] = {
            'private_key': private_key,
            'public_key': public_key
        }
    
    def send_message(self, from_user, to_user, message):
        """메시지 전송 (수신자 공개키로 암호화)"""
        recipient_public_key = self.users[to_user]['public_key']
        
        # 수신자 공개키로 암호화
        ciphertext = recipient_public_key.encrypt(
            message.encode(),
            padding.OAEP(...)
        )
        
        return ciphertext
    
    def receive_message(self, user_id, ciphertext):
        """메시지 수신 (자신의 개인키로 복호화)"""
        private_key = self.users[user_id]['private_key']
        
        # 자신의 개인키로 복호화
        plaintext = private_key.decrypt(
            ciphertext,
            padding.OAEP(...)
        )
        
        return plaintext.decode()

# 사용
e2e = E2EEncryption()
e2e.register_user('alice')
e2e.register_user('bob')

# Alice → Bob
encrypted = e2e.send_message('alice', 'bob', 'Secret message')
# 서버는 암호문만 봄!

decrypted = e2e.receive_message('bob', encrypted)
# Bob만 읽을 수 있음
```

## 🎯 암호화 비교

| 방식 | 대칭키 | 비대칭키 | 해시 |
|------|--------|----------|------|
| **키** | 1개 | 2개 (공개/개인) | 없음 |
| **속도** | 빠름 | 느림 | 빠름 |
| **복호화** | 가능 | 가능 | 불가능 |
| **용도** | 대용량 데이터 | 키 교환, 서명 | 무결성, 비밀번호 |
| **예** | AES | RSA | SHA-256 |

## 💡 보안 Best Practices

```python
# ❌ 약한 암호화
md5_hash = hashlib.md5(password).hexdigest()  # MD5 취약!

# ✅ 강력한 암호화
bcrypt_hash = bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))

# ❌ 코드에 키 하드코딩
KEY = b'my_secret_key_123'

# ✅ 환경 변수 사용
import os
KEY = os.getenv('ENCRYPTION_KEY').encode()

# ❌ 짧은 키
key = b'short'  # 취약!

# ✅ 충분한 키 길이
key = Fernet.generate_key()  # 256비트
```

## 🔗 관련 용어

- [[HTTPS]]: 암호화 통신
- [[SSL/TLS]]: 암호화 프로토콜
- [[Hash]]: 단방향 암호화

---
*카테고리: 보안*
*생성일: 2026-02-14*
