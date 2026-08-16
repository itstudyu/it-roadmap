# Full Stack (풀스택)

## 📝 정의
Full Stack은 **프론트엔드와 백엔드 모두를 다루는 것**입니다. 전체 웹 개발 스택을 의미합니다.

### 핵심 개념
- Frontend + Backend
- 데이터베이스 포함
- 배포까지 전 과정

## 💡 Full Stack 개발자

```
Frontend:
- HTML, CSS, JavaScript
- React, Vue

Backend:
- Python, Node.js
- Django, Express

Database:
- MySQL, MongoDB

DevOps:
- Docker, AWS
```

## 🎯 Full Stack 프로젝트

```javascript
// Frontend (React)
function App() {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(setUsers);
    }, []);
    
    return <UserList users={users} />;
}

// Backend (Node.js)
app.get('/api/users', async (req, res) => {
    const users = await db.collection('users').find().toArray();
    res.json(users);
});
```

## 🔗 관련 용어
- [[Frontend]]: 클라이언트
- [[Backend]]: 서버
- [[Database]]: 데이터 저장

---
*카테고리: 웹개발*
