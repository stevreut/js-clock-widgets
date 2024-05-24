import { makeSvgElem } from "./svgutils.js";

let clockAnchorElem = null;  // Element having id= that clock is attached to

let clockSvgElemOuter = null;
let clockSvgGroupElem = null;     // SVG element for clock

const numbin = "1110111;0000011;0111110;0011111;" +
            "1001011;1011101;1111101;0010011;" +
            "1111111;1011111";
const numBinArr = numbin.split(";");

const PROPS = {
    corner: [90,80],
    wid: 280,
    hgt: 440,
    hlen: 160,
    vlen: 160,
    ledwid: 20, 
    sep: 4,
    frcolr: "#ee2222",
    bgcolr: "#181111",
    dullColr: "#331111",
    fullwid: 1680,
    fullhgt: 480,
    pairwid: 550,
    digwid: 230,
    colonOffs: 10,
    skew: 8.5
}

let skewCompensation = 0;

function makeSvgPoly(points, isBright, lbl) {
    let ptStr = "";
    if (points.length < 6) {
        console.log("less than 3 points in poly");
        return;
    }
    if (points.length%2 != 0) {
        console.log("odd number of values in poly");
        return;
    }
    for (const pt in points) {
        ptStr += (points[pt]+",");
    }
    ptStr = ptStr.substring(0,ptStr.length-1);
    let attribs = {
        points: ptStr,
        fill: (isBright?PROPS.frcolr:PROPS.dullColr)
    }
    if (lbl) {
        attribs.id = lbl;
    }
    makeSvgElem(clockSvgGroupElem,"polygon", attribs);
}

function makeLedElem(xOffs,x1,y1,isHorizontal,lbl) {
    // Creates a single LED digit element in SVG as an
    // SVG <polygon>
    let ptArr = [];
    let x2 = null;
    let y2 = null;
    let inc1 = PROPS.ledwid;
    let inc2 = 2*(PROPS.ledwid+PROPS.sep);
    if (isHorizontal) {
        x2 = x1+1;
        y2 = y1;
        // horizontal element
        addIncrPair(ptArr,xOffs+PROPS.corner[0]+x1*PROPS.hlen+inc1+PROPS.sep,
            PROPS.corner[1]+y1*PROPS.vlen+inc1);
        addIncrPair(ptArr,-inc1,-inc1);
        addIncrPair(ptArr,inc1,-inc1);
        addIncrPair(ptArr,(x2-x1)*PROPS.hlen-inc2,0);
        addIncrPair(ptArr,inc1,inc1);
        addIncrPair(ptArr,-inc1,inc1);
    } else {
        // vertical element
        x2 = x1;
        y2 = y1+1;
        addIncrPair(ptArr,xOffs+PROPS.corner[0]+x1*PROPS.hlen-inc1,
            PROPS.corner[1]+y1*PROPS.vlen+inc1+PROPS.sep);
        addIncrPair(ptArr,inc1,-inc1);
        addIncrPair(ptArr,inc1,inc1);
        addIncrPair(ptArr,0,(y2-y1)*PROPS.vlen-inc2);
        addIncrPair(ptArr,-inc1,inc1);
        addIncrPair(ptArr,-inc1,-inc1);
    }
    makeSvgPoly(ptArr, false, lbl);
}

function addIncrPair(arr, xinc, yinc) {
    // Append delta to end of polygon point array
    // based on previous coordinates as moved by
    // parameters above.
    if (arr.length < 2) {
        arr.push(xinc, yinc);
    } else {
        let newx = arr[arr.length-2]+xinc;
        let newy = arr[arr.length-1]+yinc;
        arr.push(newx);
        arr.push(newy);
    }
}

function setUpSingleDigit(xOffs, lbl) {
    // Creates SVG element for image of a digital LED digit
    // Make the seven LED elements of a digit
    const conf = "00V01V00H01H02H10V11V";
    for (let i=0;i<7;i++) {
        let j = i*3;
        makeLedElem(
            xOffs,
            parseInt(conf.charAt(j)),
            parseInt(conf.charAt(j+1)),
            (conf.charAt(j+2)==="H"),
            lbl + i
        )
    }
    clockSvgElemOuter.appendChild(clockSvgGroupElem);
}

