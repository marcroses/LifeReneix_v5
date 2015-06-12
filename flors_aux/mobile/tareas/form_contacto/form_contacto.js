/*
 * Requires:
 * 		
 * 	LIBRERIAS JAVASCRIPT:
 * 		- jQuery
 * 		- jQuery Mobile
 * 		- Open Layers
 * 
 * 	JAVASCRIPT:
 * 		- map {OpenLayers.Map}: Mapa de la aplicacion.
 * 
 * 	DOM:
 * 		PAGINA PRINCIPAL:
 * 		- sugerimientosMenu: Id del boton del header.
 * 		- infoWindow: ID del div donde centrar los PopUp's.
 * 
 * 		PAGINA DE SUGERIMIENTOS:
 * 		- suggerimientosForm: Id de la pagina del formulario.
 * 		- suggerimientosForm_content: Id del div del contenido.
 */

/**
 * Inicializa los localizadores.
 * 
 */
function tarea_form_contacto()
{
	this.init();
}

/**
 * Método llamado en inicializar la tarea.
 * 
 */
tarea_form_contacto.prototype.init = function()
{
	try
	{
		this.NOMBRE_TAREA = "tarea_sugerencias";
		console.log("tarea_form_contacto.prototype.init: " + this.NOMBRE_TAREA + " iniciando....");
		$("#sugerimientosMenu").show();
		
		/* Variables */
		this.url = "../../rest/sugerencias";				// {String} URL que añade el sugerimiento.
		this.popup = null;									// {ObjetoDOM} PopUp de seguimiento del centro.
		this.popup_resultado_principal = null;				// {ObjetoDOM} PopUp de resultado.
		this.popup_resultado_sugerencias = null;			// {ObjetoDOM} PopUp de resultado.
		this.layerCenter = null;							// {OpenLayers.Layer.Markers} Layer del marcador del centro del mapa.
		
		// Inputs
		this.SUG_NOMBRE_ID = "sugerimientos_nombre";
		this.SUG_EMAIL_ID = "sugerimientos_email";
		this.SUG_COMENTARIO_ID = "sugerimientos_comentario";
		this.SUG_COORDENADA_ID = "sugerimientos_coordenada";
		
		/*Ejecución*/
		this.run();
		
	} 
	catch(e) 
	{
		console.error("Error en tarea_form_contacto.init()" + e.message);
	}
};

/**
 * Inicializa la tarea de sugerimientos.
 */
tarea_form_contacto.prototype.run = function()
{
	try
	{
		console.log("tarea_form_contacto.prototype.run: " + this.NOMBRE_TAREA);
		
		// Creamos layer de OL para mostrar un marker en el centro
		this._createLayerCentro();
		
		// Creamos los pop up's
		this._createPopUpSugerimientos();
		this._createPopUpResultado();
		
		// Creamos la pagina de sugerimientos
		this._createPage();
		
		// Assignamos la url del pop up al boton del header.
		$("#sugerimientosMenu a").attr("href", "#suggerimientos");
		
		// Añade evento de click a un boton para añadir la sugerencia.
		var self = this;
		$(document).on('click', '#enviarSugerencia', function () {
			console.log("enviando sugerencia..... ");
			self.ejecutarConsulta();
		});
		
	} 
	catch(e) 
	{
		console.error("Error en tarea_form_contacto.run()" + e.message);
	}
};

/**
 * Crea un Layer de OL con un marcador que sigue al centro del mapa.
 */
