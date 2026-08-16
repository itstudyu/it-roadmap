# AWS (Amazon Web Services)

## 📝 정의
AWS는 **Amazon의 클라우드 컴퓨팅 플랫폼**입니다. 세계 최대 규모의 클라우드 서비스 제공자입니다.

### 핵심 서비스

**컴퓨팅**:
- EC2: 가상 서버
- Lambda: 서버리스 함수
- ECS/EKS: 컨테이너

**스토리지**:
- S3: 객체 스토리지
- EBS: 블록 스토리지
- EFS: 파일 시스템

**데이터베이스**:
- RDS: 관계형 DB
- DynamoDB: NoSQL
- ElastiCache: 캐시

**네트워킹**:
- VPC: 가상 네트워크
- CloudFront: CDN
- Route 53: DNS

## 💡 AWS 시작하기

```bash
# AWS CLI 설치
pip install awscli

# 자격 증명 설정
aws configure
# Access Key ID: AKIAIOSFODNN7EXAMPLE
# Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# Region: us-east-1

# S3 버킷 목록
aws s3 ls

# EC2 인스턴스 목록
aws ec2 describe-instances
```

## 🎯 주요 특징

**글로벌 인프라**:
- 30개 이상 리전
- 90개 이상 가용 영역
- 전 세계 어디서나 배포

**보안**:
- IAM: 접근 관리
- KMS: 암호화 키 관리
- CloudTrail: 감사 로그

**관리 도구**:
- CloudWatch: 모니터링
- CloudFormation: 인프라 코드
- Systems Manager: 운영 관리

## 🔗 관련 용어
- [[Cloud]]: AWS는 클라우드 제공자
- [[EC2]]: AWS 가상 서버
- [[S3]]: AWS 스토리지
- [[Lambda]]: AWS 서버리스

---
*카테고리: 클라우드*