function setUpDigits(pairIdx, lbl) {
    setUpSingleDigit(pairIdx*PROPS.pairwid, lbl+"-a-");
    setUpSingleDigit(pairIdx*PROPS.pairwid+PROPS.digwid, lbl+"-b-");
}

function setUpDot(x, y) {
    let ptArr = [];
    const DIAG = PROPS.ledwid-PROPS.sep;
    addIncrPair(ptArr, x, y-DIAG);
    addIncrPair(ptArr, DIAG, DIAG);
    addIncrPair(ptArr, -DIAG, DIAG);
    addIncrPair(ptArr, -DIAG, -DIAG);
    makeSvgPoly(ptArr, true, null);
}

function setUpColon(idx) {
    const COL_OFFS = PROPS.corner[0]+idx*PROPS.pairwid+2*PROPS.digwid+PROPS.colonOffs;
    let cVert = PROPS.corner[1]+PROPS.hlen/2;
    setUpDot(COL_OFFS, cVert);
    cVert += PROPS.hlen;
    setUpDot(COL_OFFS, cVert);
}

function setUpClock(clockId) {
    if (!clockAnchorElem) {
        clockAnchorElem = document.getElementById(clockId);
    }
    clockSvgElemOuter = makeSvgElem(null, "svg", {
        viewBox: "0 0 " + PROPS.fullwid + " " + PROPS.fullhgt,
        width: "100%",
        height: "100%",
    })
    makeSvgElem(clockSvgElemOuter, "rect", {
        x: 0,
        y: 0,
        width: PROPS.fullwid,
        height: PROPS.fullhgt,
        fill: PROPS.bgcolr
    });
    skewCompensation = Math.tan(PROPS.skew*Math.PI/180)*PROPS.vlen;
    clockSvgGroupElem = makeSvgElem(clockSvgElemOuter, "g", {
        transform: "skewX(" + (-PROPS.skew) + ") translate(" + skewCompensation + ",0)"
    });
    setUpDigits(0, "hh");
    setUpDigits(1, "mm");
    setUpDigits(2, "ss");
    setUpColon(0);
    setUpColon(1);
    clockAnchorElem.appendChild(clockSvgElemOuter);
}

function setDigitBlank(labelPrefix) {
    for (let i=0;i<7;i++) {
        let lbl = labelPrefix + i;
        let elem = document.getElementById(lbl);
        if (elem) {
            elem.setAttribute("fill", PROPS.dullColr);
        } else {
            console.log('no element "' + lbl + '" found');
        }
    }
}

function setDigitValue(labelPrefix, val) {
    let template = numBinArr[val];
    for (let i=0;i<7;i++) {
        let elemId = labelPrefix + i;
        let elem = document.getElementById(elemId);
        if (elem) { 
            elem.setAttribute("fill",(template.charAt(i)==="1"?PROPS.frcolr:PROPS.dullColr));
        } else {
            console.log("element " + elemId + " not found");
        }
    }
}

function showTimeUnit(labelPrefix, value, blankOutLeadingZero) {
    const v1 = Math.floor(value/10);
    const v2 = value%10;
    const idPrefix1 = labelPrefix + "-a-";
    const idPrefix2 = labelPrefix + "-b-";
    if (blankOutLeadingZero && v1 === 0) {
        setDigitBlank(idPrefix1);
    } else {
        setDigitValue(idPrefix1, v1);
    }
    setDigitValue(idPrefix2, v2);
}

function showTimeOnClock() {
    let nowTime = new Date();
    let hh = nowTime.getHours();
    while (hh > 12) {
        hh-=12;
    }
    while (hh < 1) {
        hh += 12;
    }
    let mm = nowTime.getMinutes();
    let ss = nowTime.getSeconds();
    showTimeUnit("hh", hh, true);
    showTimeUnit("mm", mm, false);
    showTimeUnit("ss", ss, false);
}

function showDigitalClock(clockId) {
    setUpClock(clockId);
    setInterval(showTimeOnClock, 200);
}

export { showDigitalClock };