import {
    readAsText,
    readAsArrayBuffer,
    readAsDataURL
} from './FileRead.js';

const fileInput = document.createElement('input');
fileInput.type = 'file';

/**
 * 触发文件输入
 * @param {Function} callback 回调函数
 * @returns {Promise}
 */
function inputFile(callback) {
    return new Promise((resole, reject) => {

        function onInput() {
            fileInput.removeEventListener('change', onInput, false);
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (callback)
                    callback(file);
                if (resole)
                    resole(file);
            }
        }

        fileInput.addEventListener('change', onInput, false);

        fileInput.click();
    });
}

/**
 * 触发文件输入并读取文本
 * @param {Function} onLoad 加载完成回调函数
 * @param {Function} onError 加载出错回调函数
 * @param {String} encoding 文本编码
 * @returns {Promise}
 */
function inputFileAsText(onLoad, onError, encoding) {
    return new Promise((resole, reject) => {
        inputFile().then((file) => {
            readAsText(file, onLoad, onError, encoding).then((result) => {
                resole(result);
            }).catch((error) => {
                reject(error);
            });
        });
    });
}

/**
 * 触发文件输入并读取ArrayBuffer
 * @param {Function} onLoad 加载完成回调函数
 * @param {Function} onError 加载出错回调函数
 * @returns {Promise}
 */
function inputFileAsArrayBuffer(onLoad, onError) {
    return new Promise((resole, reject) => {
        inputFil().then((file) => {
            readAsArrayBuffer(file, onLoad, onError).then((result) => {
                resole(result);
            }).catch((error) => {
                reject(error);
            });
        });
    });
}

/**
 * 触发文件输入并读取DataURL
 * @param {Function} onLoad 加载完成回调函数
 * @param {Function} onError 加载出错回调函数
 * @returns {Promise}
 */
function inputFileAsDataURL(onLoad, onError) {
    return new Promise((resole, reject) => {
        inputFile().then((file) => {
            readAsDataURL(file, onLoad, onError).then((result) => {
                resole(result);
            }).catch((error) => {
                reject(error);
            });
        });
    });
}

export {
    inputFile,
    inputFileAsText,
    inputFileAsArrayBuffer,
    inputFileAsDataURL,
};