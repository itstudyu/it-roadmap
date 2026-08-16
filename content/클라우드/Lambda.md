# Lambda (AWS Lambda)

## 📝 정의

Lambda는 **서버 관리 없이 코드를 실행할 수 있는 서버리스 컴퓨팅 서비스**입니다. 이벤트 발생 시 자동으로 코드를 실행하고 사용한 만큼만 비용을 지불합니다.

### 핵심 개념

- **무엇인가?**: 서버 없이 함수 실행
- **왜 필요한가?**: 서버 관리 부담 제거, 비용 절감
- **어떻게 작동하나?**: 이벤트 트리거 → 함수 실행 → 자동 종료

### Lambda가 해결하는 문제

**문제 상황**:
```python
😱 시나리오 1: 항상 켜져있는 서버
간단한 이미지 리사이즈 API
→ 하루에 10번만 호출됨
→ 서버는 24시간 켜져있음
→ 23시간 50분은 놀고 있음! 😱
→ 서버 유지 비용 월 $50

😱 시나리오 2: 트래픽 변동
새벽: 사용자 0명
점심: 사용자 1000명
→ 1000명 기준으로 서버 유지? 😱
→ 대부분 시간에 자원 낭비!

😱 시나리오 3: 서버 관리
서버 설정, OS 업데이트, 보안 패치
스케일링, 모니터링, 로그 관리
→ 코드보다 인프라 관리에 시간 소비! 😱
```

**Lambda의 해결**:
```python
✅ 시나리오 1: 사용한 만큼만 지불
Lambda 함수 생성
→ 호출될 때만 실행
→ 실행 시간만 과금 (0.0001초 단위)
→ 하루 10번 × 100ms = 1초
→ 비용: 거의 무료! ✅

✅ 시나리오 2: 자동 스케일링
Lambda는 자동으로 확장
→ 1명이든 1000명이든
→ 동시 실행 자동 처리
→ 걱정할 필요 없음! ✅

✅ 시나리오 3: 인프라 관리 제로
코드만 업로드
→ AWS가 모든 인프라 관리
→ 스케일링, 패치, 모니터링 자동
→ 개발에만 집중! ✅
```

## 📊 Lambda 작동 원리


### Lambda 라이프사이클

**1. Cold Start (초기 시작)**:
```
함수 첫 호출
→ 컨테이너 생성
→ 코드 로드
→ 함수 실행
→ 응답 시간: 100-1000ms
```

**2. Warm Start (재사용)**:
```
이미 생성된 컨테이너
→ 바로 함수 실행
→ 응답 시간: 1-10ms
```

**3. Timeout (종료)**:
```
일정 시간 사용 안 하면
→ 컨테이너 자동 제거
→ 다음 호출 시 Cold Start
```

## 💡 Lambda 함수 작성

### Python Lambda

```python
# lambda_function.py
import json

def lambda_handler(event, context):
    """Lambda 함수 핸들러"""
    
    # 이벤트에서 데이터 추출
    name = event.get('name', 'Guest')
    
    # 비즈니스 로직
    message = f"Hello, {name}!"
    
    # 응답 반환
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': message
        })
    }
```

### Node.js Lambda

```javascript
// index.js
exports.handler = async (event) => {
    // 이벤트에서 데이터 추출
    const name = event.name || 'Guest';
    
    // 비즈니스 로직
    const message = `Hello, ${name}!`;
    
    // 응답 반환
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: message
        })
    };
};
```

## 🎯 실전 활용

### 1. 이미지 리사이즈

```python
import boto3
from PIL import Image
import io

def lambda_handler(event, context):
    """S3에 업로드된 이미지 자동 리사이즈"""
    
    s3 = boto3.client('s3')
    
    # S3 이벤트에서 정보 추출
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    # 원본 이미지 다운로드
    obj = s3.get_object(Bucket=bucket, Key=key)
    img = Image.open(obj['Body'])
    
    # 리사이즈
    img_resized = img.resize((800, 600))
    
    # 버퍼에 저장
    buffer = io.BytesIO()
    img_resized.save(buffer, 'JPEG')
    buffer.seek(0)
    
    # 썸네일 업로드
    thumb_key = f"thumbnails/{key}"
    s3.put_object(
        Bucket=bucket,
        Key=thumb_key,
        Body=buffer,
        ContentType='image/jpeg'
    )
    
    return {'statusCode': 200, 'body': 'Success'}
```

**트리거 설정**:
```
S3 버킷에 이미지 업로드
→ Lambda 자동 실행
→ 썸네일 생성
→ 다른 S3 경로에 저장
```

### 2. API 엔드포인트

```python
def lambda_handler(event, context):
    """REST API 엔드포인트"""
    
    # HTTP 메서드 확인
    method = event['httpMethod']
    
    if method == 'GET':
        # 데이터 조회
        return get_users()
    elif method == 'POST':
        # 데이터 생성
        body = json.loads(event['body'])
        return create_user(body)
    
def get_users():
    # DynamoDB에서 사용자 조회
    users = dynamodb.scan(TableName='Users')
    return {
        'statusCode': 200,
        'body': json.dumps(users['Items'])
    }
```

**API Gateway 연결**:
```
GET  /users  → Lambda 함수 호출
POST /users  → Lambda 함수 호출
```

### 3. 스케줄 작업

