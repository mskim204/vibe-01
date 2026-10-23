# Claude Code를 Windows CMD에서 쓰기

## 1. 처음 한 번만: `1_first_setup.bat`
더블클릭하면 Git 확인/설치 → Claude Code 설치 → 로그인까지 진행됩니다.

직접 CMD에 입력하고 싶다면 이 한 줄이면 됩니다:
```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```
설치 후 CMD 창을 새로 열고 `claude` 입력 → 브라우저에서 로그인.

## 2. 매번: `2_start_claude.bat`
더블클릭하면 프로젝트 폴더로 이동 → `git pull` → 이전 대화 이어서 Claude 실행.

- 파일 안의 `PROJECT_DIR` 를 본인 프로젝트 폴더 경로로 바꾸세요.
- 바탕화면에 바로가기를 만들어두면 클릭 한 번으로 연결됩니다.
  (파일 우클릭 → 보내기 → 바탕 화면에 바로 가기 만들기)
