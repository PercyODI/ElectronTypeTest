/// <reference path="../node_modules/@types/easeljs/index.d.ts" />

import * as $ from "jquery";
import { ILine, ScorePage } from "./models";
import { ToolController } from "./tools";
import { remote } from "electron";

$(document).ready(() => {
    const navBar = $("#navBar");

    const optionsDiv = $("<div>");
    navBar.append(optionsDiv);

    // Add interface things
    const toolCont = new ToolController();
    navBar.append(toolCont.toolDiv);

    remote.dialog.showOpenDialog({
        filters: [
            { name: "PDFs", extensions: ["pdf"] },
        ],
    }, (fileNames) => {
        console.log(`Loading: ${fileNames[0]}`);
        const something = PDFJS.getDocument(fileNames[0])
            .then((pdf) => {
                console.log("Processed PDF");
                pdf.getPage(1).then((page) => {
                    const sp = new ScorePage(page);
                    const leftScore = $("#leftScore");
                    leftScore.append(sp.scoreWrapper);

                    sp.resize(leftScore.width(), leftScore.height());

                    toolCont.addScorePage(sp);
                    $(window).resize(() => {
                        console.log("Resizing!");
                        sp.resize(leftScore.width(), leftScore.height());
                    });

                    console.log("Processed page");
                });
                pdf.getPage(2).then((page) => {
                    const sp = new ScorePage(page);
                    const rightScore = $("#rightScore");
                    rightScore.append(sp.scoreWrapper);

                    sp.resize(rightScore.width(), rightScore.height());
                    toolCont.addScorePage(sp);
                    $(window).resize(() => {
                        console.log("Resizing!");
                        sp.resize(rightScore.width(), rightScore.height());
                    });
                    console.log("Processed page");
                });
            });
    });

});
