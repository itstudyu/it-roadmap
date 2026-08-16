# tRPC

## 📝 정의

tRPC는 **TypeScript로 End-to-End 타입 안정성을 제공하는 RPC 프레임워크**입니다. API를 만들 때 별도의 스키마 정의 없이 TypeScript 타입을 자동으로 공유합니다.

### 핵심 개념

- **무엇인가?**: TypeScript 타입을 공유하는 API 프레임워크
- **왜 필요한가?**: REST API는 타입 불일치 오류 발생
- **어떻게 작동하나?**: 서버 함수 정의 → 클라이언트 자동 타입 추론

### tRPC가 해결하는 문제

**문제 상황**:
```
😱 시나리오: REST API 타입 불일치
서버: { name: string, age: number }
클라이언트: age를 string으로 가정
→ 런타임 오류 발생! 😱
```

**tRPC의 해결**:
```
✅ 타입 자동 공유:
서버에서 타입 정의
→ 클라이언트 자동 인식
→ 컴파일 타임에 오류 발견! ✅
```

## 💡 tRPC 예시

```typescript
// 서버
const appRouter = router({
  getUser: procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return { id: input.id, name: "김철수" };
    }),
});

// 클라이언트 (타입 자동 추론!)
const user = await trpc.getUser.query({ id: "123" });
console.log(user.name); // ✅ 타입 안전
```

## 🔗 관련 용어

- [[TypeScript]]: tRPC의 기반
- [[API]]: tRPC가 대체하는 방식
- [[RPC]]: Remote Procedure Call

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
