const queryPattern = /(?:^|&)([^&=]*)=?([^&]*)/g;

/**
 * 解析urlQuery字符串中的参数
 * @param {string} urlQuery
 * @param {object} result
 * @returns {object}
 */
function parseQueryParams(urlQuery, result = {}) {
    urlQuery.replace(queryPattern, function (match, key, value) {
        if (key)
            result[key] = value;
    });
    return result;
};

export default parseQueryParams;