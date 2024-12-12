const pattern = /^(https?:\/\/)?\.?\/?([\da-z])/i;

function isHttpProtocol(url) {
    return pattern.test(url);
};

export default isHttpProtocol;