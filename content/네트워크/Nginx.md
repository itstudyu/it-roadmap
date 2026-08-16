# Nginx

## 📝 정의

Nginx(엔진엑스)는 **고성능 웹 서버이자 리버스 프록시 서버**로, 정적 파일 제공, 로드 밸런싱, SSL 종료 등에 사용됩니다.

### 핵심 개념

- **무엇인가?**: 경량 고성능 웹 서버
- **왜 필요한가?**: Apache는 동시 연결 처리가 약함
- **어떻게 작동하나?**: 이벤트 기반 비동기 처리

### Nginx가 해결하는 문제

**문제 상황**:
```
😱 시나리오: Apache 사용
동시 접속 1만 명
→ 각 연결마다 프로세스/스레드 생성
→ 메모리 부족
→ 서버 다운! 😱
```

**Nginx의 해결**:
```
✅ 이벤트 기반:
동시 접속 1만 명
→ 소수의 Worker로 처리
→ 메모리 효율적
→ 안정적! ✅
```

**비유**:
- **Apache** = 고객마다 전담 직원 배치
- **Nginx** = 효율적인 직원 몇 명이 모두 처리

## 💡 기본 설정

### nginx.conf
```nginx
# Worker 프로세스 수 (CPU 코어 수)
worker_processes auto;

events {
    # Worker당 최대 연결 수
    worker_connections 1024;
}

http {
    # MIME 타입
    include mime.types;
    default_type application/octet-stream;
    
    # 로깅
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # 성능 최적화
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    
    # 가상 호스트
    include /etc/nginx/sites-enabled/*;
}
```

## 💡 정적 파일 서빙

```nginx
server {
    listen 80;
    server_name example.com;
    
    # 루트 디렉토리
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # 캐싱
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 💡 리버스 프록시

```nginx
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        # Node.js 앱으로 프록시
        proxy_pass http://localhost:3000;
        
        # 헤더 전달
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 타임아웃
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## 💡 로드 밸런싱

```nginx
# Upstream 서버 정의
upstream backend {
    # Round Robin (기본)
    server 192.168.1.10:8000;
    server 192.168.1.11:8000;
    server 192.168.1.12:8000;
    
    # 가중치
    # server 192.168.1.10:8000 weight=3;
    # server 192.168.1.11:8000 weight=1;
    
    # 백업 서버
    # server 192.168.1.99:8000 backup;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://backend;
    }
}
```

### 밸런싱 방식
```nginx
upstream backend {
    # Least Connections (연결 수 적은 서버)
    least_conn;
    server 192.168.1.10:8000;
    server 192.168.1.11:8000;
}

upstream backend {
    # IP Hash (같은 IP → 같은 서버)
    ip_hash;
    server 192.168.1.10:8000;
    server 192.168.1.11:8000;
}
```

## 💡 HTTPS 설정

```nginx
server {
    listen 80;
    server_name example.com;
    
    # HTTP → HTTPS 리다이렉션
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;
    
    # SSL 인증서
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # SSL 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # SSL 캐싱
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

## 💡 URL 리라이트

```nginx
server {
    listen 80;
    server_name example.com;
    
    # /old → /new 리다이렉트
    rewrite ^/old$ /new permanent;
    
    # 정규식
    # /user/123 → /profile?id=123
    rewrite ^/user/(\d+)$ /profile?id=$1 last;
    
    # www 제거
    if ($host ~* ^www\.(.+)$) {
        return 301 $scheme://$1$request_uri;
    }
}
```

## 💡 Rate Limiting

```nginx
# Zone 정의 (10MB = 약 16만 IP)
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    location /api/ {
        # IP당 초당 10개 요청
        limit_req zone=mylimit burst=20;
        
        proxy_pass http://backend;
    }
}
```

## 💡 접근 제어

### IP 화이트리스트
```nginx
location /admin/ {
    # 특정 IP만 허용
    allow 192.168.1.0/24;
    allow 203.0.113.0/24;
    deny all;
    
    proxy_pass http://backend;
}
```

### 인증
```nginx
location /private/ {
    # Basic Auth
    auth_basic "Restricted Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    proxy_pass http://backend;
}
```

## 💡 캐싱

```nginx
# 캐시 경로 설정
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g;

server {
    location / {
        proxy_cache my_cache;
        
        # 200 응답만 1시간 캐싱
        proxy_cache_valid 200 1h;
        proxy_cache_valid 404 1m;
        
        # 캐시 키
        proxy_cache_key "$scheme$request_method$host$request_uri";
        
        # 캐시 헤더 추가
        add_header X-Cache-Status $upstream_cache_status;
        
        proxy_pass http://backend;
    }
}
```

## 💡 압축

```nginx
http {
    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml application/javascript application/json;
    
    # 압축 레벨 (1-9, 높을수록 느림)
    gzip_comp_level 6;
}
```

## 💡 WebSocket

```nginx
location /ws/ {
    proxy_pass http://backend;
    
    # WebSocket 헤더
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

## 💡 SPA (React, Vue)

```nginx
server {
    listen 80;
    server_name app.example.com;
    
    root /var/www/app/build;
    index index.html;
    
    location / {
        # HTML5 History Mode
        try_files $uri $uri/ /index.html;
    }
    
    # API 프록시
    location /api/ {
        proxy_pass http://backend;
    }
}
```

## 💡 성능 모니터링

### Stub Status
```nginx
location /nginx_status {
    stub_status on;
    allow 127.0.0.1;
    deny all;
}

# 출력:
# Active connections: 123
# server accepts handled requests
#  45678 45678 123456
```

### 로그 분석
```bash
# 접속 로그
tail -f /var/log/nginx/access.log

# 에러 로그
tail -f /var/log/nginx/error.log

# 실시간 통계
tail -f /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn
```

## 💡 주요 명령어

```bash
# 설정 테스트
nginx -t

# 재시작 (설정 적용)
sudo systemctl restart nginx

# Reload (무중단 설정 적용)
sudo systemctl reload nginx

# 상태 확인
sudo systemctl status nginx

# 로그 보기
sudo tail -f /var/log/nginx/access.log
```

## 🎯 Nginx vs Apache

| 항목 | Nginx | Apache |
|------|-------|--------|
| **아키텍처** | 이벤트 기반 | 프로세스 기반 |
| **동시 연결** | 수만 개 | 수천 개 |
| **메모리** | 적음 | 많음 |
| **설정** | 간단 | 복잡 |
| **동적 컨텐츠** | 프록시 필요 | 직접 처리 |

## 🔗 관련 용어

- [[Reverse Proxy]]: Nginx 주요 기능
- [[Load Balancing]]: Nginx 활용
- [[HTTPS]]: Nginx SSL 설정

---
*카테고리: 네트워크*
*생성일: 2026-02-14*
