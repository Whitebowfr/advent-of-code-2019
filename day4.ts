import { dayFour as data } from "./data";

// Runs in about 150ms with my input in part 1, 200ms in part 2 
function getNumberOfPossibilities(range: number[], allowOnlyDoubles: boolean): number {
    let amountOfPasswords: number = 0;

    // Calculating the max now instead of in the for declaration since I'll use it later
    let max: number = Math.max(...range);
    for (let i = Math.min(...range); i < max; i ++) {
        // No need to bother to search over 900 000, since the only number with non decreasing digits is 999 999 and it's outside of the bounds
        if (i > 900000) break;

        if (checkForDoubleNumbers(i, allowOnlyDoubles)) {
            if (checkForIncreasingNumbers(i)) {
                amountOfPasswords += 1;

                process.stdout.cursorTo(0);
                process.stdout.write(`Found number ${i} / ${max}`)
            }
        }
    }
    
    return amountOfPasswords;
}

function checkForDoubleNumbers(number: number, allowOnlyDoubles: boolean): boolean {
    if (allowOnlyDoubles) {
        let digits: string[] = number.toString().split("");

        // Using a different array to avoid problems when shifting the original while looping trough it
        let newArray: string[] = []
        let currentString = digits[0];

        // Separating the groups of identical numbers
        digits.forEach((digit, index) => {
            if (digits[index + 1]) {
                if (digit == digits[index + 1]) {
                    currentString += digits[index + 1];
                } else {
                    newArray.push(currentString);
                    currentString = digits[index + 1];
                }
            }
        });
        newArray.push(currentString);
        return newArray.some(element => {
            return (element.length == 2)
        });
    } else {
        // Checks for 2 identical digits following each other
        let doubles = number.toString().match(/(\d)(?=\d*\1)/);
        return (doubles != undefined);
    }
}

function checkForIncreasingNumbers(number: number) : boolean {
    let digits = number.toString().split("");
    return !digits.some((digit, index) => {
        if (digits[index + 1]) return digit > digits[index + 1];
    })
}

let range: number[] = data.split("-").map(el => parseInt(el));
console.log(`\nFound ${getNumberOfPossibilities(range, true)} different passwords`)
