import Loader from './Loader.js';
import loadImage from './loadImage.js';
import isDataProtocol from '@lijuhong1981/jsurl/src/isDataProtocol.js';
import isBlobProtocol from '@lijuhong1981/jsurl/src/isBlobProtocol.js';

class ImageLoader extends Loader {

    ensureUrl(url) {
        const isImageData = (isDataProtocol(url) || isBlobProtocol(url));
        if (!isImageData)
            url = this.mergeUrl(url);
        return url;
    }

    /**
     * 加载的子类实现
     * @returns {Image} 返回的Image对象
     */
    onLoad(url, options) {
        return loadImage(url, options);
    }
};

const defaultLoader = new ImageLoader();

Object.defineProperties(ImageLoader, {
    default: {
        configurable: false,
        get: function () {
            return defaultLoader;
        }
    },
    getDefault: {
        configurable: false,
        writable: false,
        value: function () {
            return defaultLoader;
        }
    },
});

export default ImageLoader;