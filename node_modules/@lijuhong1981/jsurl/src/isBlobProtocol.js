const pattern = /^blob:/i;

function isBlobProtocol(url) {
    return pattern.test(url);
};

export default isBlobProtocol;