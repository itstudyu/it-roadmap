# Git Flow (깃 플로)

## 📝 정의

Git Flow는 **기능을 모아 두었다가 판으로 묶어 내보내는 분기 모델**이다.

AWS 문서는 이 모델을 "여러 가지를 써서 코드를 개발에서 운영까지 옮기는 분기 모델" 로 정의하고, 릴리스 주기가 정해져 있고 여러 기능을 묶어 하나의 판으로 정의해야 하는 팀에 맞는다고 적는다. 2010년에 나온 "A successful Git branching model" 이라는 글에서 온 모델이라는 것은 트렁크 기반 개발 쪽 규범 문서가 그림의 출처로 밝혀 두었다.

### 이름
Git :: 이력을 남기는 도구
Flow :: 정해진 물길
= 붙여 읽으면 "이력이 흐르는 정해진 물길". 어느 가지에서 어느 가지로 갈 수 있는지가 미리 정해져 있다

### 비유
잡지 한 호. 기사는 저마다 따로 쓰지만 아무 때나 찍지 않고 마감날에 한 권으로 묶어 찍는다.

### 예
가지 목록에 develop 과 release/v1.4 가 나란히 있는 저장소를 열어 봤다면 그게 이 모델이다.

### 직접
쓰고 있는 오픈소스 저장소의 브랜치 목록을 열어, main 말고도 계속 남아 있는 가지가 또 있는지 보라.

## 🖼️ 그림으로 보기

```도해
층: Git Flow 에서 내가 고친 것은 어디를 거쳐 굳어지나
feature :: 지금 내가 고치는 자리. 다 되면 develop 으로
develop :: 다음 판에 나갈 기능이 쌓이는 상설 가지
release :: 판 번호를 붙여 떼어 낸 가지. 여기서 올린다
main :: 지금 운영에 돌고 있는 것. 상설 가지
= 위는 손이 닿는 자리, 아래는 굳은 자리다. 기능은 쌓였다가 판으로 묶여 내려간다
```

## ⚠️ 해결하는 문제

```도해
대조: 가지를 하나만 두면 무엇이 곤란해지나
가지 하나로만 || Git Flow 로
지난 판 고치기 :: 새 기능이 딸려감 || 그 판에서만 고침
내보낼 묶음 :: 경계가 흐리다 || 판 가지가 경계다
승인 관문 :: 합칠 때 한 번 || 환경마다 둔다
= 판을 여럿 떠받쳐야 할 때, 가지를 나눠 두는 값이 생긴다
```

가지를 하나만 두면 지금 만드는 것과 지금 돌고 있는 것이 한 자리에 겹친다. 지난 판을 쓰는 곳이 아직 있는데 그 판만 고쳐 내보내려 하면 그 사이에 들어온 새 기능까지 딸려 나가고, 이번 판이 어디까지인지도 이름으로 남지 않는다.

Git Flow 는 그 경계를 가지로 세운다. develop 은 다음 판에 나갈 것이 모이는 자리이고, 계획한 기능이 다 모이면 판 번호를 붙인 release 가지를 떼어 낸다. AWS 문서는 이 분리가 어떤 변경이 어느 환경으로 언제 넘어가는지에 대한 통제를 높인다고 적고, 판 가지는 시험·스테이징·운영 어느 환경으로도 보낼 수 있어 한 번 빌드한 것을 여러 번 올리는 방식이 된다고 설명한다.

## ⚙️ 작동 원리

```도해
흐름: 기능 하나가 운영에 닿기까지 어디를 지나나
feature :: develop 에서 떼어 내 혼자 고친다
develop :: 리뷰와 빌드를 통과한 기능이 쌓인다
release :: 계획한 기능이 다 모이면 번호를 붙여 뗀다
환경 관문 :: 시험·스테이징·운영마다 승인을 받고 올린다
main :: 운영 배포에 성공하면 여기로 합쳐진다
@ 다음 판 :: 판 가지를 develop 에도 합쳐 두고 다시 쌓는다
= 올라가는 길만 있는 게 아니라 도로 합쳐 놓는 길이 한 벌로 붙어 있다
```

올린 뒤에 되돌려 놓는 일이 이 모델의 절반이다. AWS 문서는 판 가지가 운영에 배포된 뒤 develop 과 main 양쪽으로 다시 합쳐야 한다고 적는다. 판을 검증하며 고친 것이 develop 에 안 들어가면 다음 판에서 같은 버그가 되살아나기 때문이다.

운영에서 급한 문제가 터지면 main 에서 hotfix 가지를 떼어 낸다. 고쳐서 시험한 뒤에는 main 에서 만든 판 가지를 거쳐 운영으로 올린다. 아직 안 나간 판에서 발견된 버그는 hotfix 가 아니라 그 판 가지에서 딴 bugfix 가지로 고친다 — 어디서 터졌느냐에 따라 어느 가지에서 떼어 낼지가 정해져 있다.

## 📊 비교: Git Flow vs Trunk Based Development

```도해
대조: 줄기를 하나만 둘까 둘로 나눌까
Trunk Based |=| Git Flow
상설 가지 :: 줄기 하나 || 둘을 늘 둔다
가지 수명 :: 이틀 안 || 판이 끝날 때까지
덜 된 기능 :: 플래그로 가린다 || 판에서 뺀다
내보내는 때 :: 언제든 || 정한 날짜에
= 자주 내보낼 팀은 줄기 하나, 판을 여럿 떠받칠 팀은 가지를 나눈다
```

