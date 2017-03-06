(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser global
        factory();
    }
}(this, function() {
    //////////
    // Name //
    //////////

    var COMPONENT_NAME = 'PictureLoader';

    //////////
    // Tool //
    //////////

    function merge() {
        var obj = {},
            i = 0,
            il = arguments.length,
            key;

        for (; i < il; ++i) {
            for (key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    obj[key] = arguments[i][key];
                }
            }
        }

        return obj;
    }

    var ua = window.navigator.userAgent.toLowerCase();
    var isMobile = ua.match(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile/i) !== null && ua.match(/Mobile/i) !== null;
    var isiPad = ua.match(/ipad/i) !== null;
    var isAndroid = ua.match(/android/i) !== null;
    var isAndroidPad = isAndroid && !isMobile;
    var isTablet = isiPad || isAndroidPad;
    var isIE = /(msie|trident)/i.test(navigator.userAgent);
    var isDesktop = !(isMobile || isTablet);


    ///////////////
    // Component //
    ///////////////

    var dataName = 'data-source';

    var initialOptions = {
        className: 'preload',
    };

    var loadOptions = {
        done: function() {},
        end: function() {},
    };

    var Component = function(opts) {
        var options = merge({}, initialOptions, opts);

        this.className = options.className;
        this.sourceQueue = options.sourceQueue;

        /************/

        if (this.sourceQueue !== undefined) {
            this.totalCount = this.sourceQueue.length;
        } else {
            this.items = [].slice.call(document.getElementsByClassName(this.className));
            this.totalCount = this.items.length;
        }

        this.loadCount = 0;
    };

    Component.timeout = 1000 * 60;
    Component.useStorage = isDesktop && !isIE;

    Component.load = function(src, callback) {
        var image = new Image();

        image.onload = function() {
            callback.call(this, image);
        };

        checkIfInStorage({
            src: src,
            in: function(storageObj) {
                image.src = storageObj.source;
            },
            not: function() {
                image.src = src;
            }
        });
    };

    Component.prototype.load = function(opts) {
        var options = merge({}, loadOptions, opts);
        var that = this;

        this.done = options.done;
        this.end = options.end;

        if (this.totalCount === 0) {
            endHandler.call(this);
            return;
        }

        if (this.sourceQueue !== undefined) {
            this.sourceQueue.forEach(function(src, i) {
                startLoad.call(that, src);
            });
        } else {
            this.items.forEach(function(item, i) {
                var src = item.getAttribute(dataName);
                startLoad.call(that, src, item);
            });
        }
    };

    function checkIfInStorage(opts) {
        if (Component.useStorage) {
            var storageObj = JSON.parse(sessionStorage.getItem(opts.src)) || {};
            var timestamp = storageObj.timestamp;
            var liveUntil = timestamp + Component.timeout;

            if (timestamp !== undefined && liveUntil > Date.now()) {
                return opts.in.call(null, storageObj);
            } else {
                return opts.not.call(null);
            }
        } else {
            return opts.not.call(null);
        }
    }

    function startLoad(src, item) {
        var that = this;
        var image = new Image();
        // image.setAttribute('crossOrigin', 'anonymous');

        if (item && item.classList.contains('loaded')) {
            doneHandler.call(that, item, src, image);
            return;
        }

        checkIfInStorage({
            src: src,
            in: function(storageObj) {
                // load from cache
                image.src = storageObj.source;

                doneHandler.call(that, item, src, image);
            },
            not: function() {
                // load from file
                image.onload = function() {
                    if (Component.useStorage) {
                        var storageObj = {};
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');

                        canvas.width = image.width;
                        canvas.height = image.height;
                        ctx.drawImage(image, 0, 0);

                        storageObj.source = canvas.toDataURL('image/png');
                        storageObj.timestamp = Date.now();

                        try {
                            sessionStorage.setItem(src, JSON.stringify(storageObj));
                        } catch (e) {
                            console.log(e.message);
                        }
                    }

                    doneHandler.call(that, item, src, image);
                };
                image.onerror = function() {
                    item.classList.add('loaded');
                    doneHandler.call(that, item, src, image);
                };

                image.src = src;
            }
        });
    }

    function doneHandler(item, src, image) {
        if (item && !item.classList.contains('loaded')) {
            if (item.getAttribute('data-bg') !== null) {
                item.style.backgroundImage = 'url(' + src + ')';
            } else {
                item.appendChild(image);
            }

            item.classList.add('loaded');
        }


        ++this.loadCount;

        this.done(image, this.loadCount, this.totalCount);

        if (this.loadCount == this.totalCount) {
            endHandler.call(this);
        }
    }

    function endHandler() {
        this.end(this.loadCount, this.totalCount);
    }


    if (window[COMPONENT_NAME] === undefined) {
        window[COMPONENT_NAME] = Component;
    }

    return Component;
}));
