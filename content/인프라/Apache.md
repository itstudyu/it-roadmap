# Apache (아파치 웹 서버)

## 📝 정의

Apache는 **가장 널리 사용되는 오픈소스 웹 서버**입니다. HTTP 요청을 처리하여 웹 페이지를 제공합니다.

## 💡 기본 사용

```bash
# 설치 (Ubuntu)
sudo apt install apache2

# 시작/중지/재시작
sudo systemctl start apache2
sudo systemctl stop apache2
sudo systemctl restart apache2

# 상태 확인
sudo systemctl status apache2
```

## 🎯 설정 파일

```apache
# /etc/apache2/sites-available/example.conf

<VirtualHost *:80>
    ServerName example.com
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

## 📝 정리

```
Apache = 웹 서버
→ PHP와 잘 어울림
→ .htaccess 지원
→ Nginx보다 느림
```

---
*카테고리: 인프라*
