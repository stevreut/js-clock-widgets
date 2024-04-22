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

At present (22 April 2024) there are only two clock widgets and both have a fixed presentation format, although minor alterations by users/borrowers will easily enable changes to presentation such as size and color. 

# Technologies

This project, thus far, is created with:

- Javascript
- CSS
- HTML
- SVG

(Incorporation of other technologies in future revisions is likely.)

# Installation

As, for now, this is a strictly front-end implementation, all that is necessary is:

- Select the green **"<span style="color:#ffffff;background-color:#008000"><> Code ▼</span>"** button on this repository's landing page [github.com/stevreut/js-clock-widgets](https://github.com/stevreut/js-clock-widgets).

- From the drop-down, select "Download ZIP".

- Save the resulting `js-clock-widgets-main.zip` file to the location of your choice (preferably into an *empty* folder/directory).

- Unpack the `js-clock-widgets-main.zip` file using the zip/unzip utility appropriate for your platform.

- Delete the `dev-utils/` folder from the resulting expanding content, as it serves no purpose (though keeping it will also cause no harm).

The `index.html` file servers as a "sampler" and example of usage, and currently shows how both the analog and digital clock widgets can be included in a page.

The `index.html` file links to a `js/script.js` which, in turn, provides examples of how to embed *both* analog and digital clock widgets.  **NOTE** that the javascript makes use of *modules* and therefore will not function in your browser via the file: protocol; it is necessary to make use of the *https:* protocol instead and this will require the use of some kind of web server, even if just a light server (such as the "live server" plug-in).

Note the linkage between the `index.html` page `<div>` elements (specifically their `id=` attributes and the reference to those same `id=` values in the `startClock()` function in `js/script.js`).

If one prefers to make use of the scripts without using javascript modules then minor alterations to HTML and scripts locally should make this possible with a little tinkering - specifically:

* `<link>` to *all* of the scripts in the using HTML page.
* Remove the `import` and `export` statements from the various cloned scripts.
* Remove `type="module"` from the `<script>` element in `index.html`.
* It is possible some namespace collisions might result from the above suggested steps, but removing duplicated declarations should be sufficient to restore correct functioning.

# Usage

This code has been deployed to site [stevreut.github.io/js-clock-widgets/](https://stevreut.github.io/js-clock-widgets/) where it can be viewed with a browser to see the various clock widgets in operation.

# Design and Implementation

All clock widgets included to-date are based on dynamic generation of SVG (Scalable Vector Graphics) content.  In the case of these implementations, the SVG content is explicitly **not** in the form of files but, rather, consists of dynamically generated content appended to the DOM via javascript.  (See various calls to `document.createElementNS()` - especially in the `svgutils.js` module.)

In both the case of the digital clock and analog clock, the javascript first generates
the static SVG content to the element whose id= is specified by the calling script.  After creating the static content, `setInterval()` is then used to periodically update only the SVG elements that are dynamic.

In the case of the analog clock, those dynamic elements would be the hands of the clock, which are SVG `<line/>` elements whose endpoint parameters are adjusted with each iteration of the adjustment.

In the case of the digital clock, all of the SVG elements are non-moving but
are dynamic in the sense that their colors may change with each iteration of the
function which adjusts the SVG, equivalent to the physical individual LED elements in a real digital clock, each being either on or off at a given moment.  As of this moment (22 April 2024, 7:45 p.m. EDT), these LED elements are in the form of SVG `<rect/>` (rectangle) elements which are all re-rendered with each iterated update; however, in revisions expected in the next few days, these `<rect/>`
elements will be created only once and only their colors will be altered during the iterated processing driven by calls to setInterval().

## dev-utils/

Note that the `dev-utils/` folder is *not* intended to be a component of the deployed site and is not strictly needed.  However, this `dev-utils/` folder contains both tools used to develop and/or generate working components of this software as well as serve as a "sandbox" environment wherein some software elements were incrementally developed and experimented with before some were then considered sufficiently mature to be migrated to the working web site.  Although it would do no harm, the `dev-utils/` should be excluded entirely from any public deployment of these components; it is left in this repository only because, given the expository nature of this evolving repository, it was felt that the code might be of interest to some.

# License.

https://opensource.org/license/mit/ 

(See also the [LICENSE](https://github.com/stevreut/js-clock-widgets/blob/main/LICENSE) file in this repository.)

# Author

Steve Reuterskiold: steve.reuterskiold@gmail.com
