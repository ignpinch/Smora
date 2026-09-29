const {
  app,
  BrowserWindow,
} = require("electron");

const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow =
    new BrowserWindow({
      width: 1440,
      height: 900,
      minWidth: 900,
      minHeight: 650,

      backgroundColor:
        "#fff9f0",

      webPreferences: {
        preload:
          path.join(
            __dirname,
            "preload.cjs"
          ),

        contextIsolation: true,
        nodeIntegration: false,
      },
    });

  if (
    process.env.NODE_ENV ===
    "development"
  ) {
    mainWindow.loadURL(
      "http://localhost:5173"
    );
  } else {
    mainWindow.loadFile(
      path.join(
        __dirname,
        "../dist/index.html"
      )
    );
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on(
    "activate",
    () => {
      if (
        BrowserWindow
          .getAllWindows()
          .length === 0
      ) {
        createWindow();
      }
    }
  );
});

app.on(
  "window-all-closed",
  () => {
    if (
      process.platform !==
      "darwin"
    ) {
      app.quit();
    }
  }
);