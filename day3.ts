import { dayThree as data } from "./data";

// FIXME : This entire code isn't working properly

interface Cable {
    points: Point[];
}

interface Point {
    x: number;
    y: number;
}

declare global {
    interface Number {
        between: (...ars: number[]) => boolean;
    }
}

Number.prototype.between = function (...args: number[]): boolean {
    let min = Math.min(...args);
    let max = Math.max(...args);
    return this >= min && this <= max;
}

function parseCables(inputs: string): Cable[] {
    let cables: Array<string> = inputs.split("\n");
    let result: Cable[] = [];
    cables.forEach(cable => {
        let currentCable: Cable = { points: [{ x: 0, y: 0 }] };
        cable.split(",").forEach((node, index) => {
            let direction: string | null = node.match(/R|U|L|D/)![0];
            let cableLength: number = parseInt(node.match(/[0-9]+/)![0]);
            if (direction === null || isNaN(cableLength)) throw new Error(`Direction or cable length not found in node ${node} : ${direction} ${cableLength}`);
            let newCoordinates: Point = { ...currentCable.points[index] };

            switch (direction) {
                case "R":
                    newCoordinates.x += cableLength;
                    break;
                case "U":
                    newCoordinates.y -= cableLength;
                    break;
                case "L":
                    newCoordinates.x -= cableLength;
                    break;
                case "D":
                    newCoordinates.y += cableLength;
                    break;
                default:
                    throw new Error(`Unknown direction found at node ${index + 1} : direction ${direction} found in ${node}.`);
            }

            currentCable.points.push(newCoordinates);
        });
        result.push(currentCable);
    });
    return result;
}

function findIntersectingPoints(cables: Cable[]): Point[] {
    let result: Point[] = [];
    cables[0].points.forEach((point, index, currentPoints) => {
        if (currentPoints[index + 1] && (point.x !== 0 && point.y !== 0)) {
            let firstLine: Point[] = [point, currentPoints[index + 1]]

            cables[1].points.forEach((pointBis, indexBis, currentPointsBis) => {
                if (currentPointsBis[indexBis + 1] && (pointBis.x !== 0 && pointBis.y !== 0)) {
                    let secondLine: Point[] = [pointBis, currentPointsBis[indexBis + 1]]
                    let intersectionPoint: Point | null = checkForIntersection(firstLine, secondLine);
                    if (intersectionPoint) {
                        result.push(intersectionPoint);
                    }
                }
            });

        }
    });
    return result;
}

function findIntersectingPointsTheRetardWay(cables: Cable[]): number {
    let finalMap: Map<string, number> = new Map<string, number>();

    cables.forEach(cable => {
        cable.points.forEach((point, index) => {
            let nextPoint: Point| null = cable.points[index + 1];
            let alreadyPassed: string[] = [];
            if (nextPoint !== undefined) {
                if (point.x === nextPoint.x) {
                    for (let y: number = Math.min(nextPoint.y, point.y) + 2; y < Math.max(point.y, nextPoint.y); y++) {
                        let key: string = point.x + "," + y;
                        if (!alreadyPassed.includes(key)) {
                            let value: number | undefined = finalMap.get(key);
                            finalMap.set(key, (value !== undefined) ? value + 1 : 1);
                            alreadyPassed.push(key);
                        }
                    }
                } else if (point.y == nextPoint.y) {
                    for (let x: number = Math.min(nextPoint.x, point.x) + 2; x < Math.max(point.x, nextPoint.x); x++) {
                        let key: string = x + "," + point.y;
                        if (!alreadyPassed.includes(key)) {
                            let value: number | undefined = finalMap.get(key);
                            finalMap.set(key, (value !== undefined) ? value + 1 : 1);
                            alreadyPassed.push(key);
                        }
                    }
                }
                
            }
        });
    });
    
    let intersectionPoints: Point[] = []
    for (let horizontal of finalMap) {
        if (horizontal[1] >= 2) {
            let x: string = horizontal[0].split(",")[0];
            let y: string = horizontal[0].split(",")[1];
            intersectionPoints.push({x: parseInt(x), y: parseInt(y)})
        }
    }
    console.log(intersectionPoints)
    return getDistanceFromClosestPoint(intersectionPoints)
}

function checkForIntersection(line1: Point[], line2: Point[]): Point | null {
    if (line2[0].x.between(line1[0].x, line1[1].x) && line1[1].y.between(line2[0].y, line2[1].y)) {
        return { x: line2[1].x, y: line1[1].y };
    }
    if (line2[0].y.between(line1[0].y, line1[1].y) && line1[1].x.between(line2[0].x, line2[1].x)) {
        return { x: line1[1].x, y: line2[1].y };
    }
    return null
}

function getDistanceFromClosestPoint(intersections: Point[]): number {
    let distances: number[] = []
    intersections.forEach(intersectionPoint => {
        distances.push(Math.abs(intersectionPoint.x) + Math.abs(intersectionPoint.y));
    });
    return Math.min(...distances);
}

console.time()
let cables: Cable[] = parseCables(data);
let points: Point[] = findIntersectingPoints(cables);
console.log(findIntersectingPointsTheRetardWay(cables));
console.timeEnd()