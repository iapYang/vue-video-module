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

    var COMPONENT_NAME = 'Slider';

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

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function setTransform(el, val) {
        el.style.webkitTransform = val;
        el.style.MozTransform = val;
        el.style.msTransform = val;
        el.style.OTransform = val;
        el.style.transform = val;
    }

    var ua = window.navigator.userAgent.toLowerCase();
    var hasTouch = 'ontouchstart' in window;
    var isIE = /(msie|trident)/i.test(navigator.userAgent);
    var isEdge = ua.match(/edge/i) !== null;

    var useTraditionalAnimation = isIE || isEdge;


    ///////////////
    // Component //
    ///////////////
    var SAFE_DISTANCE = 15;

    var defaultOptions = {
        dragable: true,
        loop: true,
        currentIndex: 0,
        speed: 1000,
        interactiveSpeed: 200,
        interactiveDistance: 100,
        ease: 'ease-in-out',
        onChangeStart: function(i, next) {},
        onChangeEnd: function(i, prev) {}
    };

    var Component = function(opts) {
        var options = merge({}, defaultOptions, opts);

        // options which user can config
        this.container = options.container;
        this.prevBtn = options.prevBtn;
        this.nextBtn = options.nextBtn;
        this.indicator = options.indicator;
        this.dragable = options.dragable;
        this.loop = options.loop;
        this.currentIndex = options.currentIndex;
        this.speed = options.speed;
        this.interactiveSpeed = options.interactiveSpeed;
        this.interactiveDistance = options.interactiveDistance;
        this.ease = options.ease;
        this.onChangeStart = options.onChangeStart;
        this.onChangeEnd = options.onChangeEnd;



        // check
        if (!this.container) {
            throw new Error('the slider need a initialize element');
        }
        if (this.container && this.container.length) {
            throw new Error('the slider container need to be a dom element');
        }


        // init vars
        this.wrapper = this.container.children[0];
        this.items = [].slice.call(this.wrapper.children);
        if (this.indicator) this.indicatorElements = [].slice.call(this.indicator.children);
        this.animating = false;
        this.updating = false;
        this.wrapper.style.transitionTimingFunction = this.ease;

        this.disablePrev = false;
        this.disableNext = false;


        adjustEdge.call(this, this.currentIndex);
        initStyle.call(this);
        calcOrder.call(this);
        registerEvent.call(this);
    };

    Component.prototype.slidePrev = function(speed) {
        if (this.disablePrev) return;

        var targetIndex = getPrevIndex.call(this);
        var calcSpeed = isNumeric(speed) ? speed : this.speed;

        slideFunc.call(this, targetIndex, 'prev', calcSpeed);
    };

    Component.prototype.slideNext = function(speed) {
        if (this.disableNext) return;

        var targetIndex = getNextIndex.call(this);
        var calcSpeed = isNumeric(speed) ? speed : this.speed;

        slideFunc.call(this, targetIndex, 'next', calcSpeed);
    };

    Component.prototype.slideTo = function(targetIndex, speed) {
        var calcSpeed = isNumeric(speed) ? speed : this.speed;

        slideFunc.call(this, targetIndex, null, calcSpeed);
    };

    Component.prototype.prependSlide = function(dom) {
        dom.style.position = 'absolute';
        dom.style.top = 0;

        this.items.unshift(dom);
        this.wrapper.insertBefore(dom, this.wrapper.firstChild);
        ++this.currentIndex;

        adjustEdge.call(this, this.currentIndex);
        calcOrder.call(this);
    };

    Component.prototype.appendSlide = function(dom) {
        dom.style.position = 'absolute';
        dom.style.top = 0;

        this.items.push(dom);
        this.wrapper.appendChild(dom);

        adjustEdge.call(this, this.currentIndex);
        calcOrder.call(this);
    };

    Component.prototype.removeSlide = function(index) {
        this.items.splice(index, 1);
        this.wrapper.removeChild(this.wrapper.children[index]);

        if (this.currentIndex === this.items.length) --this.currentIndex;

        adjustEdge.call(this, this.currentIndex);
        calcOrder.call(this);
    };

    Component.prototype.refreshPosition = function() {
        var max_height_index = 0;
        var max_height = 0;

        this.items.forEach(function(el, i) {
            if (el.getBoundingClientRect().height > max_height) {
                max_height = el.getBoundingClientRect().height;
                max_height_index = i;
            }
        });

        this.items.forEach(function(el, i) {
            el.style.top = 0;
            setTransform(el, 'translateY(0%)');


            if (i === max_height_index) {
                el.style.position = 'relative';
            } else {
                el.style.position = 'absolute';

                el.style.top = '50%';
                setTransform(el, 'translateY(-50%)');
            }
        });
    };

    function adjustEdge(index) {
        if (this.loop) return;

        this.disablePrev = index === 0;
        this.disableNext = index === this.items.length - 1;

        if (this.prevBtn) {
            if (this.disablePrev) {
                this.prevBtn.classList.add('disabled');
            } else {
                this.prevBtn.classList.remove('disabled');
            }
        }

        if (this.nextBtn) {
            if (this.disableNext) {
                this.nextBtn.classList.add('disabled');
            } else {
                this.nextBtn.classList.remove('disabled');
            }
        }
    }

    function setDisplacement(value) {
        if (useTraditionalAnimation) {
            this.wrapper.style.left = value;
        } else {
            setTransform(this.wrapper, 'translateX(' + value + ')');
        }
    }

    function initStyle() {
        var self = this;

        this.container.style.overflow = 'hidden';
        this.wrapper.style.position = 'relative';
        setDisplacement.call(this, '0%');

        this.refreshPosition.call(this);

        if (this.indicatorElements) {
            this.indicatorElements[this.currentIndex].classList.add('active');
        }
    }

    function calcOrder() {
        var prevIndex = getPrevIndex.call(this);
        var nextIndex = getNextIndex.call(this);

        var unHideArr = [this.currentIndex];

        if (this.loop) {
            unHideArr = [this.currentIndex, prevIndex, nextIndex];
        } else {
            if (this.currentIndex === 0) {
                unHideArr = [this.currentIndex, nextIndex];
            } else if (this.currentIndex === this.items.length - 1) {
                unHideArr = [this.currentIndex, prevIndex];
            } else {
                unHideArr = [this.currentIndex, prevIndex, nextIndex];
            }
        }

        hideItemsExcept.call(this, unHideArr);




        if (!this.loop && this.items.length === 2) {
            this.items[this.currentIndex].style.left = '0%';

            if (this.currentIndex === 0) this.items[nextIndex].style.left = '100%';
            else this.items[nextIndex].style.left = '-100%';
        } else if (this.items.length === 1) {
            this.items[this.currentIndex].style.left = '0%';
        } else {
            this.items[this.currentIndex].style.left = '0%';
            this.items[prevIndex].style.left = '-100%';
            this.items[nextIndex].style.left = '100%';
        }
    }

    function hideItemsExcept(exceptArr) {
        this.items.forEach(function(el, i) {
            if (exceptArr.indexOf(i) == -1) {
                el.style.visibility = 'hidden';
                el.style.opacity = 0;
            } else {
                el.style.visibility = 'visible';
                el.style.opacity = 1;
            }
        });
    }

    function registerEvent() {
        var self = this;
        var tapEvent = hasTouch ? 'touchend' : 'click';
        var downEvent = hasTouch ? 'touchstart' : 'mousedown';
        var moveEvent = hasTouch ? 'touchmove' : 'mousemove';
        var upEvent = hasTouch ? 'touchend' : 'mouseup';

        if (this.prevBtn) this.prevBtn.addEventListener(tapEvent, this.slidePrev.bind(this), false);
        if (this.nextBtn) this.nextBtn.addEventListener(tapEvent, this.slideNext.bind(this), false);
        if (this.indicatorElements) {
            this.indicatorElements.forEach(function(el, i) {
                el.addEventListener(tapEvent, self.slideTo.bind(self, i), false);
            });
        }

        if (this.dragable) {
            this.container.addEventListener(downEvent, startDrag.bind(this), false);
            this.container.addEventListener(moveEvent, duringDrag.bind(this), false);
            this.container.addEventListener(upEvent, endDrag.bind(this), false);
            this.container.addEventListener('mouseleave', endDrag.bind(this), false);
        }
    }

    function getPrevIndex() {
        var length = this.items.length;

        return (length + this.currentIndex - 1) % length;
    }

    function getNextIndex() {
        return (this.currentIndex + 1) % this.items.length;
    }

    function slideFunc(targetIndex, direct, speed) {
        targetIndex = parseInt(targetIndex);

        if (targetIndex == this.currentIndex ||
            targetIndex < 0 ||
            targetIndex >= this.items.length)
            return;

        if (this.animating) return;
        this.animating = true;

        this.onChangeStart(this.currentIndex, targetIndex);

        adjustEdge.call(this, targetIndex);

        // necessary when slide to a  random index
        hideItemsExcept.call(this, [this.currentIndex, targetIndex]);

        // change indicator
        changeIndicator.call(this, targetIndex);

        if (direct === null) {
            direct = this.currentIndex > targetIndex ? 'prev' : 'next';
        }

        this.wrapper.style.transitionDuration = speed + 'ms';

        if (direct == 'prev') {
            this.items[targetIndex].style.left = '-100%';
            setDisplacement.call(this, '100%');
        } else {
            this.items[targetIndex].style.left = '100%';
            setDisplacement.call(this, '-100%');
        }

        var that = this;
        setTimeout(slideEnd.bind(that, targetIndex), speed);
    }

    function slideEnd(endIndex, noTriggerEvent) {
        var prevIndex = this.currentIndex;

        this.currentIndex = endIndex;

        this.wrapper.style.transitionDuration = '0ms';
        setDisplacement.call(this, '0%');

        this.animating = false;
        this.updating = false;

        calcOrder.call(this);

        if (!noTriggerEvent) {
            this.onChangeEnd(this.currentIndex, prevIndex);
        }
    }

    function startDrag(e) {
        var interactive_el = e.srcElement || e.target || e.toElement;
        if (interactive_el === this.prevBtn || interactive_el === this.nextBtn) {
            return;
        }

        if (this.animating) return;
        if (this.interactived) return;

        this.interactived = true;
        this.moveX = 0;
        this.canMove = false;
        this.startOffsetX = hasTouch ? e.touches[0].screenX : e.screenX;
        this.wrapper.style.transitionDuration = '0ms';
    }

    function duringDrag(e) {
        if (!this.interactived) return;

        this.updating = true;

        var currentOffsetX = hasTouch ? e.touches[0].screenX : e.screenX;

        this.moveX = currentOffsetX - this.startOffsetX;

        if (!this.canMove && Math.abs(this.moveX) > SAFE_DISTANCE) {
            this.canMove = true;
            this.startOffsetX = currentOffsetX;
            this.moveX = 0;
        }

        if (this.canMove) {
            if ((this.moveX > 0 && this.disablePrev) ||
                (this.moveX < 0 && this.disableNext)) {
                this.moveX = this.moveX >> 1;
            }

            setDisplacement.call(this, this.moveX + 'px');
        }
    }

    function endDrag(e) {
        if (this.animating) return;
        if (!this.interactived) return;

        this.interactived = false;

        var targetIndex, noTriggerEnd;

        this.wrapper.style.transitionDuration = this.interactiveSpeed + 'ms';
        this.animating = true;

        if (Math.abs(this.moveX) > this.interactiveDistance) {
            if (this.moveX > 0) {
                if (this.disablePrev) {
                    noTriggerEnd = true;
                } else {
                    noTriggerEnd = false;

                    setDisplacement.call(this, '100%');
                    targetIndex = getPrevIndex.call(this);
                }
            } else {
                if (this.disableNext) {
                    noTriggerEnd = true;
                } else {
                    noTriggerEnd = false;
                    setDisplacement.call(this, '-100%');
                    targetIndex = getNextIndex.call(this);
                }
            }
        } else {
            noTriggerEnd = true;
        }

        if (!noTriggerEnd) {
            changeIndicator.call(this, targetIndex);

            this.onChangeStart(this.currentIndex, targetIndex);
            adjustEdge.call(this, targetIndex);
        } else {
            setDisplacement.call(this, '0%');
            targetIndex = this.currentIndex;
        }

        setTimeout(slideEnd.bind(this, targetIndex, noTriggerEnd), this.interactiveSpeed);
    }

    function changeIndicator(targetIndex) {
        if (this.indicatorElements) {
            this.indicatorElements[this.currentIndex].classList.remove('active');
            this.indicatorElements[targetIndex].classList.add('active');
        }
    }


    if (window[COMPONENT_NAME] === undefined) {
        window[COMPONENT_NAME] = Component;
    }

    return Component;
}));
