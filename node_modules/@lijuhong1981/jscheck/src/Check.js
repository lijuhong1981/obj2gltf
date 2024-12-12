import isDefined from "./isDefined.js";
import isValid from "./isValid.js";

const Check = {};

Check.typeOf = {};

function getUndefinedErrorMessage(name) {
    return name + " is required, actual value was undefined.";
}

function getInvalidErrorMessage(name) {
    return name + " is required, actual value was invalid.";
}

function getFailedTypeErrorMessage(actual, expected, name) {
    return (
        "Expected " +
        name +
        " to be typeof " +
        expected +
        ", actual typeof was " +
        actual
    );
}

Check.defined = function (name, test) {
    if (!isDefined(test)) {
        throw new Error(getUndefinedErrorMessage(name));
    }
};

Check.valid = function (name, test) {
    if (!isValid(test)) {
        throw new Error(getInvalidErrorMessage(name));
    }
};

Check.typeOf.func = function (name, test) {
    if (typeof test !== "function") {
        throw new Error(
            getFailedTypeErrorMessage(typeof test, "function", name)
        );
    }
};

Check.typeOf.string = function (name, test) {
    if (typeof test !== "string") {
        throw new Error(
            getFailedTypeErrorMessage(typeof test, "string", name)
        );
    }
};

Check.typeOf.number = function (name, test) {
    if (typeof test !== "number") {
        throw new Error(
            getFailedTypeErrorMessage(typeof test, "number", name)
        );
    }
};

Check.typeOf.number.lessThan = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test >= limit) {
        throw new Error(
            "Expected " +
            name +
            " to be less than " +
            limit +
            ", actual value was " +
            test
        );
    }
};

Check.typeOf.number.lessThanOrEquals = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test > limit) {
        throw new Error(
            "Expected " +
            name +
            " to be less than or equal to " +
            limit +
            ", actual value was " +
            test
        );
    }
};

Check.typeOf.number.greaterThan = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test <= limit) {
        throw new Error(
            "Expected " +
            name +
            " to be greater than " +
            limit +
            ", actual value was " +
            test
        );
    }
};

Check.typeOf.number.greaterThanOrEquals = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test < limit) {
        throw new Error(
            "Expected " +
            name +
            " to be greater than or equal to" +
            limit +
            ", actual value was " +
            test
        );
    }
};

Check.typeOf.number.equals = function (name1, name2, test1, test2) {
    Check.typeOf.number(name1, test1);
    Check.typeOf.number(name2, test2);
    if (test1 !== test2) {
        throw new Error(
            name1 +
            " must be equal to " +
            name2 +
            ", the actual values are " +
            test1 +
            " and " +
            test2
        );
    }
};

Check.typeOf.object = function (name, test) {
    if (typeof test !== "object") {
        throw new Error(
            getFailedTypeErrorMessage(typeof test, "object", name)
        );
    }
};

Check.typeOf.bool = function (name, test) {
    if (typeof test !== "boolean") {
        throw new Error(
            getFailedTypeErrorMessage(typeof test, "boolean", name)
        );
    }
};

Check.typeOf.array = function (name, test) {
    if (Array.isArray(test) === false) {
        throw new Error(getFailedTypeErrorMessage(typeof test, 'array', name));
    }
};

Check.typeOf.integer = function (name, test) {
    if (Number.isSafeInteger(test) === false) {
        throw new Error(getFailedTypeErrorMessage(typeof test, 'integer', name));
    }
}

Check.typeOf.integer.lessThan = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test >= limit) {
        throw new Error('Expected ' +
            name +
            ' to be less than ' +
            limit +
            ', actual value was ' +
            test);
    }
};

Check.typeOf.integer.lessThanOrEquals = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test > limit) {
        throw new Error('Expected ' +
            name +
            ' to be less than or equal to ' +
            limit +
            ', actual value was ' +
            test);
    }
};

Check.typeOf.integer.greaterThan = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test <= limit) {
        throw new Error('Expected ' +
            name +
            ' to be greater than ' +
            limit +
            ', actual value was ' +
            test);
    }
};

Check.typeOf.integer.greaterThanOrEquals = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test < limit) {
        throw new Error('Expected ' +
            name +
            ' to be greater than or equal to' +
            limit +
            ', actual value was ' +
            test);
    }
};

Check.typeOf.integer.equals = function (name1, name2, test1, test2) {
    Check.typeOf.integer(name1, test1);
    Check.typeOf.integer(name2, test2);
    if (test1 !== test2) {
        throw new Error(
            name1 +
            " must be equal to " +
            name2 +
            ", the actual values are " +
            test1 +
            " and " +
            test2
        );
    }
};

Check.instanceOf = function (name, test, target) {
    if (test instanceof target === false) {
        throw new Error(getFailedTypeErrorMessage(false, target.name, name));
    }
};

Check.equals = function (name, test, target) {
    Check.isValid(test);
    Check.isValid(target);
    if (test !== target) {
        throw new Error('Expected ' +
            name +
            ' to be equal ' +
            target +
            ', actual value was ' +
            test);
    }
};

export default Check;