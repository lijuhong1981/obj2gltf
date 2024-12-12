function isStringNotEmpty(value) {
    return typeof value === 'string' && value.length > 0;
};

export default isStringNotEmpty;