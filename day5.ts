import { dayFive as data } from "./data";

interface Parameter {
    value: number;
    mode: "position"|"immediate";
}

interface Instructions {
    Opcode: number;
    Parameters: Parameter[];
}

type Intcode = Array<Instructions>

function parseIntCode(codeString: string) : Intcode {
    let allCodes: string[] = codeString.split(",");
    let finalIntCode: Intcode = [];
    let currentInstruction: Instructions;
    let maxLength: number;
    let stepSize = 1;

    for (let i = 0; i < allCodes.length; i += stepSize) {
        currentInstruction = parseOpCode(allCodes[i], i, allCodes);
        finalIntCode.push(currentInstruction);
        stepSize = currentInstruction.Parameters.length;
    }

    return finalIntCode;
}

function parseStepSize(instruction: Instructions) : number {
    switch(instruction.Opcode) {
        case 99 : 
            return 1;
        case 3:
            return 2;
        case 4:
            return 2;
    }
    return 4
}

function parseOpCode(code: string, index: number, entireOpCode: string[]): Instructions {
    if (code.length < 2) {
        code = "0" + code;
    }
    let opcode = code.match(/\d\d$/);
    if (opcode[0]) {
        let opCodeValue = parseInt(opcode[0]);
        let parameterLength: number = 3;

        let positionModes: string[] = code.split(opcode[0])[0].split("").reverse();

        switch(opCodeValue) {
            case 99: 
                parameterLength = 0;
                break;
            case 3:
                parameterLength = 1;
                break;
            case 4:
                parameterLength = 1;
        }

        let parameters: Parameter[] = [];
        for (let i = index + 1; i <= index + parameterLength; i++) {
            let isImmediate: boolean = false;
            if (positionModes[i - index] == "1") {
                isImmediate = true;
            }
            let newParameter: Parameter = {
                value: parseInt(entireOpCode[i]),
                mode: (isImmediate) ? "immediate" : "position"
            }
            parameters.push(newParameter);
        }

        return {
            Opcode: opCodeValue,
            Parameters: parameters
        }
    } else {
        throw new Error(`Opcode not found in : ${code}`)
    }
}

function executeIntCode(code: Intcode) : Intcode {
    let stepSize: number = 4;
    for (let i = 0; i < code.length; i += stepSize) {
        let currentInstruction = code[i];
        switch (code[i].Opcode) {
            case 1 :
                break;
            case 2 :
                break;
            case 3 :
                break;
            case 4 :
                if (code[i].Parameters[0].mode == "immediate") {
                    console.log(currentInstruction.Parameters[0].value)
                } else {
                    console.log(code[currentInstruction.Parameters[0].value])
                }
                break;
            case 99 :
                return code;
            default :
                throw new Error(`Encountered unknown opcode (${code[i].Opcode}) at index ${i}`);
        }
    }
}