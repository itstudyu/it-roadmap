# Build (빌드)

## 📝 정의

**Build는 소스 코드를 최종 실행 가능한 프로그램으로 만드는 전체 과정입니다.**

단순히 컴파일만 하는 것이 아니라, **의존성 관리 → 컴파일 → 테스트 → 링킹 → 패키징 → 배포 준비**까지 포함하는 **소프트웨어 제조 공정** 전체를 의미합니다.

## 🎯 핵심 개념

### 1. **빌드 과정 단계**

```
1. 의존성 설치 (npm install, pip install)
2. 소스 코드 전처리 (#define, 환경 변수)
3. 컴파일 (소스 → 오브젝트 파일)
4. 링킹 (오브젝트 파일 + 라이브러리 → 실행 파일)
5. 리소스 번들링 (이미지, CSS, 설정 파일)
6. 테스트 실행 (유닛 테스트, 통합 테스트)
7. 패키징 (ZIP, Docker Image, APK)
8. 아티팩트 생성 (.exe, .jar, .apk, .whl)
```

### 2. **빌드 도구 (Build Tools)**

| 언어/플랫폼 | 빌드 도구 | 설명 |
|---|---|---|
| C/C++ | Make, CMake, Ninja | Makefile 기반 빌드 |
| Java | Maven, Gradle, Ant | JAR/WAR 패키징 |
| JavaScript | Webpack, Vite, Rollup | 번들링 + 트랜스파일 |
| Python | setuptools, Poetry | 패키지 빌드 (.whl, .tar.gz) |
| Go | go build | 단일 바이너리 생성 |
| Rust | Cargo | 컴파일 + 의존성 관리 |
| Android | Gradle | APK/AAB 생성 |
| iOS | Xcode Build System | IPA 생성 |

### 3. **빌드 타입**

| 타입 | 목적 | 특징 |
|---|---|---|
| **Debug Build** | 개발/디버깅 | 최적화 없음, 디버그 심볼 포함, 빠른 빌드 |
| **Release Build** | 프로덕션 배포 | 최적화, 압축, 난독화, 느린 빌드 |
| **Test Build** | 자동화 테스트 | 테스트 커버리지, Mock 포함 |

### 4. **CI/CD 빌드**
- **Continuous Integration**: 코드 커밋 시 자동 빌드
- **Continuous Deployment**: 빌드 성공 시 자동 배포
- 도구: Jenkins, GitHub Actions, GitLab CI, CircleCI

## 🤔 왜 필요한가? (문제와 해결)

### 문제 1: 수동 빌드의 악몽

```bash
# 옛날 방식: 수동으로 모든 파일 컴파일
$ gcc file1.c -c
$ gcc file2.c -c
$ gcc file3.c -c
$ gcc file4.c -c
$ gcc file5.c -c
... (100개 파일)

# 라이브러리 링킹
$ gcc *.o -lpthread -lssl -lcrypto -lz -o program

# 파일 하나 수정 시?
→ 어떤 파일이 영향 받는지 파악
→ 필요한 파일만 재컴파일
→ 다시 링킹
→ 매번 명령어 수십 개 입력 😭
```

**빌드 시스템 해결법:**
```bash
# Makefile 작성 (한 번만)
# make가 자동으로:
# - 의존성 파악
# - 변경된 파일만 재컴파일
# - 링킹까지 자동 처리

$ make
# file2.c 수정됨 → file2.o만 재컴파일
# 나머지는 캐시 사용 → 빠름!
```

### 문제 2: "내 컴퓨터에서는 되는데요?"

```
개발자 A의 PC:
- Node.js 18.0
- npm install 로컬에서만
- 환경변수 .env에 직접 입력
→ 프로그램 정상 작동 ✅

프로덕션 서버:
- Node.js 16.0 (버전 다름)
- node_modules 없음
- 환경변수 설정 안 됨
→ 프로그램 실행 안 됨 ❌

문제:
- 의존성 버전 불일치
- 환경 차이
- 재현 불가능한 빌드
```

