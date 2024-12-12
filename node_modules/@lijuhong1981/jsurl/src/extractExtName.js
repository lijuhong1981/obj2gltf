/**
 * 从url中提取文件扩展名
 * @param {String} url 传入的url
 * @param {Boolean} containsPoint 是否包含'.'符号，默认true
 * @returns {String} 提取的扩展名
 */
function extractExtName(url, containsPoint = true) {
    let index = url.lastIndexOf('?');
    if (index !== -1)
        url = url.substring(0, index);

    index = url.lastIndexOf('.');
    if (index === -1)
        return '';
    return url.substring(containsPoint ? index : index + 1);
};

export default extractExtName;