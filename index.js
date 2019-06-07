// Require Node.js dependencies
const { readFile } = require("fs").promises;
const { join } = require("path");
const { EOL } = require("os");

// Require Third-Party dependencies
const { cyan } = require("kleur");

// Constants
const GRID = [];

/**
 * @async
 * @func main
 * @desc Algo mowitnow
 * @returns {void}
 */
async function main() {
    // Filters datas of the config file
    const letConfig = new Set("NESWLRF");
    const message = "Configuration must contain the following letters : N-E-S-W and L-R-F. Check your config.cfg file.";
    const fileConfig = await readFile(join(__dirname, "config.cfg"), { encoding: "utf8" });
    const [ gridLimit, ...mowersConfig ] = fileConfig.toUpperCase().split(EOL);
    GRID.push(...gridLimit.split(" "));

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
        const [ posMaxX, posMaxY ] = GRID;

        // Check config
        if (!letConfig.has(orient) || !sequence.split("").every((letter) => letConfig.has(letter))) {
            throw new Error(message);
        }

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
                    break;
            }
        }
        // Log result
        const initialPos = `Initial position : ${cyan(position)}  / `
        const prog = `Sequence : ${cyan(sequence)}  / `
        const out = `Output : ${cyan([x, y, orient].join(" "))}`
        console.log("Mower 1 ==>", initialPos, prog, out);
    }
}

main().catch(console.error);