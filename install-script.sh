#!/bin/bash -e
{ # this ensures the entire script is downloaded #

# Stops the execution of a script if a command or pipeline has an error
set -e

# Functiom that prints the latest stable version
version() {
  echo "0.0.18"
}

echo "Downloading latest version from github $(version)"

#download latest
wget https://github.com/MKHenson/webinate-blacktip/archive/v$(version).zip
unzip -o "v$(version).zip"

# If directories are not present, then create them
if [ ! -d "resources" ]; then
	mkdir resources
	mkdir templates
fi

# Moves the server folder to the current directory
cp -r webinate-blacktip-$(version)/resources/* ./resources
cp -r webinate-blacktip-$(version)/templates/* ./templates

# Remove modepress temp folder
if [ -d "webinate-blacktip-$(version)" ]; then
	rm webinate-blacktip-$(version) -R
fi

# Remove the zip file
rm "v$(version).zip"

# All done
echo "Blacktip $(version) successfully installed :)"
exit
} # this ensures the entire script is downloaded #