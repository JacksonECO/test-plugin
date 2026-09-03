"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redactFields = redactFields;
function redactFields(value, paths, mask = '***') {
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
        redactFieldByPath(clone, path.split('.'), mask);
    }
    return clone;
}
function redactFieldByPath(target, segments, mask) {
    if (target == null || typeof target !== 'object') {
        return;
    }
    const [head, ...rest] = segments;
    if (rest.length === 0) {
        if (head in target) {
            target[head] = mask;
        }
        return;
    }
    redactFieldByPath(target[head], rest, mask);
}
//# sourceMappingURL=redact-fields.js.map