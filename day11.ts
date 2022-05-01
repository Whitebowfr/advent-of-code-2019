import { dayEleven as data } from "./data";
import { IntCode, IntCodeComputer } from "./IntCodeComputer";

type coordinates = [x: number, y: number]
type direction = "up"|"down"|"left"|"right"

// TODO : Make this working

class paintingRobot {
    code: string;
    position: coordinates;
    direction: direction;

    constructor(code: string, position: coordinates, direction: direction) {
        this.code = code;
        this.direction = direction;
        this.position = position;
    }

    getNumberOfPanelsPainted(debug?: boolean) : number {
        let computer = new IntCodeComputer(this.code);
        computer.setInputs(0)
        let coveredPanels: {[keys: string]: number} = {}
        let stopCode = 0;
        
        while (stopCode !== 99) {
            stopCode = computer.step().stopCode ?? 0;
            computer.currentIndex += computer.currentStepSize

            if (computer.outputQueue.length === 2 && stopCode !== 99) {
                coveredPanels[this.position.join(",")] = computer.outputQueue[0];
                
                this.move(computer.outputQueue[1]);
                if (debug) {
                    process.stdout.cursorTo(0)
                    process.stdout.write(`\nRobot is at pos ${this.position} and facing ${this.direction} after following output ${computer.outputQueue}`)
                }
                computer.outputQueue = [];
                computer.setInputs(coveredPanels[this.position.join(",")] ?? 0)
                
            }
        }

        return Object.keys(coveredPanels).length;
    }

    move(direction: number) {
        let directions: direction[] = ["down", "left", "up", "right"]
        let newDirectionIndex: number = directions.indexOf(this.direction)

        if (direction === 0) {
            newDirectionIndex--;
            if (newDirectionIndex < 0) newDirectionIndex = 3;
        } else if (direction === 1) {
            newDirectionIndex++;
            if (newDirectionIndex > directions.length) newDirectionIndex = 0;
        }
        
        this.direction = directions[newDirectionIndex]
        if (this.direction === "up") {
            this.position[1] -= 1;
        } else if (this.direction === "down") {
            this.position[1] += 1;
        } else if (this.direction === "left") {
            this.position[0] -= 1;
        } else if (this.direction === "right") {
            this.position[0] += 1;
        }
    }
}

let robot = new paintingRobot(data, [0, 0], "up")
console.log(robot.getNumberOfPanelsPainted(true))