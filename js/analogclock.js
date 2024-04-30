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
        colr: THEME_COLOR_2
    }
}

// Last angular position for each hand saved, used for comparison to current
// angle (see drawClockHand()) to prevent unnecessary redrawing of hands that
// have not moved enough to be noticeable.
let handAngleSaves = {  // names must be same a clock hand ids
    hrHand: -1,
    mnHand: -1,
    scHand: -1
}

let clockAnchorToElem = null;   

let clockSvgElem = null;

function rnd2(x) {
    return Math.round(x*100)/100;
}
function drawClockHand (elemId, angle, len, wid, colr) {
    let diff = angle - handAngleSaves[elemId];
    while (diff < 0) {
        diff += (2*Math.PI);
    }
    // Do not redraw hand if it has not moved sufficiently since last redraw
    // to be noticeable.
    if (diff < 0.005) {
        return;
    } else {
        // Save new angle for comparison in next iteration
        handAngleSaves[elemId] = angle;
    }
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
    // Draw static elements of clock face (all but hands)
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
    // Draw hands as static elements first so that they have the necessary id
    // elements by which they are retrieved and updated later.
    makeSvgLine(clockSvgElem, "hrHand");
    makeSvgLine(clockSvgElem, "mnHand");
    makeSvgLine(clockSvgElem, "scHand");
    clockAnchorToElem.appendChild(clockSvgElem);
    return clockSvgElem;
}
function makeHatching(parentSvg, hatchParms) {
    // Create hatchings at hours and/or minutes
    if (!hatchParms) {
        // if specified hatching is not provided in CLOCK_DIMS then
        // that indicates no such hatching is desired in the clock
        // face and so we exit at this point.
        return;
    }
    // hatchParms.count is the number of hatch marks desired (generally
    // 12 or 60).  This is stored as count locally for convenience.  Dividing
    // that count into 2PI gives the angle between hatch marks (in radians).
    let count = hatchParms.count;
    let angleIncr = 2*Math.PI/count;
    // r1 = distance from center of clock for beginning of line representing hatching
    let r1 = CLOCK_DIMS.radius*(CLOCK_DIMS.hatchingRadius-hatchParms.len);
    // r2 = distance from center of clock for end of line representing hatching
    let r2 = CLOCK_DIMS.radius*CLOCK_DIMS.hatchingRadius;
    for (let i=0;i<count;i++) {
        let angle = angleIncr*i;
        let cs = Math.cos(angle);
        let sn = Math.sin(angle);
        let attr = {
            x1: rnd2(CLOCK_DIMS.ctr+r1*sn),
            y1: rnd2(CLOCK_DIMS.ctr+r1*cs),
            x2: rnd2(CLOCK_DIMS.ctr+r2*sn),
            y2: rnd2(CLOCK_DIMS.ctr+r2*cs),
            stroke$width: rnd2(hatchParms.wid*CLOCK_DIMS.radius),
            stroke: hatchParms.colr
        }
        makeSvgElem(parentSvg, "line", attr);
    }
}
function updateClockTime() {
    // Updates hand positions to reflect the current time
    if (clockAnchorToElem) {
        let nowTime = new Date();
        let hr = nowTime.getHours();
        // Analog clock will be standard 12-hour clock, so hr must
        // be adjusted accordingly since, otherwise, it will use values
        // greater than 12 for post meridian times.
        while (hr > 11) {
            hr -= 12;
        }
        let mn = nowTime.getMinutes();
        let ss = nowTime.getSeconds();
        let ms = nowTime.getMilliseconds();
        // all hand angles are calculated from total milliseconds since
        // last noon or midnight, thereby enabling all hands to move in a 
        // smooth pace across the clock face rather than jumping at the 
        // next second, minute, or hour.
        // Note that angles are calculated as clockwise from the top
        // of the clock.
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