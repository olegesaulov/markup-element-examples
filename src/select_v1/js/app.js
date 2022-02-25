import * as commonFunctions from "./modules/functions.js";
import { Select } from "./modules/select/index.js";

const select = new Select("#select", {
    placeholder: "Select a value",
    selectedId: "1",
    allowClear: true,
    data: Array(20).fill().map((_, index) => ({
        id: `${index + 1}`,
        value: `Option ${index + 1}`,
    })),
    onSelect(item) {
        console.log('onSelect', item);
    },
    onClear() {
        console.log('onClear');
    }
});

commonFunctions.isWebp();