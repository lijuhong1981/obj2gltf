function isValid(value) {
    if (value === undefined || value === null || (typeof value === 'number' && isNaN(value)))
        return false;
    return true;
};

export default isValid;