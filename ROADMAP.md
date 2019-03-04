# Roadmap

The following is a list of features I'd like *Viskit* to address hopefully in the not so distant future:

## Actions

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

* Detect images far too big for their form factor.
* Produce retina icons for iOS, splash screens, Android assets, etc based on an original 1024x1024 image.

## Localization

* Detect unused i18n's.
* Detect possible duplicate i18n's using fast-levenshtein algorithm.
* Export i18n's into CSV, Excel and JSON formats.

## Widgets

* Find unused segment, map and grid calendar templates.
* Find widgets of a specific type.
* Find deprecated widgets -e.g. VBox and HBox.
* Transform deprecated widgets -i.e. Transform VBox and HBox into FlexContainers.
* Detect widgets with non-mnemonic names -meaning the UUID names give by Visualizer by default.

## Skins

* Whitelist color, to define the project's color palette.
* Detect unsanctioned colors -meaning any font, border, background or font color other than the whitelisted ones.
* Detect skins that may be duplicates, equal or very similar in every way, except name.
* Detect skins with non-mnemonic names -meaning the UUID names give by Visualizer by default.

## Plugin Handling

* Revert back to the plugins backed up by the `svv` command.
