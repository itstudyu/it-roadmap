# Async/Await (비동기 문법)

## 📝 정의

Async/Await는 **비동기 프로그래밍을 동기 코드처럼 작성**할 수 있게 해주는 문법입니다. 복잡한 콜백 지옥을 피하고 가독성 좋은 코드를 작성할 수 있습니다.

### 핵심 개념

- **무엇인가?**: 비동기 코드를 쉽게 작성하는 문법
- **왜 필요한가?**: 콜백 지옥 방지, 가독성 향상
- **어떻게 작동하나?**: async 함수 + await 키워드

### Async/Await가 해결하는 문제

**문제 상황**:
```javascript
😱 시나리오 1: 콜백 지옥 (Callback Hell)
// 사용자 정보 → 주문 목록 → 주문 상세 → 결제 정보
getUser(userId, (user) => {
    getOrders(user.id, (orders) => {
        getOrderDetails(orders[0].id, (details) => {
            getPayment(details.paymentId, (payment) => {
                console.log(payment);
            });
        });
    });
});

→ 가독성 최악! 😱
→ 에러 처리 복잡! 😱
→ 유지보수 지옥! 😱

😱 시나리오 2: Promise 체이닝
// Promise로 개선해도...
getUser(userId)
    .then(user => getOrders(user.id))
    .then(orders => getOrderDetails(orders[0].id))
    .then(details => getPayment(details.paymentId))
    .then(payment => console.log(payment))
    .catch(error => console.error(error));

→ 여전히 읽기 어려움! 😱
→ 중간 변수 접근 불편! 😱

😱 시나리오 3: 에러 처리
fetch('/api/user')
    .then(res => res.json())
    .then(user => {
        if (!user) throw new Error('No user');
        return fetch(`/api/orders/${user.id}`);
    })
    .then(res => res.json())
    .catch(error => {
        // 어디서 에러 났는지 알기 어려움! 😱
        console.error(error);
    });
```

**Async/Await의 해결**:
```javascript
✅ 시나리오 1:
// 동기 코드처럼 보이는 비동기 코드!
async function getUserData(userId) {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);
    const payment = await getPayment(details.paymentId);
    return payment;
}

→ 읽기 쉬움! ✅
→ 순차적으로 이해 가능! ✅

✅ 시나리오 2:
// 모든 변수에 쉽게 접근
async function processOrder(userId) {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);

    // user와 orders 둘 다 사용 가능!
    console.log(`${user.name}님의 주문: ${orders.length}개`);
}

→ 변수 관리 편함! ✅

✅ 시나리오 3:
// try-catch로 명확한 에러 처리
async function fetchUserOrders() {
    try {
        const res = await fetch('/api/user');
        const user = await res.json();

        if (!user) throw new Error('No user');

        const ordersRes = await fetch(`/api/orders/${user.id}`);
        const orders = await ordersRes.json();

        return orders;
    } catch (error) {
        // 어디서 에러 났는지 명확! ✅
        console.error('에러 발생:', error);
    }
}
```

## 📊 작동 원리


### async/await 동작

**1. async 함수**:
```javascript
// async를 붙이면 항상 Promise를 반환
async function fetchData() {
    return "데이터";
}

// 위 코드는 아래와 같음
function fetchData() {
    return Promise.resolve("데이터");
}
```

**2. await 키워드**:
```javascript
// Promise가 완료될 때까지 대기
const result = await fetchData();
console.log(result);  // "데이터"

// await 없이는 Promise 객체가 반환됨
const promise = fetchData();
console.log(promise);  // Promise {<fulfilled>: "데이터"}
```

## 💡 실제 예시

### JavaScript/TypeScript

**기본 사용**:
```javascript
// API 호출
async function getUserInfo(userId) {
    try {
        // 비동기 작업을 동기처럼 작성
        const response = await fetch(`/api/users/${userId}`);
        const user = await response.json();

        console.log(`사용자: ${user.name}`);
        return user;
    } catch (error) {
        console.error('에러:', error);
        throw error;
    }
}

// 사용
getUserInfo(123);
```

