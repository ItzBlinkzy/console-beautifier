const errorTypes = require("./errorTypes.json")
const chalk = require("chalk")
const align = require("align-text")
class ErrorBeautifier {
    constructor(error) {
        this.errorType = error.constructor.name;
        this.message = error.message;
        this.timeFired = new Date().toLocaleString();
        this.stack = error.stack
    }

    Beautify() {
        const pathRegex = /\(.+\)/gmi
        let [r, g, b] = errorTypes[this.errorType] ?? [255, 255, 255]

        let stack1 = this.stack.split("\n")
        stack1 = stack1.splice(1, stack1.length).map(el => el.trim()).join("\n").replace(/\(.+\)|at/gmi, "").split("\n")

        const stack2 = this.stack.match(pathRegex)

        const newStack = stack1.map((el, ind) => {
            if (typeof stack2[ind] === 'undefined') {
                return ""
            } else {
                return el + align(chalk.yellow(stack2[ind]), 60 - el.length)
            }
        })

        return chalk.rgb(r, g, b).bold(("\n" + this.errorType + " @ " + this.timeFired + ": ")) + chalk.rgb(255, 75, 75).bold(this.message) + "\n\n" + chalk.rgb(255, 255, 255).underline("Stack Trace:\n") + chalk.cyanBright(newStack.join("\n") + "\n")
    }
}

process.on("unhandledRejection", (err) => {
    console.log(new ErrorBeautifier(err).Beautify())
})

process.on("uncaughtException", (err) => {
    console.log(new ErrorBeautifier(err).Beautify())
})

module.exports.ErrorBeautifier = ErrorBeautifier;