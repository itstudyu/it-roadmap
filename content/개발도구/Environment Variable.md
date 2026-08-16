# 환경 변수 (Environment Variable)

## 📝 정의

환경 변수(Environment Variable)는 **운영 환경(개발/스테이징/운영)에 따라 달라지는 설정값을 코드 외부에서 관리하는 방법**입니다. 애플리케이션은 코드를 수정하지 않고도 환경 변수를 읽어서 다양한 환경에 적응할 수 있습니다. 예를 들어 개발 환경에서는 로컬 데이터베이스를 사용하고, 운영 환경에서는 프로덕션 데이터베이스를 사용하도록 같은 코드로 동작하게 할 수 있습니다.

환경 변수의 핵심 목표는 **코드와 설정의 분리**입니다. API 키, 데이터베이스 비밀번호, 서비스 엔드포인트 등 환경에 따라 변하는 값들을 코드에 하드코딩하지 않음으로써, 보안을 강화하고 배포를 간편하게 합니다. 또한 같은 바이너리(실행 파일)를 여러 환경에서 사용할 수 있게 해줍니다.

> **한 줄 요약**: 코드를 수정하지 않고 외부에서 설정값을 주입하여 다양한 환경에 적응하는 방식

**비유 1**: 환경 변수는 영화 배우의 분장실과 같습니다. 배우(코드)는 같은 사람이지만, 분장실에서 받은 의상과 메이크업(환경 변수)에 따라 다른 캐릭터가 됩니다. 배우가 직접 의상을 만들지 않아도 됩니다.

**비유 2**: 환경 변수는 카멜레온의 피부색 변화와 같습니다. 카멜레온의 DNA(코드)는 같지만, 주변 환경(환경 변수)에 따라 색깔이 변합니다. DNA를 바꾸지 않고도 색깔이 자동으로 조정됩니다.

---

## 🎯 핵심 개념

### 1. .env 파일
`.env` 파일은 환경 변수를 저장하는 가장 일반적인 방식입니다. 프로젝트 루트에 `.env` 파일을 생성하고, `KEY=VALUE` 형식으로 작성합니다.

```
# 개발 환경용 .env
DATABASE_URL=postgresql://localhost/myapp_dev
API_KEY=dev_key_12345
DEBUG=true
JWT_SECRET=dev_secret_key
```

중요한 점은 `.env` 파일을 **`.gitignore`에 추가하여 버전 관리에서 제외**해야 한다는 것입니다. 비밀번호나 API 키가 Github 같은 공개 저장소에 노출되지 않기 위함입니다.

### 2. 환경별 분리
여러 환경에 대응하기 위해 다음과 같이 파일을 분리합니다:
- `.env.development` : 로컬 개발 환경
- `.env.staging` : 스테이징(테스트) 환경
- `.env.production` : 운영 환경
- `.env.example` : 필요한 변수 목록 (버전 관리에 포함)

### 3. 클라우드 시크릿 관리자
대규모 시스템에서는 환경 변수를 클라우드 서비스에서 관리합니다:
- **AWS Secrets Manager**: AWS의 비밀 정보 관리 서비스
- **Azure Key Vault**: Azure의 보안 키 저장소
- **Google Secret Manager**: Google Cloud의 시크릿 관리 서비스
- **HashiCorp Vault**: 멀티클라우드 지원 오픈소스 시크릿 관리 도구

이들은 암호화, 접근 제어, 감사 기능을 제공하여 더 높은 보안 수준을 보장합니다.

---

## ⚠️ 해결하는 문제

### 문제 1: 보안 정보 유출 위험
API 키, 데이터베이스 비밀번호, 신용카드 정보 등을 코드에 하드코딩하면 다음과 같은 문제가 발생합니다:
- 공개 GitHub 저장소에 실수로 커밋될 위험
- 코드 리뷰 과정에서 민감한 정보 노출
- 개발자 퇴직 시 비밀정보 회수 어려움
- 소스 코드 분석 도구에 의한 유출

환경 변수를 사용하면 코드에는 민감한 정보가 포함되지 않으므로 안전합니다.

### 문제 2: 환경마다 다른 설정 관리 복잡성
개발 환경과 운영 환경의 설정이 다르다면, 각 환경마다 다른 코드를 배포해야 합니다. 이는 오류를 유발하고 배포 프로세스를 복잡하게 합니다:
- 개발: `DATABASE_URL=localhost:5432`
- 운영: `DATABASE_URL=prod-db.aws.com:5432`

환경 변수를 사용하면 **같은 바이너리를 모든 환경에서 사용**할 수 있어 배포가 간단해집니다.

---

## 🏗️ 구조

```도해
흐름: 환경 변수, 어떤 순서로 이어지나
OS 환경 변수 (export… :: OS 환경 변수 (export…
D :: 높은 우선순위
D :: 중간 우선순위
D :: 낮은 우선순위
E :: 로드
```

