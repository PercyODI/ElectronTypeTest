import { AbstractTool } from ".";
import * as $ from "jquery";

class FreeDrawTool extends AbstractTool {
    public toolName = "Free Draw Tool";

    public getUI(): JQuery<HTMLElement> {
        return $("<div>").html("Free Draw UI Here");
    }
}

export { FreeDrawTool };
