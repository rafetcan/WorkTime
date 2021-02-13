const electron = require('electron')
const { ipcRenderer, ipcMain } = electron;
var win = electron.remote.getCurrentWindow();
const shell = require('electron').shell;
let $ = require('jquery');

var myTimer, i = 0, veriGndrTimer = 0, sonuc, _dev = false;
var versionTimer = 0,timerController = false;
var version = "0.1.16";

setInterval(() => {
    if (versionTimer == 0){
        versionTimer = 1;
        $('#version').html("Beta");
    }
    else{
        versionTimer = 0;
        $('#version').html(version);
    }
}, 2000);

$('#durdurBtn').hide();
$('#timerID').hide();
$('#hataAlani').hide();


    // Ayarlar 
        
    $('#sifirla').click(()=>{
        $("#durdur").trigger("click");
        ipcRenderer.send('sifirla');
    })


    $('#arti10').click(()=>{
        $("#durdur").trigger("click");
        ipcRenderer.send('artı10');
    })

    $('#arti30').click(()=>{
        $("#durdur").trigger("click");
        ipcRenderer.send('artı30');
    })

    $('#arti60').click(()=>{
        $("#durdur").trigger("click");
        ipcRenderer.send('artı60');
    })

    $('#eksi10').click(()=>{
        $("#durdur").trigger("click");
        ipcRenderer.send('eksi10');
    })

    $('#eksi30').click(()=>{
        $("#durdur").trigger("click");
        ipcRenderer.send('eksi30');
    })

    $('#eksi60').click(()=>{
        $("#durdur").trigger("click");
        ipcRenderer.send('eksi60');
    })

    // Ayarlar End



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
    timerController = true;
    $('#timerID').show();
    $('#bsltBtn').hide();
    $('#durdurBtn').show();
    ipcRenderer.send('bslt');
})


$('#durumBtn').click(() => {
    $('.hataMesaji').html('Bu kısım henüz eklenmedi.');
    $('#hataAlani').show();
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
    timerController = false;
    $('#bsltBtn').show();
    $('#durdurBtn').hide();
    $('#timerID').hide();
    ipcRenderer.send('myWork:durdur');
    console.log('Zamanlama Durduruldu.')
})

$('#dev').hide();

$('#devBtn').click(() => {
    if(timerController == true){
        if(_dev == true){
            _dev = false;
            $('#baslik').html('WorkTime')
            $('#menu').show();
            $('#dev').hide();
        }
        else{
            _dev = true;
            $('#baslik').html('Ayarlar')
            $('#menu').hide();
            $('#dev').show();
        } 
    }
    else{
        $('.hataMesaji').html('Önce Çalışmaya Başlamalısın.');
        $('#hataAlani').show();
        // alert('Önce Timeri Başlatmalısın')
    }
})





$('.alert-close').click(()=>{$('#hataAlani').hide()})

$('#footerLink').click(()=>{shell.openExternal("http://www.rafethokka.com")});

$('#minimize').click(() => {win.minimize();})

$('#maximize').click(() => {
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
    console.log(win.isMaximized());
})


$('#closed').click(() => {
    // Timer Hatası #Fixed2
    $('#bsltBtn').show();
    $('#durdurBtn').hide();
    $('#timerID').hide();
    ipcRenderer.send('myWork:durdur');
    console.log('Zamanlama Durduruldu.')
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
