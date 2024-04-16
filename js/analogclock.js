import { makeSvgCenteredCircle, makeSvgElem, makeSvgLine, setAtts, setDims } from "./svgutils.js";

const CLOCK_DIMS = {
    radius: 220,
    size: 500,
    ctr: 250
}

let clockImgElem = null;   

let svgElem = null;

function rnd2(x) {
    return Math.round(x*100)/100;
}
function drawHand (elemId, angle, len, wid, colr) {
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
function setUpClock() {
    setDims(CLOCK_DIMS);
    svgElem = makeSvgElem(null, "svg", {
        id: "clockImg", width: CLOCK_DIMS.size, height: CLOCK_DIMS.size
    });
    makeSvgElem(svgElem, "rect", {
        x: 0, y: 0, width: CLOCK_DIMS.size, height: CLOCK_DIMS.size, fill: "#1e2334"
    });
    makeSvgCenteredCircle(svgElem, "circ1", CLOCK_DIMS.radius+2, "#ffbdc3");
    makeSvgCenteredCircle(svgElem, "circ2", CLOCK_DIMS.radius, "#a3bdc3");
    makeSvgCenteredCircle(svgElem, "circ3", 5, "#ffbdc3");
    makeSvgLine(svgElem, "hrHand");
    makeSvgLine(svgElem, "mnHand");
    makeSvgLine(svgElem, "scHand");
    clockImgElem.appendChild(svgElem);
    return svgElem;
}
function showClockNow(clockId) {
    if (!clockImgElem) {
        clockImgElem = document.getElementById(clockId);
        setUpClock();
    }
    if (clockImgElem) {
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
        drawHand ("hrHand", hourAngle, CLOCK_DIMS.radius*0.5, CLOCK_DIMS.radius*0.04, '#000000');
        drawHand ("mnHand", minAngle, CLOCK_DIMS.radius*0.85, CLOCK_DIMS.radius*0.03, '#000000');
        drawHand ("scHand", secAngle, CLOCK_DIMS.radius*0.93, CLOCK_DIMS.radius*0.01, '#ffbdc3');
    }
}

export { showClockNow };