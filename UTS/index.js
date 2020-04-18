const electron = require("electron");
const { v4 : uuidv4 } = require('uuid');
uuidv4();

const {
    app, 
    BrowserWindow, 
    Menu, 
    ipcMain
} = electron;

let todayWindow;
let createWindow;
let listWindow;
let profilWindow;

let allApointment = [];

app.on("ready", () => {
    todayWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }, 
        title : "Rental Mobil"
    });

    todayWindow.loadURL(`file://${__dirname}/today.html`);
    todayWindow.on("closed", () => {

        app.quit();
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

const listWindowCreator = () => {
    listWindow = new BrowserWindow ({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Order Data"
    });

    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("closed", ()  => (listWindow = null));
};
const createWindowCreator = () => {
    createWindow = new BrowserWindow ({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Order"
    });

    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("closed", ()  => (createWindow = null));
};

const profilWindowCreator = () =>
    {
        profilWindow = new BrowserWindow
        ({
            webPreferences:{
                nodeIntegration: true
            },
            width: 600,
            height: 400,
            title: "Profil"
        });

        profilWindow.setMenu(null);
        profilWindow.loadURL(`file://${__dirname}/profil.html`);
        profilWindow.on("closed", () => (profilWindow = null));
    };


ipcMain.on("appointment:create", (event, appointment) => {
    appointment["id"] = uuidv4();
    appointment["done"] = 0;
    allApointment.push(appointment);

    createWindow.close();

    console.log(allApointment);
});

ipcMain.on("appointment:request:list", event => {
    listWindow.webContents.send('appointment:response:list', allApointment);
});

ipcMain.on("appointment:request:today", event => {
    console.log("here2");
});

ipcMain.on("appointment:done", (event, id) => {
    console.log("here3");
});




const menuTemplate = [{
    label: "Pesan",
    submenu: 
        [
            {
                label: "Order Here",

                click(){
                createWindowCreator();
            }

            },
            { 
                label:"Order Data", 
                click(){
                listWindowCreator();
                }
            },
            {
                label:"Quit",
                accelerator: process.platform ==="darwin" ? "Command+Q":
                "Ctrl +Q",
                click(){
                app.quit();
                }
            }
        ]
    },
    {

        label:"View",
        submenu: [{ role: "reload "}, { role: "toggledevtools"}]

    },
    {
        label:"profil",
        click()
        {
            profilWindowCreator();
        }
    }
]