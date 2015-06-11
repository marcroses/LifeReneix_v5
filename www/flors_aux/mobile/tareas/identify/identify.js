/*
 * Requires:
 * 
 * Definir la variable global 'getFeatureInfoLayer' que sera un objeto del tipo .
 * 
 */
/*
 * Requires:
 * 		
 * 	LIBRERIAS JAVASCRIPT:
 * 		- jQuery
 * 		- jQuery Mobile
 * 		- Open Layers
 * 
 * 	JAVASCRIPT:
 * 		- getFeatureInfoLayer {OpenLayers.Control.NGWMSGetFeatureInfo}: Capa para obtener la info.
 * 
 * 	DOM:
 * 		PAGINA PRINCIPAL:
 * 		- infoPanel: ID del panel de la info.
 * 		- contentPanelDiv: ID del contenido del panel.
 * 
 */


/**
 * Inicializa la informacion WMS.
 * 
 */
function tarea_identify()
{
	this.init();
}

/**
 * Método llamado en inicializar la tarea.
 * 
 */
tarea_identify.prototype.init = function()
{
	try
	{
		this.NOMBRE_TAREA = "tarea_informacion";
		console.log("tarea_informacion.prototype.init: " + this.NOMBRE_TAREA + " iniciando....");
		
		/*Variables*/
		this.$panel = null;
		this.$contentDiv = null;
		this.requestCount = 0;
		this.medidas = null;

		/*Ejecución*/
		this.run();
		
	} 
	catch(e) 
	{
		alert("Error en tarea_informacion.init()" + e.message);
	}
};

/**
 * Inicializa la tarea de información.
 */
tarea_identify.prototype.run = function()
{
	try
	{
		console.log("tarea_informacion.prototype.run: " + this.NOMBRE_TAREA);
		
		var self = this;
		$(document).on("resizeContentHeight", function (event, medidas) {
			console.log("tarea_informacion.prototype -> resizeContentHeight: ", medidas);
			self.medidas = medidas;
			
			if(self.$contentDiv) self._resizeElement(medidas);
		});
		
		this.$panel = $("#infoPanel");
		$("<a></a>")
			.html(nls["MOV_CERRAR"])
			.appendTo(this.$panel)
			.addClass("infoPanelCerrar")
			.buttonMarkup({"mini": "true", "icon": "delete", "iconpos": "notext", "theme": "a"})
			.click(function(){
				self.$panel.panel("close");
			});
		
		this.$contentDiv = $("<div></div>").attr("id", "contentPanelDiv").appendTo(this.$panel);
		if(this.medidas) this._resizeElement(this.medidas);
		this.$panel.panel({ animate: true, theme: "a" });
	} 
	catch(e)
	{
		console.error("Error en tarea_localizadores.run()", e);
	}
};

/**
 * Cambio de las medidas del elemento DOM que contiene la información.  
 * 
 * @param medidas {Object}: mediadas de la pantalla.
 */
tarea_identify.prototype._resizeElement = function (medidas) {
	
	var marginTop = medidas.headerHeight;
	var marginBottom = medidas.footerHeight;

	console.log("tarea_informacion: cambio de las medidas elemento -> height: " + medidas.contentHeight + ", margin-top: " + marginTop + ", margin-bottom: " + marginBottom);
	this.$contentDiv.css({
		"height": (medidas.contentHeight-6) + "px",
		"margin-top": (marginTop+6) + "px",
		"margin-bottom": marginBottom + "px",
		"overfloy-y": "scroll"
	});
};

tarea_identify.prototype.openPanel = function()
{
	try
	{
		$(".resultPanelInfo").remove();
		this.$panel.panel("open");
		$('<div></div>').addClass("resultPanelInfo").html(nls["MOV_CARGANDO"]).appendTo(this.$contentDiv);
		
	} catch (e) {
		console.error("Error en tarea_identify.openPanel()", e);
	}
};

/**
 * Renderiza la info en el panel.
 * 
 * @param features
 */
tarea_identify.prototype.renderInfo = function(event)
{
	try
	{
		console.log("tarea_informacion.prototype.renderInfo: " + this.NOMBRE_TAREA);
		
		if(typeof(event.features.carCodigo) != "undefined") {
			
			console.log("\t> getInfo num " + this.requestCount);
		
			if(this.requestCount == 0) {			// Eliminamos los resultados anteriores si es la primera respuesta
				$(".resultPanelInfo").remove();
				$.mobile.loading( 'show', { theme: "a" } );
				this.$panel.panel("open");
				console.log("\t> abrimos panel");
			}
			
			var cartografia = getCartografiaByCodigo(event.features.carCodigo);
			this.requestCount++;
			
			var content = $('<div></div>').addClass("resultPanelInfo").appendTo(this.$contentDiv);
			$('<h3></h3>').html(cartografia.carNombre).appendTo(content);
			
			// Modificamos el html recivido para añadir fancybox
			var htmlText = $(event.text).appendTo(content);
			
			if(this.requestCount == event.features.numRequests) {
				console.log("\t> fin getInfo");
				$.mobile.loading('hide');
				this.requestCount = 0;
			}
		}
		else {
			console.log("No features recividas: ", event.features);
		}
		
	} 
	catch(e)
	{
		console.error("Error en tarea_identify.renderInfo()", e);
	}
};
