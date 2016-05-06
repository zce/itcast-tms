# CHANGELOG

## v4.0.0-alpha1

```json
{
	"prebuild": "echo '「build script」has been deprecated. Please use 「package script」 instead.' && gulp",
  "build": "npm run build:osx && npm run build:linux && npm run build:windows",
  "build:osx": "electron-packager . $npm_package_productName --overwrite --out=release --ignore='^/(node_modules|src|test)$' --prune --platform=darwin --arch=x64 --icon=src/app.icns --app-bundle-id=net.wedn.tms --app-version=$npm_package_version --version=$npm_package_electronVersion --overwrite",
  "build:mas": "electron-packager . $npm_package_productName --overwrite --out=release --ignore='^/(node_modules|src|test)$' --prune --platform=mas --arch=x64 --icon=src/app.icns --app-bundle-id=net.wedn.tms --app-version=$npm_package_version --version=$npm_package_electronVersion --overwrite",
  "build:linux": "electron-packager . $npm_package_productName --overwrite --out=release --ignore='^/(node_modules|src|test)$' --prune --platform=linux --arch=x64 --app-bundle-id=net.wedn.tms --app-version=$npm_package_version --version=$npm_package_electronVersion --overwrite",
  "build:windows": "electron-packager . $npm_package_productName --overwrite --out=release --ignore='^/(node_modules|src|test)$' --prune --platform=win32 --arch=ia32 --icon=src/app.ico --version=$npm_package_electronVersion --version-string.ProductName=$npm_package_productName --version-string.ProductVersion=$npm_package_electronVersion --overwrite"
}
```
