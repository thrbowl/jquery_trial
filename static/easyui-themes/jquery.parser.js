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
    $.parser = {
        auto:true,
        onComplete:function (context) {
        },
        plugins:["draggable", "droppable", "resizable", "pagination", "linkbutton", "menu", "menubutton", "splitbutton", "progressbar", "tree", "combobox", "combotree", "combogrid", "numberbox", "validatebox", "searchbox", "numberspinner", "timespinner", "calendar", "datebox", "datetimebox", "slider", "layout", "panel", "datagrid", "propertygrid", "treegrid", "tabs", "accordion", "window", "dialog"],
        parse:function (context) {
            var aa = [];
            for (var i = 0; i < $.parser.plugins.length; i++) {
                var name = $.parser.plugins[i];
                var r = $(".easyui-" + name, context);
                if (r.length) {
                    if (r[name]) {
                        r[name]();
                    } else {
                        aa.push({name:name, jq:r});
                    }
                }
            }
            if (aa.length && window.easyloader) {
                var names = [];
                for (var i = 0; i < aa.length; i++) {
                    names.push(aa[i].name);
                }
                easyloader.load(names, function () {
                    for (var i = 0; i < aa.length; i++) {
                        var name = aa[i].name;
                        var jq = aa[i].jq;
                        jq[name]();
                    }
                    $.parser.onComplete.call($.parser, context);
                });
            } else {
                $.parser.onComplete.call($.parser, context);
            }
        },
        parseOptions:function (target, options) {
            var t = $(target);
            var defaults = {};
            var s = $.trim(t.attr("data-options"));
            if (s) {
                var firstChar = s.substring(0, 1);
                var lastChar = s.substring(s.length - 1, 1);
                if (firstChar != "{") {
                    s = "{" + s;
                }
                if (lastChar != "}") {
                    s = s + "}";
                }
                defaults = (new Function("return " + s))();
            }
            if (options) {
                var trans = {};
                for (var i = 0; i < options.length; i++) {
                    var pp = options[i];
                    if (typeof pp == "string") {
                        if (pp == "width" || pp == "height" || pp == "left" || pp == "top") {
                            trans[pp] = parseInt(target.style[pp]) || undefined;
                        } else {
                            trans[pp] = t.attr(pp);
                        }
                    } else {
                        for (var key in pp) {
                            var val = pp[key];
                            if (val == "boolean") {
                                trans[key] = t.attr(key) ? (t.attr(key) == "true") : undefined;
                            } else {
                                if (val == "number") {
                                    trans[key] = t.attr(key) == "0" ? 0 : parseFloat(t.attr(key)) || undefined;
                                }
                            }
                        }
                    }
                }
                $.extend(defaults, trans);
            }
            return defaults;
        }};
    $(function () {
        if (!window.easyloader && $.parser.auto) {
            $.parser.parse();
        }
    });
    $.fn._outerWidth = function (width) {
        if (width == undefined) {
            if (this[0] == window) {
                return this.width() || document.body.clientWidth;
            }
            return this.outerWidth() || 0;
        }
        return this.each(function () {
            if (!$.support.boxModel && $.browser.msie) {
                $(this).width(width);
            } else {
                $(this).width(width - ($(this).outerWidth() - $(this).width()));
            }
        });
    };
    $.fn._outerHeight = function (height) {
        if (height == undefined) {
            if (this[0] == window) {
                return this.height() || document.body.clientHeight;
            }
            return this.outerHeight() || 0;
        }
        return this.each(function () {
            if (!$.support.boxModel && $.browser.msie) {
                $(this).height(height);
            } else {
                $(this).height(height - ($(this).outerHeight() - $(this).height()));
            }
        });
    };
    $.fn._scrollLeft = function (position) {
        if (position == undefined) {
            return this.scrollLeft();
        } else {
            return this.each(function () {
                $(this).scrollLeft(position);
            });
        }
    };
    $.fn._propAttr = $.fn.prop || $.fn.attr;
    $.fn._fit = function (fit) {
        fit = fit == undefined ? true : fit;
        var p = this.parent()[0];
        var t = this[0];
        var fcount = p.fcount || 0;
        if (fit) {
            if (!t.fitted) {
                t.fitted = true;
                p.fcount = fcount + 1;
                $(p).addClass("panel-noscroll");
                if (p.tagName == "BODY") {
                    $("html").addClass("panel-fit");
                }
            }
        } else {
            if (t.fitted) {
                t.fitted = false;
                p.fcount = fcount - 1;
                if (p.fcount == 0) {
                    $(p).removeClass("panel-noscroll");
                    if (p.tagName == "BODY") {
                        $("html").removeClass("panel-fit");
                    }
                }
            }
        }
        return {width:$(p).width(), height:$(p).height()};
    };
})(jQuery);

