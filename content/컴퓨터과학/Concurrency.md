# Concurrency (동시성)

## 📝 정의

Concurrency(동시성)는 **여러 작업을 번갈아가며 실행**하여 동시에 진행되는 것처럼 보이게 하는 것입니다. 실제로는 한 번에 하나씩 실행하지만, 빠르게 전환하여 동시에 실행되는 것처럼 느껴집니다.

### 핵심 개념

- **무엇인가?**: 여러 작업을 시분할하여 처리
- **왜 필요한가?**: CPU가 놀지 않도록 효율적으로 사용
- **어떻게 작동하나?**: 작업을 빠르게 전환(Context Switching)

### Concurrency가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 순차 처리의 비효율
레스토랑 웨이터 1명:
1. 손님 A 주문 받기 (1분)
2. 주방에 주문 전달 후 대기 (10분) ← CPU가 놀고 있음!
3. 음식 서빙 (1분)
4. 손님 B 주문 받기 시작...

→ 손님 B는 11분 기다림! 😱
→ 웨이터는 10분간 멍하니 대기! 😱

😱 시나리오 2: I/O 대기
파일 다운로드 프로그램:
1. 파일 A 다운로드 시작 (네트워크 응답 대기 10초)
2. 응답 대기 중... CPU 놀고 있음
3. 파일 B는 언제 시작?

→ CPU가 90% 놀고 있음! 😱

😱 시나리오 3: UI 멈춤
버튼 클릭 → 무거운 작업 시작
→ 작업 끝날 때까지 UI 멈춤
→ 사용자: "프로그램 죽었나?" 😱
```

**Concurrency의 해결**:
```
✅ 시나리오 1:
웨이터가 현명하게 일함:
1. 손님 A 주문 받기 (1분)
2. 주문 전달 후 → 손님 B 주문 받기 (1분)
3. 손님 B 주문 전달 후 → 손님 C 주문 받기 (1분)
4. 음식 나오면 → 서빙

→ 3명이 동시에 대기! ✅
→ 웨이터가 항상 바쁘게 일함! ✅

✅ 시나리오 2:
파일 A 다운로드 시작
→ 네트워크 응답 대기 중
→ 그 사이 파일 B 다운로드 시작
→ 파일 C, D도 시작

→ 여러 파일 동시에 다운로드! ✅
→ CPU 효율적으로 사용! ✅

✅ 시나리오 3:
버튼 클릭 → 백그라운드에서 작업
→ UI는 계속 응답
→ 작업 완료 시 결과 표시

