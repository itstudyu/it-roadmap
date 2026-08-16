# Azure (Microsoft Azure)

## 📝 정의

Azure(Microsoft Azure)는 **Microsoft가 제공하는 클라우드 컴퓨팅 플랫폼**으로, 200개 이상의 제품과 서비스를 제공합니다.

### 핵심 개념

- **무엇인가?**: Microsoft 클라우드 플랫폼
- **왜 필요한가?**: 온프레미스 서버 → 유지보수 비용, 확장 어려움
- **어떻게 작동하나?**: 전 세계 60개 이상 리전에서 서비스 제공

### Azure가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 온프레미스 서버
회사 서버실 구축 → 1억원
전기/냉방/관리 인력 → 월 1천만원
재해 복구 계획 → 별도 구축 필요
→ 막대한 비용! 😱
```

**Azure의 해결**:
```
✅ 클라우드로 이전:
필요한 리소스만 사용
자동 백업 및 재해 복구
글로벌 확장 용이
→ 비용 절감 + 유연성! ✅
```

**비유**:
- **온프레미스** = 자가 발전소 (초기 투자 큼)
- **Azure** = 전력 회사 사용 (사용량만큼만 지불)

## 💡 Virtual Machines (가상머신)

### VM 생성
```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.compute import ComputeManagementClient

# 인증
credential = DefaultAzureCredential()
compute_client = ComputeManagementClient(credential, subscription_id)

# VM 생성
vm_parameters = {
    'location': 'koreacentral',
    'hardware_profile': {
        'vm_size': 'Standard_B1s'  # 기본 tier
    },
    'storage_profile': {
        'image_reference': {
            'publisher': 'Canonical',
            'offer': 'UbuntuServer',
            'sku': '18.04-LTS',
            'version': 'latest'
        }
    },
    'os_profile': {
        'computer_name': 'myVM',
        'admin_username': 'azureuser',
        'admin_password': 'MyPassword123!'
    },
    'network_profile': {
        'network_interfaces': [{
            'id': nic_id
        }]
    }
}

# 비동기 생성
async_vm_creation = compute_client.virtual_machines.begin_create_or_update(
    resource_group_name,
    'myVM',
    vm_parameters
)

vm = async_vm_creation.result()
print(f"VM created: {vm.id}")
```

## 💡 Blob Storage (객체 스토리지)

### 파일 업로드/다운로드
```python
from azure.storage.blob import BlobServiceClient

# 연결
connection_string = "DefaultEndpointsProtocol=https;AccountName=..."
blob_service = BlobServiceClient.from_connection_string(connection_string)

# 컨테이너 생성
container_client = blob_service.create_container("mycontainer")

# 파일 업로드
with open("local_file.txt", "rb") as data:
    blob_client = blob_service.get_blob_client(
        container="mycontainer",
        blob="remote_file.txt"
    )
    blob_client.upload_blob(data, overwrite=True)

# 파일 다운로드
blob_client = blob_service.get_blob_client(
    container="mycontainer",
    blob="remote_file.txt"
)

with open("downloaded.txt", "wb") as download_file:
    download_file.write(blob_client.download_blob().readall())

# 파일 목록
container_client = blob_service.get_container_client("mycontainer")
for blob in container_client.list_blobs():
    print(f"Blob: {blob.name}")
```

## 💡 Azure Functions (서버리스)

### HTTP 트리거 함수
```python
# __init__.py
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    HTTP 요청 시 자동 실행
    서버 관리 불필요
    """
    name = req.params.get('name')
    
    if not name:
        try:
            req_body = req.get_json()
            name = req_body.get('name')
        except ValueError:
            pass
    
    if name:
        return func.HttpResponse(
            f"Hello, {name}!",
            status_code=200
        )
    else:
        return func.HttpResponse(
            "Please pass a name",
            status_code=400
        )
```

### 타이머 트리거
```python
# function.json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "mytimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */5 * * * *"  # 5분마다
    }
  ]
}

# __init__.py
import logging

def main(mytimer):
    """5분마다 자동 실행"""
    logging.info('Python timer trigger function executed')
    
    # 정기 작업 수행
    cleanup_old_data()
```

## 💡 Azure SQL Database

### 데이터베이스 연결
```python
import pyodbc

# 연결 문자열
server = 'myserver.database.windows.net'
database = 'mydb'
username = 'admin'
password = 'MyPassword123!'

connection_string = (
    f'DRIVER={{ODBC Driver 17 for SQL Server}};'
    f'SERVER={server};'
    f'DATABASE={database};'
    f'UID={username};'
    f'PWD={password}'
)

# 연결
conn = pyodbc.connect(connection_string)
cursor = conn.cursor()

# 쿼리 실행
cursor.execute("""
    CREATE TABLE users (
        id INT PRIMARY KEY IDENTITY,
        username NVARCHAR(50),
        email NVARCHAR(100)
    )
