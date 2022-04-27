import { dayFive as data } from "./data";

type IntCode = Array<number>;

function parseIntCode(data: string): IntCode {
    return data.split(",").map(x => parseInt(x));
}

function executeCode(code: IntCode, input: number, debug?: boolean): IntCode {
    if (typeof debug == undefined) debug = false;
    let stepSize: number = 4;
    for (let i = 0; i < code.length; i += stepSize) {
        let stringOpCode = code[i].toString();
        if (stringOpCode.length < 2) {
            stringOpCode = "0" + stringOpCode;
        }
        let parameterModes = stringOpCode.split("")

        let currentOpCode: number = parseInt(parameterModes.splice(-2, 2).join(""));

        while (parameterModes.length < 3) {
            parameterModes.unshift("0");
        }
        parameterModes = parameterModes.reverse();
        let pm = parameterModes;
        let value: number = 0;
        let index: number = 0;
        switch (currentOpCode) {
            case 1 :
                value = getValue(code, pm[0], i + 1) + getValue(code, pm[1], i + 2);
                if (isNaN(value)) throw new Error(`Found NaN value when adding ${getValue(code, pm[1], i + 1)} and ${getValue(code, pm[2], i + 2)} after processing instruction ${code[i]},${code[i+1]},${code[i+1]},${code[i+2]} starting at index ${i}`)
                index = code[i + 3];
                code[index] = value;
                stepSize = 4;
                break;
            case 2 :
                value = getValue(code, pm[0], i + 1) * getValue(code, pm[1], i + 2);
                if (isNaN(value)) throw new Error(`Found NaN value when multipliying ${getValue(code, pm[1], i + 1)} with ${getValue(code, pm[2], i + 2)} after processing instruction ${code[i]},${code[i+1]},${code[i+2]},${code[i+1]} starting at index ${i}`)
                index = code[i + 3];
                code[index] = value;
                stepSize = 4;
                break;
            case 3 :
                value = input;
                index = code[i + 1];
                code[index] = value;
                stepSize = 2;
                break;
            case 4 :
                if (pm[0] === "1") {
                    console.log(code[i + 1]);
                } else {
                    console.log(getValue(code, pm[0], i + 1));
                }
                stepSize = 2;
                break;
            case 5 :
                if (getValue(code, pm[0], i + 1) !== 0) {
                    i = getValue(code, pm[1], i + 2);
                    stepSize = 0;
                } else {
                    stepSize = 3;
                }
                break;
            case 6 :
                if (getValue(code, pm[0], i + 1) === 0) {
                    i = getValue(code, pm[1], i + 2);
                    stepSize = 0;
                } else {
                    stepSize = 3;
                }
                break;
            case 7 :
                value = Number(getValue(code, pm[0], i + 1) < getValue(code, pm[1], i + 2));
                index = code[i + 3];
                code[index] = value;
                stepSize = 4;
                break;
            case 8 :
                value = Number(getValue(code, pm[0], i + 1) === getValue(code, pm[1], i + 2));
                index = code[i + 3];
                code[index] = value;
                stepSize = 4;
                break;
            case 99 :
                return code;
            default :
                throw new Error(`Unknown OpCode found : ${currentOpCode} at position ${i}`)
        }

        if (debug && currentOpCode !== 4 && currentOpCode !== 5 && currentOpCode !== 6) console.log(`Written ${value} to ${index}`)
    }
    return code;
}

/**
 * A simple function to get the value of a parameter (differenciating between immediate and position values)
 */
function getValue(code: IntCode, parameterMode: string, index: number): number {
    if (parameterMode === "1") {
        return code[index];
    } else {
        return code[code[index]];
    }
}