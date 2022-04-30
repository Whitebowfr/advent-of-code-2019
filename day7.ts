import { daySeven as data } from "./data";
import { IntCodeComputer, IntCode } from "./IntCodeComputer";

// Runs in about 10ms
function getHighestSignal(code: string, debug?: boolean) {
    if (typeof debug == undefined) debug = false;

    let highestSignal = 0;
    let amplifiersPhases: number[][] = getAllAmplifierPhases([0, 1, 2, 3, 4]);

    for (let amplifierPhase of amplifiersPhases) {
        let output = 0;
        for (let phaseSetting of amplifierPhase) {
            let computer = new IntCodeComputer(code);
            computer.executeCode([phaseSetting, output])
            output = computer.outputQueue[0];

            highestSignal = Math.max(highestSignal, output);
        }
        if (debug) {
            process.stdout.cursorTo(0);
            process.stdout.write(`Signal with phase ${amplifiersPhases.indexOf(amplifierPhase) + 1} / ${amplifiersPhases.length} is ${output}, highest signal is ${highestSignal}.`)
        }
    }
    
    return highestSignal;
}

function getHighestSignalWithFeedbackLoop(code: string, debug?: boolean) {
    if (debug == undefined) debug = false
    let amplifiersPhases : number[][] = getAllAmplifierPhases([5, 6, 7, 8, 9]);
    let highestSignal: number = 0;

    for (let amplifierPhase of amplifiersPhases) {
        let computers: IntCodeComputer[] = [];
        amplifierPhase.forEach(phaseSetting => {
            let currentComp = new IntCodeComputer(code)
            currentComp.setInputs(phaseSetting);
            computers.push(currentComp);
        });
        let stopCode: number = 0;
        let computerIndex = 0;
        computers[0].setInputs(0)

        while (stopCode !== 99) {
            
            let currentComp = computers[computerIndex]
            while (currentComp.outputQueue.length === 0 && stopCode !== 99) {
                stopCode = currentComp.step(currentComp.currentIndex).stopCode ?? 0;
                if (stopCode !== 99) currentComp.currentIndex += currentComp.currentStepSize;
            }

            if (stopCode !== 99) {
                let outputQueue = currentComp.outputQueue
                highestSignal = Math.max(...outputQueue, highestSignal)

                if (debug) {
                    process.stdout.cursorTo(0);
                    process.stdout.write(`Signal strength ${outputQueue[0]} found with combination ${amplifiersPhases.indexOf(amplifierPhase) + 1} / ${amplifiersPhases.length}. Highest is ${highestSignal}`)
                }
                

                currentComp.outputQueue = [];

                computers[computerIndex] = currentComp;

                computerIndex++;
                if (computerIndex >= computers.length) computerIndex = 0;
                computers[computerIndex].setInputs(outputQueue)
            }
        }
    }

    return highestSignal
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