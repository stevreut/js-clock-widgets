import { makeSvgElem, setAtts } from "./svgutils.js";

class DigitalClock {
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
        // this.testLed = [];
        // for (let i=0;i<8;i++) {
        //     this.testLed.push(new LedElem(makeSvgElem(this.rootSvgElem, "circle", {
        //         cx: 62*i+30,
        //         cy: 50,
        //         r: 25
        //     }),
        //     this.onColor,
        //     this.offColor,
        //     true));
        // }
        this.digits = [];
            for (let i=0;i<8;i++) {
                this.digits.push(new Digit(this.rootSvgElem, 20+i*60, 25, this.onColor, this.offColor, this.timeValue.charAt(i), {
                wid: 5,
                len: 35
            }));
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
                        // this.testLed[i].flipState();
                        this.digits[i].updateValue(thisDigitValue);
                    }
                    // this.digits[i].updateValue(thisDigitValue);
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
    constructor(rootSvg, baseXOffset, baseYOffset, vLevel, hLevel, isHorizontal, onColor, offColor, isOn, attribs) {
        this.rootSvg = rootSvg;
        this.baseXOffset = baseXOffset,
        this.baseYOffset = baseYOffset;
        this.vLevel = vLevel;  // 0, 1, or 2 (top, middle, bottom)
        this.hLevel = hLevel;  // 0, 1 (left, right)
        this.isHorizontal = isHorizontal;  // else vertical
        const len = (attribs.len?attribs.len:40);  // TODO
        const wid = (attribs.wid?attribs.wid:10);  // TODO
        let svgElem = makeSvgElem(this.rootSvg, "ellipse" /*TODO*/, {
            cx: (this.isHorizontal?this.baseXOffset+len/2:this.baseXOffset+this.hLevel*len),
            cy: (this.isHorizontal?this.baseYOffset+len*this.vLevel:this.baseYOffset+(0.5+this.vLevel)*len),
            rx: (this.isHorizontal?len/2*0.8:wid),
            ry: (this.isHorizontal?wid:len/2*0.8)
        });
        this.ledSvg = new LedElem(svgElem,onColor,offColor,isOn);
        // TODO - what to do with attribs
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
    constructor(rootSvg, baseXOffset, baseYOffset, onColor, offColor, value, attribs) {
        this.rootSvg = rootSvg;
        this.baseXOffset = baseXOffset;
        this.baseYOffset = baseYOffset;
        this.onColor = onColor;
        this.offColor = offColor;
        this.value = value;
        this.attribs = attribs;  // TODO ?
        this.ledSeg = [];
        let str = "00V10V00H10H20H01V11V";
        for (let i=0;i<21;i+=3) {
            let vLevel = parseInt(str.charAt(i));
            let hLevel = parseInt(str.charAt(i+1));
            let isHz = (str.charAt(i+2) == 'H');
            this.ledSeg.push(new DigitLedSegment(rootSvg, baseXOffset, baseYOffset,
                vLevel, hLevel, isHz, onColor, offColor, false, attribs));
        }
        this.updateValue(this.value);
    }
    updateValue(value) {
        // if (value == this.value) {
        //     return;
        // }
        if (value !== ' ' && (value < '0' && value > '9')) {
            console.log('not valid value "' + value + '"');
        }
        // console.log('updating digit with "' + value + '"');
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
    setInterval(showTimeOnClock, 10);  // TODO - probably should be reduced to about 20 after implementation is close to final
}

export { showDigitalClock2 };