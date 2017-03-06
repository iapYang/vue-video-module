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

    var COMPONENT_NAME = 'EntranceListener';

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

    ///////////////
    // Component //
    ///////////////

    var defaultOptions = {
        triggered: false,
        offset: 0,
        enter: function() {},
        leave: function() {},
    };

    var Component = function(opts) {
        var options = merge({}, defaultOptions, opts);

        Component.sourceQueue.push({
            el: options.el,
            offset: options.offset,
            enter: options.enter,
            leave: options.leave,
        });

        window.addEventListener('scroll', entranceHandler);
        window.addEventListener('resize', entranceHandler);
    };

    Component.sourceQueue = [];

    function entranceHandler() {
        var innerHeight = window.innerHeight;

        Component.sourceQueue.forEach(function(item) {
            var rect = item.el.getBoundingClientRect();
            var reached = (rect.top + item.offset) < innerHeight;
            var outed = rect.top >= innerHeight;

            if (reached && !item.triggered) {
                item.triggered = true;
                item.enter.call(item.el);
            }

            if (outed && item.triggered) {
                item.triggered = false;
                item.leave.call(item.el);
            }
        });
    }

    if (window[COMPONENT_NAME] === undefined) {
        window[COMPONENT_NAME] = Component;
    }

    return Component;
}));
