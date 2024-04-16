# js-clock-widgets
An evolving collection of embeddable javascript graphical clock widgets - analog and digital

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

# Description

This repository contains an on-going and *evolving* sampling of analog and digital *graphical* clock widgets designed to be embedded in an HTML page.  

At present (16 April 2024) there are only two clock widgets and both have a fixed presentation format, although minor alterations by users/borrowers will easily changes to presentation such as size and color. 

# Technologies

Project is created with:

- Javascript
- CSS
- HTML
- SVG

## Installation

As, for now, this is a strictly front-end implementation, all that is necessary is:

- Select the green **"<span style="color:#ffffff;background-color:#008000"><> Code ▼</span>"** button on this repository's landing page [github.com/stevreut/js-clock-widgets](https://github.com/stevreut/js-clock-widgets).

- From the drop-down, select "Download ZIP".

- Save the resulting `js-clock-widgets-main.zip` file to the location of your choice (preferably into an *empty* folder/directory).

- Unpack the `js-clock-widgets-main.zip` file using the zip/unzip utility appropriate for your platform.


## Usage

*For now*, once installed as described above, simply open the included `clock.html` file with your internet browser - by double-clicking, explicitly opening the file, or whatever other action might be appropriate for your platform.

This `clock.html` file servers as a "sampler" and example of usage, and currently shows how both the analog and digital clock widgets can be included in a page.

The `clock.html` file links to a `js/script.js` which, in turn, provides examples of how to embed *both* analog and digital clock widgets.  **NOTE** that the javascript makes use of *modules* and therefore will not function in your browser via the file: protocol; it is necessary to make use of the *https:* protocol instead and this will require the use of some kind of web server, even if just a light server (such as the "live server" plug-in).

Note the linkage between the `clock.html` page `<p>` elements (specifically their `id=` attributes and the reference to those same `id=` values in the `startClock()` function in `js/script.js`).  Note that the element in question does not have to be a `<p>` element; any container type element should work (for example `<div>`).

If one prefers to make use of the scripts without using javascript modules then minor alterations should make this possible with a little tinkering - specifically:

* Refer to *all* of the scripts in the using HTML page.
* Remove the `import` and `export` statements from the various cloned scripts.
* Remove `type="module"` from the `<script>` element in `clock.html`.
* It is possible some namespace collisions might result from this, but removing duplicated declarations should work. 


# License.

https://opensource.org/license/mit/ 

(See also the [LICENSE](https://github.com/stevreut/js-clock-widgets/blob/main/LICENSE) file in this repository.)

# Author

Steve Reuterskiold: steve.reuterskiold@gmail.com
