#!/bin/bash

output="github-diff-explorer"
output_file="$output.zip"
input="extension"

# Remove the zip file if already in the directory
if [ -f $output_file ]; then
  rm $output_file
fi

# Create build directory
mkdir $output

# Copy the contents into the build
cp -R $input/* $output

# Zip the folder
zip -r $output_file $output

# Clean up the temptorary output dir
rm -R $output