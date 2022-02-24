import * as commonFunctions from "./modules/functions.js";
import { initAccordeon } from "./modules/accordion.js";

initAccordeon("#accordionExpandAll", ["panel1", "panel2"], true);
initAccordeon("#accordionExpandOne", ["panel3"], false);

commonFunctions.isWebp();