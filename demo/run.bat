@echo off
setlocal
echo ======================================================
echo       Elite Todo Application - Startup Script
echo ======================================================
echo.

:: Check for Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed or not in your PATH.
    echo Please install JDK 17 or higher.
    pause
    exit /b 1
)

:: Check for PostgreSQL (Optional check, doesn't block startup but warns)
net stat -an | find "5432" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL doesn't seem to be running on port 5432.
    echo Make sure your database 'todo' is ready with user 'postgres' and password 'root'.
    echo.
)

echo [INFO] Building the application with Maven...
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] Build failed. Please check the logs above.
    pause
    exit /b 1
)

echo.
echo [INFO] Build Successful! Starting the application...
echo [INFO] Application will be available at http://localhost:8082
echo.

:: Run the application
java -jar target\demo-0.0.1-SNAPSHOT.jar

pause
