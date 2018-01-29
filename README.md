# mixrc
> [Laravel mix](https://github.com/JeffreyWay/laravel-mix) configuration made easy.

## What is it?
**mixrc** parses a configuration file (usually **.mixrc**) from your project root directory and automates the process of compiling assets by instructing **laravel-mix** the tasks you want to perform.

## What is *laravel-mix*?
**laravel-mix** is a wrapper around webpack that makes compiling assets a breeze. It comes bundled with [Laravel](https://laravel.com/), the popular php framework.

**Can i use this outside Laravel?**
Yes, you can.

**Do I have to install plugins to make it work for my project?**
Most of the cases **no**. Mix automatically installs plugins based on your configuration and it has support for most of the  web used languages out there.

## Installation
```shell
npm install --save-dev mixrc
```
## How to use outside Laravel
Add these lines to your **package.json** under section **scripts**:
```json
...
"dev": "npm run development",
"development": "cross-env NODE_ENV=development node_modules/webpack/bin/webpack.js --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js",
"watch": "cross-env NODE_ENV=development node_modules/webpack/bin/webpack.js --watch --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js",
"watch-poll": "npm run watch -- --watch-poll",
"hot": "cross-env NODE_ENV=development node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --hot --config=node_modules/laravel-mix/setup/webpack.config.js",
"prod": "npm run production",
"production": "cross-env NODE_ENV=production node_modules/webpack/bin/webpack.js --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js"
...
```

Create a **webpack.mix.js** file in your project root and add the following line:
```js
require('mixrc')();
```
Create a **.mixrc** file in your project root and add the following lines:
```json
{
  "entries": {
    "sass": [
      "src/sass/app.scss"
    ],
    "js": [
      "src/js/app.js"
    ]
  },
  "output": {
    "sass": "assets/css",
    "react": "assets/js",
  }
}
```
Add the assets to your **html**:
```html
<link href="/assets/css/app.css" />
<script src="/assets/js/app.js"></script>
```
Build:
```shell
npm run dev
```
Congrats, you good.

## How to use with Laravel
In your **webpack.mix.js** file remove everything and add this line:
```js
require('mixrc')();
```
Create a **.mixrc** file in your project root and add the following lines:
```json
{
  "entries": {
    "sass": [
      "resources/assets/sass/app.scss"
    ],
    "js": [
      "resources/assets/js/app.js"
    ]
  },
  "output": {
    "sass": "public/css",
    "react": "public/js",
  }
}
```
Add these lines to your **blade**:
```html
<link href="{{ mix('css/app.css') }}" />
<script src="{{ mix('js/app.js') }"></script>
```
Congrats, you good.

## Advanced usage

> The **.mixrc** supports other advanced configuration besides compiling. For a full feature example check the [.mixrc.example](.mixrc.example) file.

### ES6 and React
Configure **.mixrc** to compile javascript with **react** support.
```json
{
  "entries": {
    ...
    "react": [
      "resources/assets/js/app.js"
    ]
  },
  "output": {
	...
    "react": "public/js",
  }
}
```
> Advanced **babel configuration** can be done via **.babelrc**

### Working with stylesheets
**Laravel mix** supports compiling from a large set of stylesheet languages. You can find more about it [here](https://laravel.com/docs/5.5/mix#working-with-stylesheets).

Here is an example on how you can achieve this with **.mixrc** configuration file:
```json
{
  "entries": {
    ...
    "sass": [
		"resources/assets/sass/app.scss"
    ],
    "less": [
		"resources/assets/sass/app.less"	
    ]
  },
  "output": {
	...
    "sass": "public/css/sass",
    "less": "public/css/less"
  }
}
```
### Vendor modules
You can compile your vendor modules in a separate **vendor.js** file by adding the following section to your **.mixrc** configuration file:
```json
"extract": {
    "path": "public/js/vendor.js",
    "modules": [
      "react",
      "react-dom",
      "axios"
    ]
  }
```
This is very efficient in development as the vendor won't be compiled every time the source changes.
> Using the **extract** option will generate additional two files: **manifest.js** and **vendor.js**. Make sure you include them in your **html**.
```html
<!-- Vendor scripts -->
<script src="/assets/js/manifest.js"></script>
<script src="/assets/js/vendor.js"></script>

<!-- App script -->
<script src="/assets/js/app.js"></script>
```
### Autoload modules
You can autoload modules that will be globally available within your code by adding the following section to your **.mixrc** configuration file:
```json
"autoload": {
    "moduleName": [
	    "globalVariable1",
	    "globalVariable2"
    ]
}
```
For example this code will make **jquery** globally available within your bundle as **jQuery** and **$**:
```json
"autoload": {
    "jquery": [
	    "jQuery",
	    "$"
    ]
}
```
### Aliases
Aliases are one of the best solutions available when having to deal with large directory structures and inevitably with the **require('../../../myModule')**. You can mark any of your project folders as "modules" as in the following example:
```json
"aliases": {
	"components": "src/js/components"
}
```
Then, in your script you can load files under that folder by requiring it directly:
```js
// CommonJS
const MyComponent = require("components/MyComponent");
// ES6
import MyComponent from "components/MyComponent";
```