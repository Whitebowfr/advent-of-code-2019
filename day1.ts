import { dayOne as data } from "./data"

function calculateFuelNeededForRocket(deepScan: boolean): number {
    let fuelNeeded: number = 0;
    let totalAmountOfModules: number = data.split("\n").length;
    data.split("\n").forEach((moduleWeight, index) => {
        let fuelForModule = fuelNeededForModule(parseInt(moduleWeight), deepScan);
        fuelNeeded += fuelForModule;
        console.clear();
        console.log(`The module ${index + 1}/${totalAmountOfModules} needs ${fuelForModule} kg of fuel.`);
    });
    return fuelNeeded;
}

function fuelNeededForModule(weight: number, deepScan: boolean): number {
    if (!deepScan) {
        return Math.floor(weight / 3) - 2;
    } else {
        let fuelNeededForCurrentStage: number = Math.floor(weight / 3) - 2;
        let totalFuel: number = 0;
        while(fuelNeededForCurrentStage > 0) {
            totalFuel += fuelNeededForCurrentStage
            fuelNeededForCurrentStage = Math.floor(fuelNeededForCurrentStage / 3) - 2;
        }
        return totalFuel;
    }
}

console.log(calculateFuelNeededForRocket(true))