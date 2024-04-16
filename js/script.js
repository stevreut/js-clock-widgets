import { showClockNow } from "./analogclock.js";
import { showDigitalClock } from "./digitalclock.js"

window.addEventListener("load", (event) => {
    startClock();
    alterHeading();
})

function startClock() {
    setInterval(()=>showClockNow("ca"), 100);
    setInterval(()=>showDigitalClock("cd"), 200);
}

function alterHeading() {
    let h1Elems = document.getElementsByTagName("h1");
    if (h1Elems && h1Elems.length > 0) {
        let firstH1 = h1Elems[0];
        let dateStr = (new Date()).toString().trim();
        if (dateStr.endsWith(")")) {
            let idx = dateStr.lastIndexOf("(");
            let zoneStr = dateStr.substring(idx);
            firstH1.innerText += ("  " + zoneStr);
        }
    }
}