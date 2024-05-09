import { showAnalogClock } from "./analogclock.js";
import { showDigitalClock } from "./digitalclock.js";
import { showDigitalClock2 } from "./digitalclock2.js";

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
    // Attach 2nd version of digital clock to the element having id="cd2"
    try {
        const attribs = {
            backgroundColor: "lime"  // TODO
        }
        showDigitalClock2("cd2", 500, 150, attribs);
    } catch (error) {
        console.log('error attempting to attached to id=cd2');
        console.log('error = ' + error);
    }
}

let pageDate = null;
let localDateTime = null;
let zuluTime = null;
const updElem = document.getElementById("upd");
const defaultUpdColor = updElem.style.color;
const emphaticUpdColor = "#ebeb89";

function updateDate() {
    
    zuluTime = updElem.innerText;
    pageDate = new Date(updElem.innerText);
    if (pageDate) {
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
        const localDate = pageDate.toLocaleDateString(undefined,dateOptions);
        const timeOptions = {
            hour12: true,
            hour: "numeric",
            minute: "2-digit"
        }
        const localTime = pageDate.toLocaleTimeString([], timeOptions);
        const hourOffset = -pageDate.getTimezoneOffset()/60;
        const gmtOffset = "(GMT" + (hourOffset>=0?"+":"") + hourOffset + ")";
        localDateTime = localDate + " - " + localTime + " " + gmtOffset;
        const updElem = document.getElementById("upd");
        updElem.innerText = localDateTime;
        updElem.addEventListener("mouseover",()=>{
            setTimeout(()=>{
                updElem.innerText = zuluTime;
                updElem.style.color = emphaticUpdColor;
                setTimeout(()=>{
                    updElem.style.color = defaultUpdColor;
                },6000);
            },300);
        });
        updElem.addEventListener("mouseout",()=>{
            setTimeout(()=>{
                updElem.innerText = localDateTime;
                updElem.style.color = emphaticUpdColor;
                setTimeout(()=>{
                    updElem.style.color = defaultUpdColor;
                },6000);
            },1500);
        });
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
