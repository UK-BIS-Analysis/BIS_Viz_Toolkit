# BIS Analysis Data Visualization Template

This is actively under construction and by no means ready for use!

## Intro

* **Public git repository**: [https://github.com/UK-BIS-Analysis/BIS_Viz_Toolkit](https://github.com/UK-BIS-Analysis/BIS_Viz_Toolkit)
* **Private git repository**: [https://bitbucket.org/fmerletti/dbis_bis_viz_toolkit](https://bitbucket.org/fmerletti/dbis_bis_viz_toolkit)
* **Licence**: [MIT](http://opensource.org/licenses/MIT)

## Features

* Plain D3 charts (examples that you can copy, paste and modify)
* Data stored in Crossfilter
* Exposing filters to users
* Tables with jQuery Datatables
* SVG, PNG and CSV downloads
* Bootstrap modals with external files
* Feature detection with Modernizr
* Building responsive layouts with bootstrap
* App packaging with Grunt

### Libraries, frameworks and tools used:

Frontend:

* [Bootstrap](http://getbootstrap.com/): General look, UI, responsiveness
* [jQuery](https://jquery.com/): UI management
* [RequireJS](http://requirejs.org/): Packaging and modularization of the app
* [D3](http://d3js.org/): Graphing and map
* [Crossfilter](https://github.com/square/crossfilter): Used as an in-browser database
* [Modernizr](http://modernizr.com/): For checking feature support in browsers

Development tools:

* [Bower.io](http://bower.io/): To manage library dependencies
* [Grunt](http://gruntjs.com/): To package and minify the application

Both are command line tools and depend on NodeJS and NPM being installed on a system. See [nodejs.org](https://nodejs.org/) for installation instructions.

You can use a [portable Windows Node development environment](https://github.com/mjs2020/PortableNodeDevEnv) to use these tools without admin rights.

## Technical overview


### Build process: packaging and optimization

The source code of the application is optimized and minified for production use unsing [Grunt](http://gruntjs.com/) based on the ```Gruntfile.js```
script. You can then generate production code simply by running:

    grunt

The distributable build is generated in the ```build``` directory.

### Code style, notes & other practices

* Normally external libraries would be excluded from the repository and be retrieved upon install using bower. However to make the 
  visualization more portable, even on systems that do not have npm and bower installed they are included in this git repo.
* Remember to modify the index.dev.html file instead of the index.html file in development.
* Variables are preferably named using camelCase
* Indenting is 2 spaces (no tabs)

### Inspirational reading

The toolkit was made possible by reading a large number of books, articles, Github issues and StackOverflow questions and answers. Here are some.

* Viau, C., Thornton, A., Hobbelt, G., Dunn, R. (2014). [Developing a D3.js Edge](http://bleedingedgepress.com/our-books/developing-a-d3-js-edge/). Bleeding Edge Press.
* Le Bek, P. (2014). Building Responsive Visualizations with D3.js. Available: https://www.safaribooksonline.com/blog/2014/02/17/building-responsible-visualizations-d3-js/. Last accessed 8th Aug 2015.
* Shull, E. (2014). Saving Browser-based SVGs as Images. Available: http://spin.atomicobject.com/2014/01/21/convert-svg-to-png/. Last accessed 8th Aug 2015.

### Credits

Coding by [Francesco Merletti](http://fm.to.it) (Twitter: [@mjs2020](http://fm.to.it/tw),  Github: [@mjs2020](http://fm.to.it/gh))