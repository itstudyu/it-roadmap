# Pull Request (풀 리퀘스트)

## 📝 정의

풀 리퀘스트는 **변경을 합쳐 달라고 내는 제안**이다.

이름이 그대로 절차다 — 내 갈래를 당겨(pull) 가 달라는 요청(request)이다. git 에도 `git request-pull` 이라는 명령이 있지만, 그건 "이 커밋들을 이 주소에서 받아 가라" 는 요약문을 찍어 주는 데서 끝난다. 그 요청에 차이 화면과 토론과 리뷰와 병합 단추를 붙여 협업 절차로 만든 것이 GitHub 의 Pull Request 다.

### 비유
출판사에 넘기는 원고. 바로 책에 실리는 게 아니라, 편집자가 읽고 고칠 곳을 적어 준 뒤에 실린다.

## 🖼️ 그림으로 보기

```도해
흐름: 풀 리퀘스트를 열면 합쳐지기까지 무엇을 거치나
나 :: 가지에 고친 것을 올리고 PR 을 연다
GitHub :: 두 갈래의 차이를 화면에 펼친다
리뷰어 :: 그 줄에 대고 묻고 고칠 곳을 적는다
판정 :: 의견 · 승인 · 변경 요청 셋 중 하나
@ 다시 리뷰로 :: 변경 요청이면 고쳐 올리고 한 바퀴 더
= 합칠지를 사람이 정하고 나서 합쳐진다. 코드를 쓰는 자리가 아니다
```

## ⚠️ 해결하는 문제

```도해
대조: 리뷰 없이 바로 main 에 밀어 넣으면 무엇이 달라지나
바로 push || PR 로
검토 :: 아무도 안 본다 || 합치기 전에 본다
왜 고쳤나 :: 커밋 메시지만 || 토론이 남는다
사고 :: main 이 깨진다 || 승인으로 막는다
= 합치는 일 앞에 사람의 판단과 기록을 한 번 끼워 넣는 장치다
```

바로 밀어 넣으면 잘못된 변경이 그대로 main 에 들어간다. 되돌릴 수는 있지만 그 사이에 main 에서 새 작업을 시작한 사람은 이미 깨진 코드를 받아 간다.

GitHub 은 저장소 관리자가 병합 전에 승인을 필수로 걸 수 있게 해 둔다. 승인 필수는 중요한 갈래를 지키고 실수로 합쳐지는 일을 줄이는 장치다. 그리고 오간 말이 PR 안에 남기 때문에, 몇 달 뒤에 "이건 왜 이렇게 됐나" 를 물을 자리가 생긴다.

## ⚙️ 작동 원리

PR 을 열면 GitHub 이 임시 git 참조를 만든다 — 올린 갈래를 가리키는 것과, 가능하면 **합친 결과를 미리 계산해 둔 것**까지다. 그래서 합치기 전에도 합친 모습을 화면에서 볼 수 있다.

화면은 탭으로 나뉜다. Conversation 에 설명과 시간순 기록과 댓글과 리뷰가 모이고, Commits 에 그 갈래가 어떻게 변해 왔는지가 남고, Files changed 가 리뷰어가 실제로 보는 차이다.

리뷰는 셋 중 하나로 끝난다.

| 판정 | 무슨 뜻인가 |
|---|---|
| 의견 (Comment) | 승인도 변경 요청도 아닌 그냥 피드백 |
| 승인 (Approve) | 합쳐도 되겠다는 신호 |
| 변경 요청 (Request changes) | 합치기 전에 고쳐야 할 것이 있다 |

초안(Draft)으로 연 PR 은 합칠 수 없고, 코드 오너에게 리뷰 요청이 자동으로 가지 않는다. 준비됐다고 표시하는 순간부터 리뷰가 요청된다.

## 💡 실제 사례