**빌드 스크립트 해결법:**
```json
// package.json - 재현 가능한 빌드
{
  "engines": {
    "node": ">=18.0.0"  // Node 버전 명시
  },
  "scripts": {
    "prebuild": "npm ci",  // package-lock.json으로 정확한 버전 설치
    "build": "webpack --mode production",
    "postbuild": "echo 'Build completed successfully'",
    "test": "jest",
    "prepublish": "npm run test && npm run build"
  },
  "dependencies": {
    "react": "18.2.0"  // 정확한 버전 고정
  }
}
```

```bash
# 어디서나 동일한 빌드
$ npm run build

# 또는 Docker로 환경 격리
$ docker build -t myapp:1.0 .
# 환경 변수, 의존성 모두 Docker Image에 포함
```

### 문제 3: 개발 중 느린 피드백

```javascript
// 코드 수정
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// 전체 빌드
$ npm run build
[webpack] Compiling... (3분 소요)
[webpack] Bundle size: 5MB
[webpack] Build completed!

// 브라우저 새로고침
// 버그 발견

// 다시 수정
// 다시 전체 빌드 (3분) 😭
```

**빌드 도구 해결법:**
```bash
# Vite: 빠른 Hot Module Replacement (HMR)
$ npm run dev

# 코드 수정 시:
[vite] page reload (코드 변경 감지)
[vite] hmr update (0.5초만에 반영!)

# 개발 속도 100배 향상!
```

## 📊 구조

```도해
층: Build, 어떻게 나뉘어 있나
빌드 입력 :: 소스 코드 .c, .java, .js · 의존성 package.json pom.xml · 리소스 이미지,…
빌드 과정 :: 의존성 해결 npm install maven resolve · 전처리 환경 변수 코드 생성 · 컴파일 소스…
빌드 출력 :: 실행 파일 .exe, .jar · 번들 파일 bundle.js app.min.css · 배포 패키지 .zi…
```

## 🔄 작동 원리 (빌드 파이프라인)


### 동작 과정 설명

1. **트리거**: Git push 또는 PR 생성 시 자동 시작
2. **환경 준비**: Node.js, Python 등 필요한 도구 설치
3. **의존성 설치**: `npm ci`, `pip install -r requirements.txt`
4. **코드 품질 검사**: ESLint, Prettier, Black
5. **컴파일/번들링**: TypeScript → JavaScript, Sass → CSS
6. **테스트**: 유닛 테스트 → 통합 테스트 → E2E 테스트
7. **패키징**: ZIP, Docker Image, APK 생성
8. **배포**: 프로덕션 서버에 업로드

## 🏠 일상적 비유

빌드는 **자동차 조립 라인**과 같습니다:

| 자동차 공장 | 소프트웨어 빌드 |
|---|---|
| 부품 조달 (엔진, 타이어) | 의존성 설치 (npm install) |
| 부품 조립 (용접, 볼트) | 컴파일 + 링킹 |
| 도색 + 마감 | 최적화 + 압축 |
| 품질 검사 (충돌 테스트) | 유닛 테스트 + E2E 테스트 |
| 포장 + 출고 | 패키징 + 배포 |
| 조립 로봇 (자동화) | CI/CD 파이프라인 |

**또 다른 비유: 요리 레시피**
- 재료 준비 (의존성)
- 손질 + 조리 (컴파일)
- 플레이팅 (번들링)
- 맛보기 (테스트)
- 손님에게 서빙 (배포)

## 💼 P3 시스템 실제 사례

### 상황: P3 RAG 챗봇 프로덕션 빌드

P3는 **FastAPI 백엔드 + React 프론트엔드**로 구성되어 있습니다.

### 1. 백엔드 빌드 (Python + Docker)

