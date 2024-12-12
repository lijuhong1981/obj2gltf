/**
 * 读取文本
 * @param {File|Blob} file 传入的File或Blob对象
 * @param {Function} onLoad 加载完成回调函数
 * @param {Function} onError 加载出错回调函数
 * @param {String} encoding 文本编码
 * @returns {Promise}
 */
function readAsText(file, onLoad, onError, encoding) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function () {
            if (onLoad)
                onLoad(reader.result);
            resolve(reader.result);
        };
        reader.onerror = function (event) {
            console.error('readAsText failed.', event);
            if (onError)
                onError(event);
            reject(event);
        };
        reader.readAsText(file, encoding);
    });
}

/**
 * 读取ArrayBuffer
 * @param {File|Blob} file 传入的File或Blob对象
 * @param {Function} onLoad 加载完成回调函数
 * @param {Function} onError 加载出错回调函数
 * @returns {Promise}
 */
function readAsArrayBuffer(file, onLoad, onError) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function () {
            if (onLoad)
                onLoad(reader.result);
            resolve(reader.result);
        };
        reader.onerror = function (event) {
            console.error('readAsArrayBuffer failed.', event);
            if (onError)
                onError(event);
            reject(event);
        };
        reader.readAsArrayBuffer(file);
    });
}

/**
 * 读取DataURL
 * @param {File|Blob} file 传入的File或Blob对象
 * @param {Function} onLoad 加载完成回调函数
 * @param {Function} onError 加载出错回调函数
 * @returns {Promise}
 */
function readAsDataURL(file, onLoad, onError) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function () {
            if (onLoad)
                onLoad(reader.result);
            resolve(reader.result);
        };
        reader.onerror = function (event) {
            console.error('readAsDataURL failed.', event);
            if (onError)
                onError(event);
            reject(event);
        };
        reader.readAsDataURL(file);
    });
}

export {
    readAsText,
    readAsArrayBuffer,
    readAsDataURL,
};