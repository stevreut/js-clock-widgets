import { makeSvgElem } from "./svgutils.js";

let clockAnchorElem = null;  // Element having id= that clock is attached to

let clockSvgElem = null;     // SVG element for clock

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
        elem.remove();
    } 
    lns[0]+=lx;
    lns[2]+=lx;
    elem = makeSvgElem(clockSvgElem, "line", {
        id: elemId, x1: lns[0], y1: lns[1], x2: lns[2], y2: lns[3],
        stroke: (isBright?"#e02000":"#302220"),
        stroke$width: 5
    })
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
function displayTwoDigits(idx,dd,doCol) {
    let d2 = dd%10;
    let d1 = Math.floor(dd/10);
    displayDigit(idx*157+5,d1);
    displayDigit(idx*157+76,d2);
    if (doCol) {
        displayColon(idx*150+172);
    }
}
function setUpClock(clockId) {
    if (!clockAnchorElem) {
        clockAnchorElem = document.getElementById(clockId);
    }
    clockSvgElem = makeSvgElem(null, "svg", {
        width: 500,
        height: 165,
    })
    makeSvgElem(clockSvgElem, "rect", {
        x: 0,
        y: 0,
        width: 500,
        height: 165,
        fill: "#202020"
    });
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
    displayTwoDigits(0, hh, true);
    displayTwoDigits(1, mm, true);
    displayTwoDigits(2, ss, false);
}

function showDigitalClock(clockId) {
    setUpClock(clockId);
    setInterval(showTimeOnClock, 200);
}

export { showDigitalClock };