import splitPath from "./splitPath.js";

const names = ['source', 'directory', 'root', 'filename', 'basename', 'extname'];

/**
 * 解析path，输出结果如下：
 * {
 *  source: 'c:/xxx/xxx/test.png',
 *  directory: 'c:/xxx/xxx/',
 *  root: 'c:/',
 *  filename: 'test.png',
 *  basename: 'test',
 *  extname: '.png',
 *  format: 'png',
 * }
 * @param {String} path 传入的path
 * @param {Object} result 传入的结果对象，可不填
 * @returns {Object} 输出的结果对象
 */
function parsePath(path, result = {}) {
    const allParts = splitPath(path);
    for (let i = 0; i < names.length; i++) {
        result[names[i]] = allParts[i];
    }
    if (result.extname)
        result['format'] = result.extname.startsWith('.') ? result.extname.substring(1) : result.extname;
    return result;
};

export default parsePath;