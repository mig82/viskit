# viskit
A command line helper for Kony Visualizer (from now on Vis) projects.

## Disclaimer:

Viskit is meant to be a **community project**, not part of the official Kony platform, and so
it is **NOT supported by Kony in any way.**

# Requirements

This project makes heavy use of `async` functions so it requires Node 7.6 or higher.

# Installation

If you already have NPM installed all you have to do is open a command prompt and run:

    npm install -g viskit

# Usage

Once installed you'll be able to invoke **Viskit** from anywhere by simply typing in `viskit`
in the command prompt -e.g.:

    viskit --version

## Is Project

Determine whether a given path points to a Vis Enterprise project, according to
the Eclipse `.project` file located at its root directory.

    viskit is-vis-project path/to/workspace/FooApp

This is mostly a utility command on top of which others are built. It simply determines
whether the given path points to the root directory of a Vis project or not.

## Get Project Version

For Vis Enterprise projects, this determines the project version by parsing the
plugins it requires, as listed in the `konyplugins.xml` file located at its root
directory. For Vis Starter, it reads the `currentgaversion` property from the
`projectProperties.json` file also located at its root directory.

    viskit gpv path/to/workspace/FooApp

This helps you determine which Vis version you would need in order to
open a project _without_ upgrading it. This is specially relevant when
multiple developers must collaborate on a project.

You can use this command to decide which Major.Minor to install and then
use the `set-vis-version` command to install the right patch and hotfix
versions on top of that -e.g. If the project is of version 8.2.6.2, then
download version 8.2 from the Kony Downloads site and use `set-vis-version`
to get the exact plugins to match 8.2.**6.2**.

## Find Views

Find any views in the project of a specific view type, channel, or name.

    viskit find-views|fv path/to/workspace/FooApp

This is useful to give you a rough idea of how big a project is in terms of the number
of views it has. It's also a great way to see how reusable your work is, by comparing
the count of forms and popups to the number of reusable components. Meaning if the
count of views and popups is too high compared to the count of reusable components, then
you could probably be doing a better job of harvesting reusable components from your app.

## Find Widgets

Find any widgets in the project of a specific view type, channel or name.

    viskit find-widgets|fw path/to/workspace/FooApp

This mostly a utility command on top of which others are built. It's still useful
for resolving merge conflicts or if a project is broken by a reference to a widget
which can't be found, perhaps because it has been renamed by another developer.

## Count Widgets

Count the number of widgets for each view.

    viskit count-widgets|cw path/to/workspace/FooApp

The fewer widgets a form has, the less memory it will consume and the better it
will perform.

Forms with large amounts of widgets may suffer from performance issues, but this
will also depend on how heavy those widgets are.

Forms with fewer heavy widgets may perform worse than forms with many light-weight
widgets. Still, if a form is suffering from performance issues, this count may
give you a clue on why.

## Find Redundant Containers

Find any container widgets with one or no children.

    viskit find-redundant-containers|frc path/to/workspace/FooApp

Container widgets are usually necessary when positioning two or more widgets
as a group.

However, container widgets with a single child are usually not necessary as the
child can be positioned on its own.

Empty containers may be accidental, although they're sometimes used as separators,
shadows or place-holders.

## Count Skin Uses

Count the number of times each skin is used and find broken skin references.

    viskit count-skin-uses|csu path/to/workspace/FooApp --theme fooTheme

When you modify the appearance to the widgets in your project, Vis
automatically creates new skins for you. If you then delete the widgets,
the skins stay behind.

Furthermore, if you do not give these new skins mnemonic names that you
can later recognise as you create them, over time you risk accumulating
a large amount of unrecognisable skins, making it very hard to know
which ones are actually in use and which ones are not.

The intent of this command is to count the number of times each skin is
referenced. If the count of references to a skin is 0, you'll know it
is safe to delete it. If the count is low -e.g.: 1 or 2, then perhaps
you can delete it and instead reuse another. It also points out if any
widgets are referencing missing skins.

## Find Widgets with Undefined Dimensions

Find any widgets with undefined or preferred width or height.

    viskit find-autogrow-widgets|faw path/to/workspace/FooApp

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

    viskit find-orphan-widgets|fow path/to/workspace/FooApp

A widget is considered an _orphan_ when despite it being
part of the project file structure, it is not in the corresponding form's
tree of descendants. Meaning it points to a parent container which doesn't
point back to it as a child.

## Find Images

Find and classify image files and references in the project structure.

    viskit find-images|fi path/to/workspace/FooApp

An image is considered _unused_ when despite it being part of the project file
structure, it is not used as the source, loading image or "not found" image by
any image widget, nor as the background to any container widgets.

An image reference is considered _broken_ when despite it being set in a widget,
skin, splash screen, app icon or store art, it cannot be found in the project
structure.

## Find Skins

Find all the skins defined for a given theme.

    viskit find-skins|fs path/to/workspace/FooApp --theme fooTheme

