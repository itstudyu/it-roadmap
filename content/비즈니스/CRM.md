# CRM (Customer Relationship Management)

## 📝 정의

CRM(Customer Relationship Management, 고객 관계 관리)은 **고객 정보를 체계적으로 관리하고 분석**하여, 고객과의 관계를 강화하고 매출을 증대시키는 시스템입니다.

### 핵심 개념

- **무엇인가?**: 고객 데이터 통합 관리 플랫폼
- **왜 필요한가?**: 고객 정보 분산 → 비효율, 기회 손실
- **어떻게 작동하나?**: 고객 접점 데이터 수집 → 분석 → 맞춤형 대응

### CRM이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 고객 정보 분산
영업팀 → Excel 파일로 관리
고객 지원팀 → 다른 시스템 사용
→ 같은 고객인데 중복 연락
→ 고객 불만! 😱

😱 시나리오 2: 기회 손실
잠재 고객 100명 → 누구에게 먼저 연락?
→ 우선순위 불명확
→ 중요 고객 놓침! 😱
```

**CRM의 해결**:
```
✅ 통합 관리:
모든 팀 → 하나의 CRM 시스템
→ 고객 이력 실시간 공유
→ 자동 우선순위 (구매 가능성 높은 순)
→ 효율 + 매출 증가! ✅
```

**비유**:
- **CRM 없음** = 메모지에 고객 정보 (분실 위험)
- **CRM** = 디지털 고객 수첩 (검색, 분석 가능)

## 📊 CRM 구조

```도해
층: CRM, 어떻게 나뉘어 있나
Data :: 이메일 · 전화 · 웹사이트 · 소셜미디어
CRM :: 연락처 관리 · 리드 관리 · 거래 관리 · 분석/리포트
Action :: 마케팅 자동화 · 영업 활동 · 고객 지원
```

## 💡 CRM 핵심 기능

### 1. 연락처 관리
```python
# 고객 정보 통합
class Contact:
    def __init__(self, email):
        self.email = email
        self.name = None
        self.company = None
        self.phone = None
        self.interactions = []  # 모든 접점 기록
    
    def add_interaction(self, type, content):
        """고객 접점 기록"""
        self.interactions.append({
            'type': type,  # email, call, meeting
            'content': content,
            'timestamp': datetime.now()
        })
    
    def get_last_contact(self):
        """마지막 연락 일자"""
        if self.interactions:
            return self.interactions[-1]['timestamp']
        return None

# 사용
customer = Contact('john@example.com')
customer.add_interaction('email', '제품 문의')
customer.add_interaction('call', '데모 요청')
```

### 2. 리드 스코어링
```python
def calculate_lead_score(lead):
    """
    리드 점수 계산 (구매 가능성)
    """
    score = 0
    
    # 회사 규모
    if lead.company_size > 1000:
        score += 30
    elif lead.company_size > 100:
        score += 20
    
    # 직급
    if lead.job_title in ['CEO', 'CTO', 'VP']:
        score += 25
    
    # 웹사이트 활동
    score += lead.page_views * 2
    
    # 이메일 반응
    if lead.email_opened:
        score += 10
    if lead.email_clicked:
        score += 20
    
    # 최근 활동
    days_since_activity = (datetime.now() - lead.last_activity).days
    if days_since_activity < 7:
        score += 15
    
    return score

# 우선순위 정렬
leads = sorted(all_leads, key=calculate_lead_score, reverse=True)

# 점수 높은 리드부터 연락
for lead in leads[:10]:
    print(f"{lead.name}: {calculate_lead_score(lead)} 점")
```

### 3. 판매 파이프라인
```python
class Deal:
    """거래 (영업 기회)"""
    STAGES = [
        'lead',           # 리드
        'qualified',      # 검증됨
        'proposal',       # 제안서 발송
        'negotiation',    # 협상
        'closed_won',     # 수주
        'closed_lost'     # 실패
    ]
    
    def __init__(self, customer, value):
        self.customer = customer
        self.value = value
        self.stage = 'lead'
        self.probability = 10  # 수주 확률 10%
    
    def move_to_stage(self, stage):
        """단계 이동"""
        if stage not in self.STAGES:
            raise ValueError("Invalid stage")
        
        self.stage = stage
        
        # 단계별 수주 확률
        probabilities = {
            'lead': 10,
            'qualified': 20,
            'proposal': 50,
            'negotiation': 75,
            'closed_won': 100,
            'closed_lost': 0
        }
        
        self.probability = probabilities[stage]
    
    def expected_revenue(self):
        """예상 매출"""
        return self.value * (self.probability / 100)