→ 사용자는 계속 작업 가능! ✅
```

## 📊 Concurrency vs Parallelism

```도해
층: Concurrency, 어떻게 나뉘어 있나
Concurrency (동시성) · Sin… :: Task A] -.-> A2[Task B] -.-> A3[Task A] -.-> A4[Task B
Parallelism (병렬성) · Mul… :: Task A] --> B2[Task A · Task B] --> B4[Task B
```

| 특성 | Concurrency | Parallelism |
|------|-------------|-------------|
| **CPU 코어** | 1개로 가능 | 2개 이상 필요 |
| **실행 방식** | 번갈아가며 | 동시에 |
| **목적** | I/O 대기 시간 활용 | CPU 성능 향상 |
| **비유** | 1명이 여러 일 번갈아 | 여러 명이 동시에 |

**비유**:
```
Concurrency (동시성):
1명의 요리사가 여러 요리를 번갈아가며
→ 국 끓이다가 → 반찬 볶다가 → 다시 국 보기
→ 모든 요리가 "동시에" 진행되는 것처럼 보임

Parallelism (병렬성):
3명의 요리사가 동시에 작업
→ 1명은 국, 1명은 반찬, 1명은 메인 요리
→ 실제로 동시에 진행됨
```

## 💡 실제 구현

### Python: asyncio (Concurrency)

```python
import asyncio
import time

async def download_file(file_name, delay):
    """파일 다운로드 시뮬레이션"""
    print(f"[{file_name}] 다운로드 시작")
    await asyncio.sleep(delay)  # 네트워크 대기 (비동기)
    print(f"[{file_name}] 다운로드 완료")
    return f"{file_name} 완료"

async def main():
    """메인 함수"""
    # 여러 작업을 동시에 시작
    tasks = [
        download_file("파일A.zip", 3),
        download_file("파일B.zip", 2),
        download_file("파일C.zip", 1)
    ]

    # 모든 작업이 끝날 때까지 대기
    results = await asyncio.gather(*tasks)
    print(f"결과: {results}")

# 실행
start = time.time()
asyncio.run(main())
print(f"총 시간: {time.time() - start:.2f}초")
```

**실행 결과**:
```
[파일A.zip] 다운로드 시작
[파일B.zip] 다운로드 시작
[파일C.zip] 다운로드 시작
[파일C.zip] 다운로드 완료
[파일B.zip] 다운로드 완료
[파일A.zip] 다운로드 완료
결과: ['파일A.zip 완료', '파일B.zip 완료', '파일C.zip 완료']
총 시간: 3.00초  # 순차 처리는 6초 걸렸을 것!
```

### 순차 처리 vs 동시성 처리 비교

```python
import asyncio
import time

# 순차 처리 (Synchronous)
def sync_download():
    """순차적으로 다운로드"""
    print("=== 순차 처리 ===")
    for i in range(3):
        print(f"파일{i} 다운로드 시작")
        time.sleep(2)  # 2초 대기
        print(f"파일{i} 다운로드 완료")

# 동시성 처리 (Asynchronous)
async def async_download(file_id):
    """비동기로 다운로드"""
    print(f"파일{file_id} 다운로드 시작")
    await asyncio.sleep(2)  # 2초 대기 (비동기)
    print(f"파일{file_id} 다운로드 완료")

async def concurrent_download():
    """동시에 다운로드"""
    print("=== 동시성 처리 ===")
    await asyncio.gather(
        async_download(0),
        async_download(1),
        async_download(2)
    )

# 비교
start = time.time()
sync_download()
print(f"순차 처리 시간: {time.time() - start:.2f}초\n")  # ~6초

start = time.time()
asyncio.run(concurrent_download())
print(f"동시성 처리 시간: {time.time() - start:.2f}초")  # ~2초
```

**실행 결과**:
```
=== 순차 처리 ===
파일0 다운로드 시작
파일0 다운로드 완료
파일1 다운로드 시작
파일1 다운로드 완료
파일2 다운로드 시작
파일2 다운로드 완료
순차 처리 시간: 6.00초

=== 동시성 처리 ===
파일0 다운로드 시작
파일1 다운로드 시작
파일2 다운로드 시작
파일0 다운로드 완료
파일1 다운로드 완료
파일2 다운로드 완료
동시성 처리 시간: 2.00초
```

## 🔍 Concurrency 패턴

### 1. 웹 스크래핑

```python
import asyncio
import aiohttp  # 비동기 HTTP 라이브러리

async def fetch_url(session, url):
    """URL에서 데이터 가져오기"""
    async with session.get(url) as response:
        content = await response.text()
        print(f"{url}: {len(content)} bytes")
        return content

async def scrape_multiple_urls(urls):
    """여러 URL 동시 스크래핑"""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

# 사용
urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
]

asyncio.run(scrape_multiple_urls(urls))
```

### 2. 데이터베이스 쿼리

```python
import asyncio

async def fetch_user(user_id):
    """사용자 정보 조회"""
    print(f"[User {user_id}] 조회 시작")
    await asyncio.sleep(1)  # DB 쿼리 시뮬레이션
    print(f"[User {user_id}] 조회 완료")
    return {'id': user_id, 'name': f'User{user_id}'}

async def fetch_orders(user_id):
    """주문 정보 조회"""
    print(f"[Order {user_id}] 조회 시작")
    await asyncio.sleep(1.5)  # DB 쿼리 시뮬레이션
    print(f"[Order {user_id}] 조회 완료")
    return [{'order_id': 1}, {'order_id': 2}]

