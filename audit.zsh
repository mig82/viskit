#!/bin/zsh

# setup defaults
theme="defaultTheme"
locale="en_GB"

usage() {
  echo "\n"
  echo "Usage: $0 [-t|-theme <string>] [-l|-locale <string>] [<directory>]"
  echo "\n"
  echo "This project uses viskit under the hood, it runs a few of the commands to create an \"audit\"
The commands ran (in order) are:
    \"find-actions\"
    \"find-views\"
    \"find-widgets\"
    \"find-orphan-widgets\"
    \"find-autogrow-widgets\"
    \"find-redundant-containers\"
    \"find-skins\"
    \"count-skin-uses\"
    \"find-dupe-skins\"
    \"find-font-references\"
    \"find-dupe-i18ns\"
    \"find-images\""
  echo "\n"
  echo "-t|-theme   [tag] is the theme you want to do the audit on, left blank will default it to \"${theme}\"
-l|-locale  [tag] is the locale you want to do the audit on, left blank will default it to \"${locale}\"
<directory> [arg] specifies the directory your kony project is in, defaults to current working directory"
  echo "\n"
  exit 1;
}

while getopts ":h:t:l:" tag; do
    case "${tag}" in
        t)      t=${OPTARG} ;;
        theme)  t=${OPTARG} ;;
        l)      l=${OPTARG} ;;
        locale) l=${OPTARG} ;;
        *)      usage ;;
    esac
done

# default theme
if [[ -z "${t}" ]]; then
  t=theme
fi
#default locale
if [[ -z "${l}" ]]; then
  l=locale
fi

# validate and set directory
shift $((OPTIND-1))
d="$*"
if [[ -z "$d" ]] || [[ -n "$d" && ! -d "$d" ]]; then
  d="."
fi

# # params input into viskit
# echo "d = ${d}"
# echo "t = ${t}"
# echo "l = ${l}"

echo "\n"
echo "You are using viskit version:"; viskit --version
echo "\n"

if [[ `viskit is-classic-project "${d}"` == 'true' ]]; then
  echo "Classic Version:"; viskit get-project-version "$d"
else
  echo "Quantum Version:"; viskit get-quantum-version "$d"
fi

echo "\n"
echo ":Actions:"; viskit find-actions "$d"
echo "\n"
echo ":Views:"; viskit find-views "$d"
echo "\n"
echo ":Widgets:"; viskit find-widgets "$d"
echo ":Orphaned Widgets:"; viskit find-orphan-widgets "$d"
echo ":Widgets with Undefined Dimensions:"; viskit find-autogrow-widgets "$d"
echo ":Redundant Containers:"; viskit find-redundant-containers "$d"
echo "\n"
echo ":Skins:"; viskit find-skins "$d" --theme "$t"
echo ":Skin Uses:"; viskit count-skin-uses "$d"
echo ":Duplicate Skins:"; viskit find-dupe-skins "$d" --theme "$t"
echo ":Font References:"; viskit find-font-references "$d" --theme "$t"
echo "\n"
echo ":Duplicate Translations:"; viskit find-dupe-i18ns "$d" --locale "$l"
echo "\n"
echo ":Images:"; viskit find-images "$d"
