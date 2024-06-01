import { makeSvgElem } from "../js/svgutils.js";

const FRAMEW = 500;
const FRAMEH = 800;
const RECTCOLR = "#00a";
const RECTWID = 2.5;
const RECTSTYL = "round";
const LINECOLR = "#aac";
const CORE_CIRC_COLR = "rgba(128,200,128,0.4)";

let offset = 100;
let ledLen = 300;

let coreBigRadius = ledLen*Math.sqrt(0.5);

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
                })
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
        }
        anch.appendChild(svgRoot);
    } else {
        console.log('no svgdiv ID found');
    }
}