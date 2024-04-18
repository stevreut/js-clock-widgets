import { makeSvgElem } from "../svgutils.js";

let svgAnchElem = null;

let svgElem = null;

let ledCount = -1;

let digitValue = -1;

const numbin = "1110111;0000011;0111110;0011111;" +
            "1001011;1011101;1111101;0010011;" +
            "1111111;1011111";
const numBinArr = numbin.split(";");
console.log("arr size = ", numBinArr.length);
for (let j=0;j<numBinArr.length;j++) {
    console.log('bin for ', j, ' = "', numBinArr[j], '"');
}

const PROPS = {
    corner: [60,60],
    wid: 280,
    hgt: 440,
    hlen: 160,
    vlen: 160,
    ledwid: 20, 
    sep: 4,
    frcolr: "#ee2222",
    bgcolr: "#181111",
    dullColr: "#331111"
}

window.addEventListener("load", (event) => {
    // Upon loading the page ...
    svgAnchElem = document.getElementById("pid");
    createSvgDigitImg();
    walkThruDigitValues();
});

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
    console.log("proceeding with polygon construction");    
    for (const pt in points) {
        ptStr += (points[pt]+",");
    }
    ptStr = ptStr.substring(0,ptStr.length-1);
    console.log("ptrStr=\"" + ptStr + "\"");
    makeSvgElem(svgElem,"polygon",{
        id: "p"+ledCount,
        points: ptStr,
        fill: (isBright?PROPS.frcolr:PROPS.dullColr)
    });
}

function createSvgDigitImg() {
    // Creates SVG for image of a digital LED digit
    svgElem = makeSvgElem(null, "svg", {
        width: PROPS.wid,
        height: PROPS.hgt,
        version: "1.1"
    });
    makeSvgElem(svgElem, "rect", {
        x: 0,
        y: 0,
        width: PROPS.wid,
        height: PROPS.hgt,
        fill: PROPS.bgcolr
    })
    // Make the seven LED elements of a digit
    const conf = "00V01V00H01H02H10V11V";
    for (let i=0;i<21;i+=3) {
        makeLedElem(
            parseInt(conf.charAt(i)),
            parseInt(conf.charAt(i+1)),
            (conf.charAt(i+2)==="H")
        )
    }
    svgAnchElem.appendChild(svgElem);
}

function makeLedElem(x1,y1,isHorizontal) {
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
        addIncrPair(ptArr,PROPS.corner[0]+x1*PROPS.hlen+inc1+PROPS.sep,
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
        addIncrPair(ptArr,PROPS.corner[0]+x1*PROPS.hlen-inc1,
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

function walkThruDigitValues() {
    setInterval(displayDigitValue,700);
}

function displayDigitValue() {
    digitValue++;
    if (digitValue>9) {
        digitValue = 0;
    }
    let template = numBinArr[digitValue];
    console.log('template = ', template);
    for (let i=0;i<7;i++) {
        let elemId = "p" + i;
        let elem = document.getElementById(elemId);
        if (elem) { 
            elem.setAttribute("fill",(template.charAt(i)==="1"?PROPS.frcolr:PROPS.dullColr));
        } else {
            console.log("element " + elemId + " not found");
        }
    }
}