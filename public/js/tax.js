
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("change", () => {
  let taxinfo=document.querySelectorAll(".tax-info");
   for(info of taxinfo){
    if( info.style.display!=="inline"){
    info.style.display="inline";
  }else{
    info.style.display="none";
  }
   }
});


