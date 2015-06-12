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
 * 		- config {Object}: Objeto de configuracion de SITMUN
 * 
 * 	DOM:
 * 		PAGINA PRINCIPAL:
 * 		- coordCentroMenu: Id del boton del header.
 * 		- infoWindow: ID del div donde centrar los PopUp's.
 * 
 */

/**
 * Inicializa coordenadas del centro.
 * 
 */
function tarea_coord_centro()
{
	this.init();
}

/**
 * Método llamado en inicializar la tarea.
 * 
 */
tarea_coord_centro.prototype.init = function()
{
	try
	{
		this.NOMBRE_TAREA = "coord_centro";
		console.log("tarea_coord_centro.prototype.init: " + this.NOMBRE_TAREA + " iniciando....");
		$("#coordCentroMenu").show();
		
		/* Variables */
		this.popup = null;									// {ObjetoDOM} PopUp de seguimiento del centro.
		this.layerCenter = null;							// {OpenLayers.Layer.Markers} Layer del marcador del centro del mapa.
		this.icon = null;									// {OpenLayers.Icon} Icono a pintar en el centro del mapa.
		
		/*Ejecución*/
		this.run();
		
	} catch(e) 
	{
		console.error("Error en tarea_coord_centro.init()" + e.message);
	}
};

/**
 * Inicializa la tarea de coordenadas en el centro del mapa.
 */
tarea_coord_centro.prototype.run = function()
{
	try
	{
		console.log("tarea_coord_centro.prototype.run: " + this.NOMBRE_TAREA);
		
		// Creamos layer de OL para mostrar un marker en el centro
		this._createLayerCentro();
		
		// Creamos los pop up's
		this._createPopUp();
		
		// Assignamos la url del pop up al boton del header.
		$("#coordCentroMenu").attr("href", "#coordenadasCentro");
		
		
	} catch(e) 
	{
		console.error("Error en tarea_coord_centro.run()" + e.message);
	}
};

/**
 * Crea un Layer de OL con un marcador que sigue al centro del mapa.
 */
tarea_coord_centro.prototype._createLayerCentro = function()
{
	try
	{
		// Esta funcion se tiene que ejecutar una vez se haya creado el mapa OL, por lo tanto
		// se liga al evento 'openLayerMap_loaded' que se lanza una vez se ha creado el mapa.
		console.log("tarea_coord_centro _createLayerCentro: esperamos a que se cree el mapa......");
		var self = this;
		$(document).on("openLayerMap_loaded", function () {
			
			console.log("tarea_coord_centro _createLayerCentro: mapa creado! ya podemos crear la capa de centro.");
			
			// Creamos marker de centro par aseguimiento del centro
			var center = map.getCenter();
			var centerGeo = center.clone().transform(map.getProjection(), new OpenLayers.Projection("EPSG:4326"));

			self.layerCenter = new OpenLayers.Layer.Markers( "centroCoordCentro" );
			self.layerCenter.setVisibility(false);
			map.addLayer(self.layerCenter);
			
			// Creamos marcador
			var size = new OpenLayers.Size(30, 30);
			var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
			self.icon = new OpenLayers.Icon('../css/' + config.cssMov + '/images/locate-high.png', size, offset);
			self.layerCenter.addMarker(new OpenLayers.Marker(center, self.icon));
			
			$("#centroCoordLatLon").html(( Math.round(center.lon * 100) / 100 ) + ", " + ( Math.round(center.lat * 100) / 100 ));
			$("#centroCoordLatLonGeo").html(( Math.round(centerGeo.lon * 100000) / 100000 ) + ", " + ( Math.round(centerGeo.lat * 100000) / 100000 ));
			
			// Añadimos evento al map para el seguimiento del centro de este
			map.events.register("move", map , function(e) {
				if(self.layerCenter.getVisibility()) {
					self.layerCenter.clearMarkers();
					self.layerCenter.addMarker(new OpenLayers.Marker(map.getCenter(), self.icon));
					center = map.getCenter();
					centerGeo = center.clone().transform(map.getProjection(), new OpenLayers.Projection("EPSG:4326")); 
					
					$("#centroCoordLatLon").html(( Math.round(center.lon * 100) / 100 ) + ", " + ( Math.round(center.lat * 100) / 100 ));
					$("#centroCoordLatLonGeo").html(( Math.round(centerGeo.lon * 100000) / 100000 ) + ", " + ( Math.round(centerGeo.lat * 100000) / 100000 ));
				}
			});
		});
	}
	catch(e) 
	{
		console.error("Error en tarea_coord_centro._createLayerCentro()" + e.message);
	}
};

