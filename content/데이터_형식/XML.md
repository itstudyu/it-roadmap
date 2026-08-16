# XML (eXtensible Markup Language)

## 📝 정의

XML은 **데이터를 구조적으로 표현하는 마크업 언어**입니다. 태그를 사용하여 데이터를 표현합니다.

### 핵심 개념

- **무엇인가?**: 태그 기반 데이터 형식
- **왜 필요한가?**: 구조화된 문서, 데이터 교환
- **어떻게 작동하나?**: 여는 태그와 닫는 태그

## 💡 XML 형식

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <name>Alice</name>
  <age>25</age>
  <email>alice@example.com</email>
  <hobbies>
    <hobby>독서</hobby>
    <hobby>영화</hobby>
  </hobbies>
  <address>
    <city>Seoul</city>
    <country>Korea</country>
  </address>
</user>
```

## 🎯 사용법

### Python

```python
import xml.etree.ElementTree as ET

# XML 파싱
tree = ET.parse('data.xml')
root = tree.getroot()

# 요소 접근
for child in root:
    print(child.tag, child.text)

# XML 생성
root = ET.Element("user")
name = ET.SubElement(root, "name")
name.text = "Alice"

tree = ET.ElementTree(root)
tree.write("output.xml", encoding="utf-8")
```

## 📊 실전 활용

### RSS Feed

```xml
<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>블로그</title>
    <link>https://blog.example.com</link>
    <item>
      <title>첫 글</title>
      <description>설명</description>
    </item>
  </channel>
</rss>
```

### SOAP API

```xml
<soap:Envelope>
  <soap:Body>
    <GetUser>
      <UserId>123</UserId>
    </GetUser>
  </soap:Body>
</soap:Envelope>
```

## 🚨 주의사항

- 모든 태그는 닫혀야 함
- 대소문자 구분
- 루트 요소 하나만

## 🔗 관련 용어

- [[JSON]]: 더 간단한 대안
- [[HTML]]: 비슷한 마크업

## 📝 정리

**XML의 핵심**:
```
XML = 태그 기반 데이터 형식
→ 구조화된 문서
→ JSON보다 복잡
→ RSS, SOAP 등에 사용
```

---
*카테고리: 데이터_형식*
*생성일: 2026-02-15*
