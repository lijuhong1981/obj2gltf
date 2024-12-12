import isDefined from "./isDefined.js";

function getDefinedValue(...args) {
    for (let i = 0; i < args.length; i++) {
        if (isDefined(args[i]))
            return args[i];
    }
};

export default getDefinedValue;