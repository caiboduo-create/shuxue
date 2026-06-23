#!/usr/bin/env bash
# 一键把本仓库推送到 GitHub。
# 用法：在解压出的 math-ai 目录下运行  ->  bash push-to-github.sh
# 想换仓库地址时：bash push-to-github.sh https://github.com/你的用户名/你的仓库.git
set -euo pipefail

REPO_URL="${1:-https://github.com/caiboduo-create/shuxue.git}"

# 1) 确认在 git 仓库里
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "✗ 当前目录不是 git 仓库。请先解压，并 cd 进 math-ai 目录再运行。"
  exit 1
fi

# 2) 设置/更新远端 origin
if git remote | grep -qx 'origin'; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi
echo "→ 远端 origin 已指向：$REPO_URL"

# 3) 推送两个分支（首次推送会让你登录认证：用 gh auth login 或 Personal Access Token）
echo "→ 正在推送 main ..."
git push -u origin main
echo "→ 正在推送 refactor/math-ai-v2 ..."
git push -u origin refactor/math-ai-v2

echo ""
echo "✅ 完成！两个分支都已上传。"
echo "   下一步（可选）：去 GitHub 网页，从 refactor/math-ai-v2 向 main 发一个 Pull Request，"
echo "   就能看到这一版所有改动的 diff，确认后合并。"
