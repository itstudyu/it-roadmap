# Deployment (Kubernetes) (디플로이먼트)

## 📝 정의

Deployment는 **적어 둔 대로 파드 개수와 판을 맞춰 주는 것**이다.

쿠버네티스 문서는 Deployment 를 "파드와 ReplicaSet 에 대한 선언적 갱신을 제공한다" 고 적는다. 원하는 상태를 적어 두면 컨트롤러가 실제 상태를 거기에 맞춰 간다는 뜻이다. 맞추는 속도까지 정해져 있어서, 한꺼번에 갈아엎지 않고 정해진 만큼씩만 바꾼다.

### 이름
Deploy :: 펼쳐 놓다
-ment :: 그 일의 결과
= 붙여 읽으면 "펼쳐 놓은 상태". 몇 개를 어떤 판으로 펼쳐 둘지 적어 둔 종이다

### 비유
식당 매니저에게 "홀에는 늘 세 명" 이라고만 말해 두면 누가 빠지든 알아서 채워 넣는 것과 같다.

### 예
새 판을 올렸는데 사이트는 한 번도 안 끊기고 어느새 새 화면으로 바뀌어 있던 그 순간이다.

## 🖼️ 그림으로 보기

```도해
층: 파드 하나가 뜨기까지 누가 누구를 만드나
Deployment :: 몇 개를 어떤 판으로 띄울지 적힌 종이
ReplicaSet :: 판 하나에 하나씩. 그 판의 개수를 지킨다
Pod :: 실제로 도는 것. 죽으면 그 자리에 새로 태어난다
= 위는 원하는 상태를 적고, 아래로 갈수록 지금 실제로 도는 것에 가깝다
```

## ⚠️ 해결하는 문제

```도해
대조: 파드를 손으로 띄우면 무엇이 달라지나
손으로 띄우면 || Deployment 로
한 대가 죽음 :: 그만큼 줄어든다 || 곧 다시 채운다
새 판 올리기 :: 하나씩 지웠다 만듦 || 알아서 갈아낀다
잘못 올렸을 때 :: 옛 판을 다시 찾음 || 한 줄로 되돌린다
= 원하는 상태만 적어 두면, 지금 상태를 거기 맞추는 일은 맡길 수 있다
```

파드를 손으로 하나씩 띄우면 개수를 사람이 세야 한다. 노드 한 대가 빠져서 파드 둘이 사라져도 아무도 다시 만들어 주지 않고, 새 판을 올릴 때는 옛 파드를 지우고 새 파드를 띄우는 순서를 손으로 짜야 한다. 그 사이 몇 초 동안은 받을 파드가 없다.

Deployment 는 **"지금 어떻게 하라"가 아니라 "결과가 어때야 하는지"를 적는 자리**다. `replicas: 3` 이라고 적어 두면 셋이 될 때까지 컨트롤러가 계속 손을 대고, 이미지 이름만 바꿔 올리면 갈아 끼우는 절차는 컨트롤러가 짠다. 사람이 명령을 짜는 대신 상태를 적는다.

## ⚙️ 작동 원리

```도해
흐름: 적어 둔 종이 한 장이 어떻게 실제 파드 수가 되나
적어 올리기 :: `replicas: 3` 과 파드 틀을 적어 올린다
견주기 :: 적힌 것과 지금 도는 것을 맞대 본다
묶음 조정 :: 모자라면 ReplicaSet 을 키우고 남으면 줄인다
자기 것 표시 :: 만든 것에 제 이름을 박아 남의 파드와 안 섞는다
@ 다시 견주기 :: 무엇이 바뀌든 이 맞댐을 되풀이한다
= 한 번 내리는 명령이 아니라, 끝나지 않는 맞춤이다
```

컨트롤러가 하는 일은 명령 수행이 아니라 **맞춤**이다. `replicas: 3` 은 "셋을 만들어라" 가 아니라 "셋인 상태를 유지해라" 라서, 파드가 죽든 노드가 빠지든 다시 셋이 될 때까지 계속 손을 댄다. 어느 파드가 제 것인지는 `selector` 에 적은 라벨로 알아보고, 그 라벨은 파드 틀의 라벨과 반드시 맞아야 한다.

판마다 ReplicaSet 을 따로 두는 것이 되돌리기의 열쇠다. 컨트롤러는 파드 틀을 해시해 `pod-template-hash` 라벨을 붙이고, 그 해시가 다르면 다른 묶음이 된다. 그래서 `kubectl get rs` 를 치면 0개짜리 옛 묶음들이 줄줄이 남아 있고 `kubectl rollout history` 에 판 번호가 쌓인다. 몇 판까지 남길지는 `revisionHistoryLimit` 이 정하고 기본값은 10이다. 되돌리기가 이미지를 다시 받아 오는 일이 아니라 남은 묶음 하나를 도로 키우는 일로 끝나는 이유가 이것이다.

어떻게 갈아 끼울지는 `.spec.strategy` 한 줄이 정한다. 기본값인 `RollingUpdate` 는 새 묶음을 조금 키우고 옛 묶음을 조금 줄이며 겹쳐 가고, `Recreate` 로 두면 옛 파드를 전부 죽인 다음에 새것을 만든다. 겹치는 폭을 정하는 두 손잡이는 [[Rolling Update]] 편에서 잰다.

## 📊 비교: 세 가지 워크로드는 무엇이 다른가

