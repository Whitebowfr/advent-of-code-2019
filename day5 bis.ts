import { dayFive as data } from "./data";
import {IntCodeComputer, IntCode} from "./IntCodeComputer";

function diagnoseCode() {
    let code = IntCodeComputer.parseIntCode(data);
    return IntCodeComputer.executeCode(code, 1);
}

function diagnoseThermalRadiatorController() {
    let code = IntCodeComputer.parseIntCode(data);
    return IntCodeComputer.executeCode(code, 5);
}