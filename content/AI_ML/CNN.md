# CNN (Convolutional Neural Network)

## 📝 정의

CNN(Convolutional Neural Network, 합성곱 신경망)은 **이미지 인식에 특화된 딥러닝 모델**로, 이미지의 패턴을 자동으로 학습합니다.

### 핵심 개념

- **무엇인가?**: 이미지의 특징을 추출하여 분류하는 신경망
- **왜 필요한가?**: 일반 신경망은 이미지의 공간 정보를 무시함
- **어떻게 작동하나?**: Convolution → Pooling → Fully Connected 레이어

### CNN이 해결하는 문제

**문제 상황**:
```
😱 시나리오: 일반 신경망으로 이미지 인식
이미지 100x100 픽셀 = 10,000개 입력
→ 모든 픽셀을 독립적으로 처리
→ "눈", "코", "입"의 위치 관계 무시
→ 정확도 낮음! 😱
```

**CNN의 해결**:
```
✅ 공간 정보 보존:
이미지 → Convolution 필터
→ 엣지, 코너, 패턴 자동 학습
→ "눈 2개 + 코 1개 + 입 1개" 위치 관계 학습
→ 높은 정확도! ✅
```

**비유**:
- **일반 신경망** = 퍼즐 조각을 랜덤하게 섞어서 맞추기
- **CNN** = 이웃한 조각부터 차례로 맞추기

## 💡 핵심 레이어

### 1. Convolution Layer (합성곱층)
```python
# 필터(커널)로 이미지 특징 추출
import numpy as np

def convolve(image, kernel):
    """
    image: 입력 이미지
    kernel: 3x3 필터
    """
    h, w = image.shape
    kh, kw = kernel.shape
    
    output = np.zeros((h - kh + 1, w - kw + 1))
    
    for i in range(h - kh + 1):
        for j in range(w - kw + 1):
            # 필터와 이미지 영역의 곱의 합
            output[i, j] = np.sum(
                image[i:i+kh, j:j+kw] * kernel
            )
    
    return output

# 엣지 검출 필터
edge_filter = np.array([
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1]
])

features = convolve(image, edge_filter)
```

### 2. Pooling Layer (풀링층)
```python
def max_pooling(image, pool_size=2):
    """
    이미지 크기 축소 (다운샘플링)
    2x2 영역에서 최댓값만 선택
    """
    h, w = image.shape
    
    output = np.zeros((h // pool_size, w // pool_size))
    
    for i in range(0, h, pool_size):
        for j in range(0, w, pool_size):
            # 2x2 영역에서 최댓값
            output[i//pool_size, j//pool_size] = np.max(
                image[i:i+pool_size, j:j+pool_size]
            )
    
    return output

# 사용
pooled = max_pooling(features, pool_size=2)
# 28x28 → 14x14 크기 축소
```

### 3. Fully Connected Layer
```python
# 최종 분류
# Flatten: 2D → 1D
# Dense: 완전 연결
output = softmax(flatten(pooled) @ weights + bias)
# → [0.9, 0.1]  # 90% 고양이, 10% 개
```

## 💡 PyTorch 구현

```python
import torch
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        
        # Convolution Layers
        self.conv1 = nn.Conv2d(
            in_channels=1,    # 흑백 이미지
            out_channels=32,  # 필터 32개
            kernel_size=3,    # 3x3 필터
            padding=1         # 크기 유지
        )
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        
        # Pooling Layer
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        
        # Fully Connected Layers
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, 10)  # 10개 클래스
        
        # Activation & Dropout
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.5)
    
    def forward(self, x):
        # Conv1 → ReLU → Pool
        x = self.pool(self.relu(self.conv1(x)))
        # 28x28 → 14x14
        
        # Conv2 → ReLU → Pool
        x = self.pool(self.relu(self.conv2(x)))
        # 14x14 → 7x7
        
        # Flatten
        x = x.view(-1, 64 * 7 * 7)
        
        # Fully Connected
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        
        return x

# 모델 생성 및 학습
model = SimpleCNN()

# 손실 함수 & 옵티마이저
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# 학습
for epoch in range(10):
    for images, labels in train_loader:
        # Forward
        outputs = model(images)
        loss = criterion(outputs, labels)
        
        # Backward
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    
    print(f"Epoch {epoch+1}, Loss: {loss.item():.4f}")
```

## 🎯 유명한 CNN 아키텍처

| 모델 | 연도 | 특징 |
|------|------|------|
| **LeNet-5** | 1998 | 최초의 CNN (손글씨 인식) |
| **AlexNet** | 2012 | ImageNet 우승, ReLU 사용 |
| **VGGNet** | 2014 | 깊은 네트워크 (16-19 layers) |
| **ResNet** | 2015 | Skip Connection (152 layers) |
| **EfficientNet** | 2019 | 효율적인 스케일링 |

## 💡 활용 사례

```python
# 얼굴 인식
from torchvision import models

# 사전 학습된 모델 사용
model = models.resnet50(pretrained=True)

# 이미지 분류
image = load_image('photo.jpg')
prediction = model(image)
# → "사람: 95%"

# 물체 감지
from torchvision.models.detection import fasterrcnn_resnet50_fpn

detector = fasterrcnn_resnet50_fpn(pretrained=True)
boxes, labels, scores = detector(image)
# → 자동차 3대, 사람 5명 감지
```

## 🔗 관련 용어

- [[RNN]]: 순차 데이터용 신경망
- [[Transfer Learning]]: 사전 학습 모델 활용
- [[Image Augmentation]]: 데이터 증강

---
*카테고리: AI-ML*
*생성일: 2026-02-14*
