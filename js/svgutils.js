const SVG_NS = "http://www.w3.org/2000/svg";

let CLOCK_DIMS = {  // default values follow - in case setDims is not called
    size: 50,
    radius: 22,
    ctr: 25
}
function setDims(dimObj) {
    if (dimObj) {
        if (dimObj.size) {
            CLOCK_DIMS.size = dimObj.size;
        }
        if (dimObj.radius) {
            CLOCK_DIMS.radius = dimObj.radius;
        }
        if (dimObj.ctr) {
            CLOCK_DIMS.ctr = dimObj.ctr;
        }
    }
}
function setAtts(elem, atts) {  // TODO - needs improvement - maybe regex?
    for (let key in atts) {
        if (key.includes("$")) {
            let k2 = "";
            const len = key.length;
            for (let i=0;i<len;i++) {
                let ch = key.charAt(i);
                if (ch === "$") {
                    k2 += "-";
                } else {
                    k2 += ch;
                } 
            }
            elem.setAttribute(k2, atts[key]);
        } else {
            elem.setAttribute(key, atts[key]);
        }
    }
}
function makeSvgElem(svgParent, svgName, attribs) {
    let newElem = document.createElementNS(SVG_NS,svgName);
    setAtts(newElem, attribs);
    if (svgParent) {
        svgParent.appendChild(newElem);
    }
    return newElem;
}
function makeSvgLine(svgParent, id) {
    return makeSvgElem(svgParent, "line", {
        id: id, fill: "#000000"
    });
}
function makeSvgCenteredCircle(svgParent, id, radius, colr) {
    return makeSvgElem(svgParent, "circle", {
        id: id, cx: CLOCK_DIMS.ctr, cy: CLOCK_DIMS.ctr, r: radius, fill: colr
    });
}

export { makeSvgCenteredCircle, makeSvgElem, makeSvgLine, setAtts, setDims }