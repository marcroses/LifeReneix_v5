
/******************************************/
// funciones para inicio3.jsp
/******************************************/
var territoriosArray = null;
var aplicationsArray = null;
var territorioId_selected = null;
var aplicationId_selected = null;

/**
 * Esta función guarda la/s función/es del load y añade otra función.
 * 
 * @param func {function}: Nueva función a anñadir al evento load.
 */
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') window.onload = func;
	else {
		window.onload = function() {
			if (oldonload) oldonload();
			func();
		};
	}
}

/**
 * Lanza una llamada para obtener el listado de aplicaciones disponibles. El retorno va por callbak.
 * Primera funcion que se llama al cargar la pagina.
 */
function initAplicaciones() {
	try {
		if (usuarioId==null) {
			alert("Falta usuario");
			return;
		}
		//console.log("Cargando aplicaciones para el usuario: ", usuarioId);
		
		//Modificamos altura de las listas
		document.getElementById("aplicacionUL").style.height = (window.innerHeight - 109) + "px";
		document.getElementById("territoriUL").style.height = (window.innerHeight - 109) + "px";
		
		
		ConfigManager.listAplicaciones(usuarioId, loadAplicaciones);
		
	} catch (e) {
		alert("Error en initTerritorios()\n"+e.message);
	}
}

/**
 * Recorre el array de aplicaciones para crear el listado de aplicaciones disponibles.
 * 
 * @param t {Array}: Listado de todas las aplicaciones disponibles.
 */
function loadAplicaciones(t){

	try {
		aplicationsArray = t;
		
		if(aplicacionId != null) {
			console.log("URL -> aplication id = ", aplicacionId);
			aplicationId_selected = aplicacionId;
			
			//Guardamos el id en el input hidden de aplicación.
			var app = document.getElementById("hiddenAPP");
			app.value = aplicacionId;
			
			ConfigManager.listTerritorios(usuarioId, aplicacionId, loadTerritorios);
			//return;
		}

		// Elemento DOM (<ul>) donde se insertaran las aplicaciones
		var aplicacionUL = document.getElementById("aplicacionUL");
		var html = "";
		
		for(var i = 0; i < aplicationsArray.length; i++) {
			var aplication = aplicationsArray[i];
			
			//console.log(aplication);
			// Añadimos nueva aplicación movil al estar en modo movil
			if(isMobile) {
				if(aplication.appMovtempl && aplication.appMovtempl != "" && aplication.appMovtempl != "-")
					html += "<li onclick='javascript:aplicacionSelected(" + aplication.appCodigo + ");'><a>" + aplication.appNombre + "</a></li>";
			} else {
				if(aplication.appTema && aplication.appTema != "" && aplication.appTema != "-")
					html += "<li onclick='javascript:aplicacionSelected(" + aplication.appCodigo + ");'><a>" + aplication.appNombre + "</a></li>";
			}
		}
		
		aplicacionUL.innerHTML = html;
		
		if(aplicationsArray.length == 1) {
			aplicacionSelected(aplicationsArray[0].appCodigo);
		}
		
	} catch (e) {
		alert("Error en loadAplicaciones()\n"+e.message);
	}
}

/**
 * Se ejecuta al clicar sobre una aplicación.
 * 
 * @param appId {Integer}: Id de la aplicación seleccionada
 */
function aplicacionSelected(appId) {
	//console.log("aplicación selecionada = ", appId);
	
	// Mostramos lista de territorios
	document.getElementById("aplicacionContentPane").style.display = "none";
	document.getElementById("territorioContentPane").style.display = "block";
	
	//Guardamos el id en el input hidden de aplicación.
	var app = document.getElementById("hiddenAPP");
	app.value = appId;
	
	//Guardamos el id de la aplicación seleccionada.
	aplicationId_selected = appId;
	
	//Obtenemos el listado de territorios disponibles para la aplicación selecdiona
	ConfigManager.listTerritorios(usuarioId, appId, loadTerritorios);
}

/**
 * Recorre el array de territorios para crear el listado de territorios disponibles.
 * 
 * @param t {Array}: Listado de todas los territorios disponibles.
 */
