export const formatSize = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const formatSizeVarnish = (bytes, decimals = 2) => {
    if (bytes === null || bytes === undefined || bytes === 0) return "0";
    const num = typeof bytes === 'string' ? parseFloat(bytes) : bytes;
    
    if (isNaN(num) || num === null || num === undefined) return "0";
    
    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["", "K", "M", "B", "T", "P", "E", "Z", "Y"];
    
    if (num < k) {
        return Math.floor(num).toString();
    }
    
    const i = Math.floor(Math.log(num) / Math.log(k));
    const formattedNum = parseFloat((num / Math.pow(k, i)).toFixed(dm));
    
    let result;
    if (formattedNum % 1 === 0) {
        result = Math.floor(formattedNum).toString();
    } else {
        result = formattedNum.toString().replace('.', ',');
    }
    
    return result + sizes[i];
};

