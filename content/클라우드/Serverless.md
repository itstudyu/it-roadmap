# Serverless (서버리스)

## 📝 정의

Serverless는 **서버 관리 없이 애플리케이션을 실행하는 클라우드 컴퓨팅 모델**입니다. 개발자는 코드만 작성하고, 서버 관리는 클라우드 제공자가 담당합니다.

### 핵심 개념

- **무엇인가?**: 서버 관리를 클라우드에 위임
- **왜 필요한가?**: 인프라 관리 부담 제거
- **어떻게 작동하나?**: 이벤트 기반 자동 실행

### Serverless가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 서버 관리 지옥
EC2 서버 10대 운영
→ OS 업데이트, 보안 패치
→ 스케일링 설정
→ 로드밸런서 구성
→ 모니터링 설정
→ 코드보다 서버 관리에 시간 소비! 😱

😱 시나리오 2: 비용 낭비
24시간 서버 가동
→ 새벽 2시: 사용자 0명
→ 서버는 100% 가동
→ 전기세만 낭비! 😱

😱 시나리오 3: 트래픽 폭발
평소: 사용자 100명
이벤트: 사용자 10,000명
→ 수동으로 서버 증설?
→ 시간 부족! 서버 다운! 😱
```

**Serverless의 해결**:
```
✅ 시나리오 1: 관리 불필요
코드만 배포
→ AWS가 서버 관리
→ 업데이트, 패치 자동
→ 개발에만 집중! ✅

✅ 시나리오 2: 사용량 기반 과금
실행할 때만 비용
→ 새벽 2시: $0
→ 피크 타임: 사용량만큼만
→ 비용 80% 절감! ✅

✅ 시나리오 3: 자동 스케일링
트래픽 급증
→ 자동으로 확장
→ 10,000명 동시 처리
→ 걱정 끝! ✅
```

## 📊 Serverless 아키텍처


### 주요 서비스

**AWS**:
- Lambda: 함수 실행
- API Gateway: API 관리
- DynamoDB: NoSQL DB
- S3: 파일 저장
- EventBridge: 이벤트 버스

**Azure**:
- Azure Functions
- Cosmos DB
- Blob Storage

**Google Cloud**:
- Cloud Functions
- Firestore
- Cloud Storage

## 💡 Serverless 예시

### 간단한 API

```python
# Lambda 함수
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

def lambda_handler(event, context):
    """사용자 조회 API"""
    
    user_id = event['pathParameters']['id']
    
    # DynamoDB 조회
    response = table.get_item(Key={'userId': user_id})
    
    if 'Item' in response:
        return {
            'statusCode': 200,
            'body': json.dumps(response['Item'])
        }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'User not found'})
        }
```

**인프라 코드 (Serverless Framework)**:
```yaml
service: user-service

provider:
  name: aws
  runtime: python3.9

functions:
  getUser:
    handler: handler.lambda_handler
    events:
      - http:
          path: users/{id}
          method: get

resources:
  Resources:
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: Users
        AttributeDefinitions:
          - AttributeName: userId
            AttributeType: S
        KeySchema:
          - AttributeName: userId
            KeyType: HASH
```

**배포**:
```bash
serverless deploy
# → API 엔드포인트 자동 생성
# → https://abc123.execute-api.us-east-1.amazonaws.com/users/{id}
```

### 이미지 처리 파이프라인

```python
# S3 이벤트 → Lambda
def resize_handler(event, context):
    """이미지 업로드 시 자동 리사이즈"""
    
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    # 원본 다운로드
    s3.download_file(bucket, key, '/tmp/original.jpg')
    
    # 리사이즈
    resize_image('/tmp/original.jpg', '/tmp/thumbnail.jpg')
    
    # 썸네일 업로드
    s3.upload_file('/tmp/thumbnail.jpg', bucket, f'thumbs/{key}')
    
    return {'statusCode': 200}
```

**설정**:
```yaml
functions:
  resizeImage:
    handler: resize.resize_handler
    events:
      - s3:
          bucket: my-images
          event: s3:ObjectCreated:*
