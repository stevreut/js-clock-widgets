// function hexOf(x) {
//     if (x < 0 || x > 15) {
//         console.log('overriding out-of-range hex digit');
//         return "0";
//     } else {
//         return "0123456789abcdef"[x];
//     }
// }
// function toHex2(x) {
//     let a = Math.floor(x/16);
//     let b = x-a*16;
//     let res = hexOf(a);
//     res += hexOf(b);
//     return res;
// }
// function randomBackgroundColor() {
//     let str = "#";
//     for (let i=0;i<3;i++) {
//         str += toHex2(Math.floor(Math.random()*35+172));
//     }
//     return str;
// }
// function randCoords() {
//     let theta = Math.PI*2*Math.random();
//     let sn = Math.sin(theta);
//     let cs = Math.cos(theta);
//     let len = Math.sqrt(Math.random()*0.4+0.1)*CLOCKRADIUS;
//     return [rnd2(cs*len+CLOCKCTR),rnd2(sn*len+CLOCKCTR)];
// }
// function putDot() {
//     if (!svgElem) {
//         svgElem = setUpClock();
//     }
//     let dtE = document.getElementById("dot");
//     if (dtE) {
//         dtE.remove();
//     }
//     let arXy = randCoords();
//     let dotElem = makeSvgElem(svgElem, "circle", {
//         id: "dot", cx: arXy[0], cy: arXy[1], r: 20, fill: randomBackgroundColor()
//     });
// }