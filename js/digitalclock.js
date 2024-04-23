import { makeSvgElem } from "./svgutils.js";

let clockAnchorElem = null;  // Element having id= that clock is attached to

let clockSvgElem = null;     // SVG element for clock

let ledCount = -1;  // TODO - ultimately get rid of this variable

const numbin = "1110111;0000011;0111110;0011111;" +
            "1001011;1011101;1111101;0010011;" +
            "1111111;1011111";
const numBinArr = numbin.split(";");

const PROPS = {
    corner: [90,60],
    wid: 280,
    hgt: 440,
    hlen: 160,
    vlen: 160,
    ledwid: 20, 
    sep: 4,
    frcolr: "#ee2222",
    bgcolr: "#181111",
    dullColr: "#331111",
    fullwid: 1700,
    fullhgt: 480,
    pairwid: 550,
    digwid: 230
}

function drawLedElem(lx,elemIdx,isBright) {
    let lns = [];
    let elemId = "x"+Math.floor(lx)+"d"+elemIdx;
    let elem = document.getElementById(elemId);
    let elExists = (elem != null);
    switch(elemIdx) {
        case 0:
            lns = [0,0,0,1];
            break;
        case 1:
            lns = [0,1,0,2];
            break;
        case 2:
            lns = [0,0,1,0];
            break;
        case 3:
            lns = [0,1,1,1];
            break;
        case 4:
            lns = [0,2,1,2];
            break;
        case 5:
            lns = [1,0,1,1];
            break;
        case 6:
            lns = [1,1,1,2];
            break;
        default:
            console.log('unexpected default - elemIdx = ', elemIdx);
            return;
    }
    lns = lns.map((val)=>val*50+30);
    if (elExists) {
        elem.setAttribute("stroke", (isBright?"#e02000":"#302220"));
    } else {
        lns[0]+=lx;
        lns[2]+=lx;
        elem = makeSvgElem(clockSvgElem, "line", {
            id: elemId, x1: lns[0], y1: lns[1], x2: lns[2], y2: lns[3],
            stroke: (isBright?"#e02000":"#302220"),
            stroke$width: 5
        });
    }
}
function displayDigit(lx,d) {
    if (d < 0 || d > 9) {
        console.log('invalid digit = ', d, '  type=', typeof d);
        return;
    }
    const arr = [119,3,62,31,75,93,125,19,127,91];
    if (arr.length != 10) {
        console.log('unexpected arr len ', arr.length);
        return;
    }
    let eArr = [];
    let wrk = arr[d];
    for (let i=6;i>=0;i--) {
        eArr[i] = (wrk%2 === 1);
        wrk >>>= 1;  // TODO - consider bit shift, but have to be careful: >>= or >>>= ?
    }
    for (let j=0;j<7;j++) {
        drawLedElem(lx,j,eArr[j]);
    }
}
function displayColon(lx) {
    let col1 = document.getElementById("col1");
    let col2 = document.getElementById("col2");
    if (!col1) {
        col1 = makeSvgElem(clockSvgElem, "rect", {
            x: lx,
            y: 55,
            width: 5,
            height: 5,
            fill: "#e02000"
        });
    }
    if (!col2) {
        col2 = makeSvgElem(clockSvgElem,"rect", {
            x: lx,
            y: 115,
            width: 5,
            height: 5,
            fill: "#e02000"
        })
    }
}
function displayTwoDigits(idx,dd) {
    let d2 = dd%10;
    let d1 = Math.floor(dd/10);
    displayDigit(idx*157+5,d1);
    displayDigit(idx*157+76,d2);
}

function makeSvgPoly(points, isBright) {
    ledCount++;
    let ptStr = "";
    if (points.length < 6) {
        console.log("less than 3 points in poly");
        return;
    }
    if (points.length%2 != 0) {
        console.log("odd number of values in poly");
        return;
    }
    // console.log("proceeding with polygon construction");    
    for (const pt in points) {
        ptStr += (points[pt]+",");
    }
    ptStr = ptStr.substring(0,ptStr.length-1);
    // console.log("ptrStr=\"" + ptStr + "\"");
    makeSvgElem(clockSvgElem,"polygon",{
        id: "p"+ledCount,
        points: ptStr,
        fill: (isBright?PROPS.frcolr:PROPS.dullColr)
    });
}


function makeLedElem(xOffs,x1,y1,isHorizontal) {
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
    ptArr = biasPoints(ptArr);
    makeSvgPoly(ptArr, false);
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

function biasPoints(arr) {
    let newArr = []
    for (let i=0;i<arr.length;i+=2) {
        let x = arr[i];
        let y = arr[i+1];
        x += PROPS.vlen*0.2-y*0.15;
        newArr.push(x);
        newArr.push(y);
    }
    return newArr;
}


function setUpSingleDigit(xOffs, lbl) {
    // Creates SVG element for image of a digital LED digit
    // svgElem = makeSvgElem(null, "svg", {
    //     width: PROPS.wid,
    //     height: PROPS.hgt,
    //     version: "1.1"
    // });
    // makeSvgElem(clockSvgElem, "rect", {
    //     x: xOffs,
    //     y: 0,  // TODO
    //     id: lbl,  // TODO
    //     width: PROPS.wid,
    //     height: PROPS.hgt,
    //     fill: PROPS.bgcolr
    // })
    // Make the seven LED elements of a digit
    const conf = "00V01V00H01H02H10V11V";
    for (let i=0;i<21;i+=3) {
        makeLedElem(
            xOffs,
            parseInt(conf.charAt(i)),
            parseInt(conf.charAt(i+1)),
            (conf.charAt(i+2)==="H")
        )
    }
    clockAnchorElem.appendChild(clockSvgElem);
}
function setUpDigits(pairIdx, lbl) {
    setUpSingleDigit(pairIdx*PROPS.pairwid, lbl+"1");
    setUpSingleDigit(pairIdx*PROPS.pairwid+PROPS.digwid, lbl+"2");
}
function setUpClock(clockId) {
    if (!clockAnchorElem) {
        clockAnchorElem = document.getElementById(clockId);
    }
    clockSvgElem = makeSvgElem(null, "svg", {
        viewBox: "0 0 " + PROPS.fullwid + " " + PROPS.fullhgt,
        width: "100%",
        height: "100%",
    })
    makeSvgElem(clockSvgElem, "rect", {
        x: 0,
        y: 0,
        width: PROPS.fullwid,
        height: PROPS.fullhgt,
        fill: PROPS.bgcolr
    });
    setUpDigits(0, "hh");
    setUpDigits(1, "mm");
    setUpDigits(2, "ss");
    displayColon(0);
    displayColon(1);
    clockAnchorElem.appendChild(clockSvgElem);
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
    displayTwoDigits(0, hh);
    displayTwoDigits(1, mm);
    displayTwoDigits(2, ss);
}

function showDigitalClock(clockId) {
    setUpClock(clockId);
    setInterval(showTimeOnClock, 200);
}

export { showDigitalClock };