function loadTerritorios(t) {
	try {
		
		territoriosArray = t;
		
		if(aplicacionId != null && territorioId != null) {
			console.log("URL -> aplication id = ", aplicacionId);
			console.log("URL -> territorio id = ", territorioId);
			territorioId_selected = territorioId;
			
			// ocultamos div de candidatos, para dejar solo el loading.
			document.getElementById("territorioContentPane").style.display = "none";
			document.getElementById("aplicacionContentPane").style.display = "none";
			
			//Guardamos el id en el input hidden de territorio.
			var ter = document.getElementById("hiddenTER");
			ter.value = territorioId;
			
			selectionComplete();
			return;
		}
		
		// Elemento DOM (<ul>) donde se insertaran los territorios
		var territoriUL = document.getElementById("territoriUL");
		var html = "";
		
		for(var i = 0; i < territoriosArray.length; i++) {
			var territori = territoriosArray[i];
			
			// Añadimos nuevo territorio
			html += "<li><a href='#' onClick='territorioSelected(" + territori.terCodigo + ")'>" + territori.terNombre + "</a></li>";
		}
		
		territoriUL.innerHTML = html;
		
		if(territoriosArray.length == 1) {
			territorioSelected(territoriosArray[0].terCodigo);
		}
		
	} catch (e) {
		alert("Error en loadTerritorios()\n"+e.message);
	}
}

/**
 * Se ejecuta al clicar sobre un territorio.
 * 
 * @param territorioId {Integer}: Id del territorio seleccionado
 */
function territorioSelected(territorioId) {
	//console.log("territorio selecionado = ", territorioId);
	
	//Guardamos el id en el input hidden de territorio.
	var ter = document.getElementById("hiddenTER");
	ter.value = territorioId;
	
	//Guardamos el id del territorio seleccionado.
	territorioId_selected = territorioId;
	
	//Selección completa mostramos el visor seleccionado.
	selectionComplete();
}

/**
 * 
 */
function backAplication () {
	// Mostramos lista de aplicacions
	document.getElementById("aplicacionContentPane").style.display = "block";
	document.getElementById("territorioContentPane").style.display = "none";
	cleanFilters();
	
	//Guardamos el id en el input hidden de aplicación.
	var app = document.getElementById("hiddenAPP");
	app.value = "";
	aplicationId_selected = 0;
}

/**
 * A ejecutar cuando ya se ha escogido territorio y aplicación.
 * 
 */
function selectionComplete() {
	
	var application = findArray(aplicationsArray, "appCodigo", aplicationId_selected);
	var territorio = findArray(territoriosArray, "terCodigo", territorioId_selected);
	
	//Si encontramos aplicación y territorio mostramos visor.
	if(application != null && territorio != null) {
		aplicacionTemplateComplete(application, territorio);
	} else {
		console.log("Error al encontrar aplicacion o territorio: ", application, territorio);
		aplicationId_selected = aplicacionId = null;
		territorioId_selected = territorioId = null;
	}
}

/**
 * Mustra el visor seleccionado en modo desktop o movil dependiendo del entorno.
 * 
 * @param application {Object}: Objeto aplicación.
 * @param territorio {Object}: Objeto territorio.
 * 
 */
function aplicacionTemplateComplete(application, territorio) {
	
	//Mostramos el texto de cargando
	document.getElementById("territorioContentPane").style.display = "none";
	document.getElementById("cargandoContentPane").style.display = "block";
	document.getElementById("scroll-icon").style.display = "none";
	
	//Obtenemos la url del visor. Si estamos en entorno movil y se ha definido una url para ese entorno se muestra, sino mostramos la version desktop.
	var targetUrl = isMobile && application.appMovtempl != null ? application.appMovtempl : application.appTemplate;
	
	if (application.appTipo == "E") {	// Aplicaciones externas
		
		// llamada a aplicación externa. Aquí no tenemos el config, buscamos las variables una a una.
		//console.log("targetUrl original:", targetUrl);
		
		var terMunIne = territorio.terCodmun;
		targetUrl = targetUrl.replace("${MUN_INE}", terMunIne);
		targetUrl = targetUrl.replace("${APP_CODIGO}", application.appCodigo);
		targetUrl = targetUrl.replace("${TER_CODIGO}", territorio.terCodigo);
		targetUrl = targetUrl.replace("${USU_CODIGO}", usuarioId);
		
		//console.log("targetUrl final:", targetUrl);
		
		//Aparte introducimos en la BD del log
		ConfigManager.addLogManager(usuarioId, application.appCodigo, territorio.terCodigo, function(text) {
			window.location = targetUrl;
		});
		
	} else {	// Aplicaciones internas
		
		//console.log("Aplicacion interna!!");
		var form = document.getElementById("inicio3Form");
		form.action = targetUrl;
		form.submit();
	}	
}

