const electron = require ("electron");
const { v4: uuidv4 } = require ('uuid');
const 
{
    app, 
    BrowserWindow, 
    Menu, 
    ipcMain
} = electron;

let todayWindow;
let createWindow;
let listWindow;

let allAppointment = [];

app.on("ready", () => {
    todayWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration : true
        },
        title : "Aplikasi Dokter"
    });

    todayWindow.loadURL(`file://${__dirname}/today.html`);
    todayWindow.on("closed", () => {

        app.quit();
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
    
});

const listWindowCreator = () =>
    {
        listWindow = new BrowserWindow
        ({
            webPreferences:{
                nodeIntegration: true
            },
            width: 600,
            height: 400,
            title: "All Appointments"
        });

        listWindow.setMenu(null);
        listWindow.loadURL(`file://${__dirname}/list.html`);
        listWindow.on("closed", () => (listWindow = null));
    };

const createWindowCreator = () =>
    {
        createWindow = new BrowserWindow
        ({
            webPreferences:{
                nodeIntegration: true
            },
            width: 600,
            height: 400,
            title: "Create Appointment"
        });

        createWindow.setMenu(null);
        createWindow.loadURL(`file://${__dirname}/create.html`);
        createWindow.on("closed", () => (createWindow = null));
    };

ipcMain.on("appointment:create", (event, appointment) => {
    appointment["id"] = uuidv4();
    appointment["done"] = 0;
    allAppointment.push(appointment);

    createWindow.close();

    console.log(allAppointment);
});

ipcMain.on("appoinment:request:list", event => {
    console.log("here");
});

ipcMain.on("appoinment:request:today", event => {
    console.log("here2");
});

ipcMain.on("appointment:done", (event, id) => {
    console.log("here3");
})

const menuTemplate = [{
    label: "File",
    submenu: 
        [
            {
                label: "New Appointment",

                click(){
                createWindowCreator();
            }

            },
            { 
                label:"All Appoinment", 
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
        label:"About",
        click()
        {
            aboutWindowCreator();
        }
    }
]
