#!/bin/bash

type_patch="PATCH"
type_minor="MINOR"
type_major="MAJOR"

# Get the current version
current_version=$(git describe --abbrev=0)

# Break the version into fragments
IFS='.' read -r -a version_fragments <<< "$current_version"

# Determine versioning type an increment the corresponding fragment
if [ $1 == $type_patch ]; then
  version_fragments[2]=$((version_fragments[2] + 1))
elif [ $1 == $type_minor ]; then
  version_fragments[1]=$((version_fragments[1] + 1))
elif [ $1 == $type_major ]; then
  version_fragments[0]=$((version_fragments[0] + 1))
else
  echo "[Versioning Failure] Unknown version type."
  exit 1
fi

# Join the new version
function join_fragments { local IFS="."; shift; echo "$*"; }
new_version=$(join_fragments . ${version_fragments[@]})

# Replace required files
file_manifest="extension/manifest.json"
file_package_json="package.json"
file_package_lock="package-lock.json"

# TODO: Make this configureable. Right now have to manually input them
sed -i "" "s/$current_version/$new_version/g" $file_manifest

# Only replace the first occurence for these
sed -i "" "3s/$current_version/$new_version/" $file_package_json
sed -i "" "3s/$current_version/$new_version/" $file_package_lock

###
# Add these back at a later date and use Git Flow instead
##

# # Tag new version
# git tag -a $new_version -m "Version $new_version"

# # Push up branch
# git add --all
# git commit -m "Version $new_version"
# git push && git push --tags