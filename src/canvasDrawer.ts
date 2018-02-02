/// <reference path="../node_modules/@types/easeljs/index.d.ts" />

import * as $ from "jquery";
import { ILine, ScorePage } from "./models";
import { ToolController } from "./tools";

$(document).ready(() => {
    const navBar = $("#navBar");

    const optionsDiv = $("<div>");
    navBar.append(optionsDiv);

    // Add interface things
    const toolCont = new ToolController();
    navBar.append(toolCont.toolDiv);

    const something = PDFJS.getDocument("./pdfs/Bye-Bye-Birdie-Full-Score-Vol-1.pdf")
        .then((pdf) => {
            console.log("Processed PDF");
            pdf.getPage(1).then((page) => {
                const sp = new ScorePage(page);
                const leftScore = $("#leftScore");
                leftScore.append(sp.scoreWrapper);

                sp.resize(leftScore.width(), leftScore.height());
                $(window).resize(() => {
                    console.log("Resizing!");
                    sp.resize(leftScore.width(), leftScore.height());
                });
                toolCont.addScorePage(sp);

                console.log("Processed page");
            });
            pdf.getPage(2).then((page) => {
                const sp = new ScorePage(page);
                const rightScore = $("#rightScore");
                rightScore.append(sp.scoreWrapper);

                sp.resize(rightScore.width(), rightScore.height());
                $(window).resize(() => {
                    console.log("Resizing!");
                    sp.resize(rightScore.width(), rightScore.height());
                });

                console.log("Processed page");
            });
        });
});
