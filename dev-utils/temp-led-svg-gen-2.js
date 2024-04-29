import { makeSvgElem } from "../js/svgutils.js";

// let svgAnchElem = null;

let ledCount = -1;

let digitValue = -1;

const numbin = "1110111;0000011;0111110;0011111;" +
            "1001011;1011101;1111101;0010011;" +
            "1111111;1011111";
const numBinArr = numbin.split(";");

// const PROPS = {
//     corner: [60,60],
//     wid: 280,
//     hgt: 440,
//     hlen: 160,
//     vlen: 160,
//     ledwid: 20, 
//     sep: 4,
//     frcolr: "#ee2222",
//     bgcolr: "#181111",
//     dullColr: "#331111"
// }

const PROPS = {
    corner: [45,30],
    widPerDigit: 200,
    wid: 500,
    hgt: 190,
    hlen: 80,
    vlen: 65,
    ledwid: 10, 
    sep: 2,
    frcolr: "#222200",
    bgcolr: "#808080",
    dullColr: "#909090"
}

let dig1 = null;
let dig2 = null;

window.addEventListener("load", (event) => {
    // Upon loading the page ...
    // let svgAnchElem2 = document.getElementById("pid2");
    // let svgElem2 = makeSvgElem(svgAnchElem2, "svg", {
    //     width: PROPS.wid,
    //     height: PROPS.hgt,
    //     version: "1.1"
    // });
    let svgElem1 = makeSvgElem(document.getElementById("pid1"), "svg", {
        width: PROPS.wid,
        height: PROPS.hgt,
        version: "1.1"
    })
    dig1 = createSvgDigitImg(svgElem1, 0);
    dig1.ledElem[0].setAttribute("fill","yellow");  // TODO - test code
    dig2 = createSvgDigitImg(svgElem1, 1);
    dig2.ledElem[4].setAttribute("fill","red");  // TODO - test code
    dig2.ledElem[6].setAttribute("fill","#0080ff");  // TODO - test code
    console.log('dig2 (no string) = ', dig2);
    let dig2json = JSON.stringify(dig2);
    console.log('dig 2 = "' + dig2json + '"');
    let elemjson = JSON.stringify(dig2.ledElem);
    console.log('led = "' + elemjson + '"');
    // walkThruDigitValues();  // TODO - re-enable after initial testing
});

function makeSvgPoly(svgParent, points, isBright) {
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
    let svgPoly = makeSvgElem(svgParent,"polygon",{
        points: ptStr,
        fill: (isBright?PROPS.frcolr:PROPS.dullColr)
    });
    return svgPoly;
}

function createSvgDigitImg(svgParent, digNum /*TODO*/) {
    // Creates SVG for image of a digital LED digit
    // TODO - one rect PER DIGIT? (rather than per collection of digits)
    let digitSvg = {
        rect: null,
        ledElem: []
    };
    digitSvg.rect = makeSvgElem(svgParent, "rect", {
        x: 0+digNum*PROPS.widPerDigit,
        y: 0,
        width: PROPS.widPerDigit-10,  // TODO
        height: PROPS.hgt,
        fill: PROPS.bgcolr
    })
    // Make the seven LED elements of a digit
    const conf = "00V01V00H01H02H10V11V";
    let j = -3;
    for (let i=0;i<7;i++) {
        j += 3;
        let ledPolySvg = makeLedElem(
            svgParent,
            digNum,
            parseInt(conf.charAt(j)),
            parseInt(conf.charAt(j+1)),
            (conf.charAt(j+2)==="H")
        );
        digitSvg.ledElem.push(ledPolySvg);
        console.log('digitSvg.ledElem = ', digitSvg.ledElem);
        svgParent.appendChild(ledPolySvg);
    }
    // svgAnchElem.appendChild(svgParent);
    return digitSvg;
}

function makeLedElem(svgParent,digNum,x1,y1,isHorizontal) {
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
        addIncrPair(ptArr,PROPS.widPerDigit*digNum+PROPS.corner[0]+x1*PROPS.hlen+inc1+PROPS.sep,
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
        addIncrPair(ptArr,PROPS.widPerDigit*digNum+PROPS.corner[0]+x1*PROPS.hlen-inc1,
            PROPS.corner[1]+y1*PROPS.vlen+inc1+PROPS.sep);
        addIncrPair(ptArr,inc1,-inc1);
        addIncrPair(ptArr,inc1,inc1);
        addIncrPair(ptArr,0,(y2-y1)*PROPS.vlen-inc2);
        addIncrPair(ptArr,-inc1,inc1);
        addIncrPair(ptArr,-inc1,-inc1);
    }
    ptArr = biasPoints(ptArr);
    let svgPoly = makeSvgPoly(svgParent, ptArr, false);
    return svgPoly;
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
        x = Math.round(x*1000)/1000;  // TODO - new code - limits precision to 3 digits after decimal
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
    // console.log('template = ', template);
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