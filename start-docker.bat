@echo off

echo 🐳 Starting Family Chores App with Docker...

REM Stop any existing containers
echo Stopping existing containers...
docker-compose down

REM Build and start all services
echo Building and starting services...
docker-compose up --build

echo ✅ Application should be available at:
echo    Frontend: http://localhost:4000
echo    Backend API: http://localhost:4001  
echo    Database: localhost:5432
