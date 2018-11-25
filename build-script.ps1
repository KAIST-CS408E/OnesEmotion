git add .
git commit -a -m "build"
git checkout master
git pull origin master
git commit -a -m "build"
git branch -D build
git checkout -b build
expo eject
cp ..\ReactnativeExample\index.js .\
rm .\android\gradle.properties
cp ..\localOnesEmotionBuild\android\gradle.properties .\android\
cp ..\localOnesEmotionBuild\android\app\reflection.keystore .\android\app\
rm .\android\app\build.gradle
cp ..\localOnesEmotionBuild\android\app\build.gradle .\android\app\
rm .\package.json
cp ..\localOnesEmotionBuild\package.json .\
rm .\node_modules -r -Force
yarn
cd android
./gradlew assembleRelease
cd ..
start .