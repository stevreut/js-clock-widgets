import { makeSvgElem } from "../svgutils.js";

let svgAnchElem = null;

let svgElem = null;

let ledCount = -1;

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
}

window.addEventListener("load", (event) => {
    // Upon loading the page ...
    svgAnchElem = document.getElementById("pid");
    createSvgDigitImg();

});

function makeSvgPoly(points) {
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
        fill: PROPS.frcolr
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
    makeLedElem(0,0,1,0);  // (0,0) -> (1,0)
    makeLedElem(0,1,1,1);  // (0,1) -> (1,1), etc.
    makeLedElem(0,2,1,2);
    makeLedElem(0,0,0,1);
    makeLedElem(0,1,0,2);
    makeLedElem(1,0,1,1);
    makeLedElem(1,1,1,2);
    svgAnchElem.appendChild(svgElem);
}

function makeLedElem(x1,y1,x2,y2) {
    // Creates a single LED digit element in SVG as an
    // SVG <polygon>
    console.log("points ("+x1+","+y1+") -> ("+x2+","+y2+")");
    if (x1===x2 && y1===y2) {
        console.log("zero len");
        return;
    }
    if (x1!==x2 && y2!==y2) {
        console.log("diagonal");
        return;
    }
    let ptArr = [];
    if (y1===y2) {
        // horizontal element
        ptArr.push(PROPS.corner[0]+x1*PROPS.hlen+PROPS.ledwid+PROPS.sep);
        ptArr.push(PROPS.corner[1]+y1*PROPS.vlen+PROPS.ledwid);
        addIncrPair(ptArr,-PROPS.ledwid,-PROPS.ledwid);
        addIncrPair(ptArr,PROPS.ledwid,-PROPS.ledwid);
        addIncrPair(ptArr,(x2-x1)*PROPS.hlen-2*(PROPS.ledwid+PROPS.sep),0);
        addIncrPair(ptArr,PROPS.ledwid,PROPS.ledwid);
        addIncrPair(ptArr,-PROPS.ledwid,PROPS.ledwid);
    } else {
        ptArr.push(PROPS.corner[0]+x1*PROPS.hlen-PROPS.ledwid);
        ptArr.push(PROPS.corner[1]+y1*PROPS.vlen+PROPS.ledwid+PROPS.sep);
        addIncrPair(ptArr,PROPS.ledwid,-PROPS.ledwid);
        addIncrPair(ptArr,PROPS.ledwid,PROPS.ledwid);
        addIncrPair(ptArr,0,(y2-y1)*PROPS.vlen-2*(PROPS.ledwid+PROPS.sep));
        addIncrPair(ptArr,-PROPS.ledwid,PROPS.ledwid);
        addIncrPair(ptArr,-PROPS.ledwid,-PROPS.ledwid);
    }
    ptArr = biasPoints(ptArr);
    makeSvgPoly(ptArr);
}

function addIncrPair(arr, xinc, yinc) {
    // Append delta to end of polygon point array
    // based on previous coordinates as moved by
    // parameters above.
    let newx = arr[arr.length-2]+xinc;
    let newy = arr[arr.length-1]+yinc;
    arr.push(newx);
    arr.push(newy);
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