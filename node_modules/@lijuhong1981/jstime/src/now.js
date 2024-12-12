const now = (typeof performance === 'undefined' &&
    typeof performance.now === "function") ?
    function () {
        return Date.now();
    } :
    function () {
        return performance.now();
    };

export default now;