# Namespace (Kubernetes) (쿠버네티스 이름공간)

## 📝 정의

Namespace는 **한 클러스터 안을 이름이 안 겹치는 칸으로 나눈 것**이다.

쿠버네티스 문서는 이 말을 "하나의 클러스터 안에서 자원 무리를 격리하는 장치" 라고 적고, 바로 이어서 조건을 붙인다 — 이름은 한 칸 안에서만 유일하면 되고, 칸 밖에 사는 것들에는 이 규칙이 안 걸린다. 리눅스 커널의 [[Linux Namespace]] 와 이름만 같고 다른 개념이다.

### 이름
Name :: 이름
Space :: 미치는 범위
= 붙여 읽으면 "이름이 통하는 범위". 그 범위 안에서만 하나뿐이면 된다

### 비유
아파트 동 번호와 같다 — 101호는 여러 동에 다 있어도 한 동 안에 101호가 둘일 수는 없다.

### 예
파드 목록을 불렀는데 아무것도 안 나와서 한참 헤매다, 칸 이름을 안 붙였다는 걸 깨달은 그 순간이다.

## 🖼️ 그림으로 보기

```도해
층: 이름이 겹치면 안 되는 범위는 어디까지인가
클러스터 :: 노드·PersistentVolume·StorageClass 는 칸 밖에 산다
Namespace :: 칸 하나. 이 안에서만 이름이 안 겹치면 된다
파드·Service :: 반드시 한 칸에 속한다. 옆 칸에 같은 이름이 있어도 된다
= 가운데가 칸이다. 위는 칸을 안 쓰고 아래는 반드시 어느 한 칸에 든다
```

## ⚠️ 해결하는 문제

```도해
대조: 칸을 안 나누면 한 클러스터에서 무엇이 곤란해지나
칸 없이 || 칸을 나누면
같은 이름 :: 팀끼리 부딪힌다 || 칸마다 따로 산다
권한 주기 :: 전부 아니면 전무 || 이 칸만 열어 준다
자원 나누기 :: 먼저 쓰는 쪽이 임자 || 칸마다 상한을 건다
= 이름·권한·자원을 한 칸 단위로 자를 수 있게 되는 것이 나누는 이유다
```

클러스터 하나를 여러 팀이 같이 쓰면 `api` 라는 이름은 금세 동난다. 이름이 부딪히면 팀마다 `team-a-api` 처럼 앞머리를 붙이기 시작하는데, 이건 규칙이 아니라 관습이라 지키는 사람만 지킨다.

칸을 나누면 이 문제가 **이름에서 그치지 않는다.** RoleBinding 도 ResourceQuota 도 칸 하나에 걸리는 물건이라, 칸이 생기는 순간 "이 팀은 여기만 만질 수 있고 여기까지만 쓸 수 있다" 가 한 번에 정해진다. 칸은 이름을 위한 것이 아니라 권한과 몫을 자르는 단위다.

## ⚙️ 작동 원리

칸 이름은 그대로 DNS 이름에 들어간다. Service 를 만들면 `<서비스>.<칸>.svc.cluster.local` 이 생기고, 같은 칸에서는 앞부분만 불러도 닿는다. 다른 칸을 부를 때만 칸 이름을 같이 적는다. 그래서 개발 칸의 앱이 운영 칸 DB 를 부르는 사고는 오타 한 글자로도 일어난다.

무엇이 칸에 속하는지는 물어보면 나온다. `kubectl api-resources --namespaced=true` 는 칸 안에 사는 것들을, `--namespaced=false` 는 칸 밖에 사는 것들(노드, PersistentVolume, StorageClass, 그리고 Namespace 자신)을 나열한다. 장애 때 "왜 이건 칸을 붙여도 안 잡히나" 를 5초에 답하는 명령이다.

일할 때는 기본 칸을 아예 바꿔 두는 편이 안전하다. `kubectl config set-context --current --namespace=production` 을 걸어 두면 `-n` 을 잊어도 `default` 를 보지 않는다. 지금 어디를 보고 있는지는 `kubectl config view --minify | grep namespace:` 로 확인한다.

## 📊 비교: 처음부터 있는 네 칸은 무엇인가

| 칸 | 무엇이 들어 있나 | 어떻게 대하나 |
|---|---|---|
| `default` | 칸을 안 정하면 여기로 간다 | 운영 클러스터에서는 쓰지 말라고 문서가 적는다 |
| `kube-system` | 쿠버네티스가 만든 것들. `coredns`, `metrics-server` | 여기에 내 앱을 올리지 않는다 |
| `kube-node-lease` | 노드마다 하나씩 있는 Lease | 노드가 살아 있다고 알리는 자리. 손대지 않는다 |
| `kube-public` | 아무나 읽을 수 있는 자리 | 거의 안 쓴다 |

## 💡 실제 사례