""")

# 데이터 삽입
cursor.execute(
    "INSERT INTO users (username, email) VALUES (?, ?)",
    ('john', 'john@example.com')
)
conn.commit()

# 조회
cursor.execute("SELECT * FROM users")
for row in cursor:
    print(f"{row.id}: {row.username}")
```

## 💡 Cosmos DB (NoSQL)

### 문서 저장/조회
```python
from azure.cosmos import CosmosClient

# 연결
endpoint = "https://myaccount.documents.azure.com:443/"
key = "your-key-here"

client = CosmosClient(endpoint, key)

# 데이터베이스 및 컨테이너
database = client.create_database_if_not_exists(id="mydb")
container = database.create_container_if_not_exists(
    id="users",
    partition_key="/username"
)

# 문서 생성
user = {
    'id': 'user123',
    'username': 'john',
    'email': 'john@example.com',
    'age': 30
}
container.create_item(body=user)

# 문서 조회
user = container.read_item(
    item='user123',
    partition_key='john'
)

# 쿼리
query = "SELECT * FROM c WHERE c.age > @age"
items = container.query_items(
    query=query,
    parameters=[{"name": "@age", "value": 25}],
    enable_cross_partition_query=True
)

for item in items:
    print(f"{item['username']}: {item['age']}")
```

## 💡 Azure OpenAI Service

### GPT-4 사용
```python
import openai

# Azure OpenAI 설정
openai.api_type = "azure"
openai.api_base = "https://myresource.openai.azure.com/"
openai.api_version = "2023-05-15"
openai.api_key = "your-key-here"

# GPT-4 호출
response = openai.ChatCompletion.create(
    engine="gpt-4",  # 배포 이름
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain Azure in simple terms"}
    ],
    temperature=0.7,
    max_tokens=500
)

answer = response['choices'][0]['message']['content']
print(answer)
```

## 💡 Azure DevOps Pipelines

### CI/CD 파이프라인
```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
# 코드 체크아웃
- checkout: self

# Python 설정
- task: UsePythonVersion@0
  inputs:
    versionSpec: '3.9'

# 의존성 설치
- script: |
    pip install -r requirements.txt
  displayName: 'Install dependencies'

# 테스트 실행
- script: |
    pytest tests/
  displayName: 'Run tests'

# Docker 이미지 빌드
- task: Docker@2
  inputs:
    command: 'build'
    Dockerfile: '**/Dockerfile'
    tags: |
      $(Build.BuildId)

# Azure App Service 배포
- task: AzureWebApp@1
  inputs:
    azureSubscription: 'MySubscription'
    appName: 'myapp'
    package: '$(System.DefaultWorkingDirectory)/**/*.zip'
```

## 🎯 Azure vs AWS 비교

| 서비스 | Azure | AWS |
|--------|-------|-----|
| **가상머신** | Virtual Machines | EC2 |
| **서버리스** | Azure Functions | Lambda |
| **객체 스토리지** | Blob Storage | S3 |
| **관계형 DB** | Azure SQL | RDS |
| **NoSQL** | Cosmos DB | DynamoDB |
| **Kubernetes** | AKS | EKS |
| **AI/LLM** | Azure OpenAI | Bedrock |

## 💡 Azure CLI

```bash
# 로그인
az login

# 리소스 그룹 생성
az group create --name myResourceGroup --location koreacentral

# VM 생성
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys

# 스토리지 계정 생성
az storage account create \
  --name mystorageaccount \
  --resource-group myResourceGroup \
  --location koreacentral \
  --sku Standard_LRS

# 리소스 목록
az resource list --output table
```

## 🔗 관련 용어

- [[AWS]]: Amazon 클라우드
- [[클라우드 컴퓨팅]]: 클라우드 개념
- [[Kubernetes]]: AKS 기반 기술

---
*카테고리: 클라우드*
*생성일: 2026-02-14*
