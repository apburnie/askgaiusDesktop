if /I "%PROCESSOR_ARCHITECTURE%"=="ARM64" (

    cd /d ".e/vulkan"

    if exist "askGaius-windows-arm64.exe" (
        askGaius-windows-arm64.exe
    ) else (
        echo Error: executable not found in the exe folder.
    )
) else (

    cd /d "exe"

    if exist "askGaius-windows-x64.exe" (
        askGaius-windows-x64.exe
    ) else (
        echo Error: executable not found in the exe folder.
    )

)

pause
