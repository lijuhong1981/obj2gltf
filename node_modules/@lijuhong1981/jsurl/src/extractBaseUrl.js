/**
 * 从url中提取baseUrl
 * @param {String} url 传入的url
 * @returns {String} 提取的baseUrl
 */
function extractBaseUrl(url) {
    const index = url.lastIndexOf('/');
    if (index === -1) return './';
    return url.substring(0, index + 1);
}

export default extractBaseUrl;