import { makeSvgCenteredCircle, makeSvgElem, makeSvgLine, setAtts, setDims } from "./svgutils.js";

const THEME_COLOR_1 = "#ffbdc3";
const THEME_COLOR_2 = "#000000";

const CLOCK_DIMS = {
    radius: 220,
    size: 500,
    ctr: 250,
    border: 2,
    knobRadius: 0.025,
    borderColor: THEME_COLOR_1,
    faceColor: "#a3bdc3",
    knobColor: THEME_COLOR_1,
    backgroundColor: "#1e2334",
    hatchingRadius: 0.96,
    hourHand: {
        len: 0.5,
        wid: 0.04,
        colr: THEME_COLOR_2
    },
    minuteHand: {
        len: 0.85,
        wid: 0.03,
        colr: THEME_COLOR_2
    },
    secondHand: {
        len: 0.93,
        wid: 0.01,
        colr: THEME_COLOR_1
    },
    hourHatching: {
        count: 12,
        len: 0.065,
        wid: 0.03,
        colr: THEME_COLOR_2
    },
    minuteHatching: {
        count: 60,
        len: 0.015,
        wid: 0.015,
        colr: THEME_COLOR_1
    }
}

let clockAnchorToElem = null;   

let clockSvgElem = null;

function rnd2(x) {
    return Math.round(x*100)/100;
}
function drawClockHand (elemId, angle, len, wid, colr) {
    let elem = document.getElementById(elemId);
    if (!elem) {
        console.log('no element found for ', elemId);
        return;
    }
    const SLEN = 10;
    let sa = Math.sin(angle);
    let ca = Math.cos(angle);
    setAtts(elem, {
        x1: rnd2(sa*SLEN+CLOCK_DIMS.ctr),
        y1: rnd2(CLOCK_DIMS.ctr-ca*SLEN),
        x2: rnd2(sa*len+CLOCK_DIMS.ctr),
        y2: rnd2(CLOCK_DIMS.ctr-ca*len),
        stroke: colr,
        stroke$width: wid
    })
}
function setUpClock(clockId) {
    if (!clockAnchorToElem) {
        clockAnchorToElem = document.getElementById(clockId);
    }
    setDims(CLOCK_DIMS);
    clockSvgElem = makeSvgElem(null, "svg", {
        viewBox: "0 0 " + CLOCK_DIMS.size + " " + CLOCK_DIMS.size,
        width: "100%", height: "100%"
    });
    makeSvgElem(clockSvgElem, "rect", {
        x: 0, y: 0, width: CLOCK_DIMS.size, height: CLOCK_DIMS.size,
        fill: CLOCK_DIMS.backgroundColor
    });
    makeSvgCenteredCircle(clockSvgElem, null, CLOCK_DIMS.radius+CLOCK_DIMS.border,
        CLOCK_DIMS.borderColor);
    makeSvgCenteredCircle(clockSvgElem, null, CLOCK_DIMS.radius, CLOCK_DIMS.faceColor);
    makeSvgCenteredCircle(clockSvgElem, null, CLOCK_DIMS.radius*CLOCK_DIMS.knobRadius, CLOCK_DIMS.knobColor);
    makeHatching(clockSvgElem,CLOCK_DIMS.minuteHatching);
    makeHatching(clockSvgElem,CLOCK_DIMS.hourHatching);
    makeSvgLine(clockSvgElem, "hrHand");
    makeSvgLine(clockSvgElem, "mnHand");
    makeSvgLine(clockSvgElem, "scHand");
    clockAnchorToElem.appendChild(clockSvgElem);
    return clockSvgElem;
}
function makeHatching(parentSvg, hatchParms) {
    if (!hatchParms) {
        return;
    }
    if (!(typeof hatchParms.count === 'number')) {
        return;
    }
    if (hatchParms.count < 2) {
        return;
    }
    let count = hatchParms.count;
    let angleIncr = 2*Math.PI/count;
    let r1 = CLOCK_DIMS.radius*(CLOCK_DIMS.hatchingRadius-hatchParms.len);
    let r2 = CLOCK_DIMS.radius*CLOCK_DIMS.hatchingRadius;
    for (let i=0;i<count;i++) {
        let angle = angleIncr*i;
        let cs = Math.cos(angle);
        let sn = Math.sin(angle);
        let attr = {
            x1: CLOCK_DIMS.ctr+r1*sn,
            y1: CLOCK_DIMS.ctr+r1*cs,
            x2: CLOCK_DIMS.ctr+r2*sn,
            y2: CLOCK_DIMS.ctr+r2*cs,
            stroke$width: hatchParms.wid*CLOCK_DIMS.radius,
            stroke: hatchParms.colr
        }
        makeSvgElem(parentSvg, "line", attr);
    }
}
function updateClockTime() {
    if (clockAnchorToElem) {
        let nowTime = new Date();
        let hr = nowTime.getHours();
        while (hr > 11) {
            hr -= 12;
        }
        let mn = nowTime.getMinutes();
        let ss = nowTime.getSeconds();
        let ms = nowTime.getMilliseconds();
        let totMils = hr*60*60*1000 + mn*60*1000 + ss*1000 + ms;
        let hourAngle = totMils/(12*60*60*1000);
        hourAngle = hourAngle-Math.floor(hourAngle);
        hourAngle *= (2*Math.PI);
        let minAngle = totMils/(60*60*1000);
        minAngle = minAngle-Math.floor(minAngle);
        minAngle *= (2*Math.PI);
        let secAngle = totMils/(60*1000);
        secAngle = secAngle-Math.floor(secAngle);
        secAngle *= (2*Math.PI);
        drawClockHand ("hrHand", hourAngle, CLOCK_DIMS.radius*CLOCK_DIMS.hourHand.len,
            CLOCK_DIMS.radius*CLOCK_DIMS.hourHand.wid, CLOCK_DIMS.hourHand.colr);
        drawClockHand ("mnHand", minAngle, CLOCK_DIMS.radius*CLOCK_DIMS.minuteHand.len,
            CLOCK_DIMS.radius*CLOCK_DIMS.minuteHand.wid, CLOCK_DIMS.minuteHand.colr);
        drawClockHand ("scHand", secAngle, CLOCK_DIMS.radius*CLOCK_DIMS.secondHand.len,
            CLOCK_DIMS.radius*CLOCK_DIMS.secondHand.wid, CLOCK_DIMS.secondHand.colr);
    }
}
function showAnalogClock(clockId) {
    setUpClock(clockId);
    setInterval(updateClockTime, 100);
}

export { showAnalogClock };