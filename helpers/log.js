"use strict";

var logging = function (enable) {
    this.isEnable = enable;
    this.log = function (msg) {
        if(this.isEnable) {
            console.log(msg);
        }
    };
};


module.exports = logging;
