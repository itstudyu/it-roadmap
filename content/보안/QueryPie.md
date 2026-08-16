# QueryPie

## 📝 정의

QueryPie는 **데이터베이스 접근 제어 및 보안 관리 플랫폼**입니다. 누가 언제 어떤 데이터베이스에 접근했는지 추적하고, 권한을 세밀하게 관리하며, SQL 쿼리를 실시간으로 모니터링합니다.

### 핵심 개념

- **무엇인가?**: 데이터베이스 접근을 중앙에서 관리하는 보안 플랫폼
- **왜 필요한가?**: 개발자마다 DB 접속 정보를 주면 보안 사고 위험, 추적 불가
- **어떻게 작동하나?**: QueryPie 통해서만 DB 접근 → 모든 쿼리 기록 → 권한 자동 관리

### QueryPie가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: DB 접속 정보 노출
개발자마다 DB 접속 정보 공유
→ 퇴사자가 여전히 접속 가능
→ 누가 무슨 쿼리 실행했는지 모름
→ 보안 사고 발생! 😱

😱 시나리오 2: 권한 관리 복잡
100명 개발자 × 10개 DB = 1000개 권한
→ 수동으로 권한 부여/회수
→ 실수로 프로덕션 DB 권한 부여
→ 데이터 삭제 사고! 😱

😱 시나리오 3: 추적 불가능
"누가 고객 테이블 삭제했어?"
→ 로그 없음
→ 범인 찾을 수 없음
→ 책임 소재 불분명! 😱

😱 시나리오 4: 개인정보 무단 조회
개발자가 고객 주민번호 조회
→ 아무도 모름
→ PII 유출 위험
→ 법적 문제 발생! 😱
```

**QueryPie의 해결**:
```
✅ 시나리오 1 (중앙 관리):
QueryPie를 통해서만 DB 접근
→ 퇴사 시 즉시 접근 차단
→ 모든 쿼리 자동 기록
→ 안전! ✅

✅ 시나리오 2 (자동 권한 관리):
역할별로 권한 그룹 설정
→ 사람 추가 시 자동 권한 부여
→ 프로덕션은 승인 필요
→ 실수 방지! ✅

✅ 시나리오 3 (완벽한 추적):
Audit Log에 모든 쿼리 기록
→ "user_kim이 14:30에 DELETE 실행"
→ 범인 특정 가능
→ 책임 명확! ✅

✅ 시나리오 4 (PII 보호):
PII 컬럼 자동 마스킹
→ 조회 시 "******" 표시
→ 승인받은 경우만 원본 조회
→ 규정 준수! ✅
```

**비유**:
- **직접 DB 접속** = 사무실 마스터키 복사해서 모두에게 배포 (위험)
- **QueryPie** = 출입증 시스템 (누가 언제 들어갔는지 기록)

## 💡 주요 기능

### 1. 중앙 집중식 접근 관리

**Before (QueryPie 없이)**:
```
개발자 A: DB 접속 정보 슬랙으로 공유받음
개발자 B: DB 접속 정보 이메일로 공유받음
→ 여러 곳에 분산
→ 변경 시 모두에게 재공유 필요
→ 퇴사자 접근 차단 어려움
```

**After (QueryPie 사용)**:
```
모든 개발자 → QueryPie 로그인
→ 승인된 DB만 보임
→ 퇴사 시 QueryPie 계정만 삭제
→ 모든 접근 자동 차단
```

### 2. 역할 기반 권한 관리 (RBAC)

```yaml
# 역할별 권한 설정
roles:
  - name: "주니어 개발자"
    databases:
      - dev_db: read_only
      - staging_db: read_only

  - name: "시니어 개발자"
    databases:
      - dev_db: read_write
      - staging_db: read_write
      - prod_db: read_only  # 승인 필요

  - name: "DBA"
    databases:
      - dev_db: admin
      - staging_db: admin
      - prod_db: admin
```

**권한 적용**:
```
1. 신입 개발자 입사
   → "주니어 개발자" 역할 할당
   → 자동으로 dev_db, staging_db 읽기 권한

2. 승진
   → "시니어 개발자" 역할로 변경
   → 자동으로 권한 업그레이드

3. 퇴사
   → 계정 비활성화
   → 모든 권한 즉시 회수