async def get_user_data(user_id):
    """사용자와 주문 정보 동시 조회"""
    # 두 쿼리를 동시에 실행
    user, orders = await asyncio.gather(
        fetch_user(user_id),
        fetch_orders(user_id)
    )
    return {'user': user, 'orders': orders}

# 실행
result = asyncio.run(get_user_data(123))
print(f"결과: {result}")
# 순차: 2.5초 → 동시성: 1.5초!
```

## 🎯 언제 Concurrency를 사용할까?

### ✅ Concurrency가 효과적인 경우

```
I/O 작업이 많을 때:
→ 네트워크 요청 (API 호출, 웹 스크래핑)
→ 파일 읽기/쓰기
→ 데이터베이스 쿼리
→ 사용자 입력 대기

이유: 대기 시간 동안 다른 작업 처리 가능
```

**예시**:
```python
# ✅ I/O 작업 - Concurrency 적합
async def process_api_requests():
    """여러 API 동시 호출"""
    results = await asyncio.gather(
        call_api_1(),  # 네트워크 대기
        call_api_2(),  # 네트워크 대기
        call_api_3()   # 네트워크 대기
    )
    return results
```

### ❌ Concurrency가 효과 없는 경우

```
CPU 집약적 작업:
→ 복잡한 계산
→ 이미지 처리
→ 암호화/복호화
→ 데이터 압축

이유: CPU가 계속 일하므로 전환해도 의미 없음
→ 이 경우는 Parallelism(멀티프로세스) 필요
```

**예시**:
```python
# ❌ CPU 작업 - Concurrency 효과 없음
async def heavy_calculation():
    """무거운 계산"""
    result = 0
    for i in range(100_000_000):
        result += i ** 2
    return result

# 이 경우 multiprocessing 사용해야 함!
```

## 💻 JavaScript의 Concurrency

JavaScript는 기본적으로 Concurrency를 지원:

```javascript
// Promise를 사용한 동시성
function downloadFile(fileName, delay) {
    return new Promise((resolve) => {
        console.log(`[${fileName}] 다운로드 시작`);
        setTimeout(() => {
            console.log(`[${fileName}] 다운로드 완료`);
            resolve(fileName);
        }, delay);
    });
}

// 여러 작업 동시 실행
async function downloadMultiple() {
    const results = await Promise.all([
        downloadFile('파일A', 3000),
        downloadFile('파일B', 2000),
        downloadFile('파일C', 1000)
    ]);

    console.log('결과:', results);
}

downloadMultiple();
// 총 시간: 3초 (순차면 6초)
```

## 🔧 Concurrency 구현 방식

### Event Loop

Concurrency는 Event Loop를 통해 구현됩니다:


**작동 과정**:
```
1. Task A 시작 (네트워크 요청)
   → 대기 상태로 등록

2. Task B 시작 (파일 읽기)
   → 대기 상태로 등록

3. Task C 시작 (DB 쿼리)
   → 대기 상태로 등록

4. Event Loop가 체크:
   → Task B 완료됨 → 콜백 실행
   → Task A 완료됨 → 콜백 실행
   → Task C 완료됨 → 콜백 실행
```

## 🔗 관련 용어

- [[Parallelism]]: 실제로 동시에 실행
- [[Async-Await]]: 비동기 프로그래밍 문법
- [[Thread]]: 동시성을 구현하는 한 방법
- [[Process]]: 독립적인 실행 단위
- [[Multi-thread]]: 여러 스레드로 동시성 구현

## 📝 정리

**Concurrency의 핵심**:
```
동시성 = 빠르게 전환하여 동시처럼 보이기
→ I/O 대기 시간 활용
→ CPU 효율적 사용
→ 사용자 경험 향상
```

**간단한 기준**:
```
I/O 작업 많음 → Concurrency (asyncio, async/await)
CPU 작업 많음 → Parallelism (multiprocessing)
```

**비유로 기억하기**:
```
Concurrency = 1명이 멀티태스킹
Parallelism = 여러 명이 동시 작업
```

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-15*
