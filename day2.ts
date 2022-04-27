import { dayTwo as data } from './data'
const gravityAssistCompletion: number = 19690720;

type Intcode = Array<number>;

function parseIntcode(input: string, noun: number, verb: number): Intcode {
    let output: Intcode = input.split(",").map(el => parseInt(el));
    output[1] = noun;
    output[2] = verb;
    return output
}

function executeIntcode(code: Intcode, silentMode: boolean) : Intcode {
    for (let currentIndex = 0; currentIndex < code.length; currentIndex += 4) {
        switch(code[currentIndex]) {
            case 1:
            case 2:
                let firstNumberAdress: number = code[currentIndex + 1];
                let firstNumber: number = code[firstNumberAdress];
                let secondNumberAdress: number = code[currentIndex + 2];
                let secondNumber: number = code[secondNumberAdress];
                let writeAdress: number = code[currentIndex + 3];
                let operationResult: number = 0;
                if (code[currentIndex] === 1) {
                    operationResult = firstNumber + secondNumber;
                } else {
                    operationResult = firstNumber * secondNumber;
                }
                code[writeAdress] = operationResult;
                if (!silentMode) console.log(`Wrote ${operationResult} at adress n°${writeAdress}`)
                break;
            case 99:
                return code;
            default:
                throw new Error(`Unidentified number found : ${code[currentIndex]} found at ${currentIndex}`);
        }
    }
    return code;
}

function getResult(): void {
    let currentMemory: Intcode = parseIntcode(data, 12, 2);
    let output: number = executeIntcode(currentMemory, false)[0];
    console.log(`The final result is : ${output}`);
}

function findCorrectParameters(): void {
    for (let noun = 0; noun <= 99; noun++) {
        for (let verb = 0; verb <= 99; verb++) {
            let currentMemory: Intcode = parseIntcode(data, noun, verb);
            let output: number = executeIntcode(currentMemory, true)[0];
            if (output === gravityAssistCompletion ) {
                console.log(`Pair found : noun = ${noun}, verb = ${verb}. The calculated result is : ${100 * noun + verb}`);
                return;
            } else {
                console.clear();
                console.log(`Pair noun = ${noun}, verb = ${verb} gives a result of ${output}`)
            }
        }
    }
}
