# Audit Log (감사 로그)

## 📝 정의

Audit Log(감사 로그)는 시스템에서 **누가, 언제, 무엇을, 어떻게** 했는지를 기록한 로그입니다. 나중에 문제가 생겼을 때 추적하고, 보안 사고를 분석하고, 규정 준수를 증명하는 데 사용됩니다.

### 핵심 개념

- **무엇인가?**: 모든 중요한 행동을 시간순으로 기록
- **왜 필요한가?**: 책임 추적, 보안 사고 분석, 규정 준수 증명
- **어떻게 작동하나?**: 행동 발생 → 자동 기록 → 안전하게 저장 → 필요 시 분석

### Audit Log가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 누가 삭제했는지 모름
관리자: "중요한 데이터가 사라졌어요!"
시스템: "..."
팀: "누가 삭제한 거야?"
→ 범인을 찾을 수 없음! 😱

😱 시나리오 2: PII 접근 추적 불가
감사관: "지난달 누가 주민번호 조회했나요?"
시스템: "기록이 없습니다"
→ 규정 위반! 벌금! 😱

😱 시나리오 3: 보안 사고 원인 분석 불가
해커: 시스템 침입
보안팀: "언제, 어떻게 침입했지?"
시스템: "로그가 없어요"
→ 재발 방지 불가능! 😱

😱 시나리오 4: 책임 회피
직원A: "내가 안 했어요!"
관리자: "증거가 없네..."
→ 책임 소재 불분명! 😱
```

**Audit Log의 해결**:
```
✅ 시나리오 1 (기록 조회):
Audit Log:
"2024-02-14 14:30:15 | user_kim | DELETE | employee:EMP123"
→ 김 직원이 삭제했음을 확인 ✅

✅ 시나리오 2 (PII 접근 추적):
Audit Log:
"2024-01-15 | hr_manager | ACCESS_PII:ssn | EMP456"
"2024-01-20 | admin | ACCESS_PII:ssn | EMP789"
→ 모든 접근 기록 제출 ✅

✅ 시나리오 3 (침입 경로 분석):
Audit Log:
"14:25:10 | unknown_ip | FAILED_LOGIN | admin (시도 50회)"
"14:30:05 | unknown_ip | SUCCESS_LOGIN | admin"
→ 브루트 포스 공격 확인! ✅

✅ 시나리오 4 (증거 확보):
Audit Log:
"user_lee | 2024-02-14 10:15:30 | UPDATE | payroll:salary"
IP: 192.168.1.100
→ 명확한 증거 ✅
```

**비유**:
- **Audit Log 없음** = CCTV 없는 건물 (사고 시 확인 불가)
- **Audit Log 있음** = CCTV 있는 건물 (모든 행동 기록됨)

## 📊 Audit Log 구성 요소


### 6W 원칙

| 요소 | 설명 | 예시 |
|------|------|------|
| **Who** | 누가 | user_id: "admin001", IP: 192.168.1.100 |
| **When** | 언제 | 2024-02-14 14:30:15 |
| **What** | 무엇을 | resource: "payroll:EMP123" |
| **Where** | 어디서 | service: "API Server", location: "Seoul" |
| **How** | 어떻게 | action: "DELETE" |
| **Result** | 결과 | status: "success" / "failed" |

## 💡 실제 구현

### 1. 기본 Audit Logger

```python
import json
from datetime import datetime
from typing import Dict, Optional

class AuditLogger:
    """감사 로그 기록기"""

    def __init__(self, log_file: str = "audit.log"):
        self.log_file = log_file

    def log(
        self,
        user_id: str,
        action: str,
        resource: str,
        details: Optional[Dict] = None,
        result: str = "success",
        ip_address: Optional[str] = None
    ):
        """감사 로그 기록"""

        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "action": action,
            "resource": resource,
            "result": result,
            "ip_address": ip_address,
            "details": details or {}
        }

        # 파일에 기록
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')

        # 콘솔에도 출력 (개발 환경)
        print(f"[AUDIT] {user_id} {action} {resource} - {result}")

    def log_pii_access(
        self,
        user_id: str,
        pii_type: str,
        employee_id: str,
        result: str = "success"
    ):
        """PII 접근 로그 (특수 케이스)"""
        self.log(
            user_id=user_id,
            action="access_pii",
            resource=f"employee:{employee_id}",
            details={
                "pii_type": pii_type,
                "employee_id": employee_id
            },
            result=result
        )


# 사용 예시
logger = AuditLogger()

# 급여 조회 로그
logger.log(
    user_id="admin001",
    action="view",
    resource="payroll:202401",
    ip_address="192.168.1.100",
    result="success"
)

