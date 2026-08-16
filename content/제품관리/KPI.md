# KPI (Key Performance Indicator)

## 📝 정의
KPI는 **비즈니스 목표 달성을 측정하는 핵심 성과 지표**입니다.

### 주요 KPI

**제품 KPI**:
```
- DAU/MAU: 일일/월간 활성 사용자
- Retention Rate: 재방문율
- Churn Rate: 이탈률
- ARPU: 사용자당 평균 수익
```

**개발 KPI**:
```
- Deployment Frequency: 배포 빈도
- Lead Time: 개발 완료 시간
- MTTR: 평균 복구 시간
- Change Failure Rate: 배포 실패율
```

## 💡 KPI 예시

**서비스 KPI**:
```python
# DAU/MAU Ratio (Daily/Monthly Active Users)
dau = 50000  # 하루 활성 사용자
mau = 200000  # 월 활성 사용자

ratio = (dau / mau) * 100
print(f"DAU/MAU: {ratio}%")  # 25%
# → 한 달에 평균 7.5일 사용
```

**이탈률**:
```python
# Churn Rate
month_start = 1000  # 월초 사용자
month_end = 900     # 월말 사용자
churned = 100       # 이탈 사용자

churn_rate = (churned / month_start) * 100
print(f"이탈률: {churn_rate}%")  # 10%
```

## 🎯 좋은 KPI 조건

**SMART**:
```
S - Specific (구체적)
M - Measurable (측정 가능)
A - Achievable (달성 가능)
R - Relevant (관련성)
T - Time-bound (기한)
```

## 🔗 관련 용어
- [[OKR]]: 목표 프레임워크
- [[Analytics]]: KPI 측정 도구

---
*카테고리: 제품관리*
