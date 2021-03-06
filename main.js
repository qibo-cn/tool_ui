// Modules to control application life and create native browser window
const {app, ipcMain, BrowserWindow,nativeTheme, dialog} = require('electron')
const path = require('path')
const diaolg = require('electron').remote;
const {exec} = require('child_process');
const axios = require('axios').default;


function sleep(numberMillis) {
  var start = new Date().getTime();
  while (true) {
    if (new Date().getTime() - start > numberMillis) {
      break;
    }
  }
}


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 780,
    height: 700,
    backgroundColor: "#212121",
    darkTheme: true,
    frame:false,
    icon:path.join(__dirname, "resources/favicon.ico"),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration:true,
      worldSafeExecuteJavaScript: true
    }
  })

  // mainWindow.webContents.openDevTools();

  // mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadFile('main_page_v2.html');
  nativeTheme.themeSource="light"; // page style dark mode

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // receive page jump message
  // ipcMain.on("jump_to_convertor_page",(evt,args)=>{
  //   console.log("Jump from main page to convertor page.");
  //   mainWindow.loadFile("ann_convt_page.html");
  //   mainWindow.setSize(1030,710);
  // });

  // ipcMain.on("back_to_main_page",(evt,args)=>{
  //   console.log("Back to main page");
  //   mainWindow.loadFile("main_page.html");
  //   mainWindow.setSize(800,600);
  // });

  ipcMain.on("main-window-minimize",(evt, args)=>{
    console.log("minimize main window...");
    mainWindow.minimize();
  });

  ipcMain.on("main-window-close",(evt,args)=>{
    console.log("close main window...");
    mainWindow.close();
  });

  ipcMain.on("jump_to_convertor_page",(evt,args)=>{
    console.log("Jumped to main page.");
    // mainWindow.loadFile("convertor_page_v2.html");
    // mainWindow.setSize(1410,690);
    
    // open vscode for extensions
    mainWindow.minimize();
    let command_str = "E:\\courses\\ZJLab\\DarwinIDEVSCode\\scripts\\code.bat"
    let scriptProcess = exec(command_str, {});
    scriptProcess.stdout.on("data", function(data){
    });
    scriptProcess.stderr.on("data", function(data){
    });
    scriptProcess.on("close", function(code,signal){
    });

    sleep(60000);
    // 定时ping 检测
    let convertor_interval_handler = setInterval(()=>{
      axios.get("http://localhost:6003/ping").then((resp)=>{
      }).catch(err=>{
        console.log("connection error!");
        // 程序已退出
        mainWindow.restore();
        clearInterval(convertor_interval_handler);
      });
    }, 300);
    
  });

  ipcMain.on("new project",(evt,args)=>{
    console.log("create new project");
    dialog.showSaveDialog(mainWindow,{
      title:"新建项目",
    }).then(function(result){
      console.log("result is "+result.filePath);
      evt.sender.send("new project save path", result.filePath); // response of save file path
    });
  });

  ipcMain.on("open project",(evt, args)=>{
    console.log("open existing project");
    dialog.showOpenDialog(mainWindow,{
      title:"选择项目文件"
    }).then(function(result){
      console.log("selected project file path :"+result.filePaths);
      evt.sender.send("opened proj path",result.filePaths);
    });
  });

  ipcMain.on("import data",(evt,args)=>{
    console.log("import data");
    dialog.showOpenDialog(mainWindow,{
      title:"选择数据",
      properties:["multiSelections"]
    }).then(function(result){
      console.log("file paths are :"+result.filePaths);
      evt.sender.send("imported data paths", JSON.stringify(result.filePaths));
    });
  });

  ipcMain.on("import model",(evt, args)=>{
    console.log("import model");
    dialog.showOpenDialog(mainWindow,{
      title: "选择模型文件"
    }).then(function(result){
      console.log("model path is :"+result.filePaths);
      evt.sender.send("imported model path", JSON.stringify(result.filePaths));
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.allowRendererProcessReuse = false;