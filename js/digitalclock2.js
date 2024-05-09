import { makeSvgElem } from "./svgutils.js";

class DigitalClock {
    constructor (id, width, height, attribs) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.backgroundColor = attribs.backgroundColor;
        this.idAnchorElem = document.getElementById(id);
        if (id) {
            console.log('anchor element found')
        } else {
            console.log('no anchor element found, quitting');
            return;  // TODO - consider throw error?
        }
        this.rootSvgElem = makeSvgElem(null, "svg", {
            viewBox: "0 0 " + this.width + " " + this.height,
            width: "100%",
            height: "100%"
        });
        this.rootRectSvg = makeSvgElem(this.rootSvgElem, "rect", {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            fill: this.backgroundColor
        });
        // TODO
        this.idAnchorElem.append(this.rootSvgElem);
    }
}

let theClock = null;  // TODO

function setUpClock(clockId, width, height, attributes) {
    console.log('d2 setUpClock not yet implemented');  // TODO
    theClock = new DigitalClock(clockId, width, height, attributes);  // TODO
}

function showTimeOnClock() {
    console.log('d2 showTimeOnClock not yet implemented');  // TODO
}

function showDigitalClock2(clockId, wid, hgt, attribs) {
    console.log('showDigitalClock2 not yet fully implemented');  // TODO
    setUpClock(clockId, wid, hgt, attribs);
    setInterval(showTimeOnClock, 3300);  // TODO - probably should be reduced to about 20 after implementation is close to final
}

export { showDigitalClock2 };