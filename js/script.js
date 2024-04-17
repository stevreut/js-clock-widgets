import { showAnalogClock } from "./analogclock.js";
import { showDigitalClock } from "./digitalclock.js"

window.addEventListener("load", (event) => {
    startClock();
    alterHeading();
})

function startClock() {
    setInterval(()=>showAnalogClock("ca"), 100);
    setInterval(()=>showDigitalClock("cd"), 200);
}

function alterHeading() {
    let h2Elems = document.getElementsByTagName("h2");
    if (h2Elems && h2Elems.length > 0) {
        let firstH2 = h2Elems[0];
        let dateStr = (new Date()).toString().trim();
        if (dateStr.endsWith(")")) {
            let idx = dateStr.lastIndexOf("(");
            let zoneStr = dateStr.substring(idx);
            firstH2.innerText += ("  " + zoneStr);
        }
    }
}