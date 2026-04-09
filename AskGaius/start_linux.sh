#!/bin/bash

# Using -P ensures we resolve any physical paths correctly
PARENT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
cd "$PARENT_DIR/.e/vulkan" || { echo "Failure to enter directory"; exit 1; }

# Detect Operating System
OS="$(uname -s)"

# Detect Architecture
ARCH="$(uname -m)"

if [ "$OS" == "Darwin" ]; then

if [ "$ARCH" == "arm64" ]; then
        exec "./askGaius-macos-arm64.exe"
    else
        exec "./askGaius-macos-x64.exe"
    fi

else
    if [ "$ARCH" == "arm64" ]; then
        exec "./askGaius-linux-arm64.exe"
    else
        exec "./askGaius-linux-x64.exe"
    fi
fi