- **환경 가르기** — `dev`·`staging`·`prod` 를 한 클러스터의 세 칸으로 두면 같은 이름의 Deployment 를 셋 다 띄울 수 있다.
- **권한 자르기** — RoleBinding 은 칸 하나에만 걸린다. 팀에게 자기 칸만 열어 주면 옆 칸은 목록조차 못 본다.
- **몫 정하기** — ResourceQuota 를 칸에 걸면 그 칸이 통틀어 쓸 수 있는 CPU 와 메모리 총량이 정해진다.

## 🚫 흔한 오해

- **칸을 나누면 서로 못 부른다** — 기본값은 다 뚫려 있다. `<서비스>.<칸>.svc.cluster.local` 로 옆 칸을 그냥 부른다. 막으려면 NetworkPolicy 를 따로 건다.
- **칸을 지우면 목록에서만 사라진다** — 그 안의 파드·Service·Secret 이 전부 같이 지워진다. 문서가 지우기 항목에 "이 명령은 그 칸 아래의 **모든 것**을 지운다" 는 경고를 달아 두었다. 명령이 돌아왔다고 끝난 것도 아니다 — 지우기는 비동기라 한동안 `Terminating` 으로 남는다.
- **팀이 셋이면 칸도 셋으로 나눠야 한다** — 문서는 사용자가 몇 명에서 수십 명 수준이면 굳이 나눌 필요가 없다고 적는다. 살짝 다른 것을 가르는 데는 칸이 아니라 라벨을 쓰라고 한다.

## 🚨 주의사항

- **칸 이름을 `com`, `org` 같은 최상위 도메인으로 짓지 마라.** 칸 이름이 DNS 이름의 한 조각이 되기 때문에, 바깥 `example.com` 을 부르려던 것이 클러스터 안 서비스로 새어 들어갈 수 있다고 문서가 경고한다.
- **`kube-` 로 시작하는 이름은 피한다.** 쿠버네티스가 예약해 둔 앞머리다.
- **지우는데 `Terminating` 에서 안 넘어가면 남은 물건이 있다는 뜻이다.** 칸 안에 정리가 안 끝난 자원이 있으면 칸이 그 상태로 멈춘다. 무엇이 남았는지부터 찾는다.

## 📝 정리

**"이름이 통하는 칸"** 이라고 읽으면 된다. 칸 안에서만 이름이 하나면 되니 팀마다 같은 이름을 써도 안 부딪히고, 권한과 몫도 칸 단위로 걸린다. 다만 칸은 벽이 아니라 이름표라서, 오가는 것을 막으려면 NetworkPolicy 를 따로 세워야 한다.

## 🧒 열 살에게

아파트에서 101호는 동마다 다 있지? 그래도 안 헷갈리는 건 같은 동 안에 101호가 하나뿐이기 때문이야. 다른 동 친구를 부르려면 동 이름까지 같이 말해야 하고.

## ❓ 이해했는지

- 파드 목록이 비어 보이는데 실제로는 돌고 있는 일은 왜 생기나 → 작동 원리
- 칸을 나눴는데도 옆 칸 서비스가 그냥 불리는 이유는 무엇인가 → 흔한 오해
- 노드와 PersistentVolume 은 왜 칸 이름을 붙여도 안 잡히나 → 그림

## 🔗 관련 용어

- [[Kubernetes]] — 이 칸을 두는 클러스터 쪽
- [[Pod]] — 반드시 어느 한 칸에 속하는 대표적인 것
- [[Service (Kubernetes)]] — 칸 이름이 그대로 DNS 이름에 들어가는 쪽
- [[RBAC]] — 칸 하나만 열어 주는 권한을 거는 방법
- [[Linux Namespace]] — 이름만 같고 층이 다른 리눅스 커널 쪽 개념

---

**출처**

- [Namespaces — Kubernetes Documentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) — "한 클러스터 안에서 자원 무리를 격리하는 장치" 라는 정의와 칸 밖에 사는 것들(Node·PersistentVolume·StorageClass), 처음부터 있는 네 칸, `<service>.<namespace>.svc.cluster.local`, `api-resources --namespaced`, `config set-context --current --namespace`, 최상위 도메인 이름 경고, `kube-` 앞머리를 피하라는 주석, 수십 명 규모면 칸 대신 라벨을 쓰라는 권고를 확인했다
- [Namespaces Walkthrough — Kubernetes Documentation](https://kubernetes.io/docs/tasks/administer-cluster/namespaces/) — 칸을 지우면 "그 칸 아래의 모든 것" 이 지워진다는 경고와, 지우기가 비동기라 한동안 `Terminating` 으로 보인다는 서술을 확인했다
- [Azure Kubernetes Service (AKS) core concepts — Microsoft Learn](https://learn.microsoft.com/en-us/azure/aks/core-aks-concepts) — `default`·`kube-node-lease`·`kube-public`·`kube-system` 의 쓰임과 `kube-system` 에 앱을 올리지 말라는 권고를 확인했다
