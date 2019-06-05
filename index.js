// Require Node.js dependencies
const { readFile } = require("fs").promises;
const { join } = require("path");
const { EOL } = require("os");

// Require Third-Party dependencies
const { yellow, cyan } = require("kleur");

// Constants
const grid = [];

/**
 * @async
 * @func main
 * @desc Algo mowitnow
 * @returns {void}
 */
async function main() {
    // Filters datas of the config file
    const configFile = await readFile(join(__dirname, "config.cfg"), { encoding: "utf8" });
    const [ gridLimit, ...mowersConfig ] = configFile.split(EOL);
    grid.push(...gridLimit.split(" "));

    // Init position & sequence mowers
    const mowers = []
    for (let i = 0; i < mowersConfig.length; i+=2) {
        const initialPos = mowersConfig[i];
        const sequence = mowersConfig[i+1];
        mowers.push([ initialPos, sequence ]);
    }

    // Loop on each mower
    for (const [ position, sequence ] of mowers) {
        let [ x, y, orient] = position.split(" ");
        const [ posMaxX, posMaxY ] = grid;

        for (const action of sequence) {
            switch (action) {
                case "F":
                    if (orient === "N") {
                        if (y === posMaxY) break;
                        y++;
                    }
                    if (orient === "E") {
                        if (x === posMaxX) break;
                        x++;
                    }
                    if (orient === "S") {
                        if (y === 0) break;
                        y--;
                    }
                    if (orient === "W") {
                        if (x === 0) break;
                        x--;
                    }
                    break;
                
                case "L":
                    if (orient === "N") { orient = "W"; break }
                    if (orient === "W") { orient = "S"; break }
                    if (orient === "S") { orient = "E"; break }
                    if (orient === "E") { orient = "N"; break }
                    break;

                case "R":
                    if (orient === "N") { orient = "E"; break }
                    if (orient === "E") { orient = "S"; break }
                    if (orient === "S") { orient = "W"; break }
                    if (orient === "W") { orient = "N"; break }
                    break;

                default:
                    throw new Error(`Actions must be ${yellow("L - R - F")} and find ${yellow(action)} action. Check your config.cfg`);
            }
        }
        // Log result
        console.log("==>", cyan([x, y, orient].join(" ")));
    }
}


main().catch(console.error);