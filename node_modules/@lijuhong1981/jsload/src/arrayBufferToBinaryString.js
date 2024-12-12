const MaxStackSize = 1024 * 50;

/**
 * 将一个ArrayBuffer类型数组转换为二进制字符串
 * @param {ArrayBuffer} arrayBuffer 需要转换的arrayBuffer
 * @returns {String} 转换后的二进制字符串
 */
function arrayBufferToBinaryString(arrayBuffer) {
    const length = arrayBuffer.byteLength;
    let start = 0;
    let result = '';
    while (start < length) {
        let end = start + MaxStackSize;
        const buffer = arrayBuffer.slice(start, Math.min(end, length));
        start = end;
        const binaryString = String.fromCharCode.apply(null, new Uint8Array(buffer));
        result += binaryString;
    }
    return result;
}

export default arrayBufferToBinaryString;