Object.prototype.clone = function(){
    if (this == null || "object" != typeof this) return this;
    var copy = this.constructor();
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
    }
    return copy;
}