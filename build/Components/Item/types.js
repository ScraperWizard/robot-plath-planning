"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemSize = exports.ItemsTypes = void 0;
var ItemsTypes;
(function (ItemsTypes) {
    ItemsTypes[ItemsTypes["Trash"] = 1] = "Trash";
    ItemsTypes[ItemsTypes["Wall"] = 2] = "Wall";
    ItemsTypes[ItemsTypes["Bin"] = 3] = "Bin";
    ItemsTypes[ItemsTypes["Obstacle"] = 4] = "Obstacle";
    ItemsTypes[ItemsTypes["Unknown"] = 5] = "Unknown";
})(ItemsTypes || (exports.ItemsTypes = ItemsTypes = {}));
var ItemSize;
(function (ItemSize) {
    ItemSize[ItemSize["SMALL"] = 1] = "SMALL";
    ItemSize[ItemSize["MEDIUM"] = 12] = "MEDIUM";
    ItemSize[ItemSize["LARGE"] = 30] = "LARGE";
})(ItemSize || (exports.ItemSize = ItemSize = {}));
//# sourceMappingURL=types.js.map