# PII 접근 로그
logger.log_pii_access(
    user_id="hr_manager",
    pii_type="ssn",
    employee_id="EMP123",
    result="success"
)

# 실패한 접근 시도 로그
logger.log(
    user_id="user456",
    action="delete",
    resource="employee:EMP123",
    result="denied",
    details={"reason": "insufficient_permissions"}
)
```

**로그 파일 형식**:
```json
{"timestamp":"2024-02-14T14:30:15","user_id":"admin001","action":"view","resource":"payroll:202401","result":"success","ip_address":"192.168.1.100","details":{}}
{"timestamp":"2024-02-14T14:31:20","user_id":"hr_manager","action":"access_pii","resource":"employee:EMP123","result":"success","ip_address":null,"details":{"pii_type":"ssn","employee_id":"EMP123"}}
{"timestamp":"2024-02-14T14:32:05","user_id":"user456","action":"delete","resource":"employee:EMP123","result":"denied","ip_address":null,"details":{"reason":"insufficient_permissions"}}
```

### 2. 데코레이터로 자동 로깅

```python
from functools import wraps

def audit_log(action: str, resource_type: str):
    """Audit Log 데코레이터 - 함수 실행 시 자동 로깅"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 사용자 정보 추출 (첫 번째 인자가 user라고 가정)
            user = args[0] if args else None
            user_id = user.get('id') if user else 'unknown'

            # 리소스 ID 추출
            resource_id = kwargs.get('resource_id', 'unknown')
            resource = f"{resource_type}:{resource_id}"

            try:
                # 함수 실행
                result = func(*args, **kwargs)

                # 성공 로그
                logger.log(
                    user_id=user_id,
                    action=action,
                    resource=resource,
                    result="success"
                )

                return result

            except Exception as e:
                # 실패 로그
                logger.log(
                    user_id=user_id,
                    action=action,
                    resource=resource,
                    result="failed",
                    details={"error": str(e)}
                )
                raise

        return wrapper
    return decorator


# 사용 예시
@audit_log(action="view", resource_type="payroll")
def view_payroll(user: dict, resource_id: str):
    """급여 정보 조회"""
    return {"employee_id": resource_id, "salary": 5000000}

@audit_log(action="update", resource_type="employee")
def update_employee(user: dict, resource_id: str, data: dict):
    """직원 정보 수정"""
    return {"success": True}


# 호출
user = {"id": "admin001", "role": "admin"}
view_payroll(user, resource_id="EMP123")
# [AUDIT] admin001 view payroll:EMP123 - success

update_employee(user, resource_id="EMP123", data={"phone": "010-1234-5678"})
# [AUDIT] admin001 update employee:EMP123 - success
```

### 3. 데이터베이스에 저장

```python
from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class AuditLogEntry(Base):
    """Audit Log 테이블"""
    __tablename__ = 'audit_logs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.now, index=True)
    user_id = Column(String(100), index=True)
    action = Column(String(50), index=True)
    resource = Column(String(200), index=True)
    result = Column(String(20), index=True)
    ip_address = Column(String(50))
    details = Column(JSON)

class DBAuditLogger:
    """데이터베이스 기반 Audit Logger"""

    def __init__(self, db_url: str):
        self.engine = create_engine(db_url)
        Base.metadata.create_all(self.engine)
        Session = sessionmaker(bind=self.engine)
        self.session = Session()

    def log(self, user_id: str, action: str, resource: str, **kwargs):
        """감사 로그 DB에 기록"""
        entry = AuditLogEntry(
            user_id=user_id,
            action=action,
            resource=resource,
            result=kwargs.get('result', 'success'),
            ip_address=kwargs.get('ip_address'),
            details=kwargs.get('details', {})
        )

        self.session.add(entry)
        self.session.commit()

    def query_logs(
        self,
        user_id: Optional[str] = None,
        action: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ):
        """로그 조회"""
        query = self.session.query(AuditLogEntry)

        if user_id:
            query = query.filter(AuditLogEntry.user_id == user_id)

        if action:
            query = query.filter(AuditLogEntry.action == action)

        if start_date:
            query = query.filter(AuditLogEntry.timestamp >= start_date)

        if end_date:
            query = query.filter(AuditLogEntry.timestamp <= end_date)

        return query.order_by(AuditLogEntry.timestamp.desc()).all()


# 사용 예시
db_logger = DBAuditLogger("sqlite:///audit.db")

db_logger.log(
    user_id="admin001",
    action="view",
    resource="payroll:EMP123",
    result="success"
)

# 로그 조회
logs = db_logger.query_logs(user_id="admin001", action="view")
for log in logs:
    print(f"{log.timestamp}: {log.user_id} {log.action} {log.resource}")
```

### 4. 로그 분석

```python
import pandas as pd
from collections import Counter

class AuditAnalyzer:
    """Audit Log 분석기"""

    def __init__(self, log_file: str):
        self.logs = self._load_logs(log_file)

    def _load_logs(self, log_file: str) -> list:
        """로그 파일 로드"""
        logs = []
        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                logs.append(json.loads(line.strip()))
        return logs

    def get_user_activity(self, user_id: str):
        """특정 사용자의 활동 내역"""
        return [
            log for log in self.logs
            if log['user_id'] == user_id
        ]

    def get_failed_attempts(self):
        """실패한 시도 목록"""
        return [
            log for log in self.logs
            if log['result'] in ['failed', 'denied']
        ]

    def get_action_summary(self):
        """작업별 통계"""
        actions = [log['action'] for log in self.logs]
        return Counter(actions)

    def detect_suspicious_activity(self):
        """의심스러운 활동 감지"""
        suspicious = []

        # 1. 반복된 실패 시도
        failed_by_user = {}
        for log in self.logs:
            if log['result'] in ['failed', 'denied']:
                user = log['user_id']
                failed_by_user[user] = failed_by_user.get(user, 0) + 1

        # 5회 이상 실패한 사용자
        for user, count in failed_by_user.items():
            if count >= 5:
                suspicious.append({
                    'type': 'repeated_failures',
                    'user_id': user,
                    'count': count
                })

        return suspicious

    def generate_report(self):
        """보고서 생성"""
        df = pd.DataFrame(self.logs)

        print("=== Audit Log 보고서 ===\n")

        print("1. 전체 로그 수:", len(self.logs))
        print("\n2. 작업별 통계:")
        print(df['action'].value_counts())

        print("\n3. 사용자별 활동:")
        print(df['user_id'].value_counts())

        print("\n4. 결과별 통계:")
        print(df['result'].value_counts())

        print("\n5. 실패/거부 로그:")
        failed = df[df['result'].isin(['failed', 'denied'])]
        if not failed.empty:
            print(failed[['timestamp', 'user_id', 'action', 'resource']])

        print("\n6. 의심스러운 활동:")
        suspicious = self.detect_suspicious_activity()
        for activity in suspicious:
            print(f"⚠️ {activity['type']}: {activity['user_id']} ({activity['count']}회)")


# 사용 예시
analyzer = AuditAnalyzer("audit.log")
analyzer.generate_report()
```

## 🎯 Audit Log 모범 사례

| 항목 | 권장 사항 | 이유 |
|------|----------|------|
| **저장 기간** | 최소 1년, 규정에 따라 조정 | 법적 요구사항 충족 |
| **무결성 보호** | 해시, 서명 사용 | 로그 변조 방지 |
| **접근 제한** | 관리자만 접근 가능 | 무단 수정 방지 |
| **백업** | 정기적 백업 (별도 저장소) | 데이터 손실 방지 |
| **암호화** | PII 포함 시 암호화 | 개인정보 보호 |
| **성능** | 비동기 로깅 | 성능 영향 최소화 |

## 📊 로그 해야 할 작업

| 작업 유형 | 예시 | 중요도 |
|---------|------|--------|
| **인증/인가** | 로그인, 로그아웃, 권한 변경 | ⚠️ 매우 높음 |
| **PII 접근** | 주민번호 조회, 개인정보 수정 | ⚠️ 매우 높음 |
| **데이터 변경** | 생성, 수정, 삭제 | ⚠️ 높음 |
| **관리자 작업** | 설정 변경, 사용자 관리 | ⚠️ 높음 |
| **보안 이벤트** | 실패한 로그인, 권한 거부 | ⚠️ 매우 높음 |
| **조회** | 데이터 읽기 | ⚡ 중간 |

## 🔗 관련 용어

- [[PII]]: Audit Log로 접근 추적
- [[Guardrail]]: 위험 행동을 로그에 기록
- [[Token 인증]]: 인증 이벤트 로깅
- [[Escalation]]: Audit Log 분석 후 조치

## 📚 법적 근거

- [개인정보보호법 제30조](https://www.law.go.kr/) - 접근 기록 보존
- [GDPR Article 30](https://gdpr-info.eu/art-30-gdpr/) - 처리 활동 기록
- [NIST SP 800-53](https://csrc.nist.gov/) - Audit and Accountability

---
*카테고리: 보안*
*생성일: 2026-02-14*
