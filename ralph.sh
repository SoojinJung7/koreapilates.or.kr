#!/usr/bin/env bash
# ============================================================
#  KPA 홈페이지 재구축 — Ralph 루프
#  사용법:  cd ~/koreapilates.or.kr && bash ralph.sh
#  - 남은 페이지를 한 번에 하나씩 만들고 커밋·푸시합니다.
#  - 모든 페이지가 끝나면 RALPH_DONE 파일이 생기고 자동 종료합니다.
#  - 중간에 멈추려면 Ctrl+C. 다시 실행하면 이어서 진행합니다.
# ============================================================
set -u
cd "$(dirname "$0")" || exit 1

MAX="${1:-30}"                 # 안전상 최대 반복 횟수
MODEL="${RALPH_MODEL:-}"       # 선택: RALPH_MODEL=opus bash ralph.sh
LOG="_source/ralph.log"
mkdir -p _source

if ! command -v claude >/dev/null 2>&1; then
  echo "❌ 'claude' 명령을 찾을 수 없어요. Claude Code CLI가 설치돼 있어야 합니다."
  exit 1
fi

echo "===== Ralph 시작: $(date) =====" | tee -a "$LOG"

for i in $(seq 1 "$MAX"); do
  if [ -f RALPH_DONE ]; then
    echo "✅ 모든 페이지 완료 (RALPH_DONE). 종료합니다." | tee -a "$LOG"
    break
  fi

  remaining=$(grep -c '⬜' PROGRESS.md 2>/dev/null || echo "?")
  echo "" | tee -a "$LOG"
  echo "───── 반복 $i/$MAX · 남은 항목 ${remaining}개 · $(date +%H:%M:%S) ─────" | tee -a "$LOG"

  claude -p "$(cat RALPH_PROMPT.md)" \
    --dangerously-skip-permissions \
    ${MODEL:+--model "$MODEL"} \
    2>&1 | tee -a "$LOG"

  sleep 3
done

echo "===== Ralph 종료: $(date) =====" | tee -a "$LOG"
echo "결과는 PROGRESS.md 와 git 커밋 기록에서 확인하세요."
