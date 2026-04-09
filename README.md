# AskGaius

## Working Locally

To install dependencies:

```bash
bun install
```

To run locally:

```bash
bun run dev
```

## Building the Product

1. Build the output directory that contains the software for the product:

```bash
bun run build
```

The outputted software is stored in output/

2. Burn the AskGaius image to the USB:

First get where the USB is plugged in. Run the following with no USB then with to get the path e.g. /dev/sda1

```
lsblk
```

Switch to sudo mode and Linux for this to work and then burn the image to the USB. Replace the of value with the correct path:

```
dd if=askGaius.img of=/dev/sda1 bs=4M status=progress
```

3. Copy output directory to the USB

4. Rename output to AskGaius
