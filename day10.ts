import { parse } from "path";
import { dayTen as data } from "./data";

type coordinates = [x: number, y: number]

interface map {
    coords: coordinates[],
    coordsHash: string[]
}

declare global {
    interface Math {
        PGCD: (a: number, b: number) => number;
    }
}

Math.PGCD = function (a, b): number {
    if (!b) return a

    return Math.PGCD(b, a % b)
}

function parseAsteroidAsCoordinates(data: string) : map {
    let finalData: coordinates[] = []
    let coordsHash: string[] = []
    data.split("\n").forEach((y, yIndex) => {
        y.split("").forEach((x, xIndex) => {
            if (x !== ".") {
                finalData.push([xIndex, yIndex])
                coordsHash.push(`${xIndex}-${yIndex}`)
            }
        })
    })
    return {coords: finalData, coordsHash}
}

function calculateAsteroidsInLineOfSight(asteroids: map, monitoringStation: coordinates): {coords: coordinates[], hashes: string[]} {
    let coveredLinesHashes: string[] = []
    let coveredLines: coordinates[] = []

    asteroids.coords.forEach((coordinates, index) => {
        if (asteroids.coordsHash[index] !== monitoringStation.join("-")) {
            let difference: coordinates = [coordinates[0] - monitoringStation[0], coordinates[1] - monitoringStation[1]]
            let pgcd = Math.abs(Math.PGCD(...difference))
            let smallestDifference: coordinates = [difference[0] / pgcd, difference[1] / pgcd]
            if (coveredLinesHashes.indexOf(smallestDifference.join("-")) === -1) {
                coveredLinesHashes.push(smallestDifference.join("-"))
                coveredLines.push(smallestDifference)
            }
        }
    });

    return {coords: coveredLines, hashes: coveredLinesHashes}
}

// The best position is [23, 29], with 263 asteroids in line of sight.
function getBestMonitoringStationPosition(data: string, debug?: boolean): number {
    if (debug === undefined) debug = false;

    let map = parseAsteroidAsCoordinates(data);
    let maxNumberOfAsteroids = 0;

    for (let position of map.coords) {
        let numberOfAsteroids = calculateAsteroidsInLineOfSight(map, position).hashes.length;
        maxNumberOfAsteroids = Math.max(maxNumberOfAsteroids, numberOfAsteroids);

        if (debug) {
            process.stdout.cursorTo(0);
            process.stdout.write(`${numberOfAsteroids} can be seen from position ${position} (${map.coordsHash.indexOf(position.join("-")) + 1} / ${map.coords.length}). The max number is ${maxNumberOfAsteroids}.`)
        }
    }

    return maxNumberOfAsteroids
}

async function vaporizeAsteroids(data: string, monitoringStationPosition: coordinates, debug?: boolean): Promise<any> {
    if (debug === undefined) debug = false;

    let deletedAsteroids: coordinates[] = [];
    let map: map = parseAsteroidAsCoordinates(data);

    while (map.coords.length !== 1)  {
        map = parseAsteroidAsCoordinates(data)
        let asteroidsDirections = calculateAsteroidsInLineOfSight(map, monitoringStationPosition)
        let result = sortCoordinatesByCircle(asteroidsDirections.coords, monitoringStationPosition)
        asteroidsDirections.coords = result.coords
        let i = 0
        let previousAngle = 0
        for (let equation of asteroidsDirections.coords) {
            let multiplier = 1
            let asteroidCoords: coordinates = [equation[0] + monitoringStationPosition[0], equation[1] + monitoringStationPosition[1]]
            while (map.coordsHash.indexOf(asteroidCoords.join("-")) === -1) {
                asteroidCoords = [equation[0] * multiplier + monitoringStationPosition[0], equation[1] * multiplier + monitoringStationPosition[1]]
                multiplier++
            }

            data = deleteAsteroid(asteroidCoords, data, monitoringStationPosition)
            deletedAsteroids.push(asteroidCoords)
            // if (debug) {
            //     process.stdout.cursorTo(0);
            //     process.stdout.write(`Deleted asteroid at pos ${asteroidCoords}.`)
            // }
            if (debug) {
                console.clear()
                console.log(data)
                await new Promise(resolve => setTimeout(resolve, (result.angles[i] - previousAngle) * 100))
            }
            previousAngle = result.angles[i]
            i++
        }
        
    }
    
    return deletedAsteroids
}

function deleteAsteroid(asteroidCoords: coordinates, map: string, monitoringStation: coordinates) : string {
    let newMap = map.split("\n");
    newMap = newMap.map((y, yIndex) => y.split("").map((x, xIndex) => (xIndex === monitoringStation[0] && yIndex === monitoringStation[1]) ? "O" : (xIndex === asteroidCoords[0] && yIndex === asteroidCoords[1]) ? "." : x).join(""));
    return newMap.join("\n")
}

function sortCoordinatesByCircle(map: coordinates[], positionOfOrigin: coordinates): {coords: coordinates[], angles: number[]} {
    let object: any[] = []

    map.forEach(coords => {
        let absoluteAngle = Math.atan(
            coords[1] /
            coords[0]
        )
        object.push([
            coords,
            (coords[0] < 0 ? (2 * Math.PI) + absoluteAngle : absoluteAngle)
        ])
    });

    object.sort((a, b) => {
        return (a[1] > b[1]) ? 1 : -1
    })

    // console.log(object)


    let result: coordinates[] = []
    let angles: number[] = []
    object.forEach(element => {
        result.push(element[0])
        angles.push(element[1])
    });

    return {coords: result, angles}
}