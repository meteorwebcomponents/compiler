# Compiler

## What is mwc(meteor-webcomponents) compiler ?

Meteor polymer compiler.

## How to use it ?

Keep the `mwc.compiler.json` configuration file with the following properties under client folder of your Meteor App.

* `root` : Root directory from which `html`,`js`,`css` files are compiled and vulcanised to the `index.html`.
* `append` : Files specified here will be vulcanised and appended to `index.html`.
* `import` : Array of files to be imported and vulcanised to `public/mwc_compiler.html`.


Here is a sample `mwc.compiler.json`:

```json
{
    "root" : ".polymer",
    "append": [
        "index.html",
        "polymer_color.html"
    ],
    "import": [
        "bower_components/font-roboto/roboto.html",

        "bower_components/gold-email-input/gold-email-input.html",

        "bower_components/iron-flex-layout/classes/iron-flex-layout.html",
        "bower_components/iron-icons/iron-icons.html",
        "bower_components/iron-icons/social-icons.html",
        "bower_components/iron-localstorage/iron-localstorage.html",
        "custom_elements/my-element.html"
    ]
     
}

```

## Demo

Advanced Example - https://github.com/HedCET/TorrentAlert