tarea_form_contacto.prototype._createLayerCentro = function()
{
	try
	{
		// Esta funcion se tiene que ejecutar una vez se haya creado el mapa OL, por lo tanto
		// se liga al evento 'openLayerMap_loaded' que se lanza una vez se ha creado el mapa.
		console.log("tarea_form_contacto _createLayerCentro: esperamos a que se cree el mapa......");
		var self = this;
		$(document).on("openLayerMap_loaded", function () {
			
			console.log("tarea_form_contacto _createLayerCentro: mapa creado! ya podemos crear la capa de centro.");
			
			// Creamos marker de centro par aseguimiento del centro
			var center = map.getCenter();
			self.layerCenter = new OpenLayers.Layer.Markers( "centroSugerimientos" );
			self.layerCenter.setVisibility(false);
			map.addLayer(self.layerCenter);
			
			// Creamos marcador
			var size = new OpenLayers.Size(30, 30);
			var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
			var icon = new OpenLayers.Icon('../css/' + config.cssMov + '/images/locate-high.png', size, offset);
			self.layerCenter.addMarker(new OpenLayers.Marker(center, icon));
			
			$("#suggerimientosLatLon").html(( Math.round(center.lon * 100) / 100 ) + ", " + ( Math.round(center.lat * 100) / 100 ));
			$("#suggerimientosLatLon").attr("lat", ( Math.round(center.lat * 100) / 100 ));
			$("#suggerimientosLatLon").attr("lon", ( Math.round(center.lon * 100) / 100 ));
			
			// Añadimos evento al map para el seguimiento del centro de este
			map.events.register("move", map , function(e) { 
				self.layerCenter.clearMarkers();
				self.layerCenter.addMarker(new OpenLayers.Marker(map.getCenter(), icon));
				center = map.getCenter();
				
				$("#suggerimientosLatLon").html(( Math.round(center.lon * 100) / 100 ) + ", " + ( Math.round(center.lat * 100) / 100 ));
				$("#suggerimientosLatLon").attr("lat", ( Math.round(center.lat * 100) / 100 ));
				$("#suggerimientosLatLon").attr("lon", ( Math.round(center.lon * 100) / 100 ));
			});
		});
	}
	catch(e) 
	{
		console.error("Error en tarea_form_contacto._createLayerCentro()" + e.message);
	}
};

/**
 * Crea el popus de seguimiento del centro del mapa.
 */
tarea_form_contacto.prototype._createPopUpSugerimientos = function()
{
	console.log("tarea_form_contacto _createPopUpSugerimientos: creamos PopUp.");
	try
	{
		// Div del PopUp
		this.popup = $("<div></div>").attr("id", "suggerimientos");
		
		//Boton de cerrar el PopUp
		var popup_cerrar = $("<a></a>")
			.attr("href", "#")
			.attr("data-rel", "back")
			.addClass("ui-btn-right btn-sugg-close")
			.html(nls["MOV_CERRAR"])
			.appendTo(this.popup);
		
		// Titulo y span para las coordenadas
		$("<h3></h3>")
			.html(nls["MOV_COOR_SUGERENCIAS"])
			.appendTo(this.popup);
		$("<span></span>")
			.attr("id", "suggerimientosLatLon")
			.addClass("coordenadasSugerimiento")
			.appendTo(this.popup);
		
		// Boton del PopUp para ir a la pagina de sugerimientos
		var popup_seguent = $("<a></a>")
			.attr("href", "#suggerimientosForm")
			.html(nls["MOV_SIGUIENTE"])
			.appendTo(this.popup)
			.click(function () {
				var lat = $("#suggerimientosLatLon").attr("lat");
				var lon = $("#suggerimientosLatLon").attr("lon");
				
				$("#sugerimientos_coordenada").val(lon + "," + lat);
				$("#formSug_coordenadas").html(( Math.round(lon * 100) / 100 ) + ", " + ( Math.round(lat * 100) / 100 ));
			});
		
		// Añadimos PopUp al DOM (pagina principal).
		$("#mainContainer").append(this.popup);
		
		// Inicializamos PopUP
		var self = this;
		this.popup.popup({
			positionTo: "#infoWindow",
			afteropen: function( event, ui ) {
				$("#suggerimientos-screen").hide();
				self.layerCenter.setVisibility(true);
				$(document).trigger("popup_open");
			},
			afterclose: function ( event, ui ) {
				self.layerCenter.setVisibility(false);
				$(document).trigger("popup_close");
			}
		});
		
		//Inicializamos botones
		popup_cerrar.buttonMarkup({"theme": "a", "icon": "delete", "iconpos": "notext"});
		popup_seguent.buttonMarkup({"theme": "a", "role": "button", "icon": "arrow-r", "inline": true, "mini": true, "iconpos": "right"});
	} 
	catch(e) 
	{
		console.error("Error en tarea_form_contacto._createPopUpSugerimientos()" + e.message);
	}
};

