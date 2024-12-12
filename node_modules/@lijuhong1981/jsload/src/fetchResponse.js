/**
 * 封装使用fetch接口获取Response对象
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 返回Promise对象
 */
async function fetchResponse(url, requestOptions) {
    if (typeof url !== 'string') {
        throw new Error('fetch url ' + url + ' is illegal. ');
    }
    try {
        const response = await fetch(url, requestOptions);
        if (response.ok)
            return response;
        else
            throw new Error('fetch url ' + url + ' failed, status=' + response.status + ' ;statusText=' + response.statusText);
    } catch (error) {
        throw error;
    }
};

export default fetchResponse;