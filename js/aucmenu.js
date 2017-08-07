/**
 * mlpushmenu.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
;
(function ($) {
    'use strict';

    function Plugin(container, opts) {
        var me = {};
        var options = $.extend(true, {}, $.fn[NAME].options, opts);

        var levels = [];
        var items = [];

        var path = (function () {
            var p = {}, a = [], z = -1, open = false;

            p.push = function (o) {
                a.push(o);
                z++;
            }

            p.peek = function () {
                return a[z];
            }

            p.drop = function () {
                a.length = z--;
            }

            p.trim = function (il) {
                while (a[z].il !== il) z--;
                a.length = z + 1;
            }

            p.set = function (v) {
                //
            }

            p.clear = function () {
                if (open) return;
                a.length = 0;
                z = -1;
            }

            p.isOpen = function () { return open; }

            p.open = function () {
                if (open) return;
                open = true;
                if (a.length === 0) {
                    a.push({ il: 0, ii: -1 });
                    z = 0;
                }
                p.update();
            }

            p.close = function () {
                if (!open) return;
                open = false;
                p.update();
            }

            p.update = function () {
                levels.forEach(function (cl) {
                    cl.reset();
                });
                items.forEach(function (ci) {
                    ci.reset();
                });

                if (open) {
                    for (var i = 0; i <= z; i++) {
                        var aa = a[i];
                        levels[aa.il].set(z - i);
                        if (aa.ii >= 0) {
                            items[aa.ii].set();
                        }
                    }
                }

                levels.forEach(function (cl) {
                    cl.run();
                });
                items.forEach(function (ci) {
                    ci.run();
                });
            }

            return p;
        })();


        function scan(model, parent_level_ix) {
            if (!model.items || !model.items.length) {
                if (parent_level_ix >= 0) return -1;
            }

            var level_ix = levels.length;
            var outer = $('<div>').addClass('mp-level').data('il', level_ix).appendTo(container);
            var h2 = $('<h2>').appendTo(outer);
            $('<span>').text(model.label).appendTo(h2);
            $('<i>', { 'aria-hidden': true }).addClass(model.icon).appendTo(h2);

            var clev = CtlLevel(outer, parent_level_ix);
            levels.push(clev);

            if (level_ix) {
                var cback = $('<div>').addClass('mp-back').appendTo(outer);
                var back = $('<a>')
                    .attr('href', '#')
                    .data('il', parent_level_ix)
                    .text(options.backLabel)
                    .appendTo(cback);

                $('<i>', { 'aria-hidden': true }).addClass('fa fa-chevron-right mp-back-icon').appendTo(cback);

                cback.on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    path.drop();
                    path.update();
                });
            }

            if (model.items && model.items.length) {
                var ul = $('<ul>').appendTo(outer);
                model.items.forEach(function (child) {
                    var item_ix = items.length;
                    var li = $('<li>').data('ii', item_ix).appendTo(ul);

                    var citem = CtlItem(li, level_ix);
                    items.push(citem);

                    var div = $('<div>').appendTo(li);
                    var chevron = $('<i>', { 'aria-hidden': true }).addClass('fa fa-chevron-left').css({
                        margin: '0px 15px',
                        'font-size': '0.7em',
                        opacity: 0
                    }).appendTo(div);
                    var a = $('<a>').attr('href', '#').text(child.label).css({
                        //position: 'absolute',
                        //left: 40
                    }).appendTo(div);
                    $('<i>', { 'aria-hidden': true }).addClass(child.icon).css({
                        margin: '0px 15px'
                    }).appendTo(div);

                    var child_level_ix = scan(child, level_ix);
                    if (child_level_ix >= 0) {
                        levels[level_ix].children.push(child_level_ix);
                        citem.L = child_level_ix;
                        chevron.css({ opacity: 1 });
                    }

                    li.on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var ii = $(this).data('ii');
                        path.peek().ii = ii;
                        var ci = items[ii];
                        if (ci.L) {
                            path.push({ il: ci.L, ii: -1 });
                        }
                        else {
                            //TODO azione foglia
                        }
                        path.update();
                    });
                });
            }

            outer.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var il = $(this).data('il');
                path.trim(il);
                path.update();
            });

            return level_ix;
        }


        function CtlItem(elem, level_ix) {
            var state = 0;
            var c = {
                elem: elem,
                level_ix: level_ix
            };

            c.reset = function () {
                state = 0;
            }

            c.set = function () {
                state = 1;
            }

            c.run = function () {
                if (state) {
                    elem.addClass('mp-item-selected');
                }
                else {
                    elem.removeClass('mp-item-selected');
                }
            }

            return c;
        }


        function CtlLevel(elem, parent_ix) {
            var state = 0, nesting = 0;
            var c = {
                elem: elem,
                parent_ix: parent_ix,
                children: []
            };

            c.reset = function () {
                state = nesting = 0;
            }

            c.set = function (ns) {
                state = 1;
                nesting = ns;
            }

            c.run = function () {
                if (state) {
                    var offset = options.width;
                    if (options.type === 'overlap') offset += nesting * options.levelSpacing;
                    if (options.dock === 'right') offset = -offset;
                    elem.addClass('mp-level-open');
                    elem.css('transform', 'translate3d(' + offset + 'px,0,0)');
                }
                else {
                    elem.css('transform', 'translate3d(0,0,0)');
                    elem.removeClass('mp-level-open');
                }
                if (state && nesting) {
                    elem.addClass('mp-level-overlay');
                }
                else {
                    elem.removeClass('mp-level-overlay');
                }
            }

            return c;
        }


        me.init = function () {
            container.addClass('mp-menu mp-' + options.type).css({
                width: options.width
            });
            switch (options.dock) {
                case 'left':
                    container.css('transform', 'translate3d(-' + options.width + 'px,0,0)');
                    break;

                case 'right':
                    container.css('transform', 'translate3d(' + options.width + 'px,0,0)');
                    break;
            }
            scan(options.menu, -1);
            me.close();
        }


        me.isOpen = function () {
            return path.isOpen();
        }

        me.reset = function () {
            path.clear();
        }

        me.open = function (reset) {
            path.open();
        }


        me.close = function () {
            path.close();
        }


        me.toggle = function () {
            if (me.isOpen()) {
                me.close();
            }
            else {
                me.open();
            }
        }

        return me;
    }


    var NAME = "auPushMenu";

    $.fn[NAME] = function (options) {
        return this.each(function () {
            var obj = Plugin($(this), options);
            obj.init();
            $(this).data(NAME, obj);
        });
    }


    $.fn[NAME].options = {
        width: 300,
        type: 'overlap', // overlap || cover
        levelSpacing: 40,
        backLabel: 'Back'
    }

})(jQuery);
