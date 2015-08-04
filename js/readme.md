## /js/ Custom Javascript folder

Custom (not standard library) javascript files that make up the business logic of the visualization.

* ```viz.js``` is the main file for the visualization that includes all dependencies within the ```helpers``` folder.
* ```modernizr.custom.js``` is a custom install of the [Modernizr](http://modernizr.com/) library. This can be customized [here](http://modernizr.com/download/#-borderradius-history-svg-shiv-mq-cssclasses-teststyles-testprop-testallprops-domprefixes-blob_constructor-cors-load) adding or removing detected features.
* ```IE folder``` contains some libraries that are only included on older Internet Explorer version to make the browser more compliant with modern web technology.
* ```helpers``` folder contains dependencies for the main viz.js file.