```dockerfile
# Dockerfile - 재현 가능한 빌드 환경
FROM python:3.10-slim

WORKDIR /app

# 의존성 먼저 복사 (레이어 캐싱)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# 환경 변수
ENV PYTHONUNBUFFERED=1
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

# 포트 노출
EXPOSE 8000

# 실행 명령
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# 빌드 스크립트: build.sh
#!/bin/bash
set -e  # 에러 시 중단

echo "🏗️  P3 백엔드 빌드 시작..."

# 1. 의존성 확인
echo "📦 의존성 체크..."
pip install -r requirements.txt --dry-run

# 2. 코드 품질 검사
echo "🔍 린팅..."
black --check .
flake8 .
mypy .

# 3. 테스트
echo "🧪 테스트 실행..."
pytest tests/ --cov=. --cov-report=html

# 4. Docker 이미지 빌드
echo "🐳 Docker 이미지 빌드..."
docker build -t p3-backend:$(git rev-parse --short HEAD) .
docker tag p3-backend:$(git rev-parse --short HEAD) p3-backend:latest

echo "✅ 빌드 완료!"
```

### 2. 프론트엔드 빌드 (React + Vite)

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer()  // 번들 크기 분석
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,  // 프로덕션: 소스맵 제거
    minify: 'terser',  // 압축
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],  // 벤더 청크 분리
          'utils': ['lodash', 'axios']
        }
      }
    }
  },
  define: {
    'process.env.API_URL': JSON.stringify(process.env.API_URL)
  }
});
```

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:analyze": "vite build && open dist/stats.html",
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "prebuild": "npm run lint && npm run test"
  }
}
```

```bash
# 빌드 실행
$ npm run build

> p3-frontend@1.0.0 prebuild
> npm run lint && npm run test

✓ ESLint: 0 errors, 0 warnings
✓ Jest: 45 tests passed

> p3-frontend@1.0.0 build
> vite build

vite v5.0.0 building for production...
✓ 256 modules transformed.
dist/index.html                  0.48 kB │ gzip:  0.31 kB
dist/assets/index-a1b2c3d4.css   2.15 kB │ gzip:  1.02 kB
dist/assets/index-e5f6g7h8.js  142.35 kB │ gzip: 45.82 kB

✓ built in 3.42s
```

### 3. CI/CD 파이프라인 (GitHub Actions)

```yaml
# .github/workflows/build.yml
name: Build and Deploy P3

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest black flake8

      - name: Lint
        run: |
          black --check .
          flake8 .

      - name: Test
        run: pytest tests/ --cov

      - name: Build Docker Image
        run: |
          docker build -t p3-backend:${{ github.sha }} .

      - name: Push to Registry
        if: github.ref == 'refs/heads/main'
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push p3-backend:${{ github.sha }}

  frontend-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        env:
          API_URL: ${{ secrets.API_URL }}
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend-dist
          path: dist/

  deploy:
    needs: [backend-build, frontend-build]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          ssh prod-server "docker-compose pull && docker-compose up -d"
```

### 빌드 시간 최적화 결과

| 단계 | 최적화 전 | 최적화 후 | 개선 |
|---|---|---|---|
| 의존성 설치 | 2분 30초 | 45초 | npm ci + 캐싱 |
| 린팅 | 1분 20초 | 20초 | 병렬 실행 |
| 테스트 | 3분 10초 | 1분 15초 | 병렬 테스트 |
| 번들링 | 4분 50초 | 1분 30초 | Vite + Tree Shaking |
| Docker 빌드 | 5분 40초 | 2분 10초 | 레이어 캐싱 |
| **전체** | **17분 30초** | **6분** | **66% 단축** |

## 💻 코드 구현 (간단하게)

### 1. Makefile (C/C++)

```makefile
# Makefile - C 프로젝트 빌드
CC = gcc
CFLAGS = -Wall -O2
LDFLAGS = -lpthread -lssl

# 소스 파일
SRCS = main.c utils.c network.c
OBJS = $(SRCS:.c=.o)
TARGET = myapp

# 기본 타겟
all: $(TARGET)

# 링킹
$(TARGET): $(OBJS)
	$(CC) $(OBJS) $(LDFLAGS) -o $(TARGET)

# 컴파일
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

# 클린
clean:
	rm -f $(OBJS) $(TARGET)

# 테스트
test: $(TARGET)
	./test_runner

# 설치
install: $(TARGET)
	cp $(TARGET) /usr/local/bin/

.PHONY: all clean test install
```

```bash
# 사용법
make          # 빌드
make test     # 테스트
make clean    # 정리
make install  # 설치
```

### 2. package.json (JavaScript)