```도해
흐름: 환경 변수, 어떤 순서로 이어지나
개발 환경"] -->|.env.… :: 개발 환경"] -->|.env.…
D :: .env.development
D :: .env.staging
D :: .env.production
E :: 설정 값 읽기
```

---

## ⚙️ 작동 원리

1. **설정 파일 생성**: 프로젝트 루트에 `.env` 파일을 생성하고 필요한 변수들을 `KEY=VALUE` 형식으로 작성합니다.

2. **라이브러리 로드**: Node.js라면 `dotenv`, Python이라면 `python-dotenv`, Java라면 `spring.config.import` 같은 라이브러리를 사용하여 `.env` 파일을 읽습니다.

3. **환경 변수 주입**: 라이브러리가 `.env` 파일의 내용을 읽어서 프로세스의 환경 변수에 주입합니다. 이제 애플리케이션 코드에서 `process.env.DATABASE_URL`처럼 접근할 수 있습니다.

4. **코드에서 읽기**: 애플리케이션이 런타임에 환경 변수를 읽어서 초기화합니다.
   ```javascript
   const dbUrl = process.env.DATABASE_URL || 'localhost:5432';
   const apiKey = process.env.API_KEY;
   ```

5. **기본값 제공**: 환경 변수가 설정되지 않은 경우를 대비해 기본값(Default Value)을 제공하는 것이 좋습니다.

6. **환경별 오버라이드**: 운영 환경에서는 클라우드 시크릿 관리자에서 환경 변수를 주입하여 `.env` 파일의 값을 오버라이드합니다.

7. **검증**: 필수 환경 변수가 모두 설정되었는지 애플리케이션 시작 시 확인합니다.

---

## 📊 비교

| 항목 | 환경 변수 | 하드코딩 | 설정 파일 | 시크릿 매니저 |
|------|---------|--------|----------|-------------|
| **보안성** | 높음 (민감한 정보 제외) | 매우 낮음 (코드에 노출) | 중간 (파일 관리 필요) | 매우 높음 (암호화 + 접근제어) |
| **환경별 관리** | 매우 쉬움 (.env 파일 교체) | 어려움 (코드 수정 필요) | 쉬움 (설정 파일 교체) | 쉬움 (서비스에서 관리) |
| **배포 간편성** | 높음 (같은 바이너리) | 낮음 (환경마다 빌드) | 높음 | 높음 |
| **버전 관리** | 용이 (민감정보 제외) | 어려움 (민감정보 포함) | 용이 (암호화 필요) | 자동 관리 |
| **대규모 확장** | 제한적 | 불가능 | 제한적 | 최적 |
| **초기 구축 난이도** | 낮음 | 매우 낮음 | 낮음 | 높음 |
| **운영 복잡도** | 낮음 | 낮음 | 중간 | 중간 |
| **감사(Audit)** | 기본 | 없음 | 기본 | 자동 |

---

## ✅ 장단점

**장점:**
- **강력한 보안성**: API 키, 비밀번호 같은 민감한 정보를 코드에서 분리
- **환경별 유연성**: 개발/스테이징/운영 환경을 쉽게 구분 관리
- **배포 간결성**: 같은 코드(바이너리)를 모든 환경에 배포
- **설정 변경 용이**: 코드 수정 없이 환경 변수만 변경하면 됨
- **실수 방지**: 하드코딩된 테스트 비밀번호를 실수로 배포할 위험 제거
- **12 Factor App 준수**: 현대적 애플리케이션 개발 방법론과 일치
- **Docker와 통합성**: 컨테이너 환경에서 환경 변수 전달이 표준화됨
- **접근 제어**: 직원별로 필요한 환경 변수만 공개 가능

**단점:**
- **초기 설정 복잡**: 모든 필요한 환경 변수를 식별하고 정의해야 함
- **문서화 필요**: 어떤 환경 변수가 필요한지 명확히 문서화해야 함
- **기본값 관리 어려움**: 기본값을 잘못 설정하면 보안 문제 발생 가능
- **개발 편의성 감소**: 로컬 개발 시 `.env` 파일을 매번 설정해야 함
- **버전 관리 불가**: 민감한 정보는 버전 관리 시스템에 저장할 수 없음
- **오류 추적 어려움**: 잘못된 환경 변수로 인한 오류 원인 파악이 어려울 수 있음
- **도구 의존**: 각 언어/프레임워크마다 다른 라이브러리 필요
- **마이그레이션 복잡**: 기존 하드코딩된 설정을 환경 변수로 마이그레이션하는 비용

---

## 💡 실제 사례

### 사례 1: Node.js 애플리케이션의 환경 변수 관리

`.env.development`:
```
DATABASE_URL=postgresql://localhost:5432/myapp_dev
DATABASE_USER=dev_user
DATABASE_PASSWORD=dev_password
NODE_ENV=development
DEBUG=true
API_TIMEOUT=30000
```

