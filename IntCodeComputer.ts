type IntCode = Array<number>;

const OpCodes = {
    ADDITION: 1,
    MULTIPLICATION: 2,
    INPUT: 3,
    OUTPUT: 4,
    JUMP_IF_NOT_ZERO: 5,
    JUMP_IF_ZERO: 6,
    JUMP_IF_INFERIOR: 7,
    JUMP_IF_EQUAL: 8,
    ADJUST_RELATIVE_BASE: 9,
    STOP: 99
}

const ParameterModes = {
    POSITION: "0",
    IMMEDIATE: "1",
    RELATIVE: "2"
}

export class IntCodeComputer {
    code: IntCode
    inputs: number[]
    outputQueue: number[]
    currentStepSize: number;
    currentIndex: number;
    currentInputIndex: number;
    relativeBase: number;

    constructor(codeString: string) {
        this.code = this.parseIntCode(codeString);
        this.currentIndex = 0;
        this.currentInputIndex = 0;
        this.outputQueue = [];
        this.currentStepSize = 4;
        this.inputs = [];
        this.relativeBase = 0;
    }

    reset() {
        this.currentIndex = 0;
        this.currentInputIndex = 0;
        this.outputQueue = [];
        this.currentStepSize = 4;
        this.inputs = [];
        this.relativeBase = 0;
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

        while (stopCode !== 99) {
            let result = this.step(this.currentIndex)
            stopCode = result.stopCode ?? 0;
            this.currentIndex += this.currentStepSize;
        }

        return {code: this.code, outputQueue: this.outputQueue, stopCode: (stopCode === undefined) ? 0 : stopCode}
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
            case OpCodes.ADDITION:
                value = this.getValue(pm[0], i + 1) + this.getValue(pm[1], i + 2);
                if (isNaN(value) || value === undefined) throw new Error(`Found ${value} value when adding ${this.getValue(pm[0], i + 1)} and ${this.getValue(pm[1], i + 2)} after processing instruction ${this.code[i]},${this.code[i + 1]},${this.code[i + 2]},${this.code[i + 3]} starting at index ${i}`)
                index = this.getIndex(pm[2], i + 3);
                this.code[index] = value;
                this.currentStepSize = 4;
                break;

            case OpCodes.MULTIPLICATION:
                value = this.getValue(pm[0], i + 1) * this.getValue(pm[1], i + 2);
                if (isNaN(value) || value === undefined) throw new Error(`Found ${value} value when multipliying ${this.getValue(pm[0], i + 1)} with ${this.getValue(pm[1], i + 2)} after processing instruction ${this.code[i]},${this.code[i + 1]},${this.code[i + 2]},${this.code[i + 3]} starting at index ${i}`)
                index = this.getIndex(pm[2], i + 3);
                this.code[index] = value;
                this.currentStepSize = 4;
                break;

            case OpCodes.INPUT:
                if (Array.isArray(this.inputs)) {
                    value = this.inputs[this.currentInputIndex]
                    this.currentInputIndex++
                }
                index = this.getIndex(pm[0], i + 1);
                this.code[index] = value;
                this.currentStepSize = 2;
                break;

            case OpCodes.OUTPUT:
                value = this.getValue(pm[0], i + 1)
                this.currentStepSize = 2;
                this.outputQueue.push(value);
                break;

            case OpCodes.JUMP_IF_NOT_ZERO:
                if (this.getValue(pm[0], i + 1) !== 0) {
                    this.currentIndex = this.getValue(pm[1], i + 2);
                    this.currentStepSize = 0;
                } else {
                    this.currentStepSize = 3;
                }
                break;

            case OpCodes.JUMP_IF_ZERO:
                if (this.getValue(pm[0], i + 1) === 0) {
                    this.currentIndex = this.getValue(pm[1], i + 2);
                    this.currentStepSize = 0;
                } else {
                    this.currentStepSize = 3;
                }
                break;

            case OpCodes.JUMP_IF_INFERIOR:
                value = Number(this.getValue(pm[0], i + 1) < this.getValue(pm[1], i + 2));
                if (isNaN(value) || value === undefined) throw new Error(`Found ${value} value when comparing ${this.getValue(pm[0], i + 1)} and ${this.getValue(pm[1], i + 2)} after processing instruction ${this.code[i]},${this.code[i + 1]},${this.code[i + 2]},${this.code[i + 3]} starting at index ${i}`)
                index = this.getIndex(pm[2], i + 3);
                this.code[index] = value;
                this.currentStepSize = 4;
                break;

            case OpCodes.JUMP_IF_EQUAL:
                value = Number(this.getValue(pm[0], i + 1) === this.getValue(pm[1], i + 2));
                if (isNaN(value) || value === undefined) throw new Error(`Found ${value} value when comparing equality between ${this.getValue(pm[0], i + 1)} and ${this.getValue(pm[1], i + 2)} after processing instruction ${this.code[i]},${this.code[i + 1]},${this.code[i + 2]},${this.code[i + 3]} starting at index ${i}`)
                index = this.getIndex(pm[2], i + 3);
                this.code[index] = value;
                this.currentStepSize = 4;
                break;

            case OpCodes.ADJUST_RELATIVE_BASE :
                value = this.getValue(pm[0], i + 1)
                if (isNaN(value) || value === undefined) throw new Error (`Tried to offset relative base by ${value} after processing instruction ${this.code[i]}, ${this.code[i + 1]} starting at index ${i}`)
                this.relativeBase += value;
                this.currentStepSize = 2;
                break;

            case OpCodes.STOP:
                return { stopCode: OpCodes.STOP };

            default:
                throw new Error(`Unknown OpCode found : ${currentOpCode} at position ${i}`)
        }
        return {stopCode: 0}
    }

    /**
     * A simple function to get the value of a parameter (differenciating between immediate and position values)
     */
    getValue(parameterMode: string, index: number): number {
        if (index >= this.code.length) this.extendCode(index);
        
        if (parameterMode === ParameterModes.IMMEDIATE) {
            return this.code[index]

        } else if (parameterMode === ParameterModes.RELATIVE) {
            if (this.relativeBase + this.code[index] >= this.code.length) this.extendCode(this.relativeBase + this.code[index]);
            return this.code[this.relativeBase + this.code[index]]

        } else {
            if (this.code[index] >= this.code.length) this.extendCode(this.code[index]);
            return this.code[this.code[index]]

        }
    }

    getIndex(parameterMode: string, index: number) : number {
        if (index >= this.code.length) this.extendCode(index)

        if (parameterMode === ParameterModes.RELATIVE) {
            if (this.relativeBase + this.code[index] >= this.code.length) this.extendCode(this.relativeBase + this.code[index]);
            return this.relativeBase + this.code[index]

        } else {
            return this.code[index]
        }
    }

    extendCode(length: number) {
        while (this.code.length <= length) {
            this.code.push(0)
        }
    }
}

export type { IntCode };