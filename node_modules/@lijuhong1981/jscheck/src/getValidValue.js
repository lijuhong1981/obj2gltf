import isValid from "./isValid.js";

function getValidValue(...args) {
    for (let i = 0; i < args.length; i++) {
        if (isValid(args[i]))
            return args[i];
    }
};

export default getValidValue;