| 무엇 | 파드를 어떻게 세나 | 언제 쓰나 |
|---|---|---|
| **Deployment** | 개수로 센다 (`replicas: 3`) | 서로 갈아 껴도 되는 앱 |
| **StatefulSet** | 개수로 세되 이름이 고정 (`web-0`) | 제 이름과 제 디스크가 필요한 앱 |
| **DaemonSet** | 세지 않는다. 노드마다 하나 | 노드마다 하나여야 뜻이 있는 것 |

## 💡 실제 사례

- **개수를 정해 두고 잊기** — 노드 한 대가 빠져 파드 둘이 사라져도 곧 다른 노드에 둘이 새로 뜬다. 사람이 세어서 채운 적은 한 번도 없다.
- **되돌릴 자리를 미리 남겨 두기** — `kubectl rollout history` 에 판이 줄줄이 남아 있어서, 새 판이 이상하면 `kubectl rollout undo` 한 줄로 직전 묶음이 도로 커진다. `--to-revision 3` 으로 특정 판을 집을 수도 있다.
- **사람이 몰리는 시간** — `kubectl scale deployment/web --replicas=10` 으로 숫자만 올린다. 파드 틀이 안 바뀌었으니 새 묶음도 안 생기고 갈아 끼우기도 안 일어난다.

## 🚫 흔한 오해

- **Deployment 가 파드를 직접 만든다** — 아니다. 판마다 ReplicaSet 을 하나 만들고, 파드는 그 ReplicaSet 이 만든다. `kubectl get rs` 를 치면 0개짜리 옛 묶음들이 그대로 보인다.
- **`kubectl apply` 가 끝나면 배포가 끝난 것이다** — apply 는 "적어 뒀다" 까지다. 실제로 다 갈렸는지는 `kubectl rollout status` 가 끝나야 알고, 여기서 막혀 있는데 성공으로 알고 넘어가는 사고가 흔하다.
- **무슨 앱이든 Deployment 로 띄우면 된다** — 파드마다 제 이름과 제 디스크를 들고 있어야 하는 앱은 StatefulSet 쪽이다. Deployment 의 파드는 서로 갈아 껴도 되는 것들이라는 전제 위에 서 있다.

## 🚨 주의사항

- **`selector` 는 만든 뒤에 못 고친다.** 라벨 체계를 바꾸려면 지우고 다시 만들어야 한다. 처음 적을 때 신중히 정한다.
- **`kubectl rollout status` 가 안 끝나면 그대로 두지 마라.** 새 파드가 `ImagePullBackOff` 나 `CrashLoopBackOff` 면 옛 파드는 그대로 살아 있어서 서비스는 멀쩡해 보인다. 반쯤 걸린 상태로 며칠 가는 일이 있다.
- **`pod-template-hash` 라벨은 손대지 않는다.** 컨트롤러가 묶음을 가르는 열쇠라, 손대면 묶음이 서로 겹쳐 파드를 빼앗는다.

## 📝 정리

**"몇 개를 어떤 판으로 띄울지 적어 두는 종이"** 라고 읽으면 된다. 적어 두면 맞추는 일은 컨트롤러가 하고, 판마다 묶음을 따로 남기기 때문에 되돌리기가 옛 묶음을 다시 키우는 일로 끝난다.

## 🧒 열 살에게

식당에서 "홀에는 늘 세 명" 이라고 정해 두면, 한 명이 아파서 빠져도 매니저가 알아서 다른 사람을 넣어 주지? 새 옷으로 갈아입힐 때도 다 같이 벗기지 않고 한 명씩 갈아입혀서 손님은 끊김을 못 느껴.

## ❓ 이해했는지

- 파드 한 대가 죽었는데 아무도 손대지 않아도 다시 늘어나는 이유는 무엇인가 → 해결하는 문제
- 되돌리기가 이미지를 다시 받지 않고도 끝나는 이유는 무엇인가 → 작동 원리
- 파드마다 제 디스크가 있어야 하는 앱을 이걸로 띄우면 왜 곤란한가 → 흔한 오해

## 🔗 관련 용어

- [[Pod]] — Deployment 가 개수를 맞추는 대상
- [[Rolling Update]] — 겹쳐 가며 갈아 끼우는 그 방식
- [[Rollback]] — 옛 묶음을 도로 키워 되돌리는 일
- [[StatefulSet]] — 파드마다 이름과 디스크가 필요할 때 쓰는 다른 쪽
- [[Horizontal Pod Autoscaler]] — `replicas` 숫자를 자동으로 올리고 내리는 쪽

---

**출처**

- [Deployments — Kubernetes Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) — "파드와 ReplicaSet 에 대한 선언적 갱신" 이라는 정의, Deployment→ReplicaSet→Pod 관계, `pod-template-hash` 라벨이 묶음을 가른다는 서술, `rollout status/undo/history` 를 확인했다
- [Deployment — Kubernetes API Reference](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/deployment-v1/) — `.spec.strategy` 가 `Recreate`/`RollingUpdate` 이고 기본이 `RollingUpdate` 라는 것, `revisionHistoryLimit` 기본 10, `selector` 가 파드 틀 라벨과 맞아야 한다는 규칙을 확인했다
- [Perform a rolling update — Google Kubernetes Engine](https://docs.cloud.google.com/kubernetes-engine/docs/how-to/updating-apps) — 갱신이 `spec: template` 변경으로 촉발된다는 것과 `rollout pause/resume`, `undo --to-revision` 을 확인했다
