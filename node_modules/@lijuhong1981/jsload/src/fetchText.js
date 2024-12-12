import fetchResponse from './fetchResponse.js';

/**
 * 封装使用fetch接口获取文本
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 返回Promise对象
 */
async function fetchText(url, requestOptions) {
    try {
        const response = await fetchResponse(url, requestOptions);
        const text = await response.text();
        if (text)
            return text;
        else
            throw new Error('fetchText result is null. ');
    } catch (error) {
        throw error;
    }
};

export default fetchText;