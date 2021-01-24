const fs = require('fs');
const dateFormat = require('dateformat');
const log = "log//";
const date = dateFormat(new Date(), "dd-mm-yyyy"); // Tarih
const time = dateFormat(new Date(),"h:MM:ss TT") // Saat
var i = 0;


console.log(i);

// var bugun = fs.readFileSync(log+date,'utf-8');
// console.log(bugun);