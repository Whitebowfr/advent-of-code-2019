type IntCode = Array<number>;

export class IntCodeComputer {
    code: IntCode
    inputs: number[]
    outputQueue: number[]
    currentStepSize: number;
    currentIndex: number;
    currentInputIndex: number;

    constructor(codeString: string) {
        this.code = this.parseIntCode(codeString);
        this.currentIndex = 0;
        this.currentInputIndex = 0;
        this.outputQueue = [];
        this.currentStepSize = 4;
        this.inputs = [];
    }

    setInputs(a: number | number[]) {
        if (Array.isArray(a)) {
            this.inputs.push(...a)
        } else {
            this.inputs.push(a)
        }
    }

    parseIntCode(data: string): IntCode {
        return data.split(",").map(x => parseInt(x));
    }

    executeCode(input?: number[] | number, debug?: boolean): { code: IntCode, outputQueue: number[], stopCode?: number } {
        if (input !== undefined) this.setInputs(input);
        if (debug === undefined) debug = false;

        this.currentIndex = 0;
        this.currentInputIndex = 0;
        this.outputQueue = [];
        let stopCode: number = 0;

        while (this.currentIndex < this.code.length && stopCode !== 99) {
            let result = this.step(this.currentIndex)
            stopCode = result.stopCode ?? 0;
            this.currentIndex += this.currentStepSize;
        }

        return {code: this.code, outputQueue: this.outputQueue, stopCode: (stopCode === undefined) ? 0 : stopCode}
            // let stringOpCode = code[i].toString();
            // if (stringOpCode.length < 2) {
            //     stringOpCode = "0" + stringOpCode;
            // }
            // let parameterModes = stringOpCode.split("")

            // let currentOpCode: number = parseInt(parameterModes.splice(-2, 2).join(""));

            // while (parameterModes.length < 3) {
            //     parameterModes.unshift("0");
            // }
            // parameterModes = parameterModes.reverse();
            // let pm = parameterModes;
            // let value: number = 0;
            // let index: number = 0;
            // switch (currentOpCode) {
            //     case 1 :
            //         value = getValue(pm[0], i + 1) + getValue(pm[1], i + 2);
            //         if (isNaN(value) || value == undefined) throw new Error(`Found ${value} value when adding ${getValue(pm[0], i + 1)} and ${getValue(pm[1], i + 2)} after processing instruction ${code[i]},${code[i+1]},${code[i+2]},${code[i+3]} starting at index ${i}`)
            //         index = code[i + 3];
            //         code[index] = value;
            //         stepSize = 4;
            //         break;
            //     case 2 :
            //         value = getValue(pm[0], i + 1) * getValue(pm[1], i + 2);
            //         if (isNaN(value) || value == undefined) throw new Error(`Found ${value} value when multipliying ${getValue(pm[0], i + 1)} with ${getValue(pm[1], i + 2)} after processing instruction ${code[i]},${code[i+1]},${code[i+2]},${code[i+3]} starting at index ${i} with parameters ${pm}`)
            //         index = code[i + 3];
            //         code[index] = value;
            //         stepSize = 4;
            //         break;
            //     case 3 :
            //         if (Array.isArray(input)) {
            //             value = input[currentInputIndex]
            //             currentInputIndex++
            //         } else {
            //             value = input;
            //         }
            //         index = code[i + 1];
            //         code[index] = value;
            //         stepSize = 2;
            //         break;
            //     case 4 :
            //         if (pm[0] === "1") {
            //             value = code[i + 1]
            //         } else {
            //             value = getValue(pm[0], i + 1)
            //         }

            //         outputQueue.push(value)

            //         if (debug) console.log(`Output : ${value}`);
            //         stepSize = 2;
            //         break;
            //     case 5 :
            //         if (getValue(pm[0], i + 1) !== 0) {
            //             i = getValue(pm[1], i + 2);
            //             stepSize = 0;
            //         } else {
            //             stepSize = 3;
            //         }
            //         break;
            //     case 6 :
            //         if (getValue(pm[0], i + 1) === 0) {
            //             i = getValue(pm[1], i + 2);
            //             stepSize = 0;
            //         } else {
            //             stepSize = 3;
            //         }
            //         break;
            //     case 7 :
            //         value = Number(getValue(pm[0], i + 1) < getValue(pm[1], i + 2));
            //         if (isNaN(value) || value == undefined) throw new Error(`Found ${value} value when comparing ${getValue(pm[0], i + 1)} and ${getValue(pm[1], i + 2)} after processing instruction ${code[i]},${code[i+1]},${code[i+2]},${code[i+3]} starting at index ${i} with parameters ${pm}`)
            //         index = code[i + 3];
            //         code[index] = value;
            //         stepSize = 4;
            //         break;
            //     case 8 :
            //         value = Number(getValue(pm[0], i + 1) === getValue(pm[1], i + 2));
            //         if (isNaN(value) || value == undefined) throw new Error(`Found ${value} value when comparing equality between ${getValue(pm[0], i + 1)} and ${getValue(pm[1], i + 2)} after processing instruction ${code[i]},${code[i+1]},${code[i+2]},${code[i+3]} starting at index ${i} with parameters ${pm}`)
            //         index = code[i + 3];
            //         code[index] = value;
            //         stepSize = 4;
            //         break;
            //     case 99 :
            //         return {code, outputQueue, stopCode: 99};
            //     default :
            //         throw new Error(`Unknown OpCode found : ${currentOpCode} at position ${i}`)
            // }

            // if (debug && currentOpCode !== 4 && currentOpCode !== 5 && currentOpCode !== 6) console.log(`Written ${value} to ${index}`)
    }

