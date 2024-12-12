import fetchResponse from './fetchResponse.js';

/**
 * 封装使用fetch接口获取ArrayBuffer对象
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 返回Promise对象
 */
async function fetchArrayBuffer(url, requestOptions) {
    try {
        const response = await fetchResponse(url, requestOptions);
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer)
            return arrayBuffer;
        else
            throw new Error('fetchArrayBuffer result is null. ');
    } catch (error) {
        throw error;
    }
};

export default fetchArrayBuffer;