# EC2 (Elastic Compute Cloud)

## 📝 정의
EC2는 **AWS의 가상 서버 서비스**입니다. 클라우드에서 확장 가능한 컴퓨팅 용량을 제공합니다.

### 핵심 개념
- 인스턴스: 가상 서버
- AMI: 서버 이미지
- 탄력성: 즉시 증설/축소

## 💡 EC2 사용

**인스턴스 시작**:
```bash
# AWS CLI로 EC2 시작
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t2.micro \
  --key-name my-key

# SSH 접속
ssh -i my-key.pem ec2-user@54.123.45.67
```

**Python boto3**:
```python
import boto3

ec2 = boto3.resource('ec2')

# 인스턴스 생성
instance = ec2.create_instances(
    ImageId='ami-0abcdef1234567890',
    MinCount=1,
    MaxCount=1,
    InstanceType='t2.micro',
    KeyName='my-key'
)

# 인스턴스 중지
instance[0].stop()
```

## 🎯 인스턴스 타입

**범용 (General Purpose)**:
- t2.micro, t2.small: 개발/테스트
- t3.medium: 소규모 앱

**컴퓨팅 최적화**:
- c5.large: CPU 집약적
- c5.xlarge: 고성능 웹 서버

**메모리 최적화**:
- r5.large: 데이터베이스
- r5.xlarge: 캐시 서버

**GPU**:
- p3.2xlarge: 딥러닝
- g4dn.xlarge: 그래픽 처리

## 📊 요금

**온디맨드**:
```
사용한 시간만큼 비용
t2.micro: $0.0116/시간
```

**예약 인스턴스**:
```
1-3년 약정
→ 최대 75% 할인
```

**스팟 인스턴스**:
```
여유 용량 활용
→ 최대 90% 할인
→ 중단될 수 있음
```

## 🔗 관련 용어
- [[AWS]]: EC2의 제공자
- [[Lambda]]: 서버리스 대안
- [[EBS]]: EC2 스토리지
- [[VPC]]: EC2 네트워크

---
*카테고리: 클라우드*
