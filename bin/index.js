const { build } = require("./build")
const { watch } = require("./watch")

const command = process.argv[2]

switch (command) {
    case "build":
        build()
        break;
    case "watch":
        watch()
        break;

    default:
        console.log(`Incorrect command "${command}"`);
        break;
}