```

### 3. 쿼리 실행 및 모니터링

```sql
-- 개발자가 QueryPie에서 실행
SELECT * FROM users WHERE email = 'kim@example.com';
```

**QueryPie가 하는 일**:
1. 권한 확인: 이 사용자가 users 테이블에 접근 가능한가?
2. PII 체크: users 테이블에 주민번호 컬럼 있나?
3. 쿼리 실행
4. 결과 마스킹: 주민번호 → `******-*******`
5. Audit Log 기록: `user_kim executed SELECT at 2024-02-14 14:30:15`

### 4. 승인 워크플로우

프로덕션 DB 접근 시:

```도해
흐름: QueryPie, 무슨 순서로 오가나
개발자 :: 프로덕션 DB 접근 요청
QueryPie :: 정책 확인 (승인 필요)
QueryPie :: 승인 요청 알림
관리자 :: 검토 후 승인/거부
QueryPie :: 접근 허용 (1시간 유효)
개발자 :: 쿼리 실행
QueryPie :: 접근 거부
```

### 5. PII 자동 마스킹

```sql
-- QueryPie 설정
pii_columns:
  - table: users
    columns:
      - ssn: mask_full        # 123456-1234567 → ******-*******
      - phone: mask_partial   # 010-1234-5678 → 010-****-****
      - email: mask_domain    # kim@example.com → k**@example.com
```

**실행 결과**:
```
원본 데이터:
| name   | ssn            | phone         |
|--------|----------------|---------------|
| 김철수  | 123456-1234567 | 010-1234-5678 |

QueryPie 조회 결과:
| name   | ssn            | phone         |
|--------|----------------|---------------|
| 김철수  | ******-******* | 010-****-**** |
```

## 🎯 주요 사용 사례

### 1. 개발 환경별 권한 분리

```
개발 DB (dev):
  - 모든 개발자 읽기/쓰기 가능
  - 데이터 삭제 가능

스테이징 DB (staging):
  - 시니어 개발자 이상 쓰기 가능
  - 주니어는 읽기만

프로덕션 DB (prod):
  - 읽기: 승인 필요 (1시간 유효)
  - 쓰기: DBA만 가능
```

### 2. 규정 준수 (Compliance)

```
GDPR, 개인정보보호법 준수:
  ✅ 모든 PII 접근 기록
  ✅ 누가 언제 조회했는지 추적
  ✅ 자동 마스킹
  ✅ 접근 권한 자동 만료
```

### 3. 보안 사고 대응

```
사고 발생 시:
1. Audit Log 조회
   → "2024-02-14 14:30:15: user_kim executed DELETE FROM users"

2. 범인 특정
   → user_kim이 삭제

3. 권한 즉시 차단
   → QueryPie에서 계정 비활성화

4. 데이터 복구
   → 백업에서 복원
```

## 🔒 보안 Best Practices

### 1. 최소 권한 원칙

```python
# 필요한 권한만 부여
roles = {
    "analyst": {
        "databases": ["analytics_db"],
        "permissions": ["SELECT"],  # 읽기만
        "tables": ["sales", "revenue"]  # 특정 테이블만
    }
}
```

### 2. 시간 제한 권한

```python
# 프로덕션 접근은 1시간만 유효
approval_settings = {
    "production_db": {
        "requires_approval": True,
        "duration": timedelta(hours=1),
        "auto_revoke": True
    }
}
```

### 3. 정기 권한 리뷰

```python
# 90일마다 권한 재검토
def review_permissions():
    """90일 이상 사용 안 한 권한 자동 회수"""
    for user in users:
        if user.last_access > 90_days_ago:
            revoke_permission(user)
            notify_manager(user)
```

## 📊 QueryPie vs 직접 DB 접속

| 항목 | 직접 DB 접속 | QueryPie |
|------|-------------|----------|
| **접근 관리** | 분산 (여러 곳) | 중앙 집중 |
| **권한 부여** | 수동 | 자동 (역할 기반) |
| **Audit Log** | 없음 | 모든 쿼리 기록 |
| **PII 보호** | 수동 | 자동 마스킹 |
| **퇴사자 관리** | 수동 차단 | 즉시 차단 |
| **승인 워크플로우** | 없음 | 자동화 |
| **규정 준수** | 어려움 | 자동 지원 |

## 🔗 관련 용어

- [[Audit Log]]: QueryPie가 생성하는 접근 기록
- [[PII]]: QueryPie가 자동으로 마스킹
- [[RBAC]]: 역할 기반 접근 제어
- [[Compliance]]: 규정 준수 지원

## 📚 참고자료

- [QueryPie 공식 사이트](https://www.querypie.com/)
- [데이터베이스 보안 Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html)

---
*카테고리: 보안*
*생성일: 2026-02-14*
