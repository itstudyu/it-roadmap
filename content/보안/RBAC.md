# RBAC (Role-Based Access Control)

## 📝 정의

RBAC(Role-Based Access Control, 역할 기반 접근 제어)는 **사용자의 역할에 따라 시스템 권한을 부여**하는 접근 제어 방식입니다.

### 핵심 개념

- **무엇인가?**: 역할(Role)을 통한 권한 관리
- **왜 필요한가?**: 사용자마다 일일이 권한 설정 → 관리 복잡
- **어떻게 작동하나?**: 사용자 → 역할 배정 → 역할에 권한 부여

### RBAC이 해결하는 문제

**문제 상황**:
```
😱 시나리오: 직접 권한 부여
직원 100명 → 각자 권한 설정
신입 사원 입사 → 10개 권한 일일이 설정
퇴사자 발생 → 10개 권한 일일이 삭제
→ 관리 복잡! 누락 위험! 😱
```

**RBAC의 해결**:
```
✅ 역할로 관리:
역할 정의: "개발자" 역할 (10개 권한 포함)
신입 개발자 입사 → "개발자" 역할 1개만 배정
→ 자동으로 10개 권한 부여
퇴사 → 역할 제거
→ 모든 권한 자동 회수! ✅
```

**비유**:
- **직접 권한 부여** = 출입할 방마다 열쇠 복사
- **RBAC** = 직급별 통합 출입증 (역할별 자동 권한)

## 📊 RBAC 구조

```도해
층: RBAC, 어떻게 나뉘어 있나
Users :: Alice · Bob · Charlie
Roles :: Admin · Developer · Viewer
Permissions :: create_user · delete_user · read_code · write_code · read_d…
```

## 💡 RBAC 구현

### 데이터베이스 스키마
```sql
-- 사용자 테이블
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100)
);

-- 역할 테이블
CREATE TABLE roles (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    description TEXT
);

-- 권한 테이블
CREATE TABLE permissions (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    resource VARCHAR(50),
    action VARCHAR(20)
);

-- 사용자-역할 관계 (Many-to-Many)
CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

-- 역할-권한 관계 (Many-to-Many)
CREATE TABLE role_permissions (
    role_id INT,
    permission_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);
```

### Python 구현
```python
class RBACManager:
    def __init__(self, db):
        self.db = db
    
    def create_role(self, name, permissions):
        """역할 생성"""
        role_id = self.db.roles.insert({
            'name': name,
            'permissions': permissions
        })
        return role_id
    
    def assign_role(self, user_id, role_name):
        """사용자에게 역할 배정"""
        self.db.user_roles.insert({
            'user_id': user_id,
            'role': role_name
        })
    
    def has_permission(self, user_id, permission):
        """사용자가 특정 권한을 가지고 있는지 확인"""
        # 사용자의 역할 조회
        user_roles = self.db.user_roles.find({'user_id': user_id})
        
        # 각 역할의 권한 확인
        for user_role in user_roles:
            role = self.db.roles.find_one({'name': user_role['role']})
            if permission in role['permissions']:
                return True
        
        return False
    
    def get_user_permissions(self, user_id):
        """사용자의 모든 권한 조회"""
        permissions = set()
        
        user_roles = self.db.user_roles.find({'user_id': user_id})
        for user_role in user_roles:
            role = self.db.roles.find_one({'name': user_role['role']})
            permissions.update(role['permissions'])
        
        return list(permissions)

# 사용 예시
rbac = RBACManager(db)

# 역할 생성
rbac.create_role('admin', [
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'post:create',
    'post:read',
    'post:update',
    'post:delete'
])

rbac.create_role('editor', [
    'post:create',
    'post:read',
    'post:update'
])

rbac.create_role('viewer', [
    'post:read'
])

# 사용자에게 역할 배정
rbac.assign_role(user_id=1, role_name='admin')
rbac.assign_role(user_id=2, role_name='editor')

# 권한 확인
if rbac.has_permission(user_id=2, permission='post:delete'):
    delete_post()
else:
    return "Permission denied", 403
```

## 💡 Flask 데코레이터

