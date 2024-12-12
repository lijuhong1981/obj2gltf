import {
    readAsText
} from './FileRead.js';

/**
 * 按行读取文本内容
 * @param {File|Blob|ArrayBuffer|String} data 读取的数据
 * @param {Function} callback 按行回调函数
 * @param {String} encoding 文本编码
 * @returns {Promise}
 */
function readLine(data, callback, encoding) {
    return new Promise((resolve, reject) => {

        function doReadLine(text) {
            const lines = text.split(/\r\n|\r|\n/g);
            let index = 0;
            const length = lines.length;

            lines.forEach(element => {
                if (callback)
                    try {
                        callback(element, index, length);
                    } catch (error) {
                        reject(error);
                    }
                index++;
            });

            resolve();
        }

        if (data instanceof Blob) {
            readAsText(data, (text) => {
                doReadLine(text);
            }, (error) => {
                reject(error);
            }, encoding);
        } else if (data instanceof ArrayBuffer) {
            const decoder = new TextDecode(encoding);
            const text = decoder.decode(data);
            doReadLine(text);
        } else if (typeof data === 'string') {
            const text = data;
            doReadLine(text);
        } else {
            reject(new Error('unsupported data.' + data));
        }
    });
};

export default readLine;