/**
 * Crea los inputs de la pàgina de sugerimientos.
 */
tarea_form_contacto.prototype._createPage = function()
{
	console.log("tarea_form_contacto _createPage: creamos el contenidop de la pagina.");
	try
	{
		var form = $("<form></form>").attr("id", "formSugerimintos");
		
		$("<label></label>")
			.attr("for", this.SUG_NOMBRE_ID)
			.html(nls["MOV_SUG_NOMBRE"])
			.appendTo(form);
		
		$("<input />")
			.attr("name", this.SUG_NOMBRE_ID)
			.attr("id", this.SUG_NOMBRE_ID)
			.attr("type", "text")
			.addClass("ui-input-text ui-body-a")
			.appendTo(form);
		
		$("<label></label>")
			.attr("for", this.SUG_EMAIL_ID)
			.html(nls["MOV_SUG_EMAIL"])
			.appendTo(form);
	
		$("<input />")
			.attr("name", this.SUG_EMAIL_ID)
			.attr("id", this.SUG_EMAIL_ID)
			.attr("type", "email")
			.addClass("ui-input-text ui-body-a")
			.appendTo(form);
		
		$("<label></label>")
			.attr("for", this.SUG_COMENTARIO_ID)
			.html(nls["MOV_SUG_COMENTARIO"])
			.appendTo(form);
	
		$("<textarea></textarea>")
			.attr("name", this.SUG_COMENTARIO_ID)
			.attr("id", this.SUG_COMENTARIO_ID)
			.addClass("ui-input-text ui-body-a")
			.appendTo(form);
		
		$("<label></label>")
			.attr("for", this.SUG_COORDENADA_ID)
			.html(nls["MOV_SUG_COORDENADA"])
			.appendTo(form);
		
		$("<input />")
			.attr("name", this.SUG_COORDENADA_ID)
			.attr("id", this.SUG_COORDENADA_ID)
			.attr("type", "hidden")
			.addClass("ui-input-text ui-body-a")
			.appendTo(form);
		
		$("<br />").appendTo(form);
		$("<span></span>").attr("id", "formSug_coordenadas").appendTo(form);
		$("<a></a>")
			.attr("id", "enviarSugerencia")
			.attr("data-role", "button")
			.attr("data-theme", "a")
			.attr("href", "#")
			.html(nls["MOV_ENVIAR"])
			.appendTo(form);
		
		$("#suggerimientosForm_content").append(form);
		
	}
	catch(e) 
	{
		console.error("Error en tarea_form_contacto._createPage()" + e.message);
	}
};

/**
 * Crea el PopUp de resultados. Se muestra al enviar el sugerimiento
 */
tarea_form_contacto.prototype._createPopUpResultado = function()
{
	console.log("tarea_form_contacto _createPopUpSugerimientos: creamos PopUp de resultados.");
	try
	{
		this.popup_resultado_principal = $("<div></div>").attr("id", "mensajesPopUp");
		$("#mainContainer").append(this.popup_resultado_principal);
		
		// Inicializamos PopUP
		this.popup_resultado_principal.popup({
			positionTo: "#infoWindow",
			afteropen: function( event, ui ) {
				$(document).trigger("popup_open");
			},
			afterclose: function ( event, ui ) {
				$(document).trigger("popup_close");
			}
		});
		
		this.popup_resultado_sugerencias = $("<div></div>").attr("id", "mensajesPopUp");
		$("#suggerimientosForm").append(this.popup_resultado_sugerencias);
		
		// Inicializamos PopUP
		this.popup_resultado_sugerencias.popup({
			positionTo: "origin",
			afteropen: function( event, ui ) {
				$(document).trigger("popup_open");
			},
			afterclose: function ( event, ui ) {
				$(document).trigger("popup_close");
			}
		});
		
	}
	catch(e) 
	{
		console.error("Error en tarea_form_contacto._createPopUpResultado()" + e.message);
	}
};

