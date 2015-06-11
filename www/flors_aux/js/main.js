var initAPK=false;

function main() {
	document.addEventListener("deviceready", aplicacionIniciada, false); // Al inciar la app
	document.addEventListener("pause", aplicacionPausada, false);        // Al pausar la app
	document.addEventListener("resume", aplicacionReiniciada, false);    // Al reiniciar la app
	document.addEventListener("online", phonegapOnline, false);          // Phonegap tiene acceso a internet
	document.addEventListener("offline", phonegapOffline, false);        // Phonegap NO tiene acceso a internet
	document.addEventListener("menubutton", menuPulsado, false);         // Se ha pulsado la tecla menú
	document.addEventListener("searchbutton", menuPulsado, false);       // Se ha pulsado la tecla búsqued
}

function aplicacionIniciada()
{
    checkLocale();
    onSoc();
	FastClick.attach(document.body);
	setTimeout(fixContentHeight,2000);
	document.addEventListener("backbutton", atrasPulsado, false);
    window.addEventListener('load', function() {
				
	});
    
}

function atrasPulsado()
{
    if  ($.mobile.activePage.is('#mainContainer')){
    	var msgOut="";
        var titleOut="";
    	if (currentIdioma=="ca") 
        {
            titleOut="Atenció:";
            msgOut="Desitges sortir?";
        }
        if (currentIdioma=="es")
        {
            titleOut="Atención:";
            msgOut="Deseas salir?";
        }
    	
        navigator.notification.confirm(
            msgOut, 		// message
            onConfirm,      // callback to invoke with index of button pressed
            'Alerta!',      // title
            ['Si','No']     // buttonLabels
        );      
    }
}

function onConfirm(buttonIndex) {
    if (buttonIndex==1) navigator.app.exitApp();
        
}
 
function aplicacionPausada()
{
}
 
function aplicacionReiniciada()
{
}
 
function phonegapOnline()
{
}
 
function phonegapOffline()
{
}
 
function menuPulsado()
{
	
}
 
function busquedaPulsado()
{
}
