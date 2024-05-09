import { makeSvgElem, setAtts } from "./svgutils.js";

class DigitalClock {
    constructor (id, width, height, attribs) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.backgroundColor = (attribs.backgroundColor?attribs.backgroundColor:"#000000");
        this.idAnchorElem = document.getElementById(id);
        this.timeValue = DigitalClock.initialTime();
        console.log('this.timeValue = "' + this.timeValue + '"');
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
        let testCirclAttribs = {  // TODO - TEST!!
            cx : 50,
            cy : 50,
            r : 30
        }
        this.testLed = new LedElem(makeSvgElem(this.rootSvgElem, "circle", testCirclAttribs), "red", "#0000a0", true);
        // TODO
        this.idAnchorElem.append(this.rootSvgElem);
    }
    static initialTime() {
        console.log('initialTime invoked');
        return 4;  // TODO - obviously
    }
}

class LedElem {
    constructor(svgElem, onColor, offColor, isOn) {
        this.svgElem = svgElem;
        this.onColor = onColor;
        this.offColor = offColor;
        this.isOn = isOn;
        this.color = (this.isOn?this.onColor:this.offColor);
        setAtts(this.svgElem, { fill: this.color });
    }
    turnOn() {
        if (!this.isOn) {
            this.isOn = true;
            this.color = this.onColor;
            setAtts(this.svgElem, { fill: this.color });
        }
    }
    turnOff() {
        if (this.isOn) {
            this.isOn = false;
            this.color = this.offColor;
            setAtts(this.svgElem, { fill: this.color });
        }
    }
    flipState() {
        if (this.isOn) {
            this.turnOff();
        } else {
            this.turnOn();
        }
    }
}

let theClock = null;  // TODO

function setUpClock(clockId, width, height, attributes) {
    console.log('d2 setUpClock not yet implemented');  // TODO
    theClock = new DigitalClock(clockId, width, height, attributes);  // TODO
}

function showTimeOnClock() {
    console.log('d2 showTimeOnClock not yet implemented');  // TODO
    theClock.testLed.flipState();
    console.log('led state flipped at ' + (new Date()));
}

function showDigitalClock2(clockId, wid, hgt, attribs) {
    console.log('showDigitalClock2 not yet fully implemented');  // TODO
    setUpClock(clockId, wid, hgt, attribs);
    setInterval(showTimeOnClock, 3300);  // TODO - probably should be reduced to about 20 after implementation is close to final
}

export { showDigitalClock2 };