All themes in a Vis project must have the exact same set of skins.
A skin will typically have a different appearance from one theme to another,
but retain its name across themes. When a skin is created in one theme, an
equivalent of the same name is created in all themes defined in the project.
When a skin is deleted from one theme, its equivalents are deleted from all
themes in the project.

However, a common issue when using SCM with Vis projects is that conflict
resolutions may cause themes to have different sets of skins. When this occurs,
the project is left in an inconsistent state.

This command is useful to find the skins defined for each theme, and so to help
trouble-shoot such scenarios

## Find Actions

Find event references to actions, *unused* actions and *broken* action references.

    viskit find-actions|fa path/to/workspace/FooApp

In Vis it is possible to link app, form and widget events either to
functions -in code- or to actions -using the **Action Editor**'s low-code
capabilities.

When using the latter it is not uncommon for a developer to *link* an
event to an action and then change their mind and *unlink* it. However,
when an action is unlinked from an app, form or widget event, the JSON
file defining the action stays behind.

Disciplined use of your SCM tools should ward against committing these
unused action JSON files into your codebase. However, it's not uncommon
for undisciplined developers to simply commit every new file and over
time accumulate large amounts of these JSON files polluting the
codebase, making it hard to tell what's in use and what's not, as well
as to troubleshoot eventual issues and solve merge conflicts.

This command is intended to help you find *unused* action JSON files so
you can remove them from your codebase.

This command will also find any *broken* references to actions which do not
exist.

## Find Font References

Find all references to the fonts used in the project.

    viskit find-font-references|ffr path/to/workspace/FooApp --theme fooTheme

Any given project will typically have its own style guide specifying every aspect of the
application's look & feel. The font family to be used is one of such aspects. However, it's
not uncommon for development teams working on large projects to miss a label here and a button
there which are not using the required font family.

This command will help you scan your project to find which fonts you are actually using and
where, so you'll be able to quickly identify if there are any widgets where you're using
the wrong typography.

## Set Fonts

    viskit set-fonts|sf OpenSans-Regular path/to/workspace/FooApp --except OpenSans-Bold,FontAwesome

Any given project will typically have its own style guide specifying every aspect of the
application's look & feel. The font family to be used is one of such aspects. However, it's
not uncommon for development teams working on large projects to miss a label here and a button
there which are not using the required font family.

This command allows you to do bulk updates of all the skins in your project to set them to the
desired font family. You should use it to set the default font for all your skins and use the
`--except` option to avoid changing any icon fonts as well as fonts which you know are already
correct —e.g.: If you've already set some fonts to OpenSans-Bold and want all others set to
OpenSans-Regular.

You should use it along with the `find-font-references` command to query what fonts you have,
make the necessary changes and then query the results.

**Note** that by default the command runs in *dry-run mode*. Meaning it only tells you what it would do
but does not really do it unless you use the `--force` option.

## Set Vis Version

Set the version of a Vis installation to match a given project.

    viskit set-vis-version|svv path/to/KonyVisEnterpriseX.Y.Z path/to/workspace/FooApp

When working with two or more projects developed using different versions of Vis, it
is very cumbersome to switch between them. Projects developed with Vis versions older
than the one you have installed can only be opened if you upgrade them. Projects developed
with Vis versions more recent than the one you have installed can only be opened if
you upgrade your installation, and then any upgrade will likely result in a version more recent
than the one your project actually needed.

This forces you to either keep multiple installations of Vis or to manually switch
the plugins in your Vis installation. This command attempts to help you shuffle the plugins
in your Vis installation in an automated and reliable way.

Sadly it's not possible to make a single Vis installation service projects for 7.x and 8.x
but this way you can at least try to use a single 7.x installation for all your 7.x projects and
a single 8.x installation for all your 8.x projects.

**Note:** this will not work with projects of versions 6.x and below.

**IMPORTANT:** This command is HIGHLY EXPERIMENTAL. Vis v8 introduced breaking changes to how Vis
works with the JDK, Gradle and other dependencies. You should still keep at least a v7.x and
a v8.x installation and not try to transform a v7.x into a v8.x or vice versa. Also keep in mind
that the most recent Vis versions will require more recent Xcode and Android SDK versions.
This command will do its best to let you know what the min versions of those external dependencies
are.

**SUPER-IMPORTANT:** You should not try to transform Vis installations from one Major.Minor to another.
It could break your installation. This command is safest to use when transforming an installation
from one Patch or Hotfix version to another. E.g.:

 * Transforming version 8.3.2.**2** down or up a hotfix to 8.3.2.**1** or to 8.3.2.**3** is considered safe and should work.
 * Transforming version 8.3.**2** down or up a patch to 8.3.**1** or 8.3.**3** is considered safe and should work.
 * Transforming version 8.**3**.x down or up a minor to 8.**2**.x or 8.**4**.x is known to work or break depending on the versions.
 * Transforming version **8**.x.y down or up a major to **7**.x.y or **9**.x.y is likely to break your installation.

**Note:** In the event of this command breaking your installation you can always restore the original plugins
from the `plugins_BACKUP` directory created under your Vis installation.
