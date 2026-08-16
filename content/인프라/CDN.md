# CDN (Content Delivery Network)

## 📝 정의

CDN은 **콘텐츠를 전 세계 여러 서버에 분산 저장하여 빠르게 제공하는 네트워크**입니다.

## 💡 작동 원리

```
원본 서버: 서울
CDN 서버: 서울, 도쿄, LA, 런던

미국 사용자 → LA CDN → 빠름!
한국 사용자 → 서울 CDN → 빠름!
```

## 🎯 주요 CDN

```python
cdn_providers = {
    "Cloudflare": "무료 플랜, DDoS 방어",
    "AWS CloudFront": "AWS 통합",
    "Google Cloud CDN": "Google 인프라",
    "Akamai": "엔터프라이즈급"
}
```

## 💻 Cloudflare 설정

```bash
# 1. 도메인 추가
# 2. DNS 네임서버 변경
# 3. 자동 CDN 활성화

# 무료 혜택:
# - 무제한 트래픽
# - HTTPS 자동
# - DDoS 방어
# - 캐시 최적화
```

## 📝 정리

```
CDN = 글로벌 캐시
→ 빠른 로딩
→ 대역폭 절약
→ DDoS 방어
```

---
*카테고리: 인프라*
