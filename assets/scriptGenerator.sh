# run the below script to generate jacascript files
# bash ./assets/scriptGenerator.sh
# look for files

# for each thumbnails
# check if the full size version exists

# for file in ./assets/Crums/*/*
# do echo $file
#  do mv "$file" `echo $file | tr '' '_'`
# done

for fileFullName in $(find ./assets/CrumThumbnails -name "*.png")
do
   :
  fileBaseName="$(basename -- $fileFullName)"
  fileDirName="$(basename $(dirname $fileFullName))"
  if [ $fileDirName != . ]
  then
  # mv -i "$fileFullName" "${fileFullName// /_}"
  FILE=./assets/Crums/$fileDirName/$fileBaseName
  if ! [ -f "$FILE" ]; then
    echo "$fileFullName do not exist as full size"
    rm ./assets/CrumThumbnails/$fileDirName/$fileBaseName
  # else
    # echo "$fileBaseName exist as full size"
  fi
  fi
done



for fileFullName in $(find ./assets/Crums -name "*.png")
do
   :
  fileBaseName="$(basename -- $fileFullName)"
  fileDirName="$(basename $(dirname $fileFullName))"
  if [ $fileDirName != . ]
  then
  #
  FILE=./assets/CrumThumbnails/$fileDirName/$fileBaseName
  if ! [ -f "$FILE" ]; then
    echo "$fileFullName do not exist as small size"
    rm ./assets/CrumThumbnails/$fileDirName/$fileBaseName
  # else
    # echo "$fileBaseName exist as full size"
  fi
  fi
done

# seed files
touch ./script/crumSeed.js
cat /dev/null > ./script/crumSeed.js
echo "const crums = [" >> ./script/crumSeed.js
for fileFullName in $(find ./assets/Crums -name "*.png")
do
   :
  fileBaseName="$(basename -- $fileFullName| cut -d. -f1)"
  fileDirName="$(basename $(dirname $fileFullName))"
  echo "processing file:" $fileBaseName
  echo $fileDirName
  echo {name:  \"${fileDirName:3}$fileBaseName\", category:  \"$fileDirName \"}, >> ./script/crumSeed.js
done
echo "] module.exports = crums" >> ./script/crumSeed.js


# import files
touch ./assets/index.js
cat /dev/null > ./assets/index.js


echo "export const background = require('./background.png')
export const defaultProfile = require('./defaultProfile.png')
export const editIcon = require('./editIcon.png')
export const deleteIcon = require('./deleteIcon.png')
export const purpleCrumIcon = require('./purpleCrumIcon.png')
export const icon = require('./icon.png')
export const splash = require('./splash.png')"  >> ./assets/index.js

echo "export const images = {" >> ./assets/index.js
for fileFullName in $(find ./assets/Crums -name "*.png")
do
   :
  fileBaseName="$(basename -- $fileFullName| cut -d. -f1)"
  fileDirName="$(basename $(dirname $fileFullName))"
  echo "processing file:" $fileBaseName
  echo $fileDirName
  echo ${fileDirName:3}$fileBaseName\: require\(\'./Crums/$fileDirName/$fileBaseName.png\'\)\, >> ./assets/index.js
done
echo "}" >> ./assets/index.js
echo "export const imageThumbnails = {" >> ./assets/index.js
for fileFullName in $(find ./assets/Crums -name "*.png")
do
   :
  fileBaseName="$(basename -- $fileFullName| cut -d. -f1)"
  fileDirName="$(basename $(dirname $fileFullName))"
  echo "processing file:" $fileBaseName
  echo $fileDirName
  echo ${fileDirName:3}$fileBaseName\: require\(\'./CrumThumbnails/$fileDirName/$fileBaseName.png\'\)\, >> ./assets/index.js
done
echo "}" >> ./assets/index.js