`.env.production`:
```
DATABASE_URL=postgresql://prod-db.aws.com:5432/myapp
DATABASE_USER=prod_user
DATABASE_PASSWORD=xxxxxxxx (매우 안전한 비밀번호)
NODE_ENV=production
DEBUG=false
API_TIMEOUT=5000
```

`app.js`:
```javascript
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || 'localhost:5432';
const dbUser = process.env.DATABASE_USER || 'admin';
const nodeEnv = process.env.NODE_ENV || 'development';

console.log(`Starting app in ${nodeEnv} environment`);
// 데이터베이스 연결...
```

결과: 같은 `app.js` 코드를 `.env` 파일만 변경하여 모든 환경에서 실행할 수 있습니다.

### 사례 2: Docker 컨테이너에서 환경 변수 주입

`Dockerfile`:
```dockerfile
FROM node:16
WORKDIR /app
COPY . .
RUN npm install
# 환경 변수는 런타임에 주입됨
CMD ["node", "app.js"]
```

배포 스크립트:
```bash
# 개발 환경 배포
docker run -e DATABASE_URL=localhost:5432 -e API_KEY=dev_key myapp

# 운영 환경 배포
docker run -e DATABASE_URL=prod-db.aws.com:5432 -e API_KEY=prod_key_secret myapp
```

결과: 같은 Docker 이미지를 다양한 환경에서 실행할 수 있습니다.

### 사례 3: AWS Lambda 함수에서 환경 변수 사용

`lambda_function.py`:
```python
import os
import boto3

def lambda_handler(event, context):
    # 환경 변수에서 AWS 리소스 정보 읽기
    dynamodb_table = os.environ.get('DYNAMODB_TABLE')
    sns_topic_arn = os.environ.get('SNS_TOPIC_ARN')

    # 리소스 초기화
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(dynamodb_table)

    # 비즈니스 로직...
    return {'statusCode': 200}
```

AWS Lambda 콘솔 또는 CloudFormation에서 환경 변수 설정:
```
DYNAMODB_TABLE=users-prod
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789:notifications
```

결과: 코드 수정 없이 환경 변수만 변경하여 다양한 DynamoDB 테이블과 SNS 토픽을 사용할 수 있습니다.

### 사례 4: Java Spring Boot 애플리케이션

`application.properties`:
```properties
spring.datasource.url=${DATABASE_URL:jdbc:mysql://localhost:3306/myapp}
spring.datasource.username=${DATABASE_USER:root}
spring.datasource.password=${DATABASE_PASSWORD:password}
server.port=${SERVER_PORT:8080}
logging.level.root=${LOG_LEVEL:INFO}
```

`application-prod.properties`:
```properties
spring.datasource.url=${DATABASE_URL:jdbc:mysql://prod-rds.aws.com:3306/myapp}
logging.level.root=WARN
```

배포:
```bash
# 개발 환경
java -jar app.jar --spring.profiles.active=dev

# 운영 환경
java -Dspring.config.import=file:/etc/config/prod.env -jar app.jar --spring.profiles.active=prod
```

결과: Spring Boot의 프로필과 환경 변수를 조합하여 환경별 설정을 효율적으로 관리합니다.

### 사례 5: Python 데이터 분석 스크립트

`.env`:
```
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_BUCKET=my-data-bucket
DATABASE_CONNECTION_STRING=postgresql://user:pass@localhost/db
SMTP_SERVER=smtp.gmail.com
SMTP_PASSWORD=app_specific_password
```

`data_processing.py`:
```python
import os
from dotenv import load_dotenv
import boto3
import psycopg2

load_dotenv()

# AWS 설정
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

# 데이터베이스 설정
conn = psycopg2.connect(os.getenv('DATABASE_CONNECTION_STRING'))

# 이메일 설정
smtp_server = os.getenv('SMTP_SERVER')
smtp_password = os.getenv('SMTP_PASSWORD')
```

`.gitignore`:
```
.env
.env.local
*.pyc
```

결과: API 키와 비밀번호를 코드와 분리하여 안전하게 관리합니다.

---

## 🔗 관련 용어

- **.env 파일**: 환경 변수를 저장하는 텍스트 파일
- **dotenv**: 다양한 언어에서 `.env` 파일을 로드하는 라이브러리
- **AWS Secrets Manager**: AWS의 비밀 정보 관리 서비스
- **시크릿 관리자 (Secret Manager)**: 민감한 정보를 안전하게 관리하는 도구
- **설정 관리 (Configuration Management)**: 애플리케이션 설정을 체계적으로 관리
- **12 Factor App**: 현대적 웹 애플리케이션 개발의 12가지 원칙 중 하나
- **프로필 (Profile)**: Spring Boot 같은 프레임워크에서 환경별 설정 분리
- **런타임 설정 (Runtime Configuration)**: 실행 시점에 동적으로 적용되는 설정

---

*카테고리: 개발도구*
