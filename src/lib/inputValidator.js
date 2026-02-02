function isValidIPv4(ipv4) {
    const ipv4Pattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Pattern.test(ipv4);
}

function isValidIPv6(ipv6) {
    const ipv6Pattern = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i;
    return ipv6Pattern.test(ipv6);
}

function detectChangedFieldsValue(source, editedSource){
    let changedField = []
    let editedSourceKeys = Object.keys(editedSource)
    let editedSourceLength = editedSourceKeys.length
    Object.keys(source).map(currentKey => {
        for (let i = 0; i < editedSourceLength; i++) {
            let currentEditedValueKey = editedSourceKeys[i]
            if (currentKey === currentEditedValueKey && source[currentKey] !== editedSource[currentKey]){
                changedField.push(currentKey)
                break
            }
        }
    })
    return changedField
}

function extractData(obj, fields){
    let result = {}
    for (let i = 0; i < fields.length; i++) {
        let field = fields[i]
        result[field] = obj[field]
    }
    return result
}

export { isValidIPv4, isValidIPv6, detectChangedFieldsValue, extractData }