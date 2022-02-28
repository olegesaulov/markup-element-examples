import * as commonFunctions from "./modules/functions.js";
import { Modal } from "./modules/modal.js";

const modal = new Modal({
    title: "Modal Title",
    content: `
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae provident ab adipisci recusandae. Iste aut, earum repudiandae velit, quam, fuga ex voluptate dolorem nulla eligendi non aliquam quae eveniet cumque!</p>
    `,
    closable: true,
    width: '400px',
    buttons: [
        {
            title: "OK",
            className: "modal__btn--ok",
            onClick: () => {
                modal.close();
            },
        },
        {
            title: "Cancel",
            className: "modal__btn--cancel",
            onClick: () => {
                modal.close();
            },
        },
    ],
    onOpen() {
        console.log('onOpen');
    },
    onClose() {
        console.log('onClose');
    },
});
window.m = modal;

const showModalBtn = document.querySelector("#showModalBtn");
showModalBtn.addEventListener("click", () => modal.open());

commonFunctions.isWebp();