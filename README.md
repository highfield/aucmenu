
auCMenu
=========
A multi-level menu that allows (almost) endless nesting of navigation elements.

Not yet perfect, but check this [demo](https://highfield.github.io/aucmenu/) out.

## Features
The original Codrops experimental [project](https://github.com/codrops/MultiLevelPushMenu) was really nice, but misses several features I'm interested on. Here are a short summary of what my library solves:
* Items of a menu level render in a more compact way whenever its number would overflow the available height.
* Menu levels shrinks whenever the available width becomes insufficient to display the open levels.
* Items persistent selection with highlight.
* The menu structure is defined by a normal Javascript (JSON) object, thus better suitable for AJAX contexts.
* Menu dockable also on the right side (still in development).

## Status
Tasks pending:
* Rightside menu still partially implemented.
* Menu levels having lots of items could be rendered better in tiny displays (e.g. horizontal mobile)
* The "cover" mode is not working.

## Usage
The best thing you can do is having a look at the *index.html* file, which contains a complete demo.

In general, the menu model structure is very simple:
```javascript
  var menu = {
      "label": "All Categories",
      "icon": "fa fa-globe",
      "items": [
          {
              "label": "Devices",
              "icon": "fa fa-laptop",
              "items": [
      ...
```
Whenever a certain node matters for identification (e.g. selection), you can specify its key with the *id* field name, as follows:
```javascript
  { "label": "Scientific American", "icon": "fa fa-cut", id: "sci_am" },
```
Of course, this key should be unique within the entire node set (not just the category).

The component initialization could be done as the following example:
```javascript
  var options_left = {
      dock: 'left'
  };

  $('#mp-menu-left').auCMenu(options_left);
  var api_left = $('#mp-menu-left').data('auCMenu');
  api_left.load(menu);

  $('#mp-menu-left').on('selected', function (e, args) {
      console.log('selected: ' + args.item);
  });

  $(window).on('resize', function () {
      var w = $(window).width();
      var h = $(window).height() - 50;
      api_left.resize(w, h);
  });

  $(document).on('click', function () {
      api_left.close();
  });
```

## Options
The supported initialization options are:

#### width
Numeric, default is 300.

The nominal width (in pixels) of the level when is open. Depending on the actual width of the viewport, the level size may be less than this value.

#### type
String, default is "overlap".

Defines how the menu levels display over a hierarchical selection.

With "cover" every open level will totally cover the underlying levels.

With "overlap", the levels overlap partially leaving a small slice visible (see *levelSpacing*).

The latter takes more space on the display, but allows the user to select back an underlying level.

#### levelSpacing
Numeric, default is 40.

Defines what is the width (in pixels) of the visible slice in "overlap" mode.

#### backLabel
String, default is "Back".

Defines the text to display in the backbutton command.


## Dependencies
Requires:
* jQuery (tested with 3.1.1, but should be fine any recent 2.x version)
* FontAwesome (not really mandatory, but at the moment is the only icon source required)

## Browsers compatibility
Any recent browser should work fine.

Tested on:
* Chrome (59+)
* Opera (46+)
* Edge
* Firefox
* iPhone 6
* Android
* Lumia 650

## Copyright notice

Based on a Codrops experimental [project](https://github.com/codrops/MultiLevelPushMenu)

[MIT license](https://opensource.org/licenses/MIT)
