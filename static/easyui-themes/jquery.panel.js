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
    function removeNode(node) {
        node.each(function () {
            $(this).remove();
            if ($.browser.msie) {
                this.outerHTML = "";
            }
        });
    }

    ;
    function setSize(target, param) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        var pheader = panel.children("div.panel-header");
        var pbody = panel.children("div.panel-body");
        if (param) {
            if (param.width) {
                opts.width = param.width;
            }
            if (param.height) {
                opts.height = param.height;
            }
            if (param.left != null) {
                opts.left = param.left;
            }
            if (param.top != null) {
                opts.top = param.top;
            }
        }
        opts.fit ? $.extend(opts, panel._fit()) : panel._fit(false);
        panel.css({left:opts.left, top:opts.top});
        if (!isNaN(opts.width)) {
            panel._outerWidth(opts.width);
        } else {
            panel.width("auto");
        }
        pheader.add(pbody)._outerWidth(panel.width());
        if (!isNaN(opts.height)) {
            panel._outerHeight(opts.height);
            pbody._outerHeight(panel.height() - pheader._outerHeight());
        } else {
            pbody.height("auto");
        }
        panel.css("height", "");
        opts.onResize.apply(target, [opts.width, opts.height]);
        panel.find(">div.panel-body>div").triggerHandler("_resize");
    }

    ;
    function movePanel(target, param) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        if (param) {
            if (param.left != null) {
                opts.left = param.left;
            }
            if (param.top != null) {
                opts.top = param.top;
            }
        }
        panel.css({left:opts.left, top:opts.top});
        opts.onMove.apply(target, [opts.left, opts.top]);
    }

    ;
    function wrapPanel(target) {
        $(target).addClass("panel-body");
        var panel = $("<div class=\"panel\"></div>").insertBefore(target);
        panel[0].appendChild(target);
        panel.bind("_resize", function () {
            var _12 = $.data(target, "panel").options;
            if (_12.fit == true) {
                setSize(target);
            }
            return false;
        });
        return panel;
    }

    ;
    function addHeader(target) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        if (opts.tools && typeof opts.tools == "string") {
            panel.find(">div.panel-header>div.panel-tool .panel-tool-a").appendTo(opts.tools);
        }
        removeNode(panel.children("div.panel-header"));
        if (opts.title && !opts.noheader) {
            var header = $("<div class=\"panel-header\"><div class=\"panel-title\">" + opts.title + "</div></div>").prependTo(panel);
            if (opts.iconCls) {
                header.find(".panel-title").addClass("panel-with-icon");
                $("<div class=\"panel-icon\"></div>").addClass(opts.iconCls).appendTo(header);
            }
            var tool = $("<div class=\"panel-tool\"></div>").appendTo(header);
            tool.bind("click", function (e) {
                e.stopPropagation();
            });
            if (opts.tools) {
                if (typeof opts.tools == "string") {
                    $(opts.tools).children().each(function () {
                        $(this).addClass($(this).attr("iconCls")).addClass("panel-tool-a").appendTo(tool);
                    });
                } else {
                    for (var i = 0; i < opts.tools.length; i++) {
                        var t = $("<a href=\"javascript:void(0)\"></a>").addClass(opts.tools[i].iconCls).appendTo(tool);
                        if (opts.tools[i].handler) {
                            t.bind("click", eval(opts.tools[i].handler));
                        }
                    }
                }
            }
            if (opts.collapsible) {
                $("<a class=\"panel-tool-collapse\" href=\"javascript:void(0)\"></a>").appendTo(tool).bind("click", function () {
                    if (opts.collapsed == true) {
                        expandPanel(target, true);
                    } else {
                        collapsePanel(target, true);
                    }
                    return false;
                });
            }
            if (opts.minimizable) {
                $("<a class=\"panel-tool-min\" href=\"javascript:void(0)\"></a>").appendTo(tool).bind("click", function () {
                    minimizePanel(target);
                    return false;
                });
            }
            if (opts.maximizable) {
                $("<a class=\"panel-tool-max\" href=\"javascript:void(0)\"></a>").appendTo(tool).bind("click", function () {
                    if (opts.maximized == true) {
                        restorePanel(target);
                    } else {
                        maximizePanel(target);
                    }
                    return false;
                });
            }
            if (opts.closable) {
                $("<a class=\"panel-tool-close\" href=\"javascript:void(0)\"></a>").appendTo(tool).bind("click", function () {
                    closePanel(target);
                    return false;
                });
            }
            panel.children("div.panel-body").removeClass("panel-body-noheader");
        } else {
            panel.children("div.panel-body").addClass("panel-body-noheader");
        }
    }

    ;
    function loadData(target) {
        var state = $.data(target, "panel");
        var opts = state.options;
        if (opts.content) {
            _1e(target);
            _1f(opts.content);
        }
        if (opts.href && (!state.isLoaded || !opts.cache)) {
            state.isLoaded = false;
            _1e(target);
            if (opts.loadingMessage) {
                $(target).html($("<div class=\"panel-loading\"></div>").html(opts.loadingMessage));
            }
            $.ajax({url:opts.href, cache:false, dataType:"html", success:function (_20) {
                _1f(opts.extractor.call(target, _20));
                opts.onLoad.apply(target, arguments);
                state.isLoaded = true;
            }});
        }
        function _1f(_21) {
            $(target).html(_21);
            if ($.parser) {
                $.parser.parse($(target));
            }
        }

        ;
    }

    ;
    function _1e(_22) {
        var t = $(_22);
        t.find(".combo-f").each(function () {
            $(this).combo("destroy");
        });
        t.find(".m-btn").each(function () {
            $(this).menubutton("destroy");
        });
        t.find(".s-btn").each(function () {
            $(this).splitbutton("destroy");
        });
    }

    ;
    function _23(_24) {
        $(_24).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible").each(function () {
            $(this).triggerHandler("_resize", [true]);
        });
    }

    ;
    function openPanel(target, forceOpen) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        if (forceOpen != true) {
            if (opts.onBeforeOpen.call(target) == false) {
                return;
            }
        }
        panel.show();
        opts.closed = false;
        opts.minimized = false;
        var tool = panel.children("div.panel-header").find("a.panel-tool-restore");
        if (tool.length) {
            opts.maximized = true;
        }
        opts.onOpen.call(target);
        if (opts.maximized == true) {
            opts.maximized = false;
            maximizePanel(target);
        }
        if (opts.collapsed == true) {
            opts.collapsed = false;
            collapsePanel(target);
        }
        if (!opts.collapsed) {
            loadData(target);
            _23(target);
        }
    }

    ;
    function closePanel(target, forceClose) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        if (forceClose != true) {
            if (opts.onBeforeClose.call(target) == false) {
                return;
            }
        }
        panel._fit(false);
        panel.hide();
        opts.closed = true;
        opts.onClose.call(target);
    }

    ;
    function destroyPanel(target, forceDestroy) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        if (forceDestroy != true) {
            if (opts.onBeforeDestroy.call(target) == false) {
                return;
            }
        }
        _1e(target);
        removeNode(panel);
        opts.onDestroy.call(target);
    }

    ;
    function collapsePanel(target, animate) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        var pbody = panel.children("div.panel-body");
        var tool = panel.children("div.panel-header").find("a.panel-tool-collapse");
        if (opts.collapsed == true) {
            return;
        }
        pbody.stop(true, true);
        if (opts.onBeforeCollapse.call(target) == false) {
            return;
        }
        tool.addClass("panel-tool-expand");
        if (animate == true) {
            pbody.slideUp("normal", function () {
                opts.collapsed = true;
                opts.onCollapse.call(target);
            });
        } else {
            pbody.hide();
            opts.collapsed = true;
            opts.onCollapse.call(target);
        }
    }

    ;
    function expandPanel(target, animate) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        var pbody = panel.children("div.panel-body");
        var tool = panel.children("div.panel-header").find("a.panel-tool-collapse");
        if (opts.collapsed == false) {
            return;
        }
        pbody.stop(true, true);
        if (opts.onBeforeExpand.call(target) == false) {
            return;
        }
        tool.removeClass("panel-tool-expand");
        if (animate == true) {
            pbody.slideDown("normal", function () {
                opts.collapsed = false;
                opts.onExpand.call(target);
                loadData(target);
                _23(target);
            });
        } else {
            pbody.show();
            opts.collapsed = false;
            opts.onExpand.call(target);
            loadData(target);
            _23(target);
        }
    }

    ;
    function maximizePanel(target) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        var tool = panel.children("div.panel-header").find("a.panel-tool-max");
        if (opts.maximized == true) {
            return;
        }
        tool.addClass("panel-tool-restore");
        if (!$.data(target, "panel").original) {
            $.data(target, "panel").original = {width:opts.width, height:opts.height, left:opts.left, top:opts.top, fit:opts.fit};
        }
        opts.left = 0;
        opts.top = 0;
        opts.fit = true;
        setSize(target);
        opts.minimized = false;
        opts.maximized = true;
        opts.onMaximize.call(target);
    }

    ;
    function minimizePanel(target) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        panel._fit(false);
        panel.hide();
        opts.minimized = true;
        opts.maximized = false;
        opts.onMinimize.call(target);
    }

    ;
    function restorePanel(target) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        var tool = panel.children("div.panel-header").find("a.panel-tool-max");
        if (opts.maximized == false) {
            return;
        }
        panel.show();
        tool.removeClass("panel-tool-restore");
        $.extend(opts, $.data(target, "panel").original);
        setSize(target);
        opts.minimized = false;
        opts.maximized = false;
        $.data(target, "panel").original = null;
        opts.onRestore.call(target);
    }

    ;
    function setBorder(target) {
        var opts = $.data(target, "panel").options;
        var panel = $.data(target, "panel").panel;
        var pheader = $(target).panel("header");
        var pbody = $(target).panel("body");
        panel.css(opts.style);
        panel.addClass(opts.cls);
        if (opts.border) {
            pheader.removeClass("panel-header-noborder");
            pbody.removeClass("panel-body-noborder");
        } else {
            pheader.addClass("panel-header-noborder");
            pbody.addClass("panel-body-noborder");
        }
        pheader.addClass(opts.headerCls);
        pbody.addClass(opts.bodyCls);
        if (opts.id) {
            $(target).attr("id", opts.id);
        } else {
            $(target).attr("id", "");
        }
    }

    ;
    function setTitle(target, title) {
        $.data(target, "panel").options.title = title;
        $(target).panel("header").find("div.panel-title").html(title);
    }

    ;
    var TO = false;
    var _59 = true;
    $(window).unbind(".panel").bind("resize.panel", function () {
        if (!_59) {
            return;
        }
        if (TO !== false) {
            clearTimeout(TO);
        }
        TO = setTimeout(function () {
            _59 = false;
            var _5a = $("body.layout");
            if (_5a.length) {
                _5a.layout("resize");
            } else {
                $("body").children("div.panel,div.accordion,div.tabs-container,div.layout").triggerHandler("_resize");
            }
            _59 = true;
            TO = false;
        }, 200);
    });
    $.fn.panel = function (options, param) {
        if (typeof options == "string") {
            return $.fn.panel.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var _5d = $.data(this, "panel");
            var _5e;
            if (_5d) {
                _5e = $.extend(_5d.options, options);
            } else {
                _5e = $.extend({}, $.fn.panel.defaults, $.fn.panel.parseOptions(this), options);
                $(this).attr("title", "");
                _5d = $.data(this, "panel", {options:_5e, panel:wrapPanel(this), isLoaded:false});
            }
            addHeader(this);
            setBorder(this);
            if (_5e.doSize == true) {
                _5d.panel.css("display", "block");
                setSize(this);
            }
            if (_5e.closed == true || _5e.minimized == true) {
                _5d.panel.hide();
            } else {
                openPanel(this);
            }
        });
    };
    $.fn.panel.methods = {options:function (jq) {
        return $.data(jq[0], "panel").options;
    }, panel:function (jq) {
        return $.data(jq[0], "panel").panel;
    }, header:function (jq) {
        return $.data(jq[0], "panel").panel.find(">div.panel-header");
    }, body:function (jq) {
        return $.data(jq[0], "panel").panel.find(">div.panel-body");
    }, setTitle:function (jq, _5f) {
        return jq.each(function () {
            setTitle(this, _5f);
        });
    }, open:function (jq, _60) {
        return jq.each(function () {
            openPanel(this, _60);
        });
    }, close:function (jq, _61) {
        return jq.each(function () {
            closePanel(this, _61);
        });
    }, destroy:function (jq, _62) {
        return jq.each(function () {
            destroyPanel(this, _62);
        });
    }, refresh:function (jq, _63) {
        return jq.each(function () {
            $.data(this, "panel").isLoaded = false;
            if (_63) {
                $.data(this, "panel").options.href = _63;
            }
            loadData(this);
        });
    }, resize:function (jq, _64) {
        return jq.each(function () {
            setSize(this, _64);
        });
    }, move:function (jq, _65) {
        return jq.each(function () {
            movePanel(this, _65);
        });
    }, maximize:function (jq) {
        return jq.each(function () {
            maximizePanel(this);
        });
    }, minimize:function (jq) {
        return jq.each(function () {
            minimizePanel(this);
        });
    }, restore:function (jq) {
        return jq.each(function () {
            restorePanel(this);
        });
    }, collapse:function (jq, _66) {
        return jq.each(function () {
            collapsePanel(this, _66);
        });
    }, expand:function (jq, _67) {
        return jq.each(function () {
            expandPanel(this, _67);
        });
    }};
    $.fn.panel.parseOptions = function (_68) {
        var t = $(_68);
        return $.extend({}, $.parser.parseOptions(_68, ["id", "width", "height", "left", "top", "title", "iconCls", "cls", "headerCls", "bodyCls", "tools", "href", {cache:"boolean", fit:"boolean", border:"boolean", noheader:"boolean"}, {collapsible:"boolean", minimizable:"boolean", maximizable:"boolean"}, {closable:"boolean", collapsed:"boolean", minimized:"boolean", maximized:"boolean", closed:"boolean"}]), {loadingMessage:(t.attr("loadingMessage") != undefined ? t.attr("loadingMessage") : undefined)});
    };
    $.fn.panel.defaults = {id:null, title:null, iconCls:null, width:"auto", height:"auto", left:null, top:null, cls:null, headerCls:null, bodyCls:null, style:{}, href:null, cache:true, fit:false, border:true, doSize:true, noheader:false, content:null, collapsible:false, minimizable:false, maximizable:false, closable:false, collapsed:false, minimized:false, maximized:false, closed:false, tools:null, href:null, loadingMessage:"Loading...", extractor:function (_69) {
        var _6a = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
        var _6b = _6a.exec(_69);
        if (_6b) {
            return _6b[1];
        } else {
            return _69;
        }
    }, onLoad:function () {
    }, onBeforeOpen:function () {
    }, onOpen:function () {
    }, onBeforeClose:function () {
    }, onClose:function () {
    }, onBeforeDestroy:function () {
    }, onDestroy:function () {
    }, onResize:function (_6c, _6d) {
    }, onMove:function (_6e, top) {
    }, onMaximize:function () {
    }, onRestore:function () {
    }, onMinimize:function () {
    }, onBeforeCollapse:function () {
    }, onBeforeExpand:function () {
    }, onCollapse:function () {
    }, onExpand:function () {
    }};
})(jQuery);

