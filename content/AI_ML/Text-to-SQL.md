# Text-to-SQL

## 📝 정의

Text-to-SQL은 **자연어 질문을 SQL 쿼리로 자동 변환**하는 기술입니다.

### 핵심 개념

- **무엇인가?**: 자연어 → SQL 자동 변환
- **왜 필요한가?**: 비개발자도 DB 조회 가능
- **기술**: LLM + 스키마 정보

## 💡 변환 예시

```
자연어: "사원 A의 급여 내역 보여줘"
   ↓ LLM
SQL: 
SELECT * FROM salary
WHERE employee_name = '사원 A'
ORDER BY date DESC;
```

## 🚨 보안 주의

```python
# 위험한 쿼리 차단!
if any(word in sql.upper() for word in ["DELETE", "DROP", "UPDATE"]):
    raise SecurityError("읽기 전용만 허용")

# QueryPie 같은 보안 게이트 필수
```

## 📝 정리

**Text-to-SQL = 말로 DB 조회**
- 자연어로 질문
- LLM이 SQL 생성
- 보안 검증 필수

**P3의 DB MCP Agent가 이 기술 사용**

---
*카테고리: AI_ML*
*생성일: 2026-02-15*
