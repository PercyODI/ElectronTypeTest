/// <reference path="../node_modules/@types/easeljs/index.d.ts" />

import * as $ from "jquery";
import { ILine, ScorePage } from "./models";
import { ToolController } from "./tools";
import { remote } from "electron";
import * as fs from "fs";

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
                doTheThing(pdf, 1);
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
                        toolCont.updateScorePages();
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
                        toolCont.updateScorePages();
                    });
                    console.log("Processed page");
                });
            });
    });

});

function doTheThing(pdf: PDFDocumentProxy, pageNum: number) {
    const pageCount = pdf.numPages;
    if (pageNum > pageCount) { return; }
    pdf.getPage(pageNum).then((page) => {
            console.log("Starting page " + pageNum);
            const viewport = page.getViewport(2);

            const pdfJqCanvas = $("<canvas>");
            const pdfCanvas = (pdfJqCanvas.get(0) as HTMLCanvasElement);
            const canvasContext = pdfCanvas.getContext("2d");

            pdfCanvas.height = viewport.height;
            pdfCanvas.width = viewport.width;

            page.render({
                canvasContext,
                viewport,
            }).then(() => {
                const stringg = pdfCanvas.toDataURL();
                const data = stringg.replace(/^data:image\/png;base64,/, "");
                fs.writeFileSync(`C:\\test\\${pageNum}.png`, data, "base64");
                console.log("Finished page " + pageNum + " of " + pageCount);
                doTheThing(pdf, pageNum + 1);
            });
        });
}