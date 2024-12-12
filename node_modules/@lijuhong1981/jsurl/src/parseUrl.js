import splitUrl from "./splitUrl.js";
import parseQueryParams from "./parseQueryParams.js";

const names = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];

/**
 * 解析url，输出结果如下：
 * {
 *  source: '',
 *  protocol: '',
 *  authority: '',
 *  userInfo: '',
 *  user: '',
 *  password: '',
 *  host: '',
 *  port: '',
 *  relative: '',
 *  path: '',
 *  directory: '',
 *  file: '',
 *  query: '',
 *  queryParams: {
 *      key1: value1,
 *      key2: value2,
 *      ...
 *  },
 *  anchor: '',
 * }
 * @param {String} url 传入的url
 * @param {Object} result 传入的结果对象，可不填
 * @returns {Object} 输出的结果对象
 */
function parseUrl(url, result = {}) {
    const allParts = splitUrl(url);
    for (let i = 0; i < names.length; i++) {
        result[names[i]] = allParts[i];
    }
    result.queryParams = {};
    if (result.query)
        parseQueryParams(result.query, result.queryParams);
    return result;
};

export default parseUrl;