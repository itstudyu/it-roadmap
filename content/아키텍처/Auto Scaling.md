# Auto Scaling (오토 스케일링)

## 📝 정의

Auto Scaling(오토 스케일링)은 **트래픽에 따라 서버를 자동으로 증설/축소**하여, 비용을 최적화하고 안정성을 유지하는 기술입니다.

### 핵심 개념

- **무엇인가?**: 부하에 따라 서버 수를 자동 조절
- **왜 필요한가?**: 고정 서버는 비용 낭비 or 용량 부족
- **어떻게 작동하나?**: 메트릭 모니터링 → 임계값 초과 시 확장/축소

### Auto Scaling이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 고정 서버 10대
평상시: 트래픽 적음 → 7대 유휴 (비용 낭비)
이벤트 시: 트래픽 폭증 → 10대로 부족
→ 서비스 다운! 😱

😱 시나리오 2: 수동 확장
트래픽 증가 감지 → 서버 추가 요청
→ 승인 대기 → 프로비저닝 30분
→ 이미 장애 발생! 😱
```

**Auto Scaling의 해결**:
```
✅ 자동 조절:
평상시: CPU 20% → 서버 3대 유지
이벤트 시: CPU 80% → 10대로 자동 증설
이벤트 종료: CPU 20% → 3대로 자동 축소
→ 비용 절감 + 안정성! ✅
```

**비유**:
- **고정 서버** = 버스 (항상 50인승)
- **Auto Scaling** = 택시 (필요한 만큼만)

## 💡 Scaling 유형

### 1. Horizontal Scaling (수평 확장)
```
트래픽 증가:
서버 3대 → 5대로 증설
각 서버에 부하 분산

장점: 무한 확장 가능
단점: 상태 관리 복잡
```

### 2. Vertical Scaling (수직 확장)
```
트래픽 증가:
2 CPU, 4GB RAM
→ 4 CPU, 8GB RAM

장점: 상태 관리 간단
단점: 확장 한계
```

## 💡 Scaling 정책

### 1. Target Tracking (목표 추적)
```python
# AWS Auto Scaling 정책
{
  "TargetValue": 70.0,
  "PredefinedMetricType": "ASGAverageCPUUtilization"
}

# 의미: CPU 평균을 70%로 유지
# CPU 80% → 서버 추가
# CPU 60% → 서버 제거
```

### 2. Step Scaling (단계별)
```python
# CloudWatch Alarm 기반
알람 규칙:
- CPU > 80%: 서버 +2대
- CPU > 90%: 서버 +4대
- CPU < 30%: 서버 -1대
- CPU < 20%: 서버 -2대
```

### 3. Scheduled Scaling (예약)
```python
# 시간 기반 확장
스케줄:
- 평일 09:00: 10대로 증설
- 평일 18:00: 3대로 축소
- 주말: 2대 유지
```

## 💡 구현 예시

### AWS Auto Scaling Group
```python
import boto3

autoscaling = boto3.client('autoscaling')

# Auto Scaling Group 생성
autoscaling.create_auto_scaling_group(
    AutoScalingGroupName='web-asg',
    LaunchTemplate={
        'LaunchTemplateId': 'lt-xxx'
    },
    MinSize=2,          # 최소 2대
    MaxSize=10,         # 최대 10대
    DesiredCapacity=3,  # 현재 목표 3대
    VPCZoneIdentifier='subnet-xxx,subnet-yyy',
    TargetGroupARNs=['arn:aws:elasticloadbalancing:...']
)

# Scaling 정책 설정
autoscaling.put_scaling_policy(
    AutoScalingGroupName='web-asg',
    PolicyName='cpu-target-tracking',
    PolicyType='TargetTrackingScaling',
    TargetTrackingConfiguration={
        'PredefinedMetricSpecification': {
            'PredefinedMetricType': 'ASGAverageCPUUtilization'
        },
        'TargetValue': 70.0
    }
)
```

### Kubernetes HPA (Horizontal Pod Autoscaler)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-deployment
  minReplicas: 2      # 최소 2개 Pod
  maxReplicas: 10     # 최대 10개 Pod
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # CPU 70% 목표
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80  # 메모리 80% 목표
```

## ⚠️ 고려사항

### 1. Cooldown Period (대기 시간)
```
문제: 서버 추가 후 즉시 다시 확인
→ 아직 부하 분산 안 됨
→ 계속 서버 추가

해결: 5분 대기 후 재평가
```

### 2. Health Check (헬스체크)
```python
# 서버 정상 여부 확인
@app.route('/health')
def health():
    # DB 연결 확인
    if not db.is_connected():
        return 'unhealthy', 500
    
    return 'healthy', 200

# 비정상 서버는 자동 교체
```

### 3. Graceful Shutdown
```python
# 서버 축소 시 진행 중인 요청 완료
import signal
import time

def graceful_shutdown(signum, frame):
    print("Shutting down gracefully...")
    
    # 새 요청 거부
    server.stop_accepting()
    
    # 기존 요청 완료 대기 (최대 30초)
    time.sleep(30)
    
    # 종료
    sys.exit(0)

signal.signal(signal.SIGTERM, graceful_shutdown)
```

## 📊 비용 절감 효과

```
시나리오: 웹 서비스

고정 10대:
- 월 비용: $1,000
- 평균 사용률: 30%

Auto Scaling (평균 4대):
- 월 비용: $400
- 평균 사용률: 70%
→ 60% 비용 절감!
```

## 🔗 관련 용어

- [[Load Balancing]]: Auto Scaling과 함께 필수
- [[Cloud Computing]]: Auto Scaling의 핵심 기능
- [[Monitoring]]: Scaling 결정의 기준

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
