# js-clock-widgets
An evolving collection of embeddable javascript graphical clock widgets - analog and digital

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Design and Implementation](#design-and-implementation)
- [License](#license)

# Description

This repository contains an on-going and *evolving* sampling of analog and digital *graphical* clock widgets designed to be embedded in an HTML page.  

At present (17 April 2024) there are only two clock widgets and both have a fixed presentation format, although minor alterations by users/borrowers will easily changes to presentation such as size and color. 

# Technologies

Project is created with:

- Javascript
- CSS
- HTML
- SVG

# Installation

As, for now, this is a strictly front-end implementation, all that is necessary is:

- Select the green **"<span style="color:#ffffff;background-color:#008000"><> Code ▼</span>"** button on this repository's landing page [github.com/stevreut/js-clock-widgets](https://github.com/stevreut/js-clock-widgets).

- From the drop-down, select "Download ZIP".

- Save the resulting `js-clock-widgets-main.zip` file to the location of your choice (preferably into an *empty* folder/directory).

- Unpack the `js-clock-widgets-main.zip` file using the zip/unzip utility appropriate for your platform.


This `index.html` file servers as a "sampler" and example of usage, and currently shows how both the analog and digital clock widgets can be included in a page.

The `index.html` file links to a `js/script.js` which, in turn, provides examples of how to embed *both* analog and digital clock widgets.  **NOTE** that the javascript makes use of *modules* and therefore will not function in your browser via the file: protocol; it is necessary to make use of the *https:* protocol instead and this will require the use of some kind of web server, even if just a light server (such as the "live server" plug-in).

Note the linkage between the `index.html` page `<p>` elements (specifically their `id=` attributes and the reference to those same `id=` values in the `startClock()` function in `js/script.js`).  Note that the element in question does not have to be a `<p>` element; any container type element should work (for example `<div>`).

If one prefers to make use of the scripts without using javascript modules then minor alterations should make this possible with a little tinkering - specifically:

* Refer to *all* of the scripts in the using HTML page.
* Remove the `import` and `export` statements from the various cloned scripts.
* Remove `type="module"` from the `<script>` element in `index.html`.
* It is possible some namespace collisions might result from this, but removing duplicated declarations should work. 

# Usage

This code has been deployed to site [stevreut.github.io/js-clock-widgets/](https://stevreut.github.io/js-clock-widgets/) where it can be viewed with a browser to see the various clock widgets in operation.

# Design and Implementation

All clock widgets included to-date are based on dynamic generation of SVG (Scalable Vector Graphics) content.  In the case of these implementations, the SVG content is explicitly **not** in the form of files but, rather, consists of dynamically generated content appended to the DOM via javascript.

In both the case of the digital clock and analog clock, the javascript first 
the static SVG content to the element whose id= is specified by the calling script.  After creating the static content, setInterval is then used to periodically update those dynamic SVG elements as appropriate.

In the case of the analog clock, those dynamic elements would be the hands of the clock, which are SVG `<line/>` elements whose endpoint parameters are adjusted with each iteration of the adjustment.

In the case of the digital clock, all of the SVG elements are non-moving but
are dynamic in the sense that their colors may change with each iteration of the
function which adjusts the SVG, equivalent to the physical individual LED elements in a real digital clock, each being either on or off at a given moment.  As of this moment (17 April 2024, 4:00 p.m. EDT), these LED elements are in the form of SVG `<rect/>` (rectangle) elements which are all re-rendered with each iterated update; however, in revisions expected in the next few days, these `<rect/>`
elements will be created only once and only their colors will be altered during the iterated processing driven by calls to setInterval().

# License.

https://opensource.org/license/mit/ 

(See also the [LICENSE](https://github.com/stevreut/js-clock-widgets/blob/main/LICENSE) file in this repository.)

# Author

Steve Reuterskiold: steve.reuterskiold@gmail.com
