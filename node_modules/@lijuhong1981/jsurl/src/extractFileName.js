/**
 * 从url中提取包含扩展名的文件名
 * @param {String} url 传入的url
 * @returns {String} 提取的文件名
 */
function extractFileName(url) {
    let index = url.lastIndexOf('?');
    if (index !== -1)
        url = url.substring(0, index);

    index = url.lastIndexOf('/');
    if (index === -1)
        return url;
    return url.substring(index + 1);
};

export default extractFileName;