**여러 비동기 작업**:
```javascript
async function fetchMultipleData() {
    // 순차 실행 (하나씩)
    const user = await fetchUser();       // 1초 대기
    const orders = await fetchOrders();   // 1초 대기
    const products = await fetchProducts();  // 1초 대기
    // 총 3초

    // 병렬 실행 (동시에)
    const [user2, orders2, products2] = await Promise.all([
        fetchUser(),
        fetchOrders(),
        fetchProducts()
    ]);
    // 총 1초! (가장 느린 것 기준)

    return { user2, orders2, products2 };
}
```

### Python

**asyncio 사용**:
```python
import asyncio

# async def로 비동기 함수 정의
async def fetch_data(url):
    """데이터 가져오기"""
    print(f"[{url}] 다운로드 시작")
    await asyncio.sleep(2)  # 비동기 대기
    print(f"[{url}] 다운로드 완료")
    return f"Data from {url}"

async def main():
    """메인 함수"""
    # 순차 실행
    data1 = await fetch_data("api1")
    data2 = await fetch_data("api2")
    # 총 4초

    # 병렬 실행
    results = await asyncio.gather(
        fetch_data("api3"),
        fetch_data("api4"),
        fetch_data("api5")
    )
    # 총 2초!

    return results

# 실행
asyncio.run(main())
```

**실전 예시: 웹 스크래핑**:
```python
import asyncio
import aiohttp  # 비동기 HTTP 라이브러리

async def fetch_page(session, url):
    """웹 페이지 다운로드"""
    async with session.get(url) as response:
        html = await response.text()
        print(f"{url}: {len(html)} bytes")
        return html

async def scrape_multiple_sites(urls):
    """여러 사이트 동시 스크래핑"""
    async with aiohttp.ClientSession() as session:
        # 모든 URL을 동시에 다운로드
        tasks = [fetch_page(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

# 사용
urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
]

asyncio.run(scrape_multiple_sites(urls))
```

## 🎯 순차 vs 병렬 실행

### 순차 실행 (느림)

```javascript
async function sequential() {
    console.time('순차');

    const result1 = await task1();  // 1초 대기
    const result2 = await task2();  // 1초 대기
    const result3 = await task3();  // 1초 대기

    console.timeEnd('순차');  // ~3초
    return [result1, result2, result3];
}
```

### 병렬 실행 (빠름)

```javascript
async function parallel() {
    console.time('병렬');

    // 동시에 시작
    const [result1, result2, result3] = await Promise.all([
        task1(),  // 동시에
        task2(),  // 동시에
        task3()   // 동시에
    ]);

    console.timeEnd('병렬');  // ~1초
    return [result1, result2, result3];
}
```

### 조건부 실행

```javascript
async function conditional() {
    // 1. 사용자 정보 가져오기
    const user = await fetchUser();

    if (user.isAdmin) {
        // 2. 관리자면 추가 데이터 가져오기
        const adminData = await fetchAdminData();
        return { user, adminData };
    } else {
        // 2. 일반 사용자는 기본 데이터만
        return { user };
    }
}
```

## 🔍 에러 처리

### try-catch 패턴

```javascript
async function fetchWithErrorHandling() {
    try {
        const response = await fetch('/api/data');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('에러 발생:', error);

        // 에러 종류에 따른 처리
        if (error.name === 'NetworkError') {
            return { error: '네트워크 오류' };
        } else {
            return { error: '알 수 없는 오류' };
        }
    } finally {
        // 항상 실행 (정리 작업)
        console.log('요청 완료');
    }
}
```

### 여러 비동기 작업의 에러 처리

