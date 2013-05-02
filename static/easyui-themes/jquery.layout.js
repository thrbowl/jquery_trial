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
    var resizing = false;

    function setSize(container) {
        var opts = $.data(container, "layout").options;
        var panels = $.data(container, "layout").panels;
        var cc = $(container);
        opts.fit ? cc.css(cc._fit()) : cc._fit(false);
        var cpos = {top:0, left:0, width:cc.width(), height:cc.height()};

        function setNorthSize(pp) {
            if (pp.length == 0) {
                return;
            }
            pp.panel("resize", {width:cc.width(), height:pp.panel("options").height, left:0, top:0});
            cpos.top += pp.panel("options").height;
            cpos.height -= pp.panel("options").height;
        }

        ;
        if (isVisible(panels.expandNorth)) {
            setNorthSize(panels.expandNorth);
        } else {
            setNorthSize(panels.north);
        }
        function setSouthSize(pp) {
            if (pp.length == 0) {
                return;
            }
            pp.panel("resize", {width:cc.width(), height:pp.panel("options").height, left:0, top:cc.height() - pp.panel("options").height});
            cpos.height -= pp.panel("options").height;
        }

        ;
        if (isVisible(panels.expandSouth)) {
            setSouthSize(panels.expandSouth);
        } else {
            setSouthSize(panels.south);
        }
        function setEastSize(pp) {
            if (pp.length == 0) {
                return;
            }
            pp.panel("resize", {width:pp.panel("options").width, height:cpos.height, left:cc.width() - pp.panel("options").width, top:cpos.top});
            cpos.width -= pp.panel("options").width;
        }

        ;
        if (isVisible(panels.expandEast)) {
            setEastSize(panels.expandEast);
        } else {
            setEastSize(panels.east);
        }
        function setWestSize(pp) {
            if (pp.length == 0) {
                return;
            }
            pp.panel("resize", {width:pp.panel("options").width, height:cpos.height, left:0, top:cpos.top});
            cpos.left += pp.panel("options").width;
            cpos.width -= pp.panel("options").width;
        }

        ;
        if (isVisible(panels.expandWest)) {
            setWestSize(panels.expandWest);
        } else {
            setWestSize(panels.west);
        }
        panels.center.panel("resize", cpos);
    }

    ;
    function init(container) {
        var cc = $(container);
        if (cc[0].tagName == "BODY") {
            $("html").addClass("panel-fit");
        }
        cc.addClass("layout");
        function createRegions(cc) {
            cc.children("div").each(function () {
                var opts = $.parser.parseOptions(this, ["region"]);
                var region = opts.region;
                if (region == "north" || region == "south" || region == "east" || region == "west" || region == "center") {
                    createPanel(container, {region:region}, this);
                }
            });
        }

        ;
        cc.children("form").length ? createRegions(cc.children("form")) : createRegions(cc);
        $("<div class=\"layout-split-proxy-h\"></div>").appendTo(cc);
        $("<div class=\"layout-split-proxy-v\"></div>").appendTo(cc);
        cc.bind("_resize", function (elem, fit) {
            var opts = $.data(container, "layout").options;
            if (opts.fit == true || fit) {
                setSize(container);
            }
            return false;
        });
    }

    ;
    function createPanel(container, options, elem) {
        options.region = options.region || "center";
        var panels = $.data(container, "layout").panels;
        var cc = $(container);
        var dir = options.region;
        if (panels[dir].length) {
            return;
        }
        var pp = $(elem);
        if (!pp.length) {
            pp = $("<div></div>").appendTo(cc);
        }
        pp.panel($.extend({}, {
            width:(pp.length ? parseInt(pp[0].style.width) || pp.outerWidth() : "auto"),
            height:(pp.length ? parseInt(pp[0].style.height) || pp.outerHeight() : "auto"),
            split:(pp.attr("split") ? pp.attr("split") == "true" : undefined),
            doSize:false, cls:("layout-panel layout-panel-" + dir),
            bodyCls:"layout-body",
            onOpen:function () {
                var iconTable = {north:"up", south:"down", east:"right", west:"left"};
                if (!iconTable[dir]) {
                    return;
                }
                var iconCls = "layout-button-" + iconTable[dir];
                var tool = $(this).panel("header").children("div.panel-tool");
                if (!tool.children("a." + iconCls).length) {
                    var t = $("<a href=\"javascript:void(0)\"></a>").addClass(iconCls).appendTo(tool);
                    t.bind("click", {dir:dir}, function (elem) {
                        createExpandPanel(container, elem.data.dir);
                        return false;
                    });
                }
            }}, options));
        panels[dir] = pp;
        if (pp.panel("options").split) {
            var panel = pp.panel("panel");
            panel.addClass("layout-split-" + dir);
            var handles = "";
            if (dir == "north") {
                handles = "s";
            }
            if (dir == "south") {
                handles = "n";
            }
            if (dir == "east") {
                handles = "w";
            }
            if (dir == "west") {
                handles = "e";
            }
            panel.resizable({
                handles:handles,
                onStartResize:function (e) {
                    resizing = true;
                    if (dir == "north" || dir == "south") {
                        var proxy = $(">div.layout-split-proxy-v", container);
                    } else {
                        var proxy = $(">div.layout-split-proxy-h", container);
                    }
                    var top = 0, left = 0, width = 0, height = 0;
                    var pos = {display:"block"};
                    if (dir == "north") {
                        pos.top = parseInt(panel.css("top")) + panel.outerHeight() - proxy.height();
                        pos.left = parseInt(panel.css("left"));
                        pos.width = panel.outerWidth();
                        pos.height = proxy.height();
                    } else {
                        if (dir == "south") {
                            pos.top = parseInt(panel.css("top"));
                            pos.left = parseInt(panel.css("left"));
                            pos.width = panel.outerWidth();
                            pos.height = proxy.height();
                        } else {
                            if (dir == "east") {
                                pos.top = parseInt(panel.css("top")) || 0;
                                pos.left = parseInt(panel.css("left")) || 0;
                                pos.width = proxy.width();
                                pos.height = panel.outerHeight();
                            } else {
                                if (dir == "west") {
                                    pos.top = parseInt(panel.css("top")) || 0;
                                    pos.left = panel.outerWidth() - proxy.width();
                                    pos.width = proxy.width();
                                    pos.height = panel.outerHeight();
                                }
                            }
                        }
                    }
                    proxy.css(pos);
                    $("<div class=\"layout-mask\"></div>").css({left:0, top:0, width:cc.width(), height:cc.height()}).appendTo(cc);
                },
                onResize:function (e) {
                    if (dir == "north" || dir == "south") {
                        var proxy = $(">div.layout-split-proxy-v", container);
                        proxy.css("top", e.pageY - $(container).offset().top - proxy.height() / 2);
                    } else {
                        var proxy = $(">div.layout-split-proxy-h", container);
                        proxy.css("left", e.pageX - $(container).offset().left - proxy.width() / 2);
                    }
                    return false;
                },
                onStopResize:function () {
                    $(">div.layout-split-proxy-v", container).css("display", "none");
                    $(">div.layout-split-proxy-h", container).css("display", "none");
                    var opts = pp.panel("options");
                    opts.width = panel.outerWidth();
                    opts.height = panel.outerHeight();
                    opts.left = panel.css("left");
                    opts.top = panel.css("top");
                    pp.panel("resize");
                    setSize(container);
                    resizing = false;
                    cc.find(">div.layout-mask").remove();
                }});
        }
    }

    ;
    function removeRegion(container, region) {
        var panels = $.data(container, "layout").panels;
        if (panels[region].length) {
            panels[region].panel("destroy");
            panels[region] = $();
            var expandPanel = "expand" + region.substring(0, 1).toUpperCase() + region.substring(1);
            if (panels[expandPanel]) {
                panels[expandPanel].panel("destroy");
                panels[expandPanel] = undefined;
            }
        }
    }

    ;
    function createExpandPanel(container, region, duration) {
        if (duration == undefined) {
            duration = "normal";
        }
        var panels = $.data(container, "layout").panels;
        var p = panels[region];
        if (p.panel("options").onBeforeCollapse.call(p) == false) {
            return;
        }
        var expandPanel = "expand" + region.substring(0, 1).toUpperCase() + region.substring(1);
        if (!panels[expandPanel]) {
            panels[expandPanel] = _expandPanel(region);
            panels[expandPanel].panel("panel").click(function () {
                var _2d = _2e();
                p.panel("expand", false).panel("open").panel("resize", _2d.collapse);
                p.panel("panel").animate(_2d.expand);
                return false;
            });
        }
        var _2f = _2e();
        if (!isVisible(panels[expandPanel])) {
            panels.center.panel("resize", _2f.resizeC);
        }
        p.panel("panel").animate(_2f.collapse, duration, function () {
            p.panel("collapse", false).panel("close");
            panels[expandPanel].panel("open").panel("resize", _2f.expandP);
        });
        function _expandPanel(dir) {
            var icon;
            if (dir == "east") {
                icon = "layout-button-left";
            } else {
                if (dir == "west") {
                    icon = "layout-button-right";
                } else {
                    if (dir == "north") {
                        icon = "layout-button-down";
                    } else {
                        if (dir == "south") {
                            icon = "layout-button-up";
                        }
                    }
                }
            }
            var p = $("<div></div>").appendTo(container).panel({cls:"layout-expand", title:"&nbsp;", closed:true, doSize:false, tools:[
                {iconCls:icon, handler:function () {
                    expandRegion(container, region);
                    return false;
                }}
            ]});
            p.panel("panel").hover(function () {
                $(this).addClass("layout-expand-over");
            }, function () {
                $(this).removeClass("layout-expand-over");
            });
            return p;
        }

        ;
        function _2e() {
            var cc = $(container);
            if (region == "east") {
                return {resizeC:{width:panels.center.panel("options").width + panels["east"].panel("options").width - 28}, expand:{left:cc.width() - panels["east"].panel("options").width}, expandP:{top:panels["east"].panel("options").top, left:cc.width() - 28, width:28, height:panels["center"].panel("options").height}, collapse:{left:cc.width()}};
            } else {
                if (region == "west") {
                    return {resizeC:{width:panels.center.panel("options").width + panels["west"].panel("options").width - 28, left:28}, expand:{left:0}, expandP:{left:0, top:panels["west"].panel("options").top, width:28, height:panels["center"].panel("options").height}, collapse:{left:-panels["west"].panel("options").width}};
                } else {
                    if (region == "north") {
                        var hh = cc.height() - 28;
                        if (isVisible(panels.expandSouth)) {
                            hh -= panels.expandSouth.panel("options").height;
                        } else {
                            if (isVisible(panels.south)) {
                                hh -= panels.south.panel("options").height;
                            }
                        }
                        panels.east.panel("resize", {top:28, height:hh});
                        panels.west.panel("resize", {top:28, height:hh});
                        if (isVisible(panels.expandEast)) {
                            panels.expandEast.panel("resize", {top:28, height:hh});
                        }
                        if (isVisible(panels.expandWest)) {
                            panels.expandWest.panel("resize", {top:28, height:hh});
                        }
                        return {resizeC:{top:28, height:hh}, expand:{top:0}, expandP:{top:0, left:0, width:cc.width(), height:28}, collapse:{top:-panels["north"].panel("options").height}};
                    } else {
                        if (region == "south") {
                            var hh = cc.height() - 28;
                            if (isVisible(panels.expandNorth)) {
                                hh -= panels.expandNorth.panel("options").height;
                            } else {
                                if (isVisible(panels.north)) {
                                    hh -= panels.north.panel("options").height;
                                }
                            }
                            panels.east.panel("resize", {height:hh});
                            panels.west.panel("resize", {height:hh});
                            if (isVisible(panels.expandEast)) {
                                panels.expandEast.panel("resize", {height:hh});
                            }
                            if (isVisible(panels.expandWest)) {
                                panels.expandWest.panel("resize", {height:hh});
                            }
                            return {resizeC:{height:hh}, expand:{top:cc.height() - panels["south"].panel("options").height}, expandP:{top:cc.height() - 28, left:0, width:cc.width(), height:28}, collapse:{top:cc.height()}};
                        }
                    }
                }
            }
        }

        ;
    }

    ;
    function expandRegion(container, region) {
        var panels = $.data(container, "layout").panels;
        var _35 = _36();
        var p = panels[region];
        if (p.panel("options").onBeforeExpand.call(p) == false) {
            return;
        }
        var expandPanel = "expand" + region.substring(0, 1).toUpperCase() + region.substring(1);
        panels[expandPanel].panel("close");
        p.panel("panel").stop(true, true);
        p.panel("expand", false).panel("open").panel("resize", _35.collapse);
        p.panel("panel").animate(_35.expand, function () {
            setSize(container);
        });
        function _36() {
            var cc = $(container);
            if (region == "east" && panels.expandEast) {
                return {collapse:{left:cc.width()}, expand:{left:cc.width() - panels["east"].panel("options").width}};
            } else {
                if (region == "west" && panels.expandWest) {
                    return {collapse:{left:-panels["west"].panel("options").width}, expand:{left:0}};
                } else {
                    if (region == "north" && panels.expandNorth) {
                        return {collapse:{top:-panels["north"].panel("options").height}, expand:{top:0}};
                    } else {
                        if (region == "south" && panels.expandSouth) {
                            return {collapse:{top:cc.height()}, expand:{top:cc.height() - panels["south"].panel("options").height}};
                        }
                    }
                }
            }
        }

        ;
    }

    ;
    function bindEvents(container) {
        var panels = $.data(container, "layout").panels;
        var cc = $(container);
        if (panels.east.length) {
            panels.east.panel("panel").bind("mouseover", "east", collapsePanel);
        }
        if (panels.west.length) {
            panels.west.panel("panel").bind("mouseover", "west", collapsePanel);
        }
        if (panels.north.length) {
            panels.north.panel("panel").bind("mouseover", "north", collapsePanel);
        }
        if (panels.south.length) {
            panels.south.panel("panel").bind("mouseover", "south", collapsePanel);
        }
        panels.center.panel("panel").bind("mouseover", "center", collapsePanel);
        function collapsePanel(e) {
            if (resizing == true) {
                return;
            }
            if (e.data != "east" && isVisible(panels.east) && isVisible(panels.expandEast)) {
                createExpandPanel(container, "east");
            }
            if (e.data != "west" && isVisible(panels.west) && isVisible(panels.expandWest)) {
                createExpandPanel(container, "west");
            }
            if (e.data != "north" && isVisible(panels.north) && isVisible(panels.expandNorth)) {
                createExpandPanel(container, "north");
            }
            if (e.data != "south" && isVisible(panels.south) && isVisible(panels.expandSouth)) {
                createExpandPanel(container, "south");
            }
            return false;
        }

        ;
    }

    ;
    function isVisible(pp) {
        if (!pp) {
            return false;
        }
        if (pp.length) {
            return pp.panel("panel").is(":visible");
        } else {
            return false;
        }
    }

    ;
    function setExpandPanel(container) {
        var panels = $.data(container, "layout").panels;
        if (panels.east.length && panels.east.panel("options").collapsed) {
            createExpandPanel(container, "east", 0);
        }
        if (panels.west.length && panels.west.panel("options").collapsed) {
            createExpandPanel(container, "west", 0);
        }
        if (panels.north.length && panels.north.panel("options").collapsed) {
            createExpandPanel(container, "north", 0);
        }
        if (panels.south.length && panels.south.panel("options").collapsed) {
            createExpandPanel(container, "south", 0);
        }
    }

    ;
    $.fn.layout = function (options, param) {
        if (typeof options == "string") {
            return $.fn.layout.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "layout");
            if (state) {
                $.extend(state.options, options);
            } else {
                var opts = $.extend({}, $.fn.layout.defaults, $.fn.layout.parseOptions(this), options);
                $.data(this, "layout", {options:opts, panels:{center:$(), north:$(), south:$(), east:$(), west:$()}});
                init(this);
                bindEvents(this);
            }
            setSize(this);
            setExpandPanel(this);
        });
    };
    $.fn.layout.methods = {resize:function (jq) {
        return jq.each(function () {
            setSize(this);
        });
    }, panel:function (jq, region) {
        return $.data(jq[0], "layout").panels[region];
    }, collapse:function (jq, region) {
        return jq.each(function () {
            createExpandPanel(this, region);
        });
    }, expand:function (jq, region) {
        return jq.each(function () {
            expandRegion(this, region);
        });
    }, add:function (jq, options) {
        return jq.each(function () {
            createPanel(this, options);
            setSize(this);
            if ($(this).layout("panel", options.region).panel("options").collapsed) {
                createExpandPanel(this, options.region, 0);
            }
        });
    }, remove:function (jq, region) {
        return jq.each(function () {
            removeRegion(this, region);
            setSize(this);
        });
    }};
    $.fn.layout.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, [
            {fit:"boolean"}
        ]));
    };
    $.fn.layout.defaults = {fit:false};
})(jQuery);

