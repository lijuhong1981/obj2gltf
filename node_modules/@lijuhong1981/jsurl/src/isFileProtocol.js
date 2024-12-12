const pattern = /^file:\/\//i;

function isFileProtocol(url) {
    return pattern.test(url);
};

export default isFileProtocol;