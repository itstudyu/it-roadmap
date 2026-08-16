# MVP (Minimum Viable Product)

## 📝 정의
MVP는 **최소한의 기능으로 시장에 출시하는 제품**입니다. 핵심 가치만 구현하여 빠르게 검증합니다.

### 핵심 개념
- 최소 기능만 구현
- 빠른 출시
- 사용자 피드백 수집
- 반복 개선

### MVP가 해결하는 문제

**문제 상황**:
```
😱 완벽한 제품 개발
6개월 개발 → 출시 → 아무도 안 씀
→ 시간, 비용 낭비 😱

😱 모든 기능 추가
100개 기능 개발
→ 실제 사용: 10개 기능만
→ 90% 낭비 😱
```

**MVP의 해결**:
```
✅ 핵심 기능만 1개월 개발
✅ 출시 → 사용자 반응 확인
✅ 필요한 기능 추가
✅ 불필요한 기능 제거
→ 효율적! ✅
```

## 💡 MVP 예시

**Dropbox MVP**:
```
처음: 파일 동기화 데모 영상만
→ 실제 제품 없음
→ 하지만 75,000명 가입!
→ 수요 검증 완료

그 후: 실제 개발 시작
```

**Airbnb MVP**:
```
처음: 자기 아파트 3개 방만 대여
→ 웹사이트도 단순
→ 하지만 예약 성공!
→ 비즈니스 모델 검증

그 후: 전 세계로 확장
```

## 🎯 MVP 개발 단계


**1단계: 핵심 문제 파악**
```
문제: 사진 공유가 어려움
핵심: 간단한 업로드 + 링크 공유
```

**2단계: 최소 기능 정의**
```
필수:
✅ 사진 업로드
✅ 링크 생성
✅ 다운로드

불필요 (나중에):
❌ 사진 편집
❌ 앨범 정리
❌ 댓글 기능
```

**3단계: 빠른 개발**
```python
# MVP: 간단한 파일 업로드
from flask import Flask, request, send_file
import uuid

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    file_id = str(uuid.uuid4())
    file.save(f'uploads/{file_id}')
    return {'link': f'/download/{file_id}'}

@app.route('/download/<file_id>')
def download(file_id):
    return send_file(f'uploads/{file_id}')
```

## 📊 MVP vs 완제품

| 특성 | MVP | 완제품 |
|------|-----|--------|
| 개발 기간 | 1-3개월 | 6-12개월 |
| 기능 수 | 3-5개 | 50+ 개 |
| 목적 | 검증 | 완성 |
| 변경 | 쉬움 | 어려움 |

## 🔗 관련 용어
- [[Product Roadmap]]: MVP 이후 계획
- [[Agile]]: MVP 개발 방법론
- [[User Story]]: 기능 정의

---
*카테고리: 제품관리*
