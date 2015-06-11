/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Control/WMSGetFeatureInfo.js
 */

/**
 * Class: OpenLayers.Control.WMSGetFeatureInfo
 * The WMSGetFeatureInfo control uses a WMS query to get information about a point on the map.  The
 * information may be in a display-friendly format such as HTML, or a machine-friendly format such
 * as GML, depending on the server's capabilities and the client's configuration.  This control
 * handles click or hover events, attempts to parse the results using an OpenLayers.Format, and
 * fires a 'getfeatureinfo' event with the click position, the raw body of the response, and an
 * array of features if it successfully read the response.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.NGWMSGetFeatureInfo = OpenLayers.Class(OpenLayers.Control.WMSGetFeatureInfo, {

	 /**
	 * String que indica si se formateara la información (HTML) o la reciviremos directamente del servidor (XML)
	 */ 
	serviceInfoURL: null,
		
	 /**
     * Constructor: <OpenLayers.Control.WMSGetFeatureInfo>
     *
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {
    	 OpenLayers.Control.WMSGetFeatureInfo.prototype.initialize.apply(this, arguments);
    },
	/**
     * Method: findLayers
     * Internal method to get the layers, independent of whether we are
     *     inspecting the map or using a client-provided array
     */
    findLayers: function() {

        var candidates = this.layers || this.map.layers;
        var layers = [];
        var layer, url;
        for(var i = candidates.length - 1; i >= 0; --i) {
            layer = candidates[i];
            if(layer instanceof OpenLayers.Layer.WMS &&
               //NG Si el layer tiene su cartografia a queryable entonces si debemos anadirlo  a la lista de layers a consultar
               layer.esQueryable &&
               (!this.queryVisible || layer.getVisibility())) {            		
            		url = OpenLayers.Util.isArray(layer.url) ? layer.url[0] : layer.url;
                // if the control was not configured with a url, set it
                // to the first layer url
                if(this.drillDown === false && !this.url) {
                    this.url = url;
                }
                if(this.drillDown === true || this.urlMatches(url)) {
                    layers.push(layer);
                }
            }
        }
        return layers;
    },
    
    
    /**
     * Method: request
     * Sends a GetFeatureInfo request to the WMS
     * 
     * Nexus Geografics
     * Extendido del WMSGetFeatureInfo para:
     * 1. url (No es la url del layer sino que es layer.urlQueryable; //cartografia.stmServicio.serInfourl o serUrl
     * 2. carCodigo //cartografia.carCodigo (para tipologia + campos a escoger)
     * 
     *
     * Parameters:
     * clickPosition - {<OpenLayers.Pixel>} The position on the map where the
     *     mouse event occurred.
     * options - {Object} additional options for this method.
     *
     * Valid options:
     * - *hover* {Boolean} true if we do the request for the hover handler
     */
    request: function(clickPosition, options) {
        var layers = this.findLayers();
        if(layers.length == 0) {
            this.events.triggerEvent("nogetfeatureinfo");
            // Reset the cursor.
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
            return;
        }

        options = options || {};
        if(false && this.drillDown === false) {
        	// agrupa capes segons servidor wms, fent una única petició.
            var wmsOptions = this.buildWMSOptions(this.url, layers,
                clickPosition, layers[0].params.FORMAT,layers[0].carCodigo);
            var request = OpenLayers.Request.GET(wmsOptions);

            if (options.hover === true) {
                this.hoverRequest = request;
            }
        } else {
        	// fa les peticions per separat, sense agrupar segons servidor wms.
            this._requestCount = 0;
            this._numRequests = 0;
            this.features = [];
            for(var i=0, len=layers.length; i<len; i++) {
            	this._numRequests++;
                var layer = layers[i];
                
                var wmsOptions = this.buildWMSOptions(layer.urlQueryable, [layer],
                        clickPosition, layer.params.FORMAT, layer.carCodigo);
                
                if(this.serviceInfoURL && this.serviceInfoURL != "") {
	                //this.serviceInfoURL = "../../map?";// TODO 
	                //this.serviceInfoURL = "http://sitmun2/sitmun_visor/map?"; // TODO
	                
	                // redirigim petició a servlet de formateig.
	                if(wmsOptions.params.INFO_FORMAT
							&& (wmsOptions.params.INFO_FORMAT.toLowerCase()=='text/xml' || wmsOptions.params.INFO_FORMAT.toLowerCase()=='application/vnd.ogc.gml')
							&& this.serviceInfoURL
					  ) 
	                	wmsOptions.url=this.serviceInfoURL+"wmsurl="+escape(wmsOptions.url);
	                
	                // afegim param cartoid per xslt
	                //url+=((url.indexOf("?")<0)?"?":"&")+"cartoid="+layer.carCodigo;
	                wmsOptions.params["cartoid"]=layer.carCodigo;
	                
	                // mas info: no suportat.
	                // params de sessió
	                var sessionObj=getSessionObject();
	                if (sessionObj.MUN_INES) wmsOptions.params["mun_ines"]=sessionObj.MUN_INES;//url+="&mun_ines="+sessionObj.MUN_INES;
					if (sessionObj.LANG)  wmsOptions.params["lang"]=sessionObj.LANG;//url+="&lang="+sessionObj.LANG;
				}
              
                //CIME-->Augmenta la precision del identify, utilitzado en AGS 9.2 en substitucion del RADIUS
                try{
					if(sitmunProperties && sitmunProperties["identify.radius"]){
						var precision=1;
						try{precision=parseInt(sitmunProperties["identify.radius"]);}catch(e){}
						
						if(precision<1){
							precision=1;
						}
						if(wmsOptions.params.X) wmsOptions.params.X=wmsOptions.params.X/precision;
						if(wmsOptions.params.Y) wmsOptions.params.Y=wmsOptions.params.Y/precision;
						//para versiones posteriores se envia i/j
						if(wmsOptions.params.I) wmsOptions.params.I=wmsOptions.params.I/precision;
						if(wmsOptions.params.J) wmsOptions.params.J=wmsOptions.params.J/precision;
						
						if(wmsOptions.params.WIDTH) wmsOptions.params.WIDTH=wmsOptions.params.WIDTH/precision;
						if(wmsOptions.params.HEIGHT) wmsOptions.params.HEIGHT=wmsOptions.params.HEIGHT/precision;
					}
                }catch(e){
                	console.error("Error en canviar radius en los parametros x,y, width, heigth",e);
                }
                    OpenLayers.Request.GET(wmsOptions);                
            }
        }
    },
    
    
    
    /**
     * Method: buildWMSOptions
     * Build an object with the relevant WMS options for the GetFeatureInfo request
     *
     * NexusGeografics 
     * Extendido para poder incluir las capas queryables de la cartografia //cartografia.carQuerylay
     * y el carCodigo para poder separar por tipologias
     *
     * Parameters:
     * url - {String} The url to be used for sending the request
     * layers - {Array(<OpenLayers.Layer.WMS)} An array of layers
     * clickPosition - {<OpenLayers.Pixel>} The position on the map where the mouse
     *     event occurred.
     * format - {String} The format from the corresponding GetMap request
     * carCodigo - Cartografia a la que pertenecen los features
     */
    buildWMSOptions: function(url, layers, clickPosition, format, carCodigo) {
        var layerNames = [], styleNames = []; cartoIds=[];
        for (var i = 0, len = layers.length; i < len; i++) {
        	if(layers[i].esQueryable && layers[i].capasQueryable){
        		layerNames = layerNames.concat(layers[i].capasQueryable);
             
        	}else if(layers[i].esQueryable && layers[i].params.LAYERS != null) {
                layerNames = layerNames.concat(layers[i].params.LAYERS);
            }
        	styleNames = styleNames.concat(this.getStyleNames(layers[i]));
        }
        var firstLayer = layers[0];
        // use the firstLayer's projection if it matches the map projection -
        // this assumes that all layers will be available in this projection
        var projection = this.map.getProjection();
        var layerProj = firstLayer.projection;
        if (layerProj && layerProj.equals(this.map.getProjectionObject())) {
            projection = layerProj.getCode();
        }
        
        
        /**Los valores por defecto hay que poner los que nos dice el administrador,
         * VERSION
         * 1.3 ( se envia I, J, CRS) 
         * Anteriores (X,Y, SRS)/
         */
        var params=new Object();
        /* VALORES POR DEFECTO*** 
         * var params = OpenLayers.Util.extend({
            service: "WMS",
            version: firstLayer.params.VERSION,
            request: "GetFeatureInfo",
            exceptions: firstLayer.params.EXCEPTIONS,
            bbox: this.map.getExtent().toBBOX(null,
                firstLayer.reverseAxisOrder()),
            feature_count: this.maxFeatures,
            height: this.map.getSize().h,
            width: this.map.getSize().w,
            format: format,
            info_format: firstLayer.params.INFO_FORMAT || this.infoFormat
        }, (parseFloat(firstLayer.params.VERSION) >= 1.3) ?
            {
                crs: projection,
                i: parseInt(clickPosition.x),
                j: parseInt(clickPosition.y)
            } :
            {
                srs: projection,
                x: parseInt(clickPosition.x),
                y: parseInt(clickPosition.y)
            }
        );*/
        
      //Buscamos la configuracion de la carto
        var carto = null;
        var trobat = false;
        for(var j in config.olConfig.cartografias) {
        	carto = config.olConfig.cartografias[j];
        	if(carto.carCodigo == firstLayer.carCodigo) { trobat = true; break; }
        }
        
        //Añadimos valores de info al wmsOptions
        if(trobat) {
        	for(var j in carto.stmServicio.stmParamsers) {
        		var param = carto.stmServicio.stmParamsers[j];
        		if(param.id.pseTipo == "INFO") {
        			params[param.id.pseNombre.toUpperCase()] = param.pseValor;
        		}
        	}
        }
        
        //Valores por defecto
        if(!params.SERVICE) params.SERVICE="WMS";
        if(!params.VERSION) params.VERSION= firstLayer.params.VERSION;
        if(!params.REQUEST) params.REQUEST= "GetFeatureInfo";
        if(!params.EXCEPTIONS) params.EXCEPTIONS= firstLayer.params.EXCEPTIONS;
        if(!params.BBOX) params.BBOX= this.map.getExtent().toBBOX(null,firstLayer.reverseAxisOrder());
        if(!params.FEATURE_COUNT) params.FEATURE_COUNT= this.maxFeatures;
        if(!params.FORMAT) params.FORMAT= format;
        if(!params.INFO_FORMAT) params.INFO_FORMAT= firstLayer.params.INFO_FORMAT || this.infoFormat;
        if(!params.WIDTH) params.WIDTH= this.map.getSize().w;
        if(!params.HEIGHT) params.HEIGHT= this.map.getSize().h;
       
        if(parseFloat(params.VERSION) >= 1.3){
        	params.CRS=projection;
        	params.I= parseInt(clickPosition.x);
        	params.J=parseInt(clickPosition.y);
        }        
        else{
        	params.SRS=projection;
        	params.X= parseInt(clickPosition.x);
        	params.Y=parseInt(clickPosition.y);
        }
        
        if (layerNames.length != 0) {
            params = OpenLayers.Util.extend({
                layers: layerNames,
                query_layers: layerNames,
                styles: styleNames
            }, params);
        }
        OpenLayers.Util.applyDefaults(params, this.vendorParams);
        return {
            url: url,
            params: OpenLayers.Util.upperCaseObject(params),
            callback: function(request) {
                this.handleResponse(clickPosition, request, url,carCodigo);
            },
            scope: this
        };
    },

    /**
     * Method: handleResponse
     * Handler for the GetFeatureInfo response.
     *
     *  NexusGeografics:
     *  Extendido para poder anadir el id de la cartografia a los features 
     *  y asi poder agrupar por tipologias
     *
     * Parameters:
     * xy - {<OpenLayers.Pixel>} The position on the map where the
     *     mouse event occurred.
     * request - {XMLHttpRequest} The request object.
     * url - {String} The url which was used for this request.
     */
    handleResponse: function(xy, request, url, carCodigo) {
    	console.log("handleResponse (" + carCodigo + "): ", request);
    	
    	var doc = request.responseXML;
        if(!doc || !doc.documentElement) {
            doc = request.responseText;
        }
        
        var features = null;
        if(this.serviceInfoURL && this.serviceInfoURL != "") {
        	features = {carCodigo: carCodigo, numRequests: this._numRequests};
        } else {
        	features = this.format.read(doc);
	    	
    	if(features instanceof Array) {
    		for (var i=0; i< features.length; i++)
    			features[i].carCodigo=carCodigo;
	    	} else features.carCodigo=carCodigo;
        }
        
        if (this.drillDown === false) {
            this.triggerGetFeatureInfo(request, xy, features);
        } else {
            this._requestCount++;
            if (this.output === "object") {
                this._features = (this._features || []).concat(
                    {url: url, features: features}
                );
            } else {
            this._features = (this._features || []).concat(features);
            }
            if (this._requestCount === this._numRequests) {
            	this.triggerGetFeatureInfo(request, xy, this._features.concat());
                delete this._features;
                delete this._requestCount;
                delete this._numRequests;
            }
        }
    },

    CLASS_NAME: "OpenLayers.Control.NGWMSGetFeatureInfo"
});