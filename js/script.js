import { showAnalogClock } from "./analogclock.js";
import { showDigitalClock } from "./digitalclock.js"

window.addEventListener("load", (event) => {
    // Upon loading the page ...
    updateDate();
    alterHeading();

    //**************
    startClocks();
    //**************

});

function startClocks() {
    // Attach an analog clock to the element having id="ca".
    showAnalogClock("ca");
    // Attach a digital clock to the element having id="cd".
    showDigitalClock("cd");
}

function updateDate() {
    const updElem = document.getElementById("upd");
    if (updElem) {
        const pageDateStr = updElem.innerText;
        console.log('retrieved date = "' + pageDateStr + '"');
        const pageDate = new Date(pageDateStr);
        console.log('as date = "', pageDate, '"');
        if (pageDate) {
            let localDateStr = pageDate.toLocaleString();
            if (localDateStr) {
                localDateStr = localDateStr.trim();
                if (localDateStr && localDateStr.length > 0) {
                    updElem.innerText = localDateStr;
                }
            }
        }
    }
}

function alterHeading() {
    // Find FIRST h2 element and alter its text by
    // adding the parenthetical time zone description from
    // the current date's string representation
    let h2Elems = document.getElementsByTagName("h2");
    // h2Elems is an array of all h2 elements.  We are only
    // changing the first such element.
    if (h2Elems && h2Elems.length > 0) {
        let firstH2 = h2Elems[0];  // First h2
        let dateStr = (new Date()).toString().trim();
        if (dateStr.endsWith(")")) {
            // IF the string representation of the date and time ends
            // with a parenthesis then we assume it is the timezone
            // description stated between parentheses.  Thus, we look for
            // the preceding '(' character and extract the substring
            // between '(' and ')'.
            let idx = dateStr.lastIndexOf("(");
            let zoneStr = dateStr.substring(idx);
            // The extracted time zone description is then appended to 
            // the pre-existing content of the first h2 element.
            firstH2.innerText += ("  " + zoneStr);
        }
    }
}
