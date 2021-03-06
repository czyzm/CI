#!/usr/bin/env bash
### START - JXcore Test Server --------
### Testing environment prepares separate packages for each node.
### Package builder calls this script with each node's IP address
### Make sure multiple calls to this script file compiles the application file

NORMAL_COLOR='\033[0m'
RED_COLOR=''
GREEN_COLOR='\033[0;32m'
GRAY_COLOR='\033[0;37m'

LOG() {
  COLOR="$1"
  TEXT="$2"
  echo -e "${COLOR}$TEXT ${NORMAL_COLOR}"
}


ERROR_ABORT() {
  if [[ $? != 0 ]]
  then
    LOG $RED_COLOR "pack android aborted\n"
    exit -1
  fi
}
### END - JXcore Test Server   --------

cd Github/testBuild;ERROR_ABORT
jx -e "var fs=require('fs');var x = fs.existsSync('{{BUILD_PATH}}'); if (!x) console.error('Could not find the application path. Check build location on mobile_test.json');process.exit(x ? 0 : 1)";ERROR_ABORT
cp {{BUILD_PATH}} android-unaligned.apk;ERROR_ABORT
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass asddsa -keypass asddsa -keystore my-release-key.keystore android-unaligned.apk alias_name;ERROR_ABORT
zipalign -v 4 android-unaligned.apk android.apk;ERROR_ABORT
