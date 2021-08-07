const { watch } = require("fs");
const { build } = require("./build")


function watchSource () {
    let watching = true
    watch("./src", () => {
        console.log("Waiting for change in src directory...");
        
        if (!watching) return
        watching = false

        const timestamp = Date.now()
        console.log("Building project...");
        build()
        console.log(`Project built in ${(Date.now() - timestamp) / 1000} seconds \n`);

        // Prevent second-time build in short delay
        setTimeout(() => {
            watching = true
        }, 100);
    })
}

module.exports.watch = watchSource