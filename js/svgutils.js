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
function setAtts(elem, atts) {
    for (let key in atts) {
        // Replace all '$' with '-' when determining attribute name.
        // since attribute names can contain dashes but object
        // properties cannot contain dashes, users of setAtts() must
        // use a '$' instead of a '-' in property names to indicate
        // a '-' in the resulting attribute name.  e.g. when an
        // attribute of 'stroke-width' is desired, the property 
        // given in the 'atts' parameter object would be 'stroke$width'.
        elem.setAttribute(key.replaceAll(/\$/g, "-"), atts[key]);
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
    let attribsObj = {
        cx: CLOCK_DIMS.ctr, cy: CLOCK_DIMS.ctr, r: radius, fill: colr
    }
    if (id) {
        attribsObj.id = id;
    }
    return makeSvgElem(svgParent, "circle", attribsObj);
}

export { makeSvgCenteredCircle, makeSvgElem, makeSvgLine, setAtts, setDims }