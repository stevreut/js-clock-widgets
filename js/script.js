// import { drawClockTime, drawNowClock } from "./clockdraw";
const CLOCKRADIUS = 120;
const CLOCKSIZE = 300;
const CLOCKCTR = CLOCKSIZE/2;
const SVG_NS = "http://www.w3.org/2000/svg";
const clockImgElem = document.getElementById("clockImg");    
const retroParaElem = document.getElementById("retroClock");

function rnd2(x) {
    return Math.round(x*100)/100;
}
function drawHand (imgElem, elemId, angle, len, wid, colr) {
    let elem = document.getElementById(elemId);
    if (!elem) {
        console.log('no element found for ', elemId);
        return;
    }
    const SLEN = 10;
    let sa = Math.sin(angle);
    let ca = Math.cos(angle);
    let x1 = rnd2(sa*SLEN+CLOCKCTR);
    let y1 = rnd2(CLOCKCTR-ca*SLEN);
    let x2 = rnd2(sa*len+CLOCKCTR);
    let y2 = rnd2(CLOCKCTR-ca*len);
    elem.setAttribute("x1",x1);
    elem.setAttribute("y1",y1);
    elem.setAttribute("x2",x2);
    elem.setAttribute("y2",y2);
    elem.setAttribute("stroke",colr);
    elem.setAttribute("stroke-width",wid);
    imgElem.appendChild(elem);
}
function hexOf(x) {
    if (x < 0 || x > 15) {
        console.log('overriding out-of-range hex digit');
        return "0";
    } else {
        return "0123456789abcdef"[x];
    }
}
function toHex2(x) {
    let a = Math.floor(x/16);
    let b = x-a*16;
    let res = hexOf(a);
    res += hexOf(b);
    return res;
}
function randomBackgroundColor() {
    let str = "#";
    for (let i=0;i<3;i++) {
        str += toHex2(Math.floor(Math.random()*35+220));
    }
    return str;
}
function randCoords() {
    let theta = Math.PI*2*Math.random();
    let sn = Math.sin(theta);
    let cs = Math.cos(theta);
    let len = Math.sqrt(Math.random())*CLOCKRADIUS*0.8;
    let retx = [];
    retx[0] = rnd2(cs*len+CLOCKCTR);
    retx[1] = rnd2(sn*len+CLOCKCTR);
    return retx;
}
function putDot() {
    let dtE = document.getElementById("dot");
    if (dtE) {
        dtE.remove();
    }
    let dotElem = document.createElementNS(SVG_NS,"circle");
    dotElem.setAttribute("id","dot");
    let arXy = randCoords();
    dotElem.setAttribute("cx",arXy[0]);
    dotElem.setAttribute("cy",arXy[1]);
    dotElem.setAttribute("r",20);
    dotElem.setAttribute("fill",randomBackgroundColor());
    clockImgElem.appendChild(dotElem);
}
function showClockNow() {
    // console.log('showClockNow() invoked', (new Date()));
    let clkDiv = document.getElementById("clockDiv");
    let crc = document.getElementById("circ");
    if (crc) {
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
        drawHand (clockImgElem, "hrHand", hourAngle, CLOCKRADIUS*0.5, CLOCKRADIUS*0.04, '#000000');
        drawHand (clockImgElem, "mnHand", minAngle, CLOCKRADIUS*0.85, CLOCKRADIUS*0.03, '#000000');
        drawHand (clockImgElem, "scHand", secAngle, CLOCKRADIUS*0.93, CLOCKRADIUS*0.01, '#ff8080');
        // setTimeout(showClockNow(), 3000);
    }
}
function twoDec(x) {
    x = Math.round(x);
    if (x < 10) {
        return "0" + x;
    } else {
        return x.toString();
    }
}
function showDigitalClock() {
    let nowTime = new Date();
    let hr = nowTime.getHours();
    while (hr > 11) {
        hr -= 12;
    }
    let mn = nowTime.getMinutes();
    let ss = nowTime.getSeconds();
    let txt = twoDec(hr)+":"+twoDec(mn)+"<span class=\"ss\">:"+twoDec(ss)+"</span>";
    (document.getElementById("digClock")).innerHTML = txt;
}
let retroIs = false;
let retroSvg = null;

function drawLedElem(lx,elemIdx,isBright) {
    let lns = [];
    let elemId = "x"+Math.floor(lx)+"d"+elemIdx;
    let elem = document.getElementById(elemId);
    let elExists = (elem != null);
    console.log('elem=',elemId,' is?=',elExists);
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
    elem = document.createElementNS(SVG_NS,"line");
    lns[0]+=lx;
    lns[2]+=lx;
    elem.setAttribute("id",elemId);
    elem.setAttribute("x1",lns[0]);
    elem.setAttribute("y1",lns[1]);
    elem.setAttribute("x2",lns[2]);
    elem.setAttribute("y2",lns[3]);
    elem.setAttribute("stroke",(isBright?"#e02000":"#302220"));  // TODO
    elem.setAttribute("stroke-width","5");
    // if (!elExists) {
        console.log('appended elem with id = ', elemId);
        retroSvg.appendChild(elem);
    // }
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
    for (i=6;i>=0;i--) {
        // console.log('wrk=',wrk);
        // console.log('wrk mod = ',wrk%2);
        eArr[i] = (wrk%2 === 1);
        // console.log('bit=',eArr[i]);
        wrk >>>= 1;  // TODO - consider bit shift, but have to be careful: >>= or >>>= ?
        // console.log('wrk shifted = ',wrk);
    }
    // console.log('d=',d,' arr[d]=',arr[d],' eArr=',eArr);
    for (let j=0;j<7;j++) {
        drawLedElem(lx,j,eArr[j]);
    }
}
function displayColon(lx) {
    let col1 = document.getElementById("col1");
    let col2 = document.getElementById("col2");
    if (!col1) {
        let col1 = document.createElementNS(SVG_NS,"rect");
        col1.setAttribute("x",lx);
        col1.setAttribute("y",55);
        col1.setAttribute("width",5);
        col1.setAttribute("height",5);
        col1.setAttribute("fill","#e02000");
        retroSvg.appendChild(col1);
    }
    if (!col2) {
        let col2 = document.createElementNS(SVG_NS,"rect");
        col2.setAttribute("x",lx);
        col2.setAttribute("y",115);
        col2.setAttribute("width",5);
        col2.setAttribute("height",5);
        col2.setAttribute("fill","#e02000");
        retroSvg.appendChild(col2);
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
function showRetroClock() {
    console.log('showRetroClock invoked');
    if (!retroIs) {
        console.log('start svg rect creation');
        retroSvg = document.createElementNS(SVG_NS,"svg");
        retroSvg.setAttribute("width","500");
        retroSvg.setAttribute("height","165");
        let rectBgElem = document.createElementNS(SVG_NS,"rect");
        rectBgElem.setAttribute("x","0");
        rectBgElem.setAttribute("y","0");
        rectBgElem.setAttribute("width","500");
        rectBgElem.setAttribute("height","165");
        rectBgElem.setAttribute("fill","#202020");
        retroSvg.appendChild(rectBgElem);
        retroParaElem.appendChild(retroSvg);
        retroIs = true;
        console.log('finish svg rect creation')
    } else {
        console.log('svg else');
    }
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
function startClock() {
    console.log('started clock');
    setInterval(showClockNow, 100);
    setInterval(putDot, 2500);
    // setInterval(showDigitalClock, 200);
    setInterval(showRetroClock, 200);  // TODO
}