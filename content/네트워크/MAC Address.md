# MAC Address (MAC 주소)

## 📝 정의

MAC 주소는 **네트워크 카드마다 하나씩 붙는 48비트 번호**다.

`00-AA-00-4F-2A-9C` 처럼 여섯 토막으로 적는다. IEEE 는 이 48비트 값을 EUI-48 이라고 부르고, 앞 세 토막은 IEEE 가 조직에 내주고 뒤 세 토막은 그 조직이 자기 장비에 붙인다. 그래서 세상의 장비들이 같은 번호를 갖지 않는다.

### 비유
여권 번호. 사는 곳이 바뀌어도 번호는 그대로고, 번호만 알아서는 그 집을 찾아갈 수 없다.

## 🖼️ 그림으로 보기

```도해
대조: MAC 주소와 IP 주소는 무엇이 다른가
MAC 주소 |=| IP 주소
붙는 곳 :: 장비의 랜카드 || 지금 있는 자리
길이 :: 48비트 여섯 토막 || 32비트 네 토막
옮기면 :: 그대로 따라온다 || 새로 받는다
닿는 범위 :: 같은 망 안까지 || 인터넷 끝까지
= MAC 은 장비에 붙은 번호, IP 는 지금 있는 자리에 붙은 번호다
```

## ⚠️ 해결하는 문제

```도해
대조: 장비마다 고유한 번호가 없으면 어떻게 되나
번호 없이 || MAC 주소로
받은 프레임 :: 누구 것인지 모름 || 자기 것만 올림
번호 충돌 :: 제조사끼리 겹침 || IEEE 가 갈라 줌
같은 선 공유 :: 나눠 쓸 수 없음 || 여럿이 나눠 씀
= 한 선을 여럿이 나눠 쓰니, 이건 누구 것이라고 적을 번호가 있어야 한다
```

이더넷 한 구간은 여러 장비가 같은 매체를 나눠 쓴다. 프레임 앞에 받는 쪽 번호가 적혀 있어야 나머지 장비들이 "내 것이 아니구나" 하고 흘려보낼 수 있다. 이 번호가 없으면 한 선에 두 대 이상을 붙이는 일 자체가 성립하지 않는다.

번호가 겹치지 않게 하려면 나눠 주는 곳이 있어야 한다. IEEE 등록 기관(Registration Authority)이 앞 24비트를 조직에 내주고, 그 조직이 남은 24비트를 자기 장비마다 붙인다. 한 블록(MA-L)에 **1,600만 개쯤**(2의 24제곱)이 들어 있어서, 한 번 받으면 웬만한 제조사는 오래 쓴다.

## ⚙️ 작동 원리

48비트를 여덟 비트씩 여섯 토막으로 끊어 열여섯 진수로 적는다. 앞 세 토막이 **OUI**(Organizationally Unique Identifier), 조직을 가리키는 부분이다. 뒤 세 토막은 그 조직이 붙인 일련번호다.

첫 토막의 **맨 끝 두 비트만 따로 뜻을 갖는다.**

- 마지막 비트(I/G)가 `0` 이면 장비 하나를 가리키고, `1` 이면 여럿을 한꺼번에 가리킨다.
- 그 앞 비트(U/L)가 `0` 이면 IEEE 가 나눠 준 전역 고유 번호이고, `1` 이면 관리자가 자기 망 안에서만 쓰기로 정한 번호다.

두 번째가 중요하다. `1` 인 번호는 **전 세계에서 유일하지 않다.** 그 범위에서만 겹치지 않으면 되고, IEEE 도 그 유일함이 라우터를 넘어갈 필요는 없다고 적어 두었다. 이 번호가 어디까지 쓸모 있는지를 그 한 줄이 말해준다.

`FF-FF-FF-FF-FF-FF` 은 전부 `1` 인 값이라 그 망의 **모든 장비**를 가리킨다. ARP 요청이 이 주소로 나간다.

## 💡 실제 사례

- **클라우드 가상 장비** — 애저는 NIC 이 VM 에 붙어 처음 켜질 때 MAC 을 배정한다. 어떤 값을 쓸지는 고를 수 없고, NIC 을 지울 때까지 그대로 남는다.
- **한 기기에 번호 여럿** — 노트북의 유선 랜과 와이파이가 각각 다른 번호를 갖는다. 기기가 아니라 인터페이스마다 붙기 때문이다.
- **번호를 갈아 끼웠을 때** — 하드웨어에 새겨진 번호와 지금 쓰는 번호는 따로 있다. 드라이버는 그 둘을 각각 보고한다.

## 🚫 흔한 오해

- **MAC 주소는 그 기기의 고유 번호다** — 기기가 아니라 랜카드마다 붙는다. 노트북 한 대에 유선용과 와이파이용이 따로 있고, 카드를 갈면 번호도 갈린다.
- **MAC 주소만 알면 그 장비로 보낼 수 있다** — 같은 망 안에서만 통한다. 라우터는 받은 링크 계층 헤더를 떼고 새로 씌워 내보내기 때문에, 원래 적혀 있던 번호는 거기서 사라진다.
- **MAC 으로 거르는 게 IP 로 거르는 것보다 확실하다** — 하드웨어에 새겨진 번호와 지금 쓰는 번호는 다를 수 있고, 지금 쓰는 번호는 설정으로 정해진다. 자물쇠가 아니라 이름표다.

## 📝 정리

MAC 주소는 자리가 아니라 장비에 붙는 48비트 번호다. 앞부분은 IEEE 가 조직에 나눠 주고 뒷부분은 그 조직이 붙이기 때문에 겹치지 않는다. 다만 이 번호가 힘을 쓰는 범위는 같은 망 안까지이고, 라우터를 지나면 새 번호로 갈린다.

## ❓ 이해했는지

- 노트북 한 대에 MAC 주소가 두 개 이상 있는 이유는 무엇인가 → 흔한 오해
- 그 망의 모든 장비를 가리키는 번호가 따로 있는데, 어디에 쓰이나 → 작동 원리
- 사무실 노트북을 집으로 들고 가면 두 번호 중 무엇이 바뀌나 → 그림

## 🔗 관련 용어

- [[ARP]] — IP 만 알 때 이 번호를 알아내는 규칙
- [[IP Address]] — 자리에 붙는 번호. 이 번호와 짝을 이룬다
- [[Router vs Switch]] — 이 번호로 넘기는 장비와 IP 로 길을 고르는 장비
- [[OSI 7계층]] — 이 번호가 쓰이는 2계층의 자리

---

**출처**

- https://standards.ieee.org/wp-content/uploads/import/documents/tutorials/eui.pdf (Guidelines for Use of Extended Unique Identifier (EUI), Organizationally Unique Identifier (OUI), and Company ID (CID) — IEEE Registration Authority)
- https://standards.ieee.org/products-programs/regauth/ (IEEE Registration Authority)
- https://learn.microsoft.com/en-us/windows-hardware/drivers/network/oid-802-3-permanent-address (OID_802_3_PERMANENT_ADDRESS — Windows drivers, Microsoft Learn)
- https://learn.microsoft.com/en-us/windows-hardware/drivers/network/oid-802-3-current-address (OID_802_3_CURRENT_ADDRESS — Windows drivers, Microsoft Learn)
- https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface (Create, change, or delete Azure network interfaces — Microsoft Learn)
- https://www.rfc-editor.org/rfc/rfc1812.html (RFC 1812 — Requirements for IP Version 4 Routers)
