# Service (Kubernetes) (쿠버네티스 서비스)

## 📝 정의

Service는 **자꾸 갈리는 파드 앞에 세워 둔 안 바뀌는 주소**다.

파드는 죽으면 그 자리에 새로 태어나고, 새로 태어난 파드는 새 IP 를 받는다. GKE 문서는 이 사정을 "Deployment 안의 파드는 들락날락하고 그 IP 주소는 바뀐다" 고 적는다. 부르는 쪽이 그 숫자를 붙잡고 있으면 반드시 끊긴다. Service 는 그 숫자를 대신 붙잡아 주는 자리다.

### 이름
Serve :: 남을 대신해 해 주다
-ice :: 그 일 자체
= 붙여 읽으면 "대신 해 주는 일". 지금 누가 살아 있는지 찾는 일을 대신 맡는다

### 비유
회사 대표번호와 같다 — 받는 사람이 매일 바뀌어도 거는 쪽은 늘 같은 번호를 누른다.

### 예
다른 팀에 붙을 주소를 물었더니 숫자 주소 대신 이름 한 줄만 돌아오던 그 순간이다.

## 🖼️ 그림으로 보기

```도해
흐름: 이름 하나를 불렀을 때 어느 파드까지 어떻게 닿나
부르는 쪽 :: `payment` 라는 이름으로 건다
클러스터 DNS :: 그 이름에 붙은 고정 IP 하나를 알려준다
노드 규칙 :: kube-proxy 가 깔아 둔 규칙이 그 IP 를 가로챈다
살아 있는 목록 :: EndpointSlice 에 적힌, 지금 뜬 파드 주소들
파드 하나 :: 그중 하나가 실제로 받는다
= 이름과 IP 는 안 바뀌고, 뒤에 적힌 주소 목록만 계속 갈린다
```

## ⚠️ 해결하는 문제

```도해
대조: 파드 주소를 직접 부르면 무엇이 달라지나
파드를 직접 || Service 를 통해
파드가 다시 뜸 :: 주소가 바뀐다 || 이름은 그대로다
개수를 늘림 :: 부르는 쪽을 고침 || 저절로 나눠 간다
한 대가 죽음 :: 그리로 계속 건다 || 목록에서 빠진다
= 파드는 갈리는 것이다. Service 는 그 앞에서 안 갈리는 이름 하나를 맡는다
```

파드 IP 를 설정 파일에 적어 두면 그날은 잘 돈다. 문제는 배포·노드 교체·오토스케일 어느 것으로든 파드가 다시 뜨는 순간이고, 그때 그 숫자는 아무 데도 안 닿는 숫자가 된다. 파드가 몇 개인지도 부르는 쪽이 알아야 한다.

Service 는 **"누구를 부를까" 와 "지금 누가 살아 있나" 를 갈라 놓는다.** 부르는 쪽은 이름만 알고, 살아 있는 목록은 라벨 선택기가 계속 다시 채운다. 파드가 갈리는 일과 부르는 쪽 설정은 그 순간부터 서로 상관없는 일이 된다.

## ⚙️ 작동 원리

Service 는 `selector` 에 적은 라벨을 다 가진 파드를 제 식구로 삼는다. 식구 목록은 EndpointSlice 라는 별도 객체에 적히고, 파드가 뜨고 질 때마다 컨트롤러가 이걸 다시 쓴다. Service 자체는 목록을 들고 있지 않다.

실제로 트래픽을 옮기는 것은 노드마다 도는 kube-proxy 다. kube-proxy 는 API 서버를 지켜보다가 Service 와 EndpointSlice 가 바뀌면 그 노드의 iptables(또는 IPVS) 규칙을 다시 깐다. 그래서 Service 의 IP 는 어느 기계에도 안 붙어 있는 가상 주소다. 그 IP 로 나간 패킷을 커널 규칙이 가로채 파드 IP 로 바꿔치기할 뿐이다.

포트는 두 개가 짝을 이룬다. `port` 는 부르는 쪽이 쓰는 번호, `targetPort` 는 파드가 실제로 듣는 번호다. 파드 쪽에 `name: http-web-svc` 처럼 이름을 붙여 두면 `targetPort` 에 숫자 대신 그 이름을 적을 수 있어서, 앱 포트가 바뀌어도 Service 를 안 고쳐도 된다.

## 📊 비교: 네 가지 `type` 은 누구를 들여보내나

| `type` | 누가 부르나 | 무엇이 생기나 |
|---|---|---|
| `ClusterIP` | 클러스터 안 | 안에서만 닿는 고정 IP. 기본값이다 |
| `NodePort` | 노드 IP 를 아는 쪽 | 모든 노드의 같은 포트가 열린다 |
| `LoadBalancer` | 바깥 | 클라우드 부하 분산기가 **하나씩** 붙는다. 요금도 하나씩 |
| `ExternalName` | 클러스터 안 | 바깥 도메인으로 넘기는 CNAME. 가로채는 규칙이 없다 |

