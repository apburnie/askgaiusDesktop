import app from "./app" 

import Alpine from 'alpinejs'
 
//@ts-ignore
window.Alpine = Alpine
 
Alpine.start()

let main = document.createElement("div");

main.innerHTML = app;

let root = document.getElementById("app");
root!.appendChild(main)
