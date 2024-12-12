const pattern = /^(https?|ftp|file|data|blob):/i;

function hasProtocolPrefix(url) {
    return pattern.test(url);
};

export default hasProtocolPrefix;