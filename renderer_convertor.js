// This file is required by the convertor.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {ipcRenderer} = require('electron');

document.getElementById("backHome").addEventListener("click",evt=>{
    ipcRenderer.send("back_to_main_page");
});