/**
 * Crea el popus de seguimiento del centro del mapa.
 */
tarea_coord_centro.prototype._createPopUp = function()
{
	console.log("tarea_form_contacto _createPopUpSugerimientos: creamos PopUp.");
	try
	{
		// Div del PopUp
		this.popup = $("<div></div>").attr("id", "coordenadasCentro");
		
		//Boton de cerrar el PopUp
		var popup_cerrar = $("<a></a>")
			.attr("href", "#")
			.attr("data-rel", "back")
			.addClass("ui-btn-right btn-sugg-close")
			.html(nls["MOV_CERRAR"])
			.appendTo(this.popup);
		
		// Titulo y span para las coordenadas
		console.log("\t> titulo para pop-up coord. centro: " + "MOV_" + config.olConfig.projection.replace(':', '_'));
		
		// Coordenadas del mapa
		var coordBasicas = $("<p></p>");
		$("<b></b>")
			.html(nls["MOV_" + config.olConfig.projection.replace(':', '_')] + ": ")
			.appendTo(coordBasicas);
		$("<span></span>")
			.attr("id", "centroCoordLatLon")
			.addClass("coordenadasSugerimiento")
			.appendTo(coordBasicas);
		coordBasicas.appendTo(this.popup);
		
		// Coordenadas geográficas
		var coordBasicas = $("<p></p>");
		$("<b></b>")
			.html(nls["MOV_GEOGRAFICAS"] + ": ")
			.appendTo(coordBasicas);
		$("<span></span>")
			.attr("id", "centroCoordLatLonGeo")
			.addClass("coordenadasSugerimiento")
			.appendTo(coordBasicas);
		coordBasicas.appendTo(this.popup);
		
		// Añadimos PopUp al DOM (pagina principal).
		$("#mainContainer").append(this.popup);
		
		// Inicializamos PopUP
		var self = this;
		this.popup.popup({
			positionTo: "#infoWindow",
			afteropen: function( event, ui ) {
				$("#coordenadasCentro-screen").hide();
				self.layerCenter.setVisibility(true);
				self.layerCenter.clearMarkers();
				self.layerCenter.addMarker(new OpenLayers.Marker(map.getCenter(), self.icon));
				
				var center = map.getCenter();
				var centerGeo = center.clone().transform(map.getProjection(), new OpenLayers.Projection("EPSG:4326"));
				
				$("#centroCoordLatLon").html(( Math.round(center.lon * 100) / 100 ) + ", " + ( Math.round(center.lat * 100) / 100 ));
				$("#centroCoordLatLonGeo").html(( Math.round(centerGeo.lon * 100000) / 100000 ) + ", " + ( Math.round(centerGeo.lat * 100000) / 100000 ));
				
				$(document).trigger("popup_open");
			},
			afterclose: function ( event, ui ) {
				self.layerCenter.setVisibility(false);
				$(document).trigger("popup_close");
			}
		});
		
		//Inicializamos botones
		popup_cerrar.buttonMarkup({"theme": "a", "icon": "delete", "iconpos": "notext"});
	} 
	catch(e) 
	{
		console.error("Error en tarea_form_contacto._createPopUpSugerimientos()" + e.message);
	}
};


