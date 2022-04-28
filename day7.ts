import { daySeven as data } from "./data";
import { IntCodeComputer as comp, IntCode } from "./IntCodeComputer";

// Runs in about 10ms
function getHighestSignal(debug?: boolean) {
    if (typeof debug == undefined) debug = false;

    let code: IntCode = comp.parseIntCode(data);
    let highestSignal = 0;
    let amplifiersPhases: number[][] = getAllAmplifierPhases([0, 1, 2, 3, 4]);

    for (let amplifierPhase of amplifiersPhases) {
        let output = 0;
        for (let phaseSetting of amplifierPhase) {
            let result = comp.executeCode(code, [phaseSetting, output]);

            output = result.outputQueue[0];

            highestSignal = Math.max(highestSignal, output);
        }
        if (debug) {
            process.stdout.cursorTo(0);
            process.stdout.write(`Signal with phase ${amplifiersPhases.indexOf(amplifierPhase) + 1} / ${amplifiersPhases.length} is ${output}, highest signal is ${highestSignal}.`)
        }
    }
    
    return highestSignal;
}

function getHighestSignalWithFeedbackLoop(debug?: boolean) {
    if (typeof debug == undefined) debug = false;

    let code: IntCode = comp.parseIntCode(`3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
    27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`);

    let highestSignal = 0;
    let amplifiersPhases: number[][] = getAllAmplifierPhases([5, 6, 7, 8, 9]);

    for (let amplifierPhase of amplifiersPhases) {
        let output: number[] = [0];
        let result;
        while (result?.stopCode !== 99) {
            for (let phaseSetting of amplifierPhase) {
                console.log([phaseSetting, ...output])
                result = comp.executeCode(code, [phaseSetting, ...output]);
    
                output = result.outputQueue;
    
                highestSignal = Math.max(highestSignal, output[0]);
            }
            if (debug) {
                process.stdout.cursorTo(0);
                process.stdout.write(`Signal with phase ${amplifiersPhases.indexOf(amplifierPhase) + 1} / ${amplifiersPhases.length} is ${output}, highest signal is ${highestSignal}.`)
            }
        }
        
    }
    
    return highestSignal;
}

function getAllAmplifierPhases(arr: number[]): number[][] {
    let result = [];

    for (let i = 0; i < arr.length; i = i + 1) {
        let restOfPhases = getAllAmplifierPhases(arr.slice(0, i).concat(arr.slice(i + 1)));

        if (!restOfPhases.length) {
            result.push([arr[i]])
        } else {
            for (let j = 0; j < restOfPhases.length; j = j + 1) {
                result.push([arr[i]].concat(restOfPhases[j]))
            }
        }
    }
    return result;
}

let test = comp.parseIntCode(`3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`)
while (true) {
    let output: number[] = [];
    ([9,8,7,6,5]).forEach(phase => {
        let result;
        if (output.length == 0) {
             result = comp.executeCode(test, phase)
        } else {
             result = comp.executeCode(test, [phase, ...output])
        }
        output = result.outputQueue;
        console.log(output)

    });
}
