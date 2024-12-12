import arrayBufferToBinaryString from "./arrayBufferToBinaryString.js";

function arrayBufferToBinaryStringAsync(arrayBuffer) {
    return new Promise(function (resolve, reject) {
        try {
            const result = arrayBufferToBinaryString(arrayBuffer);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
};

export default arrayBufferToBinaryStringAsync;