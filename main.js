const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs');
const dateFormat = require('dateformat');
const log = "log//";
const date = dateFormat(new Date(), "dd-mm-yyyy"); // Tarih
const time = dateFormat(new Date(), "h:MM:ss TT") // Saat
var liste = [];
var i = 0;
var bugununDosyası;
var myTimer;


try {
  fs.mkdir(log, () => {
    console.log('Klasör Oluşturuldu.')
  })
} catch (error) {
  console.log(error);
}

// Fonksiyonlar
dosyaKontrol();

function dosyaKontrol() {
  if (!fs.existsSync(log + date)) { // bugunun dosyası varsa
    console.log('Bugün Çalışma Yapılmamış..!' + time);
    //
    dosyaOlusturma("0"); // Dosyamızı oluşturuyoruz.
  }
  else { // yoksa
    dosyalariListele(); // bulunan dosyaları listele
    bugununDosyası = parseInt(fs.readFileSync(log + date, 'utf-8')); // bugunun dosyanısı değişkene aata.
    console.log(bugununDosyası);
    console.log("suan Saat : " + time + " Bugun calısma Yapilmis..\nListe Hazırlanıyor!");
  }
}

function dosyaOlusturma(data) {
  fs.writeFile(log + date, data, (err, data) => {
    if (err) throw err;
    console.log('Veri Yazıldı.');
    dosyaKontrol();
  })
}

function dosyalariListele() {
  fs.readdir('log/', (err, files) => {
    if (err) throw err;
    for (var file of files) {
      liste.push(file + "<button id='" + file + "' class='btn btn-primary'>Detaylar</button><br>");
      console.log("Bulunan Dosyalar : " + file);
    }
  })
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    title: 'WorkTime',
    width: 400,
    height: 500,
    center: true,
    icon: path.join(__dirname, 'assets/favicon.png'),
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // mainWindow.webContents.openDevTools(); // Developer Zamazingosu

  mainWindow.loadFile('index.html')
  // Dosya Kontrolümüz Yapalım.

  ipcMain.on('bslt', () => {
    myTimer = setInterval(() => {
      bugununDosyası++;
      i++;
      mainWindow.webContents.send('myWork', bugununDosyası);
      console.log(bugununDosyası);
      if (i == 5) {
        // Veriyi YazdırDiyeceğiz
        fs.writeFileSync(log + date, bugununDosyası);
        i = 0;
      }
    }, 1000);
  })

  ipcMain.on('myWork:durdur', (e) => {
    clearInterval(myTimer);
    console.log('Zamanlama Durduruldu.')
  })


  ipcMain.on("durum:sorgu", (err, data) => {
    console.log('Durum Sorgulanması Gönderiliyor!\n' + data);
    mainWindow.webContents.send("durum:sonuc", liste + "<br>");
  })



  ipcMain.on('bslt:art', (err, data) => {
    parseInt(data);
    bugununDosyası += data;
    fs.writeFileSync(log + date, bugununDosyası);
    mainWindow.webContents.send('myWork', bugununDosyası);
    console.log(bugununDosyası);
  })




  ipcMain.on("key", (err, data) => {
    console.log(data);
    mainWindow.webContents.send("test:msj", data)
  })
}



app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})



