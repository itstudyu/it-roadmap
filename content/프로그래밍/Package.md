# Package / Module (패키지 / 모듈)

## 📝 정의
Package와 Module은 **코드를 구조화하고 재사용하기 위한 단위**입니다.

### 핵심 개념
- **Module**: 하나의 파일 (.py, .js)
- **Package**: 모듈들의 묶음 (폴더)

## 💡 Python 예시

```python
# 모듈 사용 (math.py)
import math
print(math.sqrt(16))  # 4.0

# 패키지 사용
from mypackage import utils
utils.hello()

# pip로 설치
pip install requests
import requests
```

**디렉토리 구조**:
```
myproject/
├── main.py
└── mypackage/
    ├── __init__.py
    ├── utils.py
    └── helpers.py
```

## 🎯 JavaScript/Node.js

```javascript
// 모듈 내보내기 (utils.js)
module.exports = {
    add: (a, b) => a + b
};

// 모듈 가져오기
const utils = require('./utils');
console.log(utils.add(2, 3));

// npm으로 설치
npm install express
const express = require('express');
```

## 🔗 관련 용어
- [[Function]]: 모듈의 구성 요소
- [[Class]]: 모듈의 구성 요소

---
*카테고리: 프로그래밍*