트렁크 기반 개발 쪽 규범 문서는 Git Flow 를 여러 가지에서 개발자 무리가 동시에 일하는 분기 모델로 설명하고, 자기네 방식과 양립하지 않는다고 못 박는다. 짧은 수명 가지의 상한을 이틀로 두고 거기 붙는 사람도 한 명(짝지어 일하면 둘)으로 두는 쪽에서 보면, 판이 끝날 때까지 남는 가지는 그 자체가 문제다.

AWS 문서는 같은 성질을 반대편에서 본다. 여러 판을 동시에 운영에서 지원해야 하거나 릴리스 일정이 정해진 팀에는 이 모델이 맞고, 리뷰와 승인 관문이 여러 번 들어 있어 규제가 있는 조직에도 맞는다고 적는다. 대신 복잡하고 규칙을 엄격히 지켜야 하며, 빠르게 자주 내보내는 모델에는 맞지 않는다고 같은 문서가 못 박는다.

## 💡 실제 사례

- **판 가지를 뗀 뒤에 끝난 기능** — 이번 판에는 못 들어간다. 뗀 뒤로 그 가지에 넣는 것은 그 판의 버그 수정뿐이고, 그 기능은 develop 에서 다음 판을 기다린다.
- **두 판을 동시에 떠받칠 때** — 어떤 곳은 아직 지난 판을 쓰고 어떤 곳은 새 판을 쓴다. 지난 판 가지가 남아 있어 그 판에만 고친 것을 내보낼 수 있다.
- **운영에서 터진 급한 버그** — main 에서 hotfix 가지를 떼어 고치고, 판 가지를 거쳐 올린 뒤 develop 으로도 되돌려 놓는다.

## 🚫 흔한 오해

- **브랜치를 여러 개 쓰면 Git Flow 다** — 가지를 내고 오래 두는 것은 Git 이 주는 기능이고, Pro Git 도 안정된 것만 담는 가지와 아직 시험 중인 가지를 따로 오래 두는 방식을 설명한다. Git Flow 는 그 위에 어떤 가지를 상설로 둘지, 어느 가지에서 떼어 내 어디로 합칠지까지 정해 놓은 규칙이다.
- **일단 Git Flow 로 시작하는 게 안전하다** — AWS 문서가 단점으로 드는 자리가 그것이다. 배포를 자주 내보내는 모델에는 맞지 않고, 새 팀이 배우기에 복잡하며, 가지가 많아 서로 맞춰 두는 일 자체가 부담이 된다.
- **merge 로 붙일지 rebase 로 붙일지가 Git Flow 다** — 그건 두 가지를 어떻게 붙이느냐의 물음이고, Git Flow 는 어떤 가지가 있어야 하느냐의 물음이다. 층이 다르다.

## 📝 정리

**"판을 짜서 내보내려고 가지를 나눠 둔 그 규칙"** 이라고 읽으면 된다. main 과 develop 을 늘 두고, 기능은 develop 에 모았다가 판 번호를 붙인 가지로 떼어 내 환경마다 승인을 받으며 올리고, 올린 뒤에는 develop 으로 도로 합쳐 놓는다. 판을 여럿 떠받쳐야 하는 팀에는 이 값이 남고, 하루에도 여러 번 내보내는 팀에는 그냥 무거운 규칙이다.

## 🧒 열 살에게

반에서 문집을 만든다고 생각해 봐. 글은 저마다 따로 쓰지만 아무 때나 인쇄하지 않고, 마감날에 다 모아서 한 권으로 묶어 찍어. 찍고 나서 큰 실수가 나오면 그 쪽만 다시 찍어 끼우고, 다음 호 원고에도 똑같이 고쳐 둬야 그 실수가 안 되살아나.

## ❓ 이해했는지

- 급한 버그를 고쳐 올린 뒤에 develop 에도 같은 수정을 넣는 이유는 → 작동 원리
- 하루에도 여러 번 내보내는 팀에 이 모델이 무거워지는 이유는 무엇인가 → 흔한 오해
- 지난 판을 쓰는 곳이 아직 있을 때 이 모델이 무엇을 쉽게 해 주나 → 해결하는 문제

## 🔗 관련 용어

- [[Trunk Based Development]] — 같은 물음에 정반대로 답한 모델. 규범 문서가 둘은 양립하지 않는다고 적는다
- [[Git Branch]] — Git Flow 가 규칙을 얹는 그 장치. 가지를 내는 일 자체는 여기서 온다
- [[Merge vs Rebase]] — 가지를 어떻게 붙일지의 물음. Git Flow 는 어떤 가지를 둘지를 정한다
- [[Feature Flag]] — 줄기 하나로 갈 때 덜 된 기능을 가리는 장치. Git Flow 는 판 가지로 그 일을 대신한다
- [[Semantic Versioning]] — 판 가지 이름에 붙는 그 번호를 매기는 규칙

---

**출처**

- https://docs.aws.amazon.com/prescriptive-guidance/latest/choosing-git-branch-approach/gitflow-branching-strategy.html (Gitflow branching strategy — AWS Prescriptive Guidance)
- https://docs.aws.amazon.com/prescriptive-guidance/latest/choosing-git-branch-approach/branches-in-a-gitflow-strategy.html (Branches in a Gitflow strategy — AWS Prescriptive Guidance)
- https://docs.aws.amazon.com/prescriptive-guidance/latest/choosing-git-branch-approach/advantages-and-disadvantages-of-the-gitflow-strategy.html (Advantages and disadvantages of the Gitflow strategy — AWS Prescriptive Guidance)
- https://trunkbaseddevelopment.com/alternative-branching-models/ (Alternative Branching Models — Trunk Based Development)
- https://trunkbaseddevelopment.com/short-lived-feature-branches/ (Short-Lived Feature Branches — Trunk Based Development)
- https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows (Git Branching - Branching Workflows — Pro Git)