```json
{
  "name": "myapp",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "prebuild": "npm run lint",
    "postbuild": "npm run test",
    "clean": "rm -rf dist node_modules"
  }
}
```

### 3. setup.py (Python)

```python
# setup.py - Python 패키지 빌드
from setuptools import setup, find_packages

setup(
    name='mypackage',
    version='1.0.0',
    packages=find_packages(),
    install_requires=[
        'fastapi>=0.100.0',
        'uvicorn>=0.23.0',
        'pydantic>=2.0.0'
    ],
    extras_require={
        'dev': ['pytest', 'black', 'flake8'],
        'test': ['pytest-cov', 'httpx']
    },
    entry_points={
        'console_scripts': [
            'myapp=mypackage.main:main'
        ]
    }
)
```

```bash
# 빌드 명령
python setup.py sdist bdist_wheel  # .tar.gz, .whl 생성
pip install dist/mypackage-1.0.0-py3-none-any.whl
```

## ⚠️ 빌드 주의사항

### 1. 빌드 재현성 (Reproducible Build)

```bash
# ❌ 나쁜 예: 의존성 버전 고정 안 함
pip install requests  # 버전이 시간에 따라 달라짐

# ✅ 좋은 예: requirements.txt로 버전 고정
pip freeze > requirements.txt
# requests==2.31.0
# urllib3==2.0.7

pip install -r requirements.txt  # 정확한 버전 설치
```

### 2. 빌드 캐싱

```dockerfile
# ❌ 나쁜 예: 캐시 활용 안 됨
COPY . /app
RUN npm install  # 코드 변경 시마다 재설치

# ✅ 좋은 예: 의존성 먼저 복사
COPY package.json package-lock.json /app/
RUN npm ci  # 캐시 활용 (의존성 안 바뀌면 재사용)
COPY . /app
```

### 3. 빌드 시간 최적화

```javascript
// ❌ 나쁜 예: 거대한 번들
import _ from 'lodash';  // 전체 라이브러리 (70KB)

// ✅ 좋은 예: Tree Shaking
import { debounce } from 'lodash-es';  // 필요한 함수만 (3KB)
```

## 🔗 관련 용어

- **[[Compile]]**: 소스 코드를 기계어로 변환
- **[[CI/CD]]**: 지속적 통합 및 배포
- **[[Docker]]**: 컨테이너 기반 빌드 환경
- **[[Webpack]]**: JavaScript 번들러
- **[[Maven]]**: Java 빌드 도구
- **[[Make]]**: C/C++ 빌드 도구
- **[[Artifact]]**: 빌드 결과물 (.jar, .exe, .whl)

## 📝 정리

### 핵심 3줄
1. **빌드 = 소스 코드 → 실행 파일 전체 과정**: 컴파일 + 링킹 + 테스트 + 패키징
2. **자동화 필수**: Makefile, package.json, CI/CD로 재현 가능한 빌드
3. **최적화 중요**: 캐싱, 병렬 빌드, Tree Shaking으로 빌드 시간 단축

### 빌드 프로세스 요약
```
소스 코드
  ↓ 의존성 설치
  ↓ 코드 품질 검사 (Lint)
  ↓ 컴파일/번들링
  ↓ 테스트 (Unit, E2E)
  ↓ 최적화 (압축, Tree Shaking)
  ↓ 패키징 (.jar, .exe, Docker Image)
배포 준비 완료!
```

### 실무 체크리스트
- [ ] 빌드 스크립트 작성 (Makefile, package.json)
- [ ] 의존성 버전 고정 (requirements.txt, package-lock.json)
- [ ] CI/CD 파이프라인 구축 (GitHub Actions, Jenkins)
- [ ] 빌드 캐싱 활용 (Docker 레이어, npm cache)
- [ ] 테스트 자동화 (빌드 실패 시 배포 차단)
- [ ] 빌드 시간 모니터링 (병목 지점 파악)
- [ ] Artifact 버저닝 (Git SHA, 시맨틱 버전)

---
*카테고리: 프로그래밍*
*관련 프로젝트: P3 (CI/CD 파이프라인)*
*업데이트: 2024-02-15*
