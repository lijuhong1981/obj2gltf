function destroyHTMLElementImpl(element, deepChildren) {
    if (deepChildren) {
        while (element.lastChild) {
            destroyHTMLElementImpl(element.lastChild, deepChildren);
        }
    }
    if (element.parentNode)
        element.parentNode.removeChild(element);
    if (element instanceof HTMLVideoElement) {
        if (element.hlsPlayer) {
            element.hlsPlayer.destroy();
            delete element.hlsPlayer;
        }
        if (element.flvPlayer) {
            try {
                element.flvPlayer.unload();
                element.flvPlayer.detachMediaElement();
            } catch (error) {
                console.error(error);
            }
            element.flvPlayer.destroy();
            delete element.flvPlayer;
        }
        try {
            element.pause();
            element.loop = false;
            element.removeAttribute('src');
            element.load();
        } catch (error) {
            console.error(error);
        }
    } else if (element instanceof HTMLImageElement) {
        //指向一张空白图片以释放之前的图片
        element.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    } else if (element instanceof HTMLCanvasElement) {
        //移除apng动画
        if (element.apngPlayer) {
            element.apngPlayer.stop();
            delete element.apngPlayer;
        }
        //移除gif动画
        if (element.gifPlayer) {
            element.gifPlayer.stop();
            delete element.gifPlayer;
        }
        //修改canvas尺寸为0可以释放之前的绘制结果
        element.width = element.height = 0;
    }
}

/**
 * 销毁HTMLElement对象
 * @param {HTMLElement} element HTMLElement对象
 * @param {Boolean} deepChildren 是否向下执行深度销毁
 * @returns {void}
 */
function destroyHTMLElement(element, deepChildren) {
    if (element instanceof HTMLElement === false) {
        console.warn('The element must be instanceof HTMLElement.');
        return;
    }
    destroyHTMLElementImpl(element, deepChildren);
};

export default destroyHTMLElement;