# AskGaius

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run server.ts
```

To build executables:

```bash
bun run build:windows:linux
```

Executables are stored in the directory `output`. The executables must be run in the same directory as contains the directory `public/model`. The ONNX directory must be stored under `onnx-community/Qwen3.5-4B-ONNX`.

This project was created using `bun init` in bun v1.3.10. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
