"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFields = removeFields;
function removeFields(value, paths) {
    if (value == null || !paths || paths.length === 0) {
        return value;
    }
    let clone;
    try {
        clone = JSON.parse(JSON.stringify(value));
    }
    catch {
        return value;
    }
    for (const path of paths) {
        removeFieldByPath(clone, path.split('.'));
    }
    return clone;
}
function removeFieldByPath(target, segments) {
    if (target == null || typeof target !== 'object') {
        return;
    }
    const [head, ...rest] = segments;
    if (rest.length === 0) {
        delete target[head];
        return;
    }
    removeFieldByPath(target[head], rest);
}
//# sourceMappingURL=remove-fields.js.map