```python
from functools import wraps
from flask import abort, g

def require_permission(permission):
    """권한 확인 데코레이터"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = g.current_user.id
            
            if not rbac.has_permission(user_id, permission):
                abort(403, description=f"Permission denied: {permission}")
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def require_role(role):
    """역할 확인 데코레이터"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = g.current_user.id
            user_roles = rbac.get_user_roles(user_id)
            
            if role not in user_roles:
                abort(403, description=f"Role required: {role}")
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# 사용
@app.route('/users', methods=['POST'])
@require_permission('user:create')
def create_user():
    """사용자 생성 (user:create 권한 필요)"""
    return jsonify({'created': True})

@app.route('/admin/dashboard')
@require_role('admin')
def admin_dashboard():
    """관리자 대시보드 (admin 역할 필요)"""
    return render_template('admin.html')
```

## 💡 계층적 역할 (Role Hierarchy)

```python
class HierarchicalRBAC:
    """역할 상속 지원"""
    
    ROLE_HIERARCHY = {
        'superadmin': ['admin', 'editor', 'viewer'],
        'admin': ['editor', 'viewer'],
        'editor': ['viewer'],
        'viewer': []
    }
    
    def get_inherited_roles(self, role):
        """상속받은 역할 포함"""
        roles = {role}
        
        if role in self.ROLE_HIERARCHY:
            for inherited_role in self.ROLE_HIERARCHY[role]:
                roles.add(inherited_role)
                roles.update(self.get_inherited_roles(inherited_role))
        
        return roles
    
    def has_permission(self, user_id, permission):
        """상속 고려한 권한 확인"""
        user_roles = self.get_user_roles(user_id)
        
        # 상속받은 역할까지 포함
        all_roles = set()
        for role in user_roles:
            all_roles.update(self.get_inherited_roles(role))
        
        # 모든 역할의 권한 확인
        for role in all_roles:
            role_permissions = self.get_role_permissions(role)
            if permission in role_permissions:
                return True
        
        return False

# 예시
# superadmin → admin, editor, viewer 권한 자동 상속
# admin → editor, viewer 권한 자동 상속
```

## 💡 동적 권한 (Attribute-Based)

```python
def check_resource_permission(user_id, action, resource):
    """리소스별 권한 확인"""
    
    # 1. 기본 RBAC 확인
    if rbac.has_permission(user_id, f"{resource}:{action}"):
        return True
    
    # 2. 리소스 소유자 확인
    if action in ['update', 'delete']:
        resource_owner = get_resource_owner(resource)
        if resource_owner == user_id:
            return True  # 자기 것은 수정/삭제 가능
    
    # 3. 조직 기반 권한
    user_dept = get_user_department(user_id)
    resource_dept = get_resource_department(resource)
    
    if user_dept == resource_dept and action == 'read':
        return True  # 같은 부서 자료는 읽기 가능
    
    return False

# 사용
@app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    user_id = g.current_user.id
    
    if not check_resource_permission(user_id, 'delete', post_id):
        abort(403)
    
    # 삭제 로직
```

## 🎯 실전 예시

### 역할 정의
```python
ROLES = {
    'superadmin': {
        'description': '최고 관리자',
        'permissions': '*'  # 모든 권한
    },
    'admin': {
        'description': '관리자',
        'permissions': [
            'user:*',        # 사용자 관리
            'role:*',        # 역할 관리
            'post:*',        # 게시물 관리
            'settings:read'
        ]
    },
    'moderator': {
        'description': '모더레이터',
        'permissions': [
            'post:read',
            'post:update',
            'post:delete',
            'comment:delete'
        ]
    },
    'author': {
        'description': '작성자',
        'permissions': [
            'post:create',
            'post:read',
            'post:update:own',  # 자기 글만
            'post:delete:own'
        ]
    },
    'user': {
        'description': '일반 사용자',
        'permissions': [
            'post:read',
            'comment:create'
        ]
    }
}
```

## 🔗 관련 용어

- [[ACL]]: Access Control List (대안)
- [[ABAC]]: Attribute-Based Access Control
- [[OAuth]]: 권한 위임 프로토콜

---
*카테고리: 보안*
*생성일: 2026-02-14*
