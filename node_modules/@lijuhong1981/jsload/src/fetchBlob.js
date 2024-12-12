import fetchResponse from './fetchResponse.js';

/**
 * 封装使用fetch接口获取Blob对象
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 返回Promise对象
 */
async function fetchBlob(url, requestOptions) {
    try {
        const response = await fetchResponse(url, requestOptions);
        const blob = await response.blob();
        if (blob)
            return blob;
        else
            throw new Error('fetchBlob result is null. ');
    } catch (error) {
        throw error;
    }
};

export default fetchBlob;