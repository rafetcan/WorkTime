const electron = require('electron')
const { ipcRenderer, ipcMain } = electron;
var win = electron.remote.getCurrentWindow();
const shell = require('electron').shell;
let $ = require('jquery');

var myTimer, i = 0, veriGndrTimer = 0, sonuc;

$('#durdurBtn').hide();
$('#timerID').hide();
$('#durumBtn').hide();



ipcRenderer.on('myWork', (e, myWork) => {
    myWorkSncn = myWork.toString();
    if (parseInt(myWork) % 5 == 0) {
        $('#myTimer').html(myWorkSncn.toHMS() + "<span class='text-success'> * </span>");
    }
    else {
        $('#myTimer').html(myWorkSncn.toHMS());
    }
})

$('#bsltBtn').click(() => {
    $('#timerID').show();
    $('#bsltBtn').hide();
    $('#durdurBtn').show();
    ipcRenderer.send('bslt');
})


$('#durumBtn').click(() => {
    alert('Beta');
    // ipcRenderer.send('durum:sorgu'); // durum sorgula dedik
})

ipcRenderer.on('durum:sonuc', (e, durumSonuc) => {
    console.log(durumSonuc);
    document.getElementById('icerik').innerHTML = durumSonuc;
})


ipcRenderer.on("test:msj", (e, todoItem) => {
    console.log(todoItem);
    document.getElementById('icerik').innerHTML = todoItem;
})


$('#durdurBtn').click(() => {
    $('#bsltBtn').show();
    $('#durdurBtn').hide();
    $('#timerID').hide();
    ipcRenderer.send('myWork:durdur');
    console.log('Zamanlama Durduruldu.')
})





$('footer').click(()=>{
    shell.openExternal("http://www.rafethokka.com")
});

$('#minimize').click(() => {
    win.minimize();
})

$('#maximize').click(() => {
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
    console.log(win.isMaximized());
})


$('#closed').click(() => {
    // Timer Hatası
    $("#durdur").trigger("click");
    setTimeout(function() {
        win.close();
    }, 500);
})

// Saate Çevirme Functionumz
String.prototype.toHMS = function () {
    var sec_num = parseInt(this, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? minutes = "0" + minutes : minutes;
    seconds = (seconds < 10) ? seconds = "0" + seconds : seconds;
    return (hours != "00") ? hours + ' Saat ' + minutes + ' Dakika ' + seconds + " Saniye" : minutes + ' Dakika ' + seconds + " Saniye";
}
