# SSR (Server Side Rendering)

## 📝 정의
SSR은 **서버에서 페이지를 렌더링하는 방식**입니다. 완성된 HTML을 브라우저에 전송합니다.

### 작동 방식
1. 서버에서 HTML 생성
2. 완성된 HTML 전송
3. 브라우저에 즉시 표시
4. JavaScript로 인터랙션 추가

## 💡 예시

```python
# Django SSR
def user_profile(request, user_id):
    user = User.objects.get(id=user_id)
    return render(request, 'profile.html', {'user': user})
```

```html
<!-- 서버에서 생성된 완성된 HTML -->
<!DOCTYPE html>
<html>
<body>
    <h1>Alice님의 프로필</h1>
    <p>나이: 25세</p>
</body>
</html>
```

## 🎯 장단점

**장점**:
- 빠른 초기 로딩
- SEO 유리

**단점**:
- 서버 부담 큼
- 페이지 전환 시 전체 새로고침

## 🔗 관련 용어
- [[CSR]]: 클라이언트 렌더링
- [[Backend]]: SSR 담당

---
*카테고리: 웹개발*