```javascript
async function fetchMultipleWithErrors() {
    try {
        const [users, orders, products] = await Promise.all([
            fetchUsers(),
            fetchOrders(),
            fetchProducts()
        ]);

        return { users, orders, products };
    } catch (error) {
        // 하나라도 실패하면 여기로
        console.error('하나 이상의 요청 실패:', error);
        throw error;
    }
}

// 일부 실패해도 계속 진행
async function fetchMultipleAllSettled() {
    const results = await Promise.allSettled([
        fetchUsers(),
        fetchOrders(),
        fetchProducts()
    ]);

    // 성공한 것만 추출
    const successful = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

    // 실패한 것 로깅
    const failed = results.filter(r => r.status === 'rejected');
    failed.forEach(r => console.error('실패:', r.reason));

    return successful;
}
```

## 💻 실전 패턴

### 1. Timeout 처리

```javascript
function timeout(ms) {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
    );
}

async function fetchWithTimeout(url, ms = 5000) {
    try {
        const response = await Promise.race([
            fetch(url),
            timeout(ms)
        ]);
        return await response.json();
    } catch (error) {
        if (error.message === 'Timeout') {
            console.error(`${url} 요청 시간 초과`);
        }
        throw error;
    }
}

// 사용
await fetchWithTimeout('/api/slow-endpoint', 3000);
```

### 2. Retry 로직

```javascript
async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log(`시도 ${i + 1}/${retries} 실패`);

            if (i === retries - 1) {
                throw error;  // 마지막 시도도 실패
            }

            // 재시도 전 대기 (Exponential Backoff)
            await new Promise(resolve =>
                setTimeout(resolve, 1000 * (i + 1))
            );
        }
    }
}
```

### 3. 속도 제한 (Rate Limiting)

```javascript
async function processWithRateLimit(items, limit = 5) {
    const results = [];

    // 최대 limit개씩 처리
    for (let i = 0; i < items.length; i += limit) {
        const batch = items.slice(i, i + limit);

        // 배치 처리
        const batchResults = await Promise.all(
            batch.map(item => processItem(item))
        );

        results.push(...batchResults);

        // 다음 배치 전 대기
        if (i + limit < items.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return results;
}
```

## 🚨 주의사항

### 1. await는 async 함수 안에서만

```javascript
// ❌ 에러!
function normal() {
    const data = await fetchData();  // SyntaxError!
}

// ✅ 올바름
async function correct() {
    const data = await fetchData();
}
```

### 2. 불필요한 await 방지

```javascript
// ❌ 비효율
async function bad() {
    return await fetchData();  // 불필요한 await
}

// ✅ 더 나음
async function good() {
    return fetchData();  // Promise를 그대로 반환
}

// ⚠️ 단, try-catch가 필요하면 await 필요
async function needAwait() {
    try {
        return await fetchData();  // await 필요!
    } catch (error) {
        console.error(error);
    }
}
```

### 3. 루프에서 주의

```javascript
// ❌ 순차 실행 (느림)
async function slow(items) {
    for (const item of items) {
        await processItem(item);  // 하나씩 처리
    }
}

// ✅ 병렬 실행 (빠름)
async function fast(items) {
    await Promise.all(
        items.map(item => processItem(item))  // 동시 처리
    );
}
```

## 🔗 관련 용어

- [[Concurrency]]: 동시성 - async/await가 구현하는 개념
- [[Promise]]: async/await의 기반
- [[Callback]]: async/await 이전의 비동기 처리
- [[Event Loop]]: 비동기 처리의 메커니즘
- [[Thread]]: 다른 동시 실행 방법

## 📝 정리

**Async/Await의 핵심**:
```
async/await = 비동기 코드를 동기처럼 작성
→ 콜백 지옥 해결
→ 가독성 향상
→ 에러 처리 간단
```

**기본 패턴**:
```javascript
async function example() {
    try {
        const result = await asyncOperation();
        return result;
    } catch (error) {
        console.error(error);
    }
}
```

**비유로 기억하기**:
```
Promise 체이닝 = 복잡한 콜백 사슬
Async/Await = 일반 코드처럼 작성
```

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-15*
