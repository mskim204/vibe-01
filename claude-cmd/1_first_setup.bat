@echo off
chcp 65001 >nul
title Claude Code 최초 설치
echo ==========================================
echo   Claude Code 최초 설치 (처음 한 번만 실행)
echo ==========================================
echo.

REM 1) Git 확인 (Windows용 Claude Code는 Git for Windows가 필요)
where git >nul 2>nul
if errorlevel 1 (
    echo [1/3] Git이 없어서 설치합니다...
    winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
) else (
    echo [1/3] Git 확인 완료
)

REM 2) Claude Code 설치 (공식 설치 스크립트)
echo [2/3] Claude Code 설치 중...
curl -fsSL https://claude.ai/install.cmd -o "%TEMP%\claude-install.cmd"
call "%TEMP%\claude-install.cmd"
del "%TEMP%\claude-install.cmd" >nul 2>nul

REM 설치 경로를 현재 창 PATH에 추가
set "PATH=%USERPROFILE%\.local\bin;%PATH%"

REM 3) 설치 확인
echo [3/3] 설치 확인...
claude --version
if errorlevel 1 (
    echo.
    echo 설치는 끝났지만 PATH 적용이 안 됐을 수 있습니다.
    echo CMD 창을 닫고 새로 연 뒤 "claude" 를 입력해보세요.
    pause
    exit /b 1
)

echo.
echo 설치 완료! 이제 Claude를 실행합니다.
echo 처음 실행하면 브라우저가 열리고 로그인 화면이 나옵니다.
echo.
pause
claude
