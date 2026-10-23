@echo off
chcp 65001 >nul
title Claude Code

REM ===== 여기만 본인 프로젝트 폴더로 바꾸세요 =====
set "PROJECT_DIR=%USERPROFILE%\vibe-01"
REM ===============================================

set "PATH=%USERPROFILE%\.local\bin;%PATH%"

where claude >nul 2>nul
if errorlevel 1 (
    echo Claude Code가 설치되어 있지 않습니다. 1_first_setup.bat 을 먼저 실행하세요.
    pause
    exit /b 1
)

if exist "%PROJECT_DIR%" (
    cd /d "%PROJECT_DIR%"
) else (
    echo 프로젝트 폴더가 없어 현재 폴더에서 시작합니다: %CD%
)

REM 프로젝트 폴더가 git 저장소면 최신 내용 받아오기
if exist ".git" git pull

REM 이전 대화 이어서 시작 (이전 대화가 없으면 새로 시작)
claude --continue || claude
