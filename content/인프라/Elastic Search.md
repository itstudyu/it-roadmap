# Elastic Search

## 📝 정의

Elastic Search는 **검색 전문 엔진**입니다. 로그, 문서, 메뉴 검색에 최적화되어 있습니다.

### 핵심 개념

- **무엇인가?**: 분산 검색 엔진
- **왜 필요한가?**: 빠른 전문 검색
- **특징**: Full-text search, 실시간

## 💡 검색 예시

```json
// 인덱스 생성
PUT /p3_menu
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "keywords": { "type": "text" }
    }
  }
}

// 검색
GET /p3_menu/_search
{
  "query": {
    "match": {
      "keywords": "주소 변경"
    }
  }
}
```

## 🔍 vs SQL DB

```
SQL DB:
- 정확한 매칭
- LIKE 검색 느림

Elastic Search:
- 전문 검색 (Full-text)
- 오타 허용
- 빠름 (인덱스 기반)
```

## 📝 정리

**Elastic Search = 검색 전문가**
- 로그 분석
- 문서 검색
- 메뉴 검색

**P3: Navigation Agent를 ES로 대체 제안**

---
*카테고리: 인프라*
*생성일: 2026-02-15*
