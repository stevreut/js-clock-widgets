import { makeSvgElem, setAtts } from "./svgutils.js";

class DigitalClock {

    // Note:  All of the following named attributes of the "attribs" parameter are 
    // optional and, in all cases, suitable defaults will be calculated for any attribute
    // that is not provided.  The list below provides both the attribute names and the
    // default values inferred in the specific case that ALL attributes are omitted; otherwise,
    // the calculate of inferred attribute values can be more complex when other values are
    // explicitly provided:
    //
    //    backgroundColor: "#100040",
    //    onColor: "#1880ff",
    //    offColor: "#180860",
    //    digitWidth: 60,
    //    ledLength: 35,
    //    ledWidth: 5,
    //    digitElemFullLength: 40
    //    skewDegrees: 0   // NOT YET IMPLEMENTED!!

    constructor (id, width, height, attribs) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.backgroundColor = (attribs.backgroundColor?attribs.backgroundColor:"#000000");
        this.onColor = (attribs.onColor?attribs.onColor:"#ff0000");
        this.offColor = (attribs.offColor?attribs.offColor:this.backgroundColor);
        this.idAnchorElem = document.getElementById(id);
        this.timeValue = this.nowTimeString();
        if (!id) {
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
        let innerWidth = (attribs.ledWidth?attribs.ledWidth:5);
        let innerLen = (attribs.ledLength?attribs.ledLength:35);
        let outerLen = (attribs.digitElemFullLength?attribs.digitElemFullLength:innerLen*8/7);
        let digitWidth = (attribs.digitWidth?attribs.digitWidth:outerLen*1.5);
        let initXOffset = (this.width+outerLen/2-digitWidth*8)/2;
        let initYOffset = (this.height-2*outerLen)/2;
        this.digits = [];
        for (let i=0;i<8;i++) {
            this.digits.push(new Digit(this.rootSvgElem, initXOffset+i*digitWidth, initYOffset, 
                    this.onColor, this.offColor, this.timeValue.charAt(i),
                    outerLen, innerLen, innerWidth
                )
            );
        }   
        this.idAnchorElem.append(this.rootSvgElem);
    }
    asTwo(n, doPad) {
        let str = Math.floor(n).toString();
        if (str.length > 3) {
            str = str.substring(str.length-2);
            if (!doPad && str.charAt[0] === '0') {
                str = ' ' + str.substring(1);
            }
        } else {
            while (str.length < 2) {
                str = (doPad?'0':' ') + str;
            }
        }
        return str;
    }
    nowTimeString() {
        const now = new Date();
        let hr = now.getHours();
        while (hr < 1) {
            hr += 12;
        }
        while (hr > 12) {
            hr -= 12;
        }
        const hh = this.asTwo(hr, false);
        const mm = this.asTwo(now.getMinutes(), true);
        const ss = this.asTwo(now.getSeconds(), true);
        const cs = this.asTwo(Math.floor(now.getMilliseconds()/10), true);
        const timeStr = hh + mm + ss + cs;
        return timeStr;

    }
    updateTimeDisplay() {
        const newTime = this.nowTimeString();
        if (newTime !== this.timeValue) {
            const oldTime = this.timeValue;
            this.timeValue = newTime;
            const digCount = this.timeValue.length;
            if (digCount != 8) {
                console.log('unexpected time stamp len in "' + this.timeValue + '"')
            } else {
                for (let i=0;i<digCount;i++) {
                    let thisDigitValue = this.timeValue.charAt(i);
                    if (thisDigitValue !== oldTime.charAt(i)) {
                        this.digits[i].updateValue(thisDigitValue);
                    }
                }
            }
        }
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

class DigitLedSegment {
    constructor(rootSvg, baseXOffset, baseYOffset, vLevel, hLevel, isHorizontal, onColor, offColor, isOn, outerLen, innerLen, innerWidth) {
        this.rootSvg = rootSvg;
        this.baseXOffset = baseXOffset,
        this.baseYOffset = baseYOffset;
        this.vLevel = vLevel;  // 0, 1, or 2 (top, middle, bottom)
        this.hLevel = hLevel;  // 0, 1 (left, right)
        this.isHorizontal = isHorizontal;  // else vertical
        let svgElem = makeSvgElem(this.rootSvg, "ellipse" /*TODO*/, {
            cx: (this.isHorizontal?this.baseXOffset+outerLen/2:this.baseXOffset+this.hLevel*outerLen),
            cy: (this.isHorizontal?this.baseYOffset+outerLen*this.vLevel:this.baseYOffset+(0.5+this.vLevel)*outerLen),
            rx: (this.isHorizontal?innerLen/2:innerWidth),
            ry: (this.isHorizontal?innerWidth:innerLen/2)
        });
        this.ledSvg = new LedElem(svgElem,onColor,offColor,isOn);
        // TODO - should this class *extend* the LedElem class?
    }
    turnOn() {
        this.ledSvg.turnOn();
    }
    turnOff() {
        this.ledSvg.turnOff();
    }
}

class Digit {
    constructor(rootSvg, baseXOffset, baseYOffset, onColor, offColor, value, outerLen, innerLen, innerWidth) {
        this.rootSvg = rootSvg;
        this.baseXOffset = baseXOffset;
        this.baseYOffset = baseYOffset;
        this.onColor = onColor;
        this.offColor = offColor;
        this.value = value;
        this.ledSeg = [];
        let str = "00V10V00H10H20H01V11V";
        for (let i=0;i<21;i+=3) {
            let vLevel = parseInt(str.charAt(i));
            let hLevel = parseInt(str.charAt(i+1));
            let isHz = (str.charAt(i+2) == 'H');
            this.ledSeg.push(new DigitLedSegment(rootSvg, baseXOffset, baseYOffset,
                vLevel, hLevel, isHz, onColor, offColor, false, outerLen, innerLen, innerWidth));
        }
        this.updateValue(this.value);
    }
    updateValue(value) {
        if (value !== ' ' && (value < '0' && value > '9')) {
            console.log('not valid value "' + value + '"');
        }
        // TODO - make template static?
        const template = ("0000000;1110111;0000011;0111110;0011111;" +
            "1001011;1011101;1111101;0010011;" +
            "1111111;1011111").split(";");
        let subTemplate = '';
        if (value === ' ') {
            subTemplate = template[0];
        } else {
            subTemplate = template[parseInt(value)+1];
        }
        for (let i=0;i<7;i++) {
            if (subTemplate.charAt(i) === '1') {
                this.ledSeg[i].turnOn();
            } else {
                this.ledSeg[i].turnOff();
            }
        }
    }
}

let theClock = null;  // TODO

function setUpClock(clockId, width, height, attributes) {
    theClock = new DigitalClock(clockId, width, height, attributes);  // TODO
}

function showTimeOnClock() {
    theClock.updateTimeDisplay();
}

function showDigitalClock2(clockId, wid, hgt, attribs) {
    console.log('showDigitalClock2 not yet fully implemented');  // TODO
    setUpClock(clockId, wid, hgt, attribs);
    setInterval(showTimeOnClock, 20);  // TODO - probably should be reduced to about 20 after implementation is close to final
}

export { showDigitalClock2 };