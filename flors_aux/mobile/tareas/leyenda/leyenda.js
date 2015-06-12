/*
 * Requires:
 *  
 * 	LIBRERIAS JAVASCRIPT:
 * 		- jQuery
 * 		- jQuery Mobile
 * 
 * 	DOM:
 * 		PAGINA PRINCIPAL:
 * 		- leyendaMenu: Id del boton del header.
 * 		- leyenda: ID de la pagina de leyendas.
 * 		- leyendaContent: Id de l div de contenido.
 * 
 */



/**
 * Inicializa la leyenda.
 * 
 */
function tarea_leyenda()
{
	this.init();
}

/**
 * Método llamado en inicializar la tarea.
 * 
 */
tarea_leyenda.prototype.init = function()
{
	this.NOMBRE_TAREA = "tarea_leyenda";
	console.log("tarea_leyenda.prototype.init: " + this.NOMBRE_TAREA + " iniciando....");
	$("#leyendaMenu").show();
	
	/*Variables*/
	
	/*Ejecución*/
	this.run();
};

/**
 * Inicializa la tarea de leyendas.
 */
tarea_leyenda.prototype.run = function()
{
	console.log("tarea_leyenda.prototype.run: " + this.NOMBRE_TAREA);
	try {
		
		var self = this;
		$(document).on("pagebeforeshow", "#leyenda", function () { 
			console.log("página de leyenda cargada -> petición de leyendas");
			self.renderLeyendas($("#leyendaContent"));
		});
		
	} catch ( error ) {
		console.error("tarea_leyenda run:", error);
	}
};

/**
 * A partir de una cartografia lo devolvemos en un string que añadiremos a la url para enviar al servlet
 * 
 * @param carto {Object}: Objeto cartografia
 * @returns {String}: Parametros URL para obtener la leyenda.
 */
tarea_leyenda.prototype.getStringFromCarto = function(carto) {

	//Primero hemos de descubrir si la url es la imagen o tenemos que ir a buscarla al capabilities
	if (typeof(carto.carLeyendtip)== "undefined" || carto.carLeyendtip==null) return "";
	
	
	if (typeof(carto.carLeyendtip)!= "undefined")
			string = carto.carLeyendtip; //CAPAPBILITIES, LINK, LEGENDGRAPHIC
	else string=""; //Por si el tipo no existe tenemos que empezar la cadena en blanco
	string+="~";			
	
	if (typeof(carto.carLeyendurl)!= "undefined" && carto.carLeyendurl != null)
		string +=escape(carto.carLeyendurl);
	
	else
	{
		if (typeof(carto.stmServicio.serUrl) !="undefined" && carto.stmServicio.serTipo==="WMS")
			string +=escape(carto.stmServicio.serUrl);
		else string +="null";
	}
	string+="~";
	
	if (typeof(carto.carCapas) !="undefined"){
		string+= escape(carto.carCapas);
	}
	string+="~";
	
	if (typeof(carto.stmServicio.stmParamsers) !="undefined"){
		var j=0; var trobat=false;
		while(!trobat && j < carto.stmServicio.stmParamsers.length){
			if (typeof(carto.stmServicio.stmParamsers[j].id.pseNombre) != "undefined" && carto.stmServicio.stmParamsers[j].id.pseNombre=="VERSION"){
				string+=carto.stmServicio.stmParamsers[j].pseValor;
				trobat = true;
			}
			j++;
		}
	}
	string+="~";
	
	if (typeof(carto.carNombre) != undefined){
		string+= escape(carto.carNombre);
	}
	
	return string;
};

/**
 * Muestra en el elemento DOM especificado el resultado de la obtencion de las leyendas 
 * 
 * @param elementDom {ObjectDOM}: objeto DOM donde se pintaran las leyendas.
 */
tarea_leyenda.prototype.renderLeyendas = function(elementDom) {
	
	console.log("tarea_leyenda getLeyendas");
	elementDom.empty();
	$.mobile.loading( 'show', { theme: "a" } );
	var numLeyendas = 0;
	var urls = new Array();
	var imgsRestService = new Array();
	
	for(var index in config.olConfig.cartografias) {
		var carto = config.olConfig.cartografias[index];
		
		if(carto.carVisible) {
			
			if(carto.carLeyendtip == "CAPABILITIES" && carto.stmServicio.serTipo.toLowerCase() == "wms") {
				
				$("<h3></h3>").html(carto.carNombre).appendTo(elementDom);
				$("<img />").addClass("imgLeyenda").attr("id", "imgLeyendaCarto_" + carto.carCodigo).attr("alt", carto.carNombre).attr("title", carto.carNombre).appendTo(elementDom);
				var string = this.getStringFromCarto(carto);
				console.log("\t>String a añadir: " + string);
				urls.push(string);
				imgsRestService[carto.carCapas] = {carto: carto, domImg: "imgLeyendaCarto_" + carto.carCodigo};
				
				numLeyendas++;
				
			} else if(carto.carLeyendtip =="LINK") {
				
				$("<h3></h3>").html(carto.carNombre).appendTo(elementDom);
				$("<img />").addClass("imgLeyenda").attr("src", carto.carLeyendurl).attr("alt", carto.carNombre).attr("title", carto.carNombre).appendTo(elementDom);
				numLeyendas++;
				
			} else console.log("\t> leyenda de cartografia " + carto.carCodigo + " [" + carto.carNombre + "]: valor no valido: ", carto.carLeyendtip);
			
		} else {
			console.log("\t> cartografia no visible");
		}
	}
	
	console.log("\t> numero de leyendas a mostrar: " + numLeyendas);
	
	if(numLeyendas <= 0) {
		$("<div></div>").html(nls["MOV_NO_LEYENDAS"]).appendTo(elementDom);
	}
	
	var idioma ="es"; //ponemos idioma por defecto el castellano
	var url = window.location.href;
	if(url.indexOf("lang=") > -1) idioma = url.substr(url.indexOf("lang=")+5,2);
	
	var data = {idioma: idioma, urls: urls.join(",")};
	
	console.log("\t> leyendas que tenemos que descargar con REST: ", urls);
	
	$.ajax({
		type: "POST",
		url: "../../rest/legend",
		dataType: "json",
		data: data
	})
	.then( function ( response ) {
		
		console.log("\t> datos de las leyendas recibidios = ", response.LegendUrls);
		
		for(var index in response.LegendUrls) {
			var legend = response.LegendUrls[index];
			var cartografia = imgsRestService[legend.nombre];
			
			console.log("\t> recargando la imagen con id = " + cartografia.domImg + " -> " + legend.url);
			
			$("#" + cartografia.domImg).attr("src", legend.url);
		}
		
		// Ocultamos el loading
		$.mobile.loading('hide');
		
	}, function (response) {
		
		console.error("listviewbeforefilter: ", response);
		
		// Ocultamos el loading
		$.mobile.loading('hide');
	});
	
	$.mobile.loading('hide');
	
};

