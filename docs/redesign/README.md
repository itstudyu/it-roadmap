# 개편 문서

`*.src.html` 은 **그림이 안 박힌 원본**이다. `__FONT__`, `__IMG_A__` 같은
자리표시가 들어 있고, 발행할 때 그 자리에 폰트와 PNG 를 base64 로 끼워 넣는다.

그림까지 박힌 판은 2MB 를 넘는다. 그걸 저장소에 두면 문서 한 줄 고칠 때마다
2MB 짜리 덩어리가 새로 쌓인다. 그래서 원본만 두고 그림은 그때 굽는다.

## 다시 굽는 법

```bash
# 1. 목업을 띄운다
python3 -m http.server 8899

# 2. 화면을 찍는다 (헤드리스 크롬)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox --window-size=3280,930 \
  --hide-scrollbars --virtual-time-budget=9000 \
  --screenshot=/tmp/A.png "http://localhost:8899/mockups/redesign-a.html"

# 3. 원본에 폰트와 그림을 끼워 넣는다
python3 - <<'PY'
import base64
src = open("docs/redesign/plan.src.html", encoding="utf-8").read()
def d(p, m):
    return "data:%s;base64,%s" % (m, base64.b64encode(open(p, "rb").read()).decode())
src = src.replace("__FONT__", d("fonts/pretendard-subset.woff2", "font/woff2"))
src = src.replace("__IMG_A__", d("/tmp/A.png", "image/png"))
open("/tmp/plan.html", "w", encoding="utf-8").write(src)
PY
```

## 왜 이 파일이 여기 있나

이번 세션 도중에 `/private/tmp` 청소기가 작업판을 통째로 지웠다. 집필 안내와
조사 결과 여든여섯 건이 거기 있었고 전부 날아갔다. 임시 폴더는 임시다.
다시 만들 수 없는 것은 저장소에 둔다.

목업 자체(`mockups/redesign-*.html`)와 그 자료(`mockups/_mockdata.js`)는
이미 저장소에 있으므로, 그림은 언제든 다시 구울 수 있다. 다시 못 만드는
것은 **왜 그렇게 결정했는지가 적힌 이 문서들** 이다.