```python
import boto3
from datetime import datetime

def lambda_handler(event, context):
    """매일 밤 12시 DB 백업"""
    
    rds = boto3.client('rds')
    
    # 타임스탬프
    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    
    # DB 스냅샷 생성
    response = rds.create_db_snapshot(
        DBSnapshotIdentifier=f'backup-{timestamp}',
        DBInstanceIdentifier='my-database'
    )
    
    return {
        'statusCode': 200,
        'body': f"Backup created: {timestamp}"
    }
```

**CloudWatch Events 설정**:
```
매일 00:00 UTC
→ Lambda 자동 실행
→ DB 백업
```

### 4. 실시간 데이터 처리

```python
def lambda_handler(event, context):
    """Kinesis 스트림 데이터 처리"""
    
    for record in event['Records']:
        # Base64 디코딩
        payload = base64.b64decode(record['kinesis']['data'])
        data = json.loads(payload)
        
        # 데이터 처리
        if data['temperature'] > 30:
            send_alert(f"High temp: {data['temperature']}")
        
        # DynamoDB에 저장
        save_to_dynamodb(data)
    
    return {'statusCode': 200}
```

## 🔍 Lambda 제한사항

### 시간 제한

```
최대 실행 시간: 15분
→ 장시간 작업은 부적합
→ ECS/Fargate 사용 권장
```

### 메모리 제한

```
최소: 128MB
최대: 10,240MB (10GB)

메모리 ↑ = CPU 성능 ↑ = 비용 ↑
```

### 동시 실행 제한

```
기본: 1,000개 동시 실행
→ 증가 요청 가능
→ 너무 많으면 Reserved Concurrency 설정
```

### 패키지 크기

```
압축: 50MB
압축 해제: 250MB

큰 라이브러리는 Lambda Layer 사용
```

## 💻 Lambda 배포

### AWS CLI로 배포

```bash
# 코드 압축
zip function.zip lambda_function.py

# Lambda 함수 생성
aws lambda create-function \
  --function-name my-function \
  --runtime python3.9 \
  --role arn:aws:iam::123456789012:role/lambda-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://function.zip

# 함수 업데이트
aws lambda update-function-code \
  --function-name my-function \
  --zip-file fileb://function.zip
```

### Serverless Framework

```yaml
# serverless.yml
service: my-service

provider:
  name: aws
  runtime: python3.9

functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: hello
          method: get
```

```bash
# 배포
serverless deploy
```

### SAM (Serverless Application Model)

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  HelloFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.lambda_handler
      Runtime: python3.9
      Events:
        HelloApi:
          Type: Api
          Properties:
            Path: /hello
            Method: get
```

## 🚨 Lambda 최적화

### 1. Cold Start 최소화

```python
# ❌ 나쁜 예: 함수 안에서 초기화
def lambda_handler(event, context):
    import boto3  # 매번 import!
    s3 = boto3.client('s3')  # 매번 생성!

# ✅ 좋은 예: 전역에서 초기화
import boto3
s3 = boto3.client('s3')  # 한 번만!

def lambda_handler(event, context):
    # s3 재사용
    pass
```

### 2. 메모리 최적화

```
메모리 적게 = 느림 + 저렴
메모리 많이 = 빠름 + 비쌈

실험해서 최적값 찾기!
→ 128MB: $0.0000000021/100ms
→ 1024MB: $0.0000166667/100ms
```

### 3. 불필요한 코드 제거

```python
# ❌ 무거운 라이브러리
import pandas  # 사용 안 하는데 import

# ✅ 필요한 것만
from datetime import datetime
```

## 📊 Lambda 비용

### 요금 계산

```
요청 수: $0.20 per 1M requests
실행 시간: $0.0000166667 per GB-second

예시:
- 100만 건 요청
- 각 128MB, 100ms 실행
- 요청 비용: $0.20
- 실행 비용: $0.21
- 총: $0.41
```

### 무료 티어

```
매월 무료:
- 100만 건 요청
- 40만 GB-초 실행 시간

개인 프로젝트는 거의 무료!
```

## 🔗 관련 용어

- [[Serverless]]: Lambda는 서버리스의 대표
- [[API Gateway]]: Lambda와 자주 함께 사용
- [[S3]]: Lambda 트리거로 사용
- [[DynamoDB]]: Lambda와 함께 사용하는 DB
- [[CloudWatch]]: Lambda 로그 및 모니터링

## 📝 정리

**Lambda의 핵심**:
```
Lambda = 서버 없이 함수 실행
→ 이벤트 발생 시 자동 실행
→ 사용한 만큼만 비용
→ 자동 스케일링
→ 인프라 관리 제로
```

**언제 사용?**:
```
✅ 좋은 경우:
- 이벤트 기반 처리
- 짧은 실행 시간 (<15분)
- 간헐적 실행
- API 엔드포인트

❌ 안 좋은 경우:
- 장시간 실행 (>15분)
- 대용량 메모리 (>10GB)
- 지속적 실행 (24/7)
```

**비유로 기억하기**:
```
Lambda = 택시
→ 필요할 때만 호출
→ 탄 만큼만 요금
→ 차량 관리는 회사가

서버 = 자가용
→ 항상 소유
→ 고정 비용 (보험, 주차)
→ 직접 관리 필요
```

---
*카테고리: 클라우드*
*생성일: 2026-02-15*
