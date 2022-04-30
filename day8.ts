import { dayEight as data } from "./data";

type image = number[][][]

function parseLayers(imageData: string, pixels: [number, number]) : image {
    let separatedPixels: number[] = imageData.split("").map(x => parseInt(x));

    let currentLine: number[] = []
    let currentLayer: number[][] = []
    let finishedImage: image = []
    let currentIndex = 0;
    while (currentIndex <= separatedPixels.length) {
        if (currentIndex % pixels[0] === 0 && currentIndex !== 0) {
            currentLayer.push(currentLine)
            currentLine = []
        }
        if (currentIndex % (pixels[0] * pixels[1]) == 0 && currentIndex !== 0) {
            finishedImage.push(currentLayer)
            currentLayer = []
        }
        currentLine.push(separatedPixels[currentIndex])
        currentIndex++;
    }

    return finishedImage;
}

function verifyIntegrity(image: image, debug?: boolean): number {
    if (debug === undefined) debug = false

    let minAmountOfZeros = Infinity;
    let outputNumber = 0;
    for (let layer of image) {
        let amountOfPixels: number[] = new Array(10).fill(0);
        for (let line of layer) {
            for (let pixel of line) {
                amountOfPixels[pixel]++
            }
        }
        minAmountOfZeros = Math.min(amountOfPixels[0], minAmountOfZeros)
        if (minAmountOfZeros === amountOfPixels[0]) {
            outputNumber = amountOfPixels[1] * amountOfPixels[2];
        }
        if (debug) {
            process.stdout.cursorTo(0);
            process.stdout.write(`Found ${amountOfPixels[0]} 0s in the ${image.indexOf(layer) + 1} / ${image.length} layer. The min number is ${minAmountOfZeros} and the number is ${outputNumber}`)
        }
    }
    return outputNumber
}

function decodeImage(image: image, display?: boolean): number[][] {
    if (display == undefined) display = true;

    for (let lineIndex = 0; lineIndex < image[0].length; lineIndex++) {
        for (let pixelIndex = 0; pixelIndex < image[0][lineIndex].length; pixelIndex++) {
            let layerIndex = 0;
            let pixel = image[layerIndex][lineIndex][pixelIndex]
            while (pixel === 2) {
                pixel = image[layerIndex][lineIndex][pixelIndex]
                layerIndex++
            }
            image[0][lineIndex][pixelIndex] = pixel
        }
    }

    if (display) {
        let duplicate: string = ""
        image[0].forEach(line => {
            let currentLine: string = ""
            line.forEach((pixel) => {
                currentLine += (pixel === 0 ? "⬜" : "⬛")
            })
            duplicate += "\n" + currentLine
        })
        console.clear()
        console.log(duplicate)
    }

    return image[0]
}