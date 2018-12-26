# viskit
A command line helper for Kony Visualizer projects.

## Disclaimer:

Viskit is meant to be a **community project**, not part of the official Kony platform, and so
it is **NOT supported by Kony in any way.**

## Find Views

Find any views in the project of a specific view type, channel, or name.

    find-views|fv <project>

This useful to give you a rough idea of how big a project is in terms of the number
of views it has. It's also a great way to see how reusable your work is, by comparing
the count of forms and popups to the number of reusable components. Meaning if the
count of views and popups is too high compared to the count of reusable components, then
you could probably be doing a better job of harvesting reusable components from your app.

## Find Widgets

Find any widgets in the project of a specific view type, channel or name.

    find-widgets|fw <project>

This mostly a utility command on top of which others are built. It's still useful
for resolving merge conflicts or if a project is broken by a reference to a widget
which can't be found, perhaps because it has been renamed by another developer.

## Count Widgets

Count the number of widgets for each view.

    count-widgets|cw <project>

The fewer widgets a form has, the less memory it will consume and the better it
will perform.

Forms with large amounts of widgets may suffer from performance issues, but this
will also depend on how heavy those widgets are.

Forms with fewer heavy widgets may perform worse than forms with many light-weight
widgets. Still, if a form is suffering from performance issues, this count may
give you a clue on why.

## Find Redundant Containers

Find any container widgets with one or no children.

    find-redundant-containers|frc <project>

Container widgets are usually necessary when positioning two or more widgets
as a group.

However, container widgets with a single child are usually not necessary as the
child can be positioned on its own.

Empty containers may be accidental, although they're sometimes used as separators,
shadows or place-holders.

## Find Widgets with Undefined Dimensions

Find any widgets with undefined or preferred width or height.

    find-autogrow-widgets|faw <project>

It's possible to create a widget without a defined width, by setting its left and
right properties instead and letting it be as wide as it must to meet those.

It's also possible to create a widget without a defined height, by setting its top and
bottom properties instead and letting it be as tall as it must to meet those.

It's also possible to set a widget's width or height to preferred, and let it be
as wide or tall as it must in order to accommodate its content.

Any of the scenarios above will cause additional overhead to calculate the resulting
width or height of the widget. Ergo it is better to define both the width and height whenever
possible. If a specific form is suffering from performance issues, this command will
give you a hint on whether too many widgets with undefined width or height may be
part of the problem.

## Find Orphaned Widgets

Find any widgets in the project structure not linked to a view.

    find-orphan-widgets|fow <project>

A widget is considered an orphan when despite it being
part of the project file structure, it is not in the corresponding form's
tree of descendants. Meaning it points to a parent container which doesn't
point back to it as a child.

# Roadmap

The following is a list of features that *Viskit* aims to address hopefully in the not so distant future:

## Actions

* Find unused actions -meaning actions which are part of the project structure but are not pointed to by any app, form or widget event.
* Find actions with non-mnemonic names -meaning actions with the UUID names that Visualizer gives them by default.
* Rename actions to human-readable mnemonic names -so that developers can better tell what those actions are for when looking at the project structure.

## Fonts

* Find unused fonts -meaning fonts that are in the project structure but which are not used by any skin.
* Whitelist fonts -meaning creating a list of the fonts that the app is supposed to use.
* Find unsanctioned fonts -meaning any skin using a font other than the whitelisted ones.
* Bulk update fonts -meaning apply a font to all skins in the project matching a certain criteria.
* Detect inconsistent fonts -meaning widgets named the same across views but using different fonts, font colors and font sizes.
* Detect when fonts of a skin are not the same across channels.
* Detect when a font is not present in all channels.
* Font import -meaning copying a font from a specified location into all channels.
* Font remove -meaning deleting a specified font from all channels.
* Rename a font file to the name of the font contained within -so it can be correctly used in the project.

## Forms

* Whitelist transitions -meaning a list of the transitions to be used throughout the app.
* Find unsanctioned transitions -meaning any form transition other than the whitelisted ones.
* Bulk update form transitions -to avoid the need to manually go in and edit each form and the risk of missing one.
* Count heavy widgets per view -e.g. segments, browsers, maps.
* Detect heavy widgets which do not occupy the whole view they're in.
* Detect heavy widgets nested inside segments or grids.

## Images

* Detect unused images -meaning images that are part of the project structure but are not used as the source, loading image, not-found image of any image icon nor as the background image of any container widget.
* Detect images far too big for their form factor.
* Produce retina icons for iOS, splash screens, Android assets, etc based on an original 1024x1024 image.

## Localization

* Detect unused i18n's.
* Detect possible duplicate i18n's using fast-levenshtein algorithm.
* Export i18n's into CSV, Excel and JSON formats.

## Widgets

* Find deprecated widgets -e.g. VBox and HBox.
* Transform deprecated widgets -i.e. Transform VBox and HBox into FlexContainers.
* Detect widgets with non-mnemonic names -meaning the UUID names give by Visualizer by default.

## Skins

* Detect unused skins.
* Detect different count of skins across themes
* Whitelist color, to define the project's color palette.
* Detect unsanctioned colors -meaning any font, border, background or font color other than the whitelisted ones.
* Detect skins that may be duplicates, equal or very similar in every way, except name.
* Detect skins with non-mnemonic names -meaning the UUID names give by Visualizer by default.

## Plugin Handling

* Transforming a Visualizer installation to match the plugin versions of a specific project so that it can be opened without the need to upgrade it.