여기에 `clusterIP: None` 인 머리 없는 Service 가 따로 있다. IP 하나로 묶지 않고 파드 주소를 그대로 DNS 로 내주는 방식이라, 어느 파드인지 골라 불러야 하는 앱이 쓴다.

## 💡 실제 사례

- **파드가 갈려도 안 끊긴다** — `kubectl get endpointslices` 를 보면 파드가 뜨고 질 때마다 주소 목록만 바뀌고 Service 의 IP 는 그대로다.
- **포트 사이 맞추기** — 앱은 8080 에서 듣는데 부르는 쪽은 80 을 쓴다면 `port: 80` 과 `targetPort: 8080` 으로 잇는다.
- **머리 없는 Service** — `clusterIP: None` 으로 두면 `web-0.nginx` 처럼 파드마다 이름이 생긴다. StatefulSet 이 반드시 짝으로 두는 것이 이것이다.

## 🚫 흔한 오해

- **Service 는 트래픽이 지나가는 장비다** — 지나가는 물건이 아니다. 노드마다 kube-proxy 가 깔아 둔 커널 규칙 뭉치이고, 그 규칙이 목적지 주소를 바꿔칠 뿐이다. 그래서 Service 가 죽어서 장애가 나는 일은 없다.
- **파드가 없으면 Service 가 에러를 낸다** — 조용하다. EndpointSlice 가 비어 있을 뿐이고, 부르는 쪽은 연결 거부나 시간 초과만 본다. `selector` 라벨 오타 한 글자로도 똑같은 증상이 나오므로, 안 붙으면 `kubectl get endpointslices` 부터 본다.
- **밖으로 내려면 전부 `type: LoadBalancer` 다** — 그 Service 하나마다 클라우드 부하 분산기와 요금이 하나씩 붙는다. 웹 여러 개를 한 주소 아래로 낼 거면 Ingress 가 맞다.

## 🚨 주의사항

- **만들자마자 식구가 붙었는지 확인해라.** `kubectl get endpointslices -l kubernetes.io/service-name=<이름>` 이 비어 있으면 라벨이 안 맞은 것이다. 아무 경고도 안 나온다.
- **환경 변수로 주입되는 주소는 파드가 뜬 시점의 것이다.** 파드보다 늦게 만든 Service 는 거기 없다. DNS 이름을 쓰는 편이 안전하다.
- **`ExternalName` 은 이름만 바꿔치기한다.** 프록시도 부하 분산도 없고 포트도 안 바꾼다. 바깥 주소를 안쪽 이름으로 부르고 싶을 때만 쓴다.

## 📝 정리

**"갈리는 것들 앞에 세워 둔 안 갈리는 이름"** 이라고 읽으면 된다. 뒤의 파드 목록은 계속 바뀌지만 이름과 IP 는 그대로라, 부르는 쪽은 상대가 몇 개인지도 어디 있는지도 몰라도 된다.

## 🧒 열 살에게

가게에 전화하면 그날 누가 받든 번호는 늘 같지? 안에서 일하는 사람이 바뀌어도 너는 같은 번호만 누르면 되고, 한 사람이 쉬는 날이면 전화가 저절로 다른 사람한테 넘어가.

## ❓ 이해했는지

- 파드가 새로 떴는데 부르는 쪽이 아무것도 안 고쳐도 되는 이유는 무엇인가 → 그림
- 붙긴 붙는데 연결 거부만 계속 날 때 제일 먼저 볼 곳은 어디인가 → 흔한 오해
- 바깥에서 들어오게 하려면 어떤 `type` 을 골라야 하나 → 비교

## 🔗 관련 용어

- [[Pod]] — Service 뒤에 서서 실제로 받는 것
- [[Ingress]] — 웹 요청 하나를 여러 Service 로 갈라 보내는 앞단
- [[DNS]] — Service 이름이 IP 로 풀리는 그 방식
- [[Load Balancer]] — `type: LoadBalancer` 가 클라우드에 만들어 달라고 하는 물건
- [[StatefulSet]] — 머리 없는 Service 를 반드시 짝으로 두는 쪽

---

**출처**

- [Service — Kubernetes Documentation](https://kubernetes.io/docs/concepts/services-networking/service/) — "파드는 오래 가는 것이 아니다" 라는 전제, `selector` 를 계속 훑어 EndpointSlice 를 다시 쓴다는 서술, `port`/`targetPort` 와 이름 붙인 포트, 네 가지 `type`, `clusterIP: None` 을 확인했다
- [Virtual IPs and Service Proxies — Kubernetes Documentation](https://kubernetes.io/docs/reference/networking/virtual-ips/) — kube-proxy 가 Service·EndpointSlice 변화를 지켜보다 노드의 iptables·IPVS·nftables 규칙을 다시 깐다는 서술과, Service 의 IP 가 어느 장치에도 안 붙은 가상 주소라는 것을 확인했다
- [Service — Google Kubernetes Engine](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/service) — "Deployment 안의 파드는 들락날락하고 IP 가 바뀐다", 라벨 선택기로 식구를 고른다는 것, 다섯 가지 유형 설명을 확인했다
