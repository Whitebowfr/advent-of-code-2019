import { dayTwo as data } from './data'
import { IntCode, IntCodeComputer } from './IntCodeComputer';
const gravityAssistCompletion: number = 19690720;

function getResult(): void {
    let computer = new IntCodeComputer(data);
    computer.code[1] = 12
    computer.code[2] = 2
    computer.executeCode()
    console.log(`The final result is : ${computer.code[0]}`);
}

function findCorrectParameters(): void {
    for (let noun = 0; noun <= 99; noun++) {
        for (let verb = 0; verb <= 99; verb++) {
            let computer = new IntCodeComputer(data)
            computer.code[1] = noun
            computer.code[2] = verb
            computer.executeCode()
            if (computer.code[0] === gravityAssistCompletion ) {
                console.log(`\nPair found : noun = ${noun}, verb = ${verb}. The calculated result is : ${100 * noun + verb}`);
                return;
            } else {
                process.stdout.cursorTo(0)
                process.stdout.write(`Pair noun = ${noun}, verb = ${verb} gives a result of ${computer.code[0]}`)
            }
        }
    }
}