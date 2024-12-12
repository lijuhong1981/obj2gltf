import fetchResponse from './fetchResponse.js';

/**
 * 封装使用fetch接口获取Json对象
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 返回Promise对象
 */
async function fetchJson(url, requestOptions) {
    try {
        const response = await fetchResponse(url, requestOptions);
        const json = await response.json();
        if (json)
            return json;
        else
            throw new Error('fetchJson result is null. ');
    } catch (error) {
        throw error;
    }
};

export default fetchJson;