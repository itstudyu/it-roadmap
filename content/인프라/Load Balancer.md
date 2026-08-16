# Load Balancer (로드 밸런서)

## 📝 정의

Load Balancer는 **트래픽을 여러 서버에 분산시키는 장치 또는 소프트웨어**입니다.

## 💡 작동 원리

```
사용자 요청
    ↓
Load Balancer
    ├→ Server 1 (33%)
    ├→ Server 2 (33%)
    └→ Server 3 (34%)
```

## 🎯 알고리즘

```python
algorithms = {
    "Round Robin": "순서대로 분배",
    "Least Connections": "연결 적은 서버로",
    "IP Hash": "IP 기반 고정",
    "Weighted": "서버 성능 비율로"
}
```

## 💻 Nginx 로드 밸런서

```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

## 📝 정리

```
Load Balancer = 트래픽 분산
→ 부하 분산
→ 고가용성
→ 확장성
```

---
*카테고리: 인프라*
