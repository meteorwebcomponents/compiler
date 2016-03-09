<!--
  Title: Meteor Webcomponents Compiler for Meteor Polymer integration
  Description: Compiler for polymer/webcomponents in meteor.
  -->
# Compiler

## What is mwc (meteor-webcomponents) compiler ?


Automates Polymer vulcanizing in Meteor


## Why ?


Actually its difficult to code Polymer with Meteor, Meteor not support extra `<template>` tag, You can solve it by 2 ways


* Keep all `bower_components`, `custom polymer elements`, etc in public folder, Manually vulcanize, Delete `bower_components` after vulcanizing (bower_compuments increases app size)
* Keep html inside javascript (like .jsx in react)


mwc:compiler automatically watch Polymer project folder anywhere in local file system & added to meteor after vulcanizing


## How to use it ?


Install `mwc:compiler` package to your Meteor App 


```sh
    $ meteor add mwc:compiler
```

Keep the `compiler.mwc.json` named configuration file with the following properties under `/client` folder of your Meteor App.


* `root`[String] : Root directory from which `html`,`js`,`css`,etc files to be compiled and vulcanized. Root directory should be a .(dot) folder to avoid meteor watching the files. Compiler has a dedicated watcher to do that. eg .polymer. 
* `append` [Array] : Files specified here will be appended to `web.bowser`, `web.cordova` builds after vulcanizing.
* `import` [Array] : Files to be vulcanised to `public/mwc_compiler.html` & imported to `<head>`.


Here is a sample `compiler.mwc.json`:

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
    ], 
    "extensions": {
        "mwc:ecmascript@1.0.8": {
            "compileFunction": "MWCEcmascript"
        }
    }
}

```
Refer https://github.com/meteorwebcomponents/extensions for more details on extensions.

Keep all `bower_components`, `custom polymer elements`, etc in the `root` (here it will be `.polymer`) vulcanizer root directory.

##Related Projects

[MWC Mixin](https://github.com/meteorwebcomponents/mixin) - Mixin for polymer/webcomponents in meteor.

[MWC Router](https://github.com/meteorwebcomponents/router) - Reactive routing for polymer/webcomponents in meteor.

[MWC Layout](https://github.com/meteorwebcomponents/layout) - polymer layout renderer


## Demo

* Basic Example with flowrouter - [mwc-flowrouter](https://github.com/meteorwebcomponents/demo-flowrouter)
* Apps Using `mwc:compiler` - [Free Ebooks](https://github.com/sujith3g/ebook), [TorrentAlert](https://github.com/HedCET/TorrentAlert)

<img width="1280" alt="screen shot 2016-02-12 at 2 16 47 pm" src="https://cloud.githubusercontent.com/assets/1298779/13002443/8ec7255a-d194-11e5-8297-096ff642e00d.png">

<p align="center">
<img width="363" alt="screen shot 2016-02-12 at 2 22 25 pm" src="https://cloud.githubusercontent.com/assets/1298779/13002446/94f7701a-d194-11e5-9864-42100dd614d7.png">
</p>
