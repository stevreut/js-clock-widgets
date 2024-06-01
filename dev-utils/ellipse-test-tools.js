import { makeSvgElem } from "../js/svgutils.js";

const FRAMEW = 500;
const FRAMEH = 800;
const RECTCOLR = "#00a";
const RECTWID = 2.5;
const RECTSTYL = "round";
const LINECOLR = "rgba(200,200,200,0.4)";
const CORE_CIRC_COLR = "rgba(128,200,128,0.4)";
const ELL_COLR = "rgba(255,200,128,0.4)";

let offset = 100;
let ledLen = 300;

let minorFraction = 0.18; 

//-------------

// See ellipse-math-notes.txt

// Recalculating majorFraction from minorFraction:

//   = sqrt(mf*(1+2*mf)/2) (from .txt calculations)

let majorFraction = Math.sqrt(minorFraction*(1+2*minorFraction)/2);
console.log('minor/major = ', minorFraction, ", ", majorFraction);

let a = ledLen*majorFraction;
let b = ledLen*minorFraction;

console.log('a, b = ', a, ', ', b);

const coreBigRadius = ledLen*Math.sqrt(0.5);

window.addEventListener("load",()=>{
    console.log("ellipse window loaded at " + (new Date()));
    makeSvgImage();
})

function makeSvgImage() {
    console.log('making SVG ... at ' + (new Date()));
    let anch = document.getElementById("svgdiv");
    if (anch) {
        console.log('found svgdiv, proceeding ...');
        let svgRoot = makeSvgElem(null, "svg", {
            width: FRAMEW, height: FRAMEH
        });
        makeSvgElem(svgRoot, "rect", {
            x: 0, y: 0, width: FRAMEW, height: FRAMEH,
            fill: RECTCOLR
        });
        let ellipseCenterX = offset+ledLen/2;
        for (let i=0;i<3;i++) {
            const y = offset+i*ledLen;
            makeSvgElem(svgRoot, "line", {
                x1: offset,
                y1: y,
                x2: offset+ledLen,
                y2: y,
                stroke: LINECOLR,
                stroke$width: RECTWID,
                stroke$linecap: RECTSTYL
            });
            makeSvgElem(svgRoot, "ellipse", {
                cx: ellipseCenterX,
                cy: y,
                rx: a,
                ry: b,
                fill: ELL_COLR
            });
        }
        for (let i=0;i<2;i++) {
            for (let j=0;j<2;j++) {
                const x = offset+i*ledLen;
                const yInit = offset+j*ledLen;
                makeSvgElem(svgRoot, "line", {
                    x1: x,
                    y1: yInit,
                    x2: x,
                    y2: yInit+ledLen,
                    stroke: LINECOLR,
                    stroke$width: RECTWID,
                    stroke$linecap: RECTSTYL
                });
                makeSvgElem(svgRoot, "ellipse", {
                    cx: x,
                    cy: yInit+ledLen/2,
                    rx: b,
                    ry: a,
                    fill: ELL_COLR
                });
            }
        }
        let centerX = offset+ledLen/2;
        for (let i=0;i<2;i++) {
            makeSvgElem(svgRoot, "circle", {
                cx: centerX,
                cy: offset+(0.5+i)*ledLen,
                r: coreBigRadius,
                fill: CORE_CIRC_COLR
            })
            makeSvgElem(svgRoot, "circle", {
                cx: centerX,
                cy: offset+(0.5+i)*ledLen,
                r: ledLen/2,
                fill: "transparent",
                stroke: "rgba(255,0,255,0.2)",
                stroke$width: 2*b
            })
        }
        anch.appendChild(svgRoot);
    } else {
        console.log('no svgdiv ID found');
    }
}