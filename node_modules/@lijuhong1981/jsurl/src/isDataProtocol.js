const pattern = /^data:/i;

function isDataProtocol(url) {
    return pattern.test(url);
};

export default isDataProtocol;