```

## 🎯 Serverless 장단점

### 장점

**1. 비용 절감**:
```
사용한 만큼만 비용
→ 유휴 시간 = $0
→ 트래픽 적으면 거의 무료
```

**2. 자동 스케일링**:
```
트래픽에 따라 자동 확장
→ 1 요청 = 1 인스턴스
→ 10,000 요청 = 10,000 인스턴스
```

**3. 관리 부담 제거**:
```
서버 없음
→ OS 업데이트 불필요
→ 보안 패치 자동
→ 인프라 코드로 관리
```

**4. 빠른 개발**:
```
서버 설정 불필요
→ 코드 작성 → 배포
→ 몇 분 안에 프로덕션
```

### 단점

**1. Cold Start**:
```
첫 요청 시 지연
→ 100-1000ms 추가
→ 자주 호출되면 괜찮음
```

**2. 실행 시간 제한**:
```
Lambda: 최대 15분
→ 장시간 작업 불가
→ Batch 작업은 다른 서비스
```

**3. 디버깅 어려움**:
```
로컬 환경과 다름
→ CloudWatch 로그 확인 필요
→ 분산 트레이싱 복잡
```

**4. 벤더 종속**:
```
AWS Lambda → Azure Functions 이동?
→ 코드 재작성 필요
→ Lock-in 위험
```

## 🔍 Serverless vs 기존 서버

| 특성 | Serverless | 기존 서버 |
|------|-----------|----------|
| **서버 관리** | 불필요 | 필요 |
| **비용** | 사용량 기반 | 고정 비용 |
| **스케일링** | 자동 | 수동/자동 |
| **시작 시간** | 즉시 | 서버 부팅 |
| **상태 유지** | Stateless | Stateful 가능 |
| **실행 시간** | 제한 있음 | 무제한 |

## 💻 실전 패턴

### 1. API Backend

```javascript
// Express 스타일 Lambda
const serverless = require('serverless-http');
const express = require('express');

const app = express();

app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.json(users);
});

app.post('/users', async (req, res) => {
    const user = await createUser(req.body);
    res.json(user);
});

module.exports.handler = serverless(app);
```

### 2. 스케줄 작업

```python
# 매일 밤 12시 리포트 생성
def generate_report(event, context):
    """일일 리포트 생성"""
    
    # 데이터 수집
    data = collect_daily_data()
    
    # 리포트 생성
    report = generate_pdf(data)
    
    # 이메일 전송
    send_email(report)
```

```yaml
# 스케줄 설정
functions:
  dailyReport:
    handler: report.generate_report
    events:
      - schedule: cron(0 0 * * ? *)  # 매일 자정
```

### 3. 이벤트 처리

```python
# SQS 메시지 처리
def process_message(event, context):
    """큐 메시지 처리"""
    
    for record in event['Records']:
        message = json.loads(record['body'])
        
        # 비즈니스 로직
        process_order(message)
```

## 🚨 Serverless 베스트 프랙티스

### 1. 작은 함수

```python
# ❌ 나쁜 예: 모든 것을 하나에
def mega_function(event, context):
    if event['type'] == 'user':
        create_user()
    elif event['type'] == 'order':
        create_order()
    # ... 100줄

# ✅ 좋은 예: 역할별 분리
def create_user(event, context):
    # 사용자 생성만
    pass

def create_order(event, context):
    # 주문 생성만
    pass
```

### 2. 환경 변수 사용

```python
import os

# ✅ 환경 변수로 설정
DB_HOST = os.environ['DB_HOST']
API_KEY = os.environ['API_KEY']
```

```yaml
# serverless.yml
functions:
  myFunction:
    handler: handler.main
    environment:
      DB_HOST: ${env:DB_HOST}
      API_KEY: ${env:API_KEY}
```

### 3. 에러 처리

```python
def lambda_handler(event, context):
    try:
        result = process(event)
        return {
            'statusCode': 200,
            'body': json.dumps(result)
        }
    except ValueError as e:
        # 클라이언트 오류
        return {
            'statusCode': 400,
            'body': json.dumps({'error': str(e)})
        }
    except Exception as e:
        # 서버 오류
        logger.error(f"Unexpected error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        }
```

## 🔗 관련 용어

- [[Lambda]]: AWS의 서버리스 컴퓨팅
- [[API Gateway]]: 서버리스 API 관리
- [[DynamoDB]]: 서버리스 데이터베이스
- [[S3]]: 서버리스 스토리지
- [[CloudFormation]]: 인프라 as 코드

## 📝 정리

**Serverless의 핵심**:
```
Serverless = 서버 관리 불필요
→ 코드만 작성
→ 사용량 기반 비용
→ 자동 스케일링
→ 이벤트 기반 실행
```

**언제 사용?**:
```
✅ 적합:
- API 백엔드
- 이벤트 처리
- 배치 작업
- 마이크로서비스

❌ 부적합:
- 장시간 실행 (>15분)
- 상태 유지 필요
- WebSocket (제한적)
- 대용량 메모리
```

**비유로 기억하기**:
```
기존 서버 = 자가용
→ 구매, 유지보수, 주차 필요
→ 항상 소유

Serverless = 우버/택시
→ 필요할 때만 호출
→ 탄 만큼만 요금
→ 차량 관리 불필요
```

---
*카테고리: 클라우드*
*생성일: 2026-02-15*
