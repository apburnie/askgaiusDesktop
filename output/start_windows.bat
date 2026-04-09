if /I "%PROCESSOR_ARCHITECTURE%"=="ARM64" (
    echo Architecture ARM64 detected. Starting up...

    cd /d "exe"

    if exist "askGaius-windows-arm64.exe" (
        askGaius-windows-arm64.exe
    ) else (
        echo Error: executable not found in the exe folder.
    )
) else (
    echo The system architecture is not ARM64. Starting up...

    cd /d "exe"

    if exist "askGaius-windows-x64.exe" (
        askGaius-windows-x64.exe
    ) else (
        echo Error: executable not found in the exe folder.
    )

)

pause
