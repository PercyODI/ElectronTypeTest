// import {ITool} from "./ITool"
import * as shortid from "shortid";

class FreeDrawTool implements ITool {
    public id: string;
    public toolName = "Free Draw Tool";

    /**
     *
     */
    constructor() {
        this.id = shortid.generate();
    }

    public getUI() {
        return $("<div>");
    }
}

export { FreeDrawTool };
