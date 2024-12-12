import Check from "./src/Check.js";
import isDefined from "./src/isDefined.js";
import getDefinedValue from "./src/getDefinedValue.js";
import isArray from "./src/isArray.js";
import isBoolean from "./src/isBoolean.js";
import isFunction from "./src/isFunction.js";
import isAsyncFunction from "./src/isAsyncFunction.js";
import isInteger from "./src/isInteger.js";
import isNumber from "./src/isNumber.js";
import isObject from "./src/isObject.js";
import isString from "./src/isString.js";
import isStringNotEmpty from "./src/isStringNotEmpty.js";
import isTypedArray from "./src/isTypedArray.js";
import isValid from "./src/isValid.js";
import getValidValue from "./src/getValidValue.js";

export default Check;
export {
    Check,
    isDefined,
    isDefined as defined,
    getDefinedValue,
    getDefinedValue as definedValue,
    isArray,
    isBoolean,
    isFunction,
    isAsyncFunction,
    isInteger,
    isNumber,
    isObject,
    isString,
    isStringNotEmpty,
    isTypedArray,
    isValid,
    isValid as valid,
    getValidValue,
    getValidValue as validValue,
};