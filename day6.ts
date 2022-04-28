
import { daySix as data } from "./data";
const fs = require("fs");

interface orbits {
    [key: string]: any
}

function parseOrbits(data: string) : object {
    let UAOorbits: string[] = data.split("\n");
    let OrbitsTree: orbits = {};
    UAOorbits.forEach((orbitString) => {
        let [planetA, planetB] = [...orbitString.split(")")];
        if (!OrbitsTree.hasOwnProperty(planetA)) {
            OrbitsTree[planetA] = [];
        }
        OrbitsTree[planetA].push(planetB);
    });

    // Removing duplicates/compacting
    let singles: string[] = [];
    Object.keys(OrbitsTree).forEach((key, index) => {
        let isThePlanetTheLastOneToOrbit = !OrbitsTree[key].some((planet: string) => {return OrbitsTree.hasOwnProperty(planet)})
        if (isThePlanetTheLastOneToOrbit) {
            singles.push(key);
        }
    });

    singles.forEach((lastPlanet, index) => {
        let isOriginalPlanet = false;
        while (isOriginalPlanet === false) {
            let isPlanetStored = false;
            for (let index = 0; index < Object.keys(OrbitsTree).length; index++) {
                const key = Object.keys(OrbitsTree)[index];
                let isLastPlanetInThisOne = OrbitsTree[key].some((planet: string) => {return planet === lastPlanet});
                if (isLastPlanetInThisOne) {
                    OrbitsTree[key][lastPlanet] = OrbitsTree[lastPlanet];
                    delete OrbitsTree[lastPlanet];
                    isPlanetStored = true;
                    lastPlanet = key
                    console.log(key)
                    break;
                }
            }
            if (!isPlanetStored) {
                isOriginalPlanet = true;
            }
        }
    });

    return OrbitsTree;
}

let dataExtracted = parseOrbits(data)
console.log(JSON.stringify(dataExtracted));
fs.writeFile('./test.txt', JSON.stringify(dataExtracted), (e: Error) => {});
  