/// <reference path="../node_modules/@types/easeljs/index.d.ts" />

import * as $ from "jquery";
import { line, ScorePage } from "./models";
// import { PDFJSStatic } from 'pdfjs-dist';

// const $ = jQuery;
$(document).ready(() => {
    const navBar = $("#navBar");

    let optionsDiv = $("<div>");
    navBar.append(optionsDiv);

    // Add interface things

    // let devDiv = $("<div>");
    // navBar.after(devDiv);

    let colorDiv = $("<div>").html("Colors: ");
    optionsDiv.append(colorDiv);
    let sizeDiv = $("<div>").html("Sizes: ");
    optionsDiv.append(sizeDiv);
    let otherOptionsDiv = $("<div>");
    optionsDiv.append(otherOptionsDiv);

    colorDiv.append(buildButton("Black", () => changeColor("Black")));
    colorDiv.append(buildButton("Blue", () => changeColor("Blue")));

    sizeDiv.append(buildButton("Small", () => changeSize(2)));
    sizeDiv.append(buildButton("Normal", () => changeSize(5)));
    sizeDiv.append(buildButton("Large", () => changeSize(8)));

    // Interface Functions
    let currentColor: string = "black";
    let currentSize: number = 5;

    function changeColor(color: string) {
        currentColor = color;
    }

    function changeSize(size: number) {
        currentSize = size;
    }

    function buildButton(text: string, functionToCall: JQuery.EventHandler<HTMLElement, null>): JQuery<HTMLElement> {
        return $("<button>")
            .html(text)
            .click(functionToCall);
    }

    // function updateStage() {
    //     stage.update();
    //     // devDiv.html(JSON.stringify(lines));
    // }


    var something = PDFJS.getDocument("./pdfs/Bye-Bye-Birdie-Full-Score-Vol-1.pdf")
        .then(pdf => {
            console.log("Processed PDF");
            pdf.getPage(1).then(page => {
                console.log("Processed page");
                let sp = new ScorePage(page);
                let leftScore = $("#leftScore");
                leftScore.append(sp.scoreWrapper);

                sp.resize(leftScore.width(), leftScore.height());
                $(window).resize(() => {
                    console.log("Resizing!")
                    sp.resize(leftScore.width(), leftScore.height());
                })
            })
            pdf.getPage(2).then(page => {
                console.log("Processed page");
                let sp = new ScorePage(page);
                let rightScore = $("#rightScore");
                rightScore.append(sp.scoreWrapper);

                sp.resize(rightScore.width(), rightScore.height());
                $(window).resize(() => {
                    console.log("Resizing!")
                    sp.resize(rightScore.width(), rightScore.height());
                })
            })
        });
});