- **기능 하나에 가지 하나** — 고친 것을 따로 가지에 담아 PR 로 올리고, 합쳐지면 그 가지를 버린다. 나중에 이력을 뒤질 때 그 변경이 왜 들어왔는지 PR 하나로 되짚는다.
- **아직 다 안 된 작업 상의** — 초안으로 열어 두면 합쳐지지 않는 채로 방향만 먼저 물어볼 수 있다.
- **충돌이 붙은 PR** — 단순한 줄 충돌은 그 화면에서 고치고, 그보다 복잡하면 내려받아 고쳐 다시 올린다.

## 🚫 흔한 오해

- **Pull Request 는 git 기능이다** — git 에는 그 절차가 없다. git 이 주는 건 커밋 목록과 받아 갈 주소를 요약해 찍어 주는 `git request-pull` 까지고, 차이 화면·토론·리뷰·병합 단추는 GitHub 이 얹은 것이다.
- **승인을 받았으면 코드가 맞다는 뜻이다** — 승인은 "합쳐도 되겠다" 는 신호다. 맞다는 증명이 아니라 사람 하나가 읽고 판단했다는 표시다.
- **리뷰어는 많이 붙일수록 안전하다** — Microsoft 는 연구를 근거로 둘을 적정 인원으로 든다. 한 사람에게 PR 을 몰아주면 리뷰가 밀리고, 팀이 나눠 맡는 편이 낫다.

## 🚨 주의사항

- **승인이 모자라면 단추가 안 눌린다.** 병합 상태 표시가 무엇이 막고 있는지 알려준다. 승인 필수를 걸어 둔 저장소에서는 코드가 멀쩡해도 사람을 기다려야 한다.
- **같은 두 갈래인데 차이가 달라 보일 수 있다.** Compare 화면과 PR 화면은 기준점을 다르게 잡을 수 있어서, 같은 갈래를 놓고도 바뀐 파일이 다르게 나온다.
- **설명을 리뷰어가 읽을 만큼 쓴다.** 리뷰는 시간이 드는 일이라, 무엇을 기대하는지 팀이 먼저 합의해 둬야 한다. 왜 이렇게 고쳤는지가 없으면 리뷰어는 코드부터 거꾸로 짚어 올라간다.

## 📝 정리

풀 리퀘스트는 변경을 합쳐 달라고 내는 제안이고, 합치기 전에 사람이 읽는 자리를 만든 것이다. git 은 가지와 병합만 알고, 그 위에 차이 화면과 리뷰와 승인을 얹은 것은 GitHub 이다. 그래서 PR 을 잘 쓰는 일은 명령을 외우는 일이 아니라 팀이 무엇을 기대할지 합의하는 일이다.

## ❓ 이해했는지

- 같은 두 갈래인데 Compare 화면과 PR 화면의 바뀐 파일이 다르게 나오는 까닭은 → 주의사항
- 초안으로 열어 둔 PR 은 왜 합칠 수 없나 → 작동 원리
- git 만 쓰는 팀에는 PR 이 없는데도 협업이 되는 까닭은 → 흔한 오해

## 🔗 관련 용어

- [[Git]] — PR 이 얹혀 있는 아래층. 가지와 병합은 여기가 한다
- [[Merge Conflict]] — 합치려는 순간 이 화면에 붙는 문제
- [[CI_CD]] — PR 이 열릴 때마다 빌드와 시험을 자동으로 돌리는 짝
- [[CLI]] — 웹에서 못 고치는 충돌을 여기서 고쳐 다시 올린다

---

**출처**

- https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests (About pull requests — GitHub Docs)
- https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews (About pull request reviews — GitHub Docs)
- https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request (Commenting on a pull request — GitHub Docs)
- https://git-scm.com/docs/git-request-pull (git-request-pull — Generate a summary of pending changes)
- https://learn.microsoft.com/en-us/azure/devops/repos/git/git-branching-guidance (Git branching guidance — Azure Repos, Microsoft Learn)
