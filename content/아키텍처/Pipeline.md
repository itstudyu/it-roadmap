# Pipeline

## 📝 정의

Pipeline(파이프라인)은 **데이터나 작업이 여러 단계를 거쳐 순차적으로 처리되는 구조**입니다. 한 단계의 출력이 다음 단계의 입력이 됩니다.

### 핵심 개념

- **무엇인가?**: 작업을 여러 단계로 나눠 순차 처리
- **왜 필요한가?**: 복잡한 작업을 관리 가능한 단위로 분할
- **어떻게 작동하나?**: 단계1 → 단계2 → 단계3 → 완료

### Pipeline이 해결하는 문제

**문제 상황**:
```
😱 시나리오: 데이터 처리 과정이 복잡
원본 데이터 → 정제 → 변환 → 집계 → 저장
→ 하나의 스크립트에 모두 작성
→ 실패 시 전체 재실행
→ 유지보수 어려움! 😱
```

**Pipeline의 해결**:
```
✅ 단계별 분리:
Step 1: 데이터 수집 ✅
Step 2: 데이터 정제 ✅
Step 3: 데이터 변환 ✅
Step 4: 데이터 저장 ✅
→ 각 단계 독립적 관리
→ 실패 시 해당 단계만 재실행! ✅
```

**비유**:
- **Pipeline 없음** = 요리를 한 번에 (재료 손질부터 완성까지)
- **Pipeline** = 공장 컨베이어 벨트 (각 단계별로 작업)

## 💡 Pipeline 예시

### 1. CI/CD Pipeline

```yaml
# GitHub Actions
pipeline:
  - name: Build
    run: npm run build

  - name: Test
    run: npm test

  - name: Deploy
    run: deploy.sh
```

### 2. Data Pipeline

```python
def data_pipeline(raw_data):
    # Step 1: 수집
    collected = collect_data(raw_data)

    # Step 2: 정제
    cleaned = clean_data(collected)

    # Step 3: 변환
    transformed = transform_data(cleaned)

    # Step 4: 저장
    save_data(transformed)
```

## 🔗 관련 용어

- [[ETL]]: 데이터 파이프라인의 한 형태
- [[CI/CD]]: 소프트웨어 파이프라인
- [[Workflow]]: 파이프라인의 상위 개념

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
