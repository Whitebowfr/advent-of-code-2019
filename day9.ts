import { IntCode, IntCodeComputer } from "./IntCodeComputer"
import { dayNine as data } from "./data"

function getBOOSTKeyCode(code: string) : number {
    return new IntCodeComputer(data).executeCode(1).outputQueue[0]
}

function getDistressSignalCoordinates(code: string) : number[] {
    return new IntCodeComputer(data).executeCode(2).outputQueue
}