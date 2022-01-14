export async function main(ns) {
    // const args = ns.flags([["help", false]]);
    // if (args.help) {
    //     ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
    //     ns.tprint(`Usage: run ${ns.getScriptName()}`);
    //     ns.tprint("Example:");
    //     ns.tprint(`> run ${ns.getScriptName()}`);
    //     return;
    // }
    
    //const doc = document; // This is expensive! (25GB RAM) Perhaps there's a way around it? ;)

    const doc = eval('document');



    //Number of lines rendered
    const resolution = 50;
    //Delay between data gathered in seconds
    const delay = 10;

    const textSize = 7.5;

    const lineColor = "green";



    const strokeWidth = 1;

    const conWidth = 100;
    const conHeight = 80;
    const wBuffer = 1;
    const hBuffer = 5;

    

	var container = doc.getElementById('graph_container');
    ns.atExit(function() {KillChildren(container); container.remove();});

	if (container != null) {
        KillChildren(container);
        container.remove();
    }

    const dropPage = doc.getElementById('overview-extra-hook-0').parentElement.parentElement.parentElement.parentElement.parentElement;
    
    container = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const containerAttr = [["viewBox","0 0 " + conWidth + " " + conHeight],["xmlns", "http://www.w3.org/2000/svg"],["id", "graph_container"]];
    AddAttr(container, containerAttr);
    dropPage.appendChild(container);


    const uiThickness = .1;

    var topLine = doc.createElementNS('http://www.w3.org/2000/svg', 'line');
    AddAttr(topLine, [["x1",String(wBuffer)], ["y1",String(hBuffer)], ["x2",String(conWidth - wBuffer)], ["y2",String(hBuffer)], ["stroke","lightgrey"], ["stroke-width",String(uiThickness)]]);
    container.appendChild(topLine);

    var midLine = doc.createElementNS('http://www.w3.org/2000/svg', 'line');
    AddAttr(midLine, [["x1",String(wBuffer)], ["y1",String(conHeight/2)], ["x2",String(conWidth - wBuffer)], ["y2",String(conHeight/2)], ["stroke","lightgrey"], ["stroke-width",String(uiThickness)]]);
    container.appendChild(midLine);

    var botLine = doc.createElementNS('http://www.w3.org/2000/svg', 'line');
    AddAttr(botLine, [["x1",String(wBuffer)], ["y1",String(conHeight - hBuffer)], ["x2",String(conWidth - wBuffer)], ["y2",String(conHeight - hBuffer)], ["stroke","lightgrey"], ["stroke-width",String(uiThickness)]]);
    container.appendChild(botLine);


    var lines = [];
    for (var i = 0; i < (resolution - 1); i++) {
        lines[i] = doc.createElementNS('http://www.w3.org/2000/svg', 'line');
	    //AddAttr(lines[i], [["x1","0"], ["y1","60"], ["x2","100"], ["y2","0"], ["stroke","green"], ["stroke-width","1"]]);
        AddAttr(lines[i], [["x1","0"], ["y1","0"], ["x2","0"], ["y2","0"], ["stroke",lineColor], ["stroke-width",String(strokeWidth)]]);
        container.appendChild(lines[i]);
    }

    var topText = CreateText("test", wBuffer, hBuffer + (hBuffer/2), container, doc, textSize);
    var topTextBG = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
    HighlightText(topTextBG, topText, container);

    var midText = CreateText("test", wBuffer, (conHeight/2) + (hBuffer/2), container, doc, textSize);
    var midTextBG = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
    HighlightText(midTextBG, midText, container);

    var botText = CreateText("test", wBuffer, conHeight - (hBuffer/2), container, doc, textSize);
    var botTextBG = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
    HighlightText(botTextBG, botText, container);


    var values = [];
    while (true) {
        try {
            if (values.length == resolution) {
                values.splice(0, 1);
            }
            values[values.length] = ns.getPlayer().money;

            if (values.length > 2) {
                var lineCount = values.length-2;
                var xOff = (conWidth-(wBuffer*2))/(lineCount);
                
                var moneyList = [];

                for (var i = 0; i < values.length - 1; i++) {
                    moneyList[i] = (values[i+1] - values[i]);
                }

                var highestVal = moneyList[0];
                var lowestVal = moneyList[0];
                
                for (var i in moneyList) {
                    if (moneyList[i] > highestVal) {
                        highestVal = moneyList[i];
                    }
                    if (moneyList[i] < lowestVal) {
                        lowestVal = moneyList[i];
                    }
                }

                highestVal = highestVal-lowestVal;

                for (var i in moneyList) {
                    if (highestVal != lowestVal) {
                        moneyList[i] = (moneyList[i] - lowestVal)/highestVal;
                    } else {
                        moneyList[i] = .5;
                    }
                    
                }

                for (var i = 0; i < lineCount; i++) {
                    var temp = String(conHeight-((moneyList[i] * (conHeight - (hBuffer*2))) + hBuffer));
                    if (temp == NaN) {
                        ns.tprint("Uh oh NAN:");
                        ns.tprint(moneyList);
                    } 

                    var attr = [["x1",String((i * xOff) + wBuffer)],["y1",String(conHeight-((moneyList[i] * (conHeight - (hBuffer*2))) + hBuffer))],["x2",String(((i+1)*xOff) + wBuffer)],["y2",String(conHeight-((moneyList[i+1] * (conHeight - (hBuffer*2))) + hBuffer))]];
                    AddAttr(lines[i], attr);
                }

                topText.innerHTML = ns.nFormat((highestVal + lowestVal)/delay, "$0.00a") + "/sec"
                HighlightText(topTextBG, topText, container);

                midText.innerHTML = ns.nFormat(((highestVal/2) + lowestVal)/delay, "$0.00a") + "/sec"
                HighlightText(midTextBG, midText, container);

                botText.innerHTML = ns.nFormat(lowestVal/delay, "$0.00a") + "/sec"
                HighlightText(botTextBG, botText, container);
            }

            // Now drop it into the placeholder elements
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(delay * 1000);
    }
}

function AddAttr (element, attrList) {
	for (var i in attrList) {
        element.setAttribute(attrList[i][0], attrList[i][1]);
    }
}

function KillChildren (element) {
    const children = element.children
    for (var line of children) {
        line.remove();
    }
}

function CreateText (text, x, y, parent, doc, textSize) {
    var textElm = doc.createElementNS('http://www.w3.org/2000/svg', 'text');
    AddAttr(textElm, [["x",String(x)], ["y",String(y)], ["fill","lightgrey"],["font-size",String(textSize)],["font-family","sans-serif"], ["stroke","black"], ["stroke-width","0"]]);
    textElm.innerHTML = text;
    parent.appendChild(textElm);
    return textElm;
}

function HighlightText (bg, text, parent) { 
    var textBox = text.getBBox();

    AddAttr(bg, [["x",String(textBox.x)],["y",String(textBox.y)],["width",String(textBox.width)],["height",String(textBox.height)],["fill","black"],["opacity","0.6"]]);
    parent.insertBefore(bg, text);
}