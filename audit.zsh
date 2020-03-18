#!/bin/zsh
if [[ -n "$1" ]] && [[ -d "$1" ]] && (viskit ivp "$1"); then
  echo ":Project Version:"; viskit gpv "$1"
  echo "\n"
  echo ":Actions:"; viskit fa "$1"
  echo ":Views:"; viskit fv "$1"
  echo ":Widgets:"; viskit fw "$1"
  echo ":Images:"; viskit fi "$1"
  echo "\n"
  echo ":Skin Uses:"; viskit csu $1
  echo ":Orphaned Widgets:"; viskit fow $1
  echo ":Widgets with Undefined Dimensions:"; viskit faw $1
  echo ":Redundant Containers:"; viskit frc $1
else
  echo "The path entered is not a Visualizer Enterprise project"
fi