# 파이프라인 분석
total_pipeline = sum(deal.expected_revenue() for deal in all_deals)
print(f"예상 매출: ${total_pipeline:,.2f}")
```

## 💡 CRM 자동화

### 이메일 자동화
```python
from datetime import timedelta

def automate_follow_up():
    """자동 후속 조치"""
    for lead in Lead.objects.filter(stage='qualified'):
        days_since_contact = (datetime.now() - lead.last_contact).days
        
        # 3일 동안 연락 없으면 자동 이메일
        if days_since_contact >= 3:
            send_email(
                to=lead.email,
                subject=f"안녕하세요 {lead.name}님",
                body=get_template('follow_up').render(lead=lead)
            )
            
            lead.last_contact = datetime.now()
            lead.save()

# 매일 실행
schedule.every().day.at("09:00").do(automate_follow_up)
```

### 리드 자동 할당
```python
def auto_assign_lead(lead):
    """지역/산업별 영업 담당자 자동 할당"""
    # 지역별 담당자
    region_owners = {
        'Seoul': 'sales_seoul@company.com',
        'Busan': 'sales_busan@company.com',
    }
    
    # 산업별 전문가
    industry_experts = {
        'IT': 'sales_it@company.com',
        'Healthcare': 'sales_healthcare@company.com',
    }
    
    # 1순위: 산업 전문가
    if lead.industry in industry_experts:
        owner = industry_experts[lead.industry]
    # 2순위: 지역 담당자
    elif lead.region in region_owners:
        owner = region_owners[lead.region]
    # 3순위: Round Robin
    else:
        owner = get_least_busy_sales()
    
    lead.owner = owner
    lead.save()
    
    # 담당자에게 알림
    send_notification(owner, f"새 리드 배정: {lead.name}")
```

## 🎯 주요 CRM 솔루션

| CRM | 특징 | 적합 대상 |
|-----|------|----------|
| **Salesforce** | 가장 강력, 비쌈 | 대기업 |
| **HubSpot** | 무료 플랜, 마케팅 통합 | 중소기업 |
| **Pipedrive** | 영업 중심, 직관적 | 영업팀 |
| **Zoho CRM** | 저렴, 기능 풍부 | 스타트업 |
| **Microsoft Dynamics** | Office 365 통합 | MS 생태계 |

## 💡 CRM API 연동

### Salesforce API
```python
from simple_salesforce import Salesforce

# 연결
sf = Salesforce(
    username='user@company.com',
    password='password',
    security_token='token'
)

# 리드 생성
lead = sf.Lead.create({
    'FirstName': 'John',
    'LastName': 'Doe',
    'Company': 'Acme Corp',
    'Email': 'john@acme.com',
    'LeadSource': 'Web'
})

# 연락처 조회
contacts = sf.query("SELECT Id, Name, Email FROM Contact WHERE Company = 'Acme Corp'")

for contact in contacts['records']:
    print(f"{contact['Name']}: {contact['Email']}")

# 거래 업데이트
sf.Opportunity.update('006...', {
    'StageName': 'Closed Won',
    'Amount': 100000
})
```

### HubSpot API
```python
import requests

API_KEY = 'your_hubspot_api_key'

# 연락처 생성
response = requests.post(
    'https://api.hubapi.com/crm/v3/objects/contacts',
    headers={'Authorization': f'Bearer {API_KEY}'},
    json={
        'properties': {
            'email': 'john@example.com',
            'firstname': 'John',
            'lastname': 'Doe',
            'company': 'Acme Corp'
        }
    }
)

contact_id = response.json()['id']

# 거래 생성
deal = requests.post(
    'https://api.hubapi.com/crm/v3/objects/deals',
    headers={'Authorization': f'Bearer {API_KEY}'},
    json={
        'properties': {
            'dealname': 'New Deal',
            'amount': '50000',
            'dealstage': 'qualifiedtobuy'
        }
    }
)
```

## 📊 CRM 분석

```python
# 월별 매출 추이
import pandas as pd

deals = Deal.objects.filter(stage='closed_won')
df = pd.DataFrame(list(deals.values('close_date', 'amount')))

monthly_revenue = df.groupby(
    df['close_date'].dt.to_period('M')
)['amount'].sum()

# 전환율 분석
total_leads = Lead.objects.count()
converted = Deal.objects.filter(stage='closed_won').count()
conversion_rate = (converted / total_leads) * 100

print(f"전환율: {conversion_rate:.1f}%")
```

## 🔗 관련 용어

- [[Marketing Automation]]: CRM과 통합
- [[Sales Pipeline]]: CRM 핵심 기능
- [[Customer Data Platform]]: CRM 데이터 활용

---
*카테고리: 비즈니스*
*생성일: 2026-02-14*
