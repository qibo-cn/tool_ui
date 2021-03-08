// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {ipcRenderer} = require('electron');

// Add click listener for ann convertor button
document.getElementById("convertor_btn").addEventListener("click",evt=>{
    ipcRenderer.send("jump_to_convertor_page");
});
document.getElementById("training_btn").addEventListener("click",evt=>{
    ipcRenderer.send("jump_to_training_page");

});