/**
 * Ejecuta la consula para enviar la sugerencia.
 */
tarea_form_contacto.prototype.ejecutarConsulta = function()
{
	console.log("tarea_sugerencias.prototype.ejecutarConsulta: " + this.NOMBRE_TAREA);
	
	$.mobile.loading( 'show', { theme: "a" } );
	
	var data = getSessionObject();
	data["SUG_NOMBRE"] =	 $("#" + this.SUG_NOMBRE_ID).val();
	data["SUG_EMAIL"] =		 $("#" + this.SUG_EMAIL_ID).val();
	data["SUG_COMENTARIO"] = $("#" + this.SUG_COMENTARIO_ID).val();
	data["SUG_COORDENADA"] = $("#" + this.SUG_COORDENADA_ID).val();
	data["SUG_TITLE"] = 	 "Mobile";
	
	var validation = this.validateInputs(data);
	console.log("\t> data = ", data, " validación -> " + validation.validate + ": " + validation.msg);
	
	if(validation.validate) {
	
		var self = this;
		$.ajax({
			type: "POST",
			url: this.url,
			dataType: "json",
			data: data
		})
		.then( function ( response ) {
			
			console.log(response);
			if(response.result == "OK") {
				
				self.popup_resultado_principal.empty().html(nls["MOV_SUG_ENVIADO_OK"]);
				$.mobile.changePage("#mainContainer");
				
				setTimeout(function() {
					self.popup_resultado_principal.popup("open");		// abrimos el popup con un delay para dar tiempo a cargar la pagina.
				}, 500);
			}
			
			// Ocultamos el loading
			$.mobile.loading('hide');
			
		}, function (response) {
			
			console.error("tarea_sugerencias -> ejecutarConsulta: ", response);
			self.popup_resultado_sugerencias.empty().html(nls["MOV_SUG_ENVIADO_ERROR"]);
			$.mobile.changePage("#mainContainer");
			
			setTimeout(function() {
				self.popup_resultado_sugerencias.popup("open");		// abrimos el popup con un delay para dar tiempo a cargar la pagina.
			}, 500);
			
			$.mobile.loading('hide');
		});
	} else {
		
		this.popup_resultado_sugerencias.empty().html(validation.msg);
		$.mobile.loading('hide');
		this.popup_resultado_sugerencias.popup("open");
		
	}

};

/**
 * Comprueba si el nombre, email, comentario y coordenadas estan bien definidos en el objeto a enviar.
 * 
 * @param data {Object}: Objeto que contiene los elementos a enviar al servidor. 
 * @returns {Object}: indica si esta totdo correcto, y en caso contrario, envia un comentrio con que input esta mal.
 */
tarea_form_contacto.prototype.validateInputs = function(data)
{
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	var ret = {"validate": false, "msg": "OK"};

	if( !data["SUG_NOMBRE"] || data["SUG_NOMBRE"].length <= 0 ) { ret["msg"] = nls["MOV_ERR_NOMBRE"]; return ret; }
	if( !data["SUG_EMAIL"] || data["SUG_EMAIL"].length <= 0 || !emailReg.test( data["SUG_EMAIL"] ) ) { ret["msg"] = nls["MOV_ERR_EMAIL"]; return ret; }
	if( !data["SUG_COMENTARIO"] || data["SUG_COMENTARIO"].length <= 0 ) { ret["msg"] = nls["MOV_ERR_COMENTARIO"]; return ret; }
	if( !data["SUG_COORDENADA"] || data["SUG_COORDENADA"].length <= 0 || data["SUG_COORDENADA"].split(",").length != 2 ) { ret["msg"] = nls["MOV_ERR_COORDENADA"]; return ret; }
	
	ret["validate"] = true;
	return ret;
};

