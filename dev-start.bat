@echo off
echo ========================================
echo  AI Quant Wallet - 本地开发启动
echo ========================================
echo.

echo [1/2] 启动后端 (NestJS :3001)...
start cmd /k "cd backend && npm run start:dev"

timeout /t 3 /nobreak >nul

echo [2/2] 启动前端 (Next.js :3000)...
start cmd /k "npm run dev"

echo.
echo ========================================
echo  后端: http://localhost:3001/api/docs
echo  前端: http://localhost:3000
echo  数据库: SQLite (无需安装)
echo ========================================
echo.
echo  按任意键退出...
pause >nul
taskkill /f /im node.exe 2>nul
