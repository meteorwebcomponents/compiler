# Compiler

## What is mwc (meteor-webcomponents) compiler ?


Automates Polymer vulcanizing in Meteor


## Why ?


Actually its difficult to code Polymer with Meteor, Meteor not support extra `<template>` tag, You can solve it by 2 ways


* Keep all `bower_components`, `custom polymer elements`, etc in public folder & manually vulcanize, delete `bower_components` after vulcanizing
* Keep html inside javascript (like .jsx in react)


mwc:compiler will automatically watch Polymer project folder anywhere in local file system & added to meteor after vulcanizing


## How to use it ?


Install `mwc:compiler` package to your Meteor App 


```sh
    $ meteor add mwc:compiler
```

Keep the `mwc.compiler.json` named configuration file with the following properties under `/client` folder of your Meteor App.


* `root`[String] : Root directory from which `html`,`js`,`css`,etc files to be compiled and vulcanised.
* `append` [Array] : Files specified here will be appended to `web.bowser`, 'web.cordova' builds after vulcanizing.
* `import` [Array] : Files to be vulcanised to `public/mwc_compiler.html` & imported to `<head>`.


Here is a sample `mwc.compiler.json`:

```json
{
    "root" : ".polymer",

    "append": [
        "index.html",
        "my_class.html"
    ],

    "import": [
        "bower_components/font-roboto/roboto.html",

        "bower_components/paper-header-panel/paper-header-panel.html",
        "bower_components/paper-scroll-header-panel/paper-scroll-header-panel.html",

        "bower_components/polymer/polymer.html",

        "linto/card-route.html"
    ]     
}

```


Keep all `bower_components`, `custom polymer elements`, etc in the `root` (here it will be `.polymer`) vulcanizer root directory.


## Demo

* Ebooks [link](https://github.com/sujith3g/ebook)
* Advanced Example - [TorrentAlert](https://github.com/HedCET/TorrentAlert)

