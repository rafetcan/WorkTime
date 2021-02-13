const { app, BrowserWindow, ipcMain, ipcRenderer, dialog, Notification } = require('electron')
const path = require('path')
const fs = require('fs');
const dateFormat = require('dateformat');
const log = "log//";
const date = dateFormat(new Date(), "dd-mm-yyyy"); // Tarih
const time = dateFormat(new Date(), "h:MM:ss TT") // Saat
var liste = [];
var i = 0;
var bugununDosyası;
var myTimerVar, myTimer,timerController = false;


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
    width: 425,
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

  function myTimer() {
    bugununDosyası++;
    i++;
    mainWindow.webContents.send('myWork', bugununDosyası);
    console.log(bugununDosyası);
    if (i == 5) {
      // Veriyi YazdırDiyeceğiz
      fs.writeFileSync(log + date, bugununDosyası);
      i = 0;
    }
    if (bugununDosyası >= 86400){
      hataTimer();
    }
  }

  function hataTimer() {
    clearInterval(myTimerVar);
    const options = {
      type: 'error',
      defaultId: 2,
      title: 'Hata',
      message: 'Kafam Karıştı bir günde 24 saat yokmuydu??????',
      detail: 'Uygulamayı bi kapatıp açalım bakalım. 5 sn sonra kapatıyorum sen tekrar açarsın',
    };
  
    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      console.log(response);
      console.log(checkboxChecked);
    });
    fs.writeFileSync(log+date,0);
    // alert('Kafam Karıştı bir günde 24 saat yokmuydu??????')
    // alert('Uygulamayı bi kapatıp açalım bakalım. 5 sn sonra kapatıyorum sen tekrar açarsın');
    setTimeout(() => {
      app.quit();
      app.relaunch();
    }, 500);
  }


  ipcMain.on('bslt', () => {
    if(timerController == false){
      timerController = true;
      myTimerVar = setInterval(myTimer,1000);
    }
  })

  ipcMain.on('myWork:durdur', (e) => {
    if(timerController == true){
      timerController = false;
      clearInterval(myTimerVar);
      console.log('Zamanlama Durduruldu.')
    }
  })

  ipcMain.on("durum:sorgu", (err, data) => {
    console.log('Durum Sorgulanması Gönderiliyor!\n' + data);
    mainWindow.webContents.send("durum:sonuc", liste + "<br>");
  })


  // Ayarlar Başlangıç
  function zamanEkle(dk) {
    clearInterval(myTimerVar);
    if(dk == 0){
      bugununDosyası = 0;
      console.log('Süre Sıfırlandı ve Timer Başlatıldı...!');
    }
    else{
      bugununDosyası =  bugununDosyası + dk * 60;
      console.log(dk+' Dakika Eklendi ve Timer Başlatıldı...!');
    }
    if(bugununDosyası < 0){
      bugununDosyası = 0;
      console.log('Zaman - Olamaz!')
    }
    setTimeout(() => {
      fs.writeFileSync(log+date,bugununDosyası);
    }, 100);
    myTimerVar = setInterval(myTimer,1000);
  }

  ipcMain.on("sifirla",()=>{
    zamanEkle(0);
  })

  ipcMain.on("artı10",()=>{
    zamanEkle(10);
  })

  ipcMain.on("artı30",()=>{
    zamanEkle(30);
  })

  ipcMain.on("artı60",()=>{
    zamanEkle(60);
  })


  ipcMain.on("eksi10",()=>{
    zamanEkle(-10);
  })

  ipcMain.on("eksi30",()=>{
    zamanEkle(-30);
  })

  ipcMain.on("eksi60",()=>{
    zamanEkle(-60);
  })

  // Ayalar Bitişo gülo





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