import { dayFive as data } from "./data";
import {IntCodeComputer, IntCode} from "./IntCodeComputer";

function diagnoseCode() {
    let computer = new IntCodeComputer(data)
    return computer.executeCode(1);
}

function diagnoseThermalRadiatorController() {
    let computer = new IntCodeComputer(data)
    return computer.executeCode(5);
}