/**
 * Busca un objeto dentro de un array.
 * 
 * @param array {Array}: array donde se busca el objeto.
 * @param attribute {String}: nombre del atributo del objeto a comparar.
 * @param id {String}: identificador a comparar.
 * @returns {Object}: el objeto en caso de encontrarlo, null si no se encuentra.
 * 
 */
function findArray(array, attribute, id) {
	
	var trobat = false;
	
	for(var index in array) {
		var element = array[index];
		
		trobat = typeof(element[attribute]) != "undefined" && element[attribute] == id;
		if(trobat) break;
	}
	
	if(trobat) return array[index];
	else return null;
}

/*FILTROS DE ARRAYS*/

function autocompleteAplication(input) {

	var findText = normalizeText(input.value);
	var aplicacionUL = document.getElementById("aplicacionUL");
	var html = "";
	
	for(var i = 0; i < aplicationsArray.length; i++) {
		var aplication = aplicationsArray[i];
		
		// Añadimos aplicación a la lista si encontramos el texto
		if(isMobile) {
			if(normalizeText(aplication.appNombre).indexOf(findText) >= 0 && aplication.appMovtempl && aplication.appMovtempl != "" && aplication.appMovtempl != "-")
				html += "<li onclick='javascript:aplicacionSelected(" + aplication.appCodigo + ");'><a>" + aplication.appNombre + "</a></li>";
		} else {
			if(normalizeText(aplication.appNombre).indexOf(findText) >= 0 && aplication.appTema && aplication.appTema != "" && aplication.appTema != "-")
				html += "<li onclick='javascript:aplicacionSelected(" + aplication.appCodigo + ");'><a>" + aplication.appNombre + "</a></li>";
		}
	}
	
	aplicacionUL.innerHTML = html;
	
}

function autocompleteTerritorio(input) {
	
	var findText = normalizeText(input.value);
	var territoriUL = document.getElementById("territoriUL");
	var html = "";
	
	for(var i = 0; i < territoriosArray.length; i++) {
		var territori = territoriosArray[i];
		
		// Añadimos aplicación a la lista si encontramos el texto
		if(normalizeText(territori.terNombre).indexOf(findText) >= 0)
			html += "<li><a href='#' onClick='territorioSelected(" + territori.terCodigo + ")'>" + territori.terNombre + "</a></li>";
	}
	
	territoriUL.innerHTML = html;
}

function cleanFilters() {
	
	// Limpiamos input de filtro de aplicaciones
	document.getElementById("filterAplication").value = "";
	//console.log("filterAplication:", document.getElementById("filterAplication").value);
	autocompleteAplication(document.getElementById("filterAplication"));
	
	// Limpiamos input de filtro de territorios
	document.getElementById("filterTerritorio").value = "";
	//console.log("filterTerritorio:", document.getElementById("filterTerritorio").value);
}

function normalizeText(text) {
	var textNormal = text.toLowerCase();					//  - Minusculas
	textNormal = textNormal.replace(/à|á|ä|â/g ,"a")
        .replace(/è|é|ë|ê/g ,"e").replace(/ì|í|ï|î/g ,"i")
        .replace(/ò|ó|ö|ô/g ,"o").replace(/ù|ú|ü|û/g ,"u");	//  - Tilde vocals   ` ´ ¨ ^   -> sin tilde
	
	return textNormal;
}

