import { makeSvgElem } from "../svgutils.js";

let svgAnchElem = null;

let svgElem = null;

let ledCount = -1;

const PROPS = {
    corner: [75,75],
    wid: 350,
    hgt: 550,
    hlen: 200,
    vlen: 200,
    ledwid: 25, 
    sep: 2,
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
    // makeSvgPoly([3,3,20,3,3,20]);
    makeLedElem(0,0,1,0);
    makeLedElem(0,1,1,1);
    makeLedElem(0,2,1,2);
    makeLedElem(0,0,0,1);
    makeLedElem(0,1,0,2);
    makeLedElem(1,0,1,1);
    makeLedElem(1,1,1,2);
    svgAnchElem.appendChild(svgElem);
}

function makeLedElem(x1,y1,x2,y2) {
    console.log("points ("+x1+","+y1+") -> ("+x2+","+y2+")");
    if (x1===x2 && y1===y2) {
        console.log("zero len");
        return;
    }
    if (x1!==x2 && y2!==y2) {
        console.log("diagonal");
        return;
    }
    if (y1===y2) {
        // horizontal element
        makeSvgPoly([
            PROPS.corner[0]+PROPS.sep+x1*PROPS.hlen,
            PROPS.corner[1]+y1*PROPS.vlen,
            PROPS.corner[0]+PROPS.sep+x1*PROPS.hlen+PROPS.ledwid,
            PROPS.corner[1]+y1*PROPS.vlen-PROPS.ledwid,
            PROPS.corner[0]+x2*PROPS.hlen-PROPS.ledwid-PROPS.sep,
            PROPS.corner[1]+y1*PROPS.vlen-PROPS.ledwid,
            PROPS.corner[0]+x2*PROPS.hlen-PROPS.sep,
            PROPS.corner[1]+y1*PROPS.vlen,
            PROPS.corner[0]+x2*PROPS.hlen-PROPS.ledwid-PROPS.sep,
            PROPS.corner[1]+y1*PROPS.vlen+PROPS.ledwid,
            PROPS.corner[0]+PROPS.sep+x1*PROPS.hlen+PROPS.ledwid,
            PROPS.corner[1]+y1*PROPS.vlen+PROPS.ledwid,
        ]);
    } else {
        // vertical element
        makeSvgPoly([
            PROPS.corner[0]+PROPS.hlen*x1,
            PROPS.corner[1]+PROPS.vlen*y1+PROPS.sep,
            PROPS.corner[0]+PROPS.hlen*x1+PROPS.ledwid,
            PROPS.corner[1]+PROPS.vlen*y1+PROPS.sep+PROPS.ledwid,
            PROPS.corner[0]+PROPS.hlen*x1+PROPS.ledwid,
            PROPS.corner[1]+PROPS.vlen*y2-PROPS.sep-PROPS.ledwid,
            PROPS.corner[0]+PROPS.hlen*x1,
            PROPS.corner[1]+PROPS.vlen*y2-PROPS.sep,
            PROPS.corner[0]+PROPS.hlen*x1-PROPS.ledwid,
            PROPS.corner[1]+PROPS.vlen*y2-PROPS.sep-PROPS.ledwid,
            PROPS.corner[0]+PROPS.hlen*x1-PROPS.ledwid,
            PROPS.corner[1]+PROPS.vlen*y1+PROPS.sep+PROPS.ledwid,
        ]);
    }
}