/**
 * jQuery EasyUI 1.3.2
 *
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function ($) {
    var _1 = false;
    $.fn.resizable = function (options, _3) {
        if (typeof options == "string") {
            return $.fn.resizable.methods[options](this, _3);
        }
        function resize(e) {
            var _5 = e.data;
            var _6 = $.data(_5.target, "resizable").options;
            if (_5.dir.indexOf("e") != -1) {
                var _7 = _5.startWidth + e.pageX - _5.startX;
                _7 = Math.min(Math.max(_7, _6.minWidth), _6.maxWidth);
                _5.width = _7;
            }
            if (_5.dir.indexOf("s") != -1) {
                var _8 = _5.startHeight + e.pageY - _5.startY;
                _8 = Math.min(Math.max(_8, _6.minHeight), _6.maxHeight);
                _5.height = _8;
            }
            if (_5.dir.indexOf("w") != -1) {
                _5.width = _5.startWidth - e.pageX + _5.startX;
                if (_5.width >= _6.minWidth && _5.width <= _6.maxWidth) {
                    _5.left = _5.startLeft + e.pageX - _5.startX;
                }
            }
            if (_5.dir.indexOf("n") != -1) {
                _5.height = _5.startHeight - e.pageY + _5.startY;
                if (_5.height >= _6.minHeight && _5.height <= _6.maxHeight) {
                    _5.top = _5.startTop + e.pageY - _5.startY;
                }
            }
        }

        ;
        function applySize(e) {
            var _a = e.data;
            var _b = _a.target;
            $(_b).css({left:_a.left, top:_a.top});
            $(_b)._outerWidth(_a.width)._outerHeight(_a.height);
        }

        ;
        function doDown(e) {
            _1 = true;
            $.data(e.data.target, "resizable").options.onStartResize.call(e.data.target, e);
            return false;
        }

        ;
        function doMove(e) {
            resize(e);
            if ($.data(e.data.target, "resizable").options.onResize.call(e.data.target, e) != false) {
                applySize(e);
            }
            return false;
        }

        ;
        function doUp(e) {
            _1 = false;
            resize(e, true);
            applySize(e);
            $.data(e.data.target, "resizable").options.onStopResize.call(e.data.target, e);
            $(document).unbind(".resizable");
            $("body").css("cursor", "");
            return false;
        }

        ;
        return this.each(function () {
            var opts = null;
            var state = $.data(this, "resizable");
            if (state) {
                $(this).unbind(".resizable");
                opts = $.extend(state.options, options || {});
            } else {
                opts = $.extend({}, $.fn.resizable.defaults, $.fn.resizable.parseOptions(this), options || {});
                $.data(this, "resizable", {options:opts});
            }
            if (opts.disabled == true) {
                return;
            }
            $(this).bind("mousemove.resizable", {target:this},
                    function (e) {
                        if (_1) {
                            return;
                        }
                        var dir = getDirection(e);
                        if (dir == "") {
                            $(e.data.target).css("cursor", "");
                        } else {
                            $(e.data.target).css("cursor", dir + "-resize");
                        }
                    }).bind("mouseleave.resizable", {target:this},
                    function (e) {
                        $(e.data.target).css("cursor", "");
                    }).bind("mousedown.resizable", {target:this}, function (e) {
                        var dir = getDirection(e);
                        if (dir == "") {
                            return;
                        }
                        function getCssValue(css) {
                            var val = parseInt($(e.data.target).css(css));
                            if (isNaN(val)) {
                                return 0;
                            } else {
                                return val;
                            }
                        }

                        ;
                        var data = {target:e.data.target, dir:dir, startLeft:getCssValue("left"), startTop:getCssValue("top"), left:getCssValue("left"), top:getCssValue("top"), startX:e.pageX, startY:e.pageY, startWidth:$(e.data.target).outerWidth(), startHeight:$(e.data.target).outerHeight(), width:$(e.data.target).outerWidth(), height:$(e.data.target).outerHeight(), deltaWidth:$(e.data.target).outerWidth() - $(e.data.target).width(), deltaHeight:$(e.data.target).outerHeight() - $(e.data.target).height()};
                        $(document).bind("mousedown.resizable", data, doDown);
                        $(document).bind("mousemove.resizable", data, doMove);
                        $(document).bind("mouseup.resizable", data, doUp);
                        $("body").css("cursor", dir + "-resize");
                    });
            function getDirection(e) {
                var tt = $(e.data.target);
                var dir = "";
                var offset = tt.offset();
                var width = tt.outerWidth();
                var height = tt.outerHeight();
                var edge = opts.edge;
                if (e.pageY > offset.top && e.pageY < offset.top + edge) {
                    dir += "n";
                } else {
                    if (e.pageY < offset.top + height && e.pageY > offset.top + height - edge) {
                        dir += "s";
                    }
                }
                if (e.pageX > offset.left && e.pageX < offset.left + edge) {
                    dir += "w";
                } else {
                    if (e.pageX < offset.left + width && e.pageX > offset.left + width - edge) {
                        dir += "e";
                    }
                }
                var handles = opts.handles.split(",");
                for (var i = 0; i < handles.length; i++) {
                    var handle = handles[i].replace(/(^\s*)|(\s*$)/g, "");
                    if (handle == "all" || handle == dir) {
                        return dir;
                    }
                }
                return "";
            }

            ;
        });
    };
    $.fn.resizable.methods = {options:function (jq) {
        return $.data(jq[0], "resizable").options;
    }, enable:function (jq) {
        return jq.each(function () {
            $(this).resizable({disabled:false});
        });
    }, disable:function (jq) {
        return jq.each(function () {
            $(this).resizable({disabled:true});
        });
    }};
    $.fn.resizable.parseOptions = function (_1a) {
        var t = $(_1a);
        return $.extend({}, $.parser.parseOptions(_1a, ["handles", {minWidth:"number", minHeight:"number", maxWidth:"number", maxHeight:"number", edge:"number"}]), {disabled:(t.attr("disabled") ? true : undefined)});
    };
    $.fn.resizable.defaults = {disabled:false, handles:"n, e, s, w, ne, se, sw, nw, all", minWidth:10, minHeight:10, maxWidth:10000, maxHeight:10000, edge:5, onStartResize:function (e) {
    }, onResize:function (e) {
    }, onStopResize:function (e) {
    }};
})(jQuery);

