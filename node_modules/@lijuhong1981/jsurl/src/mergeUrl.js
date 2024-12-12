import hasProtocolPrefix from "./hasProtocolPrefix.js";

function mergeUrl(base, relative) {
    if (!base || base.length === 0 || hasProtocolPrefix(relative))
        return relative;
    const hasEndSeparator = base.endsWith('/');
    const hasStartSeparator = relative.startsWith('/');
    if (!hasEndSeparator && !hasStartSeparator)
        return base + '/' + relative;
    else if ((hasEndSeparator && !hasStartSeparator) || (!hasEndSeparator && hasStartSeparator))
        return base + relative;
    else
        return base + relative.substring(1);
};

export default mergeUrl;