    step(currentInputIndex: number): { stopCode?: number } {
        let i = this.currentIndex;
        let stringOpCode = this.code[i].toString();
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
            case 1:
                value = this.getValue(pm[0], i + 1) + this.getValue(pm[1], i + 2);
                if (isNaN(value) || value == undefined) throw new Error(`Found ${value} value when adding ${this.getValue(pm[0], i + 1)} and ${this.getValue(pm[1], i + 2)} after processing instruction ${this.code[i]},${this.code[i + 1]},${this.code[i + 2]},${this.code[i + 3]} starting at index ${i}`)
                index = this.code[i + 3];
                this.code[index] = value;
                this.currentStepSize = 4;
                break;
            case 2:
                value = this.getValue(pm[0], i + 1) * this.getValue(pm[1], i + 2);
                if (isNaN(value) || value == undefined) throw new Error(`Found ${value} value when multipliying ${this.getValue(pm[0], i + 1)} with ${this.getValue(pm[1], i + 2)} after processing instruction ${this.code[i]},${this.code[i + 1]},${this.code[i + 2]},${this.code[i + 3]} starting at index ${i} with parameters ${pm}`)
                index = this.code[i + 3];
                this.code[index] = value;
                this.currentStepSize = 4;
                break;
            case 3:
                if (Array.isArray(this.inputs)) {
                    value = this.inputs[this.currentInputIndex]
                    this.currentInputIndex++
                }
                index = this.code[i + 1];
                this.code[index] = value;
                this.currentStepSize = 2;
                break;
            case 4:
                if (pm[0] === "1") {
                    value = this.code[i + 1]
                } else {
                    value = this.getValue(pm[0], i + 1)
                }
                this.currentStepSize = 2;
                this.outputQueue.push(value);
                break;
            case 5:
                if (this.getValue(pm[0], i + 1) !== 0) {
                    this.currentIndex = this.getValue(pm[1], i + 2);
                    this.currentStepSize = 0;
                } else {
                    this.currentStepSize = 3;
                }
                break;
            case 6:
                if (this.getValue(pm[0], i + 1) === 0) {
                    this.currentIndex = this.getValue(pm[1], i + 2);
                    this.currentStepSize = 0;
                } else {
                    this.currentStepSize = 3;
                }
                break;
            case 7:
                value = Number(this.getValue(pm[0], i + 1) < this.getValue(pm[1], i + 2));
                if (isNaN(value) || value == undefined) throw new Error(`Found ${value} value when comparing ${this.getValue(pm[0], i + 1)} and ${this.getValue(pm[1], i + 2)} after processing instruction ${this.code[i]},${this.code[i + 1]},${this.code[i + 2]},${this.code[i + 3]} starting at index ${i} with parameters ${pm}`)
                index = this.code[i + 3];
                this.code[index] = value;
                this.currentStepSize = 4;
                break;
            case 8:
                value = Number(this.getValue(pm[0], i + 1) === this.getValue(pm[1], i + 2));
                if (isNaN(value) || value == undefined) throw new Error(`Found ${value} value when comparing equality between ${this.getValue(pm[0], i + 1)} and ${this.getValue(pm[1], i + 2)} after processing instruction ${this.code[i]},${this.code[i + 1]},${this.code[i + 2]},${this.code[i + 3]} starting at index ${i} with parameters ${pm}`)
                index = this.code[i + 3];
                this.code[index] = value;
                this.currentStepSize = 4;
                break;
            case 99:
                return { stopCode: 99 };
            default:
                throw new Error(`Unknown Opthis.code found : ${currentOpCode} at position ${i}`)
        }
        return {stopCode: 0}
    }

    /**
     * A simple function to get the value of a parameter (differenciating between immediate and position values)
     */
    getValue(parameterMode: string, index: number, code?: IntCode): number {
        if (parameterMode === "1") {
            return (code === undefined) ? this.code[index] : code[index];
        } else {
            return (code === undefined) ? this.code[this.code[index]] : code[code[index]];
        }
    }
}

export type { IntCode };