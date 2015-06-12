var vector = null;
var coordsMapa = null;
var moving=false;
/**
 * Accions a realitzar quan el doc estigui carregat.
 */
$(document).ready(function () {
	
});

/**
 * Refem el heigh en canviar orientaciï¿½ de mï¿½bil.
 */
//$(window).bind("orientationchange resize", fixContentHeight);
//$(window).bind("orientationchange resize pageshow", fixContentHeight);

//$("#mainContainer").on( "pagechange", function( event ) {
/*$(document).bind('pagechange', function() {
	console.log("mainContainer page Change");
	
	fixContentHeight();
} );*/


$(window).on("orientationchange",function(){
	fixContentHeight();
});


/**
* Ajusta el height del content perque OL ho ocupi tot.
*/
function fixContentHeight() {

	    document.getElementById('mapCanvas3').style.height = (parseInt(window.innerHeight) -210) + 'px';
	    document.getElementById('mapCanvas3').style.width = (window.innerWidth - 70) + 'px';    

		//Silme
		document.getElementById('mapa').style.width = ((window.innerWidth) - 0) + 'px';
		document.getElementById('mapa').style.height = ((window.innerHeight) - 250) + 'px';
		document.getElementById('dadesLoc').style.bottom = '0px';  	    
	
		var header = $("div[data-role='header']:visible"),
			footer = $("div[data-role='footer']:visible"),
		  	content = $("#mapa"),
		  	viewHeight = $(window).height(),
		  	contentHeight = viewHeight - footer.outerHeight() - header.outerHeight();
		  	//Silme
		  	//contentHeight = contentHeight + 250;
		
		console.log("viewHeight:"+viewHeight+" contentHeight:"+contentHeight);
		

		if ((content.outerHeight() + footer.outerHeight() + header.outerHeight()) !== viewHeight) {
			contentHeight -= (content.outerHeight() - content.height() + 1);
			console.log("new contentHeight:"+contentHeight);
			content.height(contentHeight);
		}

		
	  	//lanzamos un evento de resize para todos los elementos que se tengan que redimensionar puedan hacerlo
		console.log("lanzamos evento personalizado 'resizeContentHeight' para adaptar las medidad de los contenidos que lo necesiten.");
		var medidas = getMedidas();
		$(document).trigger("resizeContentHeight", medidas);
		
		if (window.map && window.map instanceof OpenLayers.Map) {
			map.updateSize();
			map3.updateSize();
			/*
			map.zoomIn();
			map.zoomOut();
			map3.zoomIn();
			map3.zoomOut();
			*/
			
		} else {
			//Inicialitzacio del mapa amb timeOut ja que a vegades no te temps de renderitzar tota la pagina
			//i OpenLayers te problemes en recuperar el height del mapa
			//setTimeout(mapInit(), 2000);
			mapInit();
		}

	

	
}

/**
 * 
 * @returns {___anonymous1946_2161}
 */
function getMedidas() {
	
	var header = $("div[data-role='header']:visible"),
		footer = $("div[data-role='footer']:visible"),
		viewHeight = $(window).height(),
		contentHeight = viewHeight - footer.outerHeight() - header.outerHeight();
	
	var medidas = {
		viewHeight: viewHeight,
		contentHeight: contentHeight,
		footerHeight: footer.outerHeight(),
		headerHeight: header.outerHeight(),
		footerWidth: footer.outerWidth(),
		headerWidth: header.outerWidth()
	};
	
	if(!footer.outerHeight()) medidas["footerHeight"] = 0;
	if(!header.outerHeight()) medidas["headerHeight"] = 0;
	if(!footer.outerWidth()) medidas["footerWidth"] = 0;
	if(!header.outerWidth()) medidas["headerWidth"] = 0;
	
	return medidas;
}

//------------- METODOS PARA EL DEBUG EN DISP. MOVILES -----
function deb() {
	fixContentHeight();
}
	
function consoleObj(){
	this.log=function (v) {
		$("#debres").html($("#debres").html()+"<br/>"+v);
	};
	this.clear=function () {
		$("#debres").html("");
	};
}

if (!console) {
	console=new consoleObj();
	console.clear();
}
//-------------------------------------------------------------

/**
 * Inicializaciï¿½n del mapa.
 */
var getFeatureInfoLayer = null;
function mapInit() {
	try {
		//alert(mapInit);
	    creaMap3();		
		
		console.log("mapInit");
		var olConfig=config.olConfig;
		
		map = new OpenLayers.Map('mapa', { 
			theme: null,
	        controls: [
	            //new OpenLayers.Control.Attribution(),
	            new OpenLayers.Control.TouchNavigation({
	                dragPanOptions: {
	                    enableKinetic: true
	                }
	            }),
	            new OpenLayers.Control.Zoom({zoomInText: "", zoomOutText: ""})
	        ]
	    });

		getFeatureInfoLayer = new OpenLayers.Control.NGWMSGetFeatureInfo({
            //url: 'http://demo.opengeo.org/geoserver/wms',
			title: 'Identify',
            queryVisible: true,
            drillDown: true,
            infoFormat: "text/xml",
            eventListeners: asignarListener(),
            serviceInfoURL: getServiceInfoURL()
        });
		
        map.addControl(getFeatureInfoLayer);
        //getFeatureInfoLayer.activate();
        
		setMapConfig(olConfig,map);
		setMapLayers(olConfig,map);
		
		try {
			if(debugOn) {
				var ls=new OpenLayers.Control.LayerSwitcher();
				map.addControl(ls);
				ls.maximizeControl();
			}
		} catch (e) {
			console.warn("Error añadiendo LayerSwitcher");
		}
		
		map.events.register("moveend", map, function(){
			coordsMapa = new OpenLayers.LonLat(map.getCenter().lon, map.getCenter().lat);
			
		    var myPos2 = coordsMapa;
		    var myPosLon2;
		    var myPosLat2;
		    
		    if (srsCoords=="WSG84")
		    {
				myPos2.transform(new OpenLayers.Projection("EPSG:25831"), new OpenLayers.Projection("EPSG:4326"));
			    myPosLon2 = parseFloat(myPos2.lon).toFixed(4);
			    myPosLat2 = parseFloat(myPos2.lat).toFixed(4);
		    }
		    else{
			    myPosLon2 = parseInt(myPos2.lon).toFixed(0);
			    myPosLat2 = parseInt(myPos2.lat).toFixed(0);
		    }			
			
			//alert(srsCoords + " " + myPos2.lon + " " + myPos2.lat + " " + myPosLon2 + " " + myPosLat2);
			
			if (currentIdioma=="ca")
			{
				document.getElementById("locDataTop").innerHTML="&nbsp;<b>Centre del Mapa</b> X: " + myPosLon2 + ", Y: " + myPosLat2;	
			}
			if (currentIdioma=="es")
			{
				document.getElementById("locDataTop").innerHTML="&nbsp;<b>Centro del Mapa</b> X: " + myPosLon2 + ", Y: " + myPosLat2;	
			}
			
			
		});
		
		
		addGeolocateControl();
			
		// centrado inicial del mapa.
	    try {
	    	if (wktInit!=null) {
	    		map.zoomToExtent(OpenLayers.Geometry.fromWKT(wktInit).getBounds());
	    	} else if (scaleInit!=null) {
	        	map.zoomToScale(parseFloat(scaleInit),true);
	        } else if (bboxInit!=null) {
	        	map.zoomToExtent(OpenLayers.Bounds.fromString(bboxInit),true);
	        } else map.zoomToMaxExtent();
	    } catch(e) {
	    	console.warn("Error inicializando extensiï¿½n inicial.",e);
	    	map.zoomToMaxExtent();
	    }
	    // lanzamos un evento para informar que el mapa ya esta cargado.
	    $(document).trigger("openLayerMap_loaded");
	} catch (e) {
		//console.error("Error inicializando mapa: ",e);
		alert("Error inicializando mapa: ",e.toString())
	}
}

/**
 * Aï¿½ade el control de geolocalizaciï¿½n a OL.
 * basado en ejemplo: http://openlayers.org/dev/examples/geolocation.html
 */
function addGeolocateControl() {
	try {
		vector = new OpenLayers.Layer.Vector(
			'geolocateVector',
            {
                styleMap: new OpenLayers.StyleMap({
                    "default": {
                        externalGraphic: "${icon}",
                        graphicWidth: "${width}",
                        graphicHeight: "${height}",
                        labelYOffset: 25,
                        graphicYOffset: -19,
                        rotation: "${rotacio}",
                        label: "${etiqueta}"
                    }
                })
            });
		
		
		map.addLayers([vector]);
		
		/*
		var pulsate = function(feature) {
		    var point = feature.geometry.getCentroid(),
		        bounds = feature.geometry.getBounds(),
		        radius = Math.abs((bounds.right - bounds.left)/2),
		        count = 0,
		        grow = 'up';

		    var resize = function(){
		        if (count>16) {
		            clearInterval(window.resizeInterval);
		        }
		        var interval = radius * 0.03;
		        var ratio = interval/radius;
		        switch(count) {
		            case 4:
		            case 12:
		                grow = 'down'; break;
		            case 8:
		                grow = 'up'; break;
		        }
		        if (grow!=='up') {
		            ratio = - Math.abs(ratio);
		        }
		        feature.geometry.resize(1+ratio, point);
		        vector.drawFeature(feature);
		        count++;
		    };
		    window.resizeInterval = window.setInterval(resize, 50, point, radius);
		};

		
		var geolocate = new OpenLayers.Control.Geolocate({
		    bind: false,
		    geolocationOptions: {
		        enableHighAccuracy: false,
		        maximumAge: 0,
		        timeout: 7000
		    }
		});
		map.addControl(geolocate);
		
		geolocate.events.register("locationupdated",geolocate,function(e) {
			console.log("geolocate locationupdated",e);
			$.mobile.hidePageLoadingMsg( 'Searching' );
		    vector.removeAllFeatures();
		    if (!map.getMaxExtent().containsLonLat(new OpenLayers.LonLat(e.point.x,e.point.y))) {
		    	alert(nls.MA_GEOLOCATE_LIMITES);
		    	return;
		    }
		    var circle = new OpenLayers.Feature.Vector(
		        OpenLayers.Geometry.Polygon.createRegularPolygon(
		            new OpenLayers.Geometry.Point(e.point.x, e.point.y),
		            e.position.coords.accuracy/2, //L'exactitud dividit per 2 pel radi
		            40,
		            0
		        ),
		        {},
		        { 
		          fillColor: '#000',
				  fillOpacity: 0.1,
				  strokeWidth: 0
		        }
		    );
		    vector.addFeatures([
		        new OpenLayers.Feature.Vector(
		            e.point,
		            {},//attributes
		            {
		            	 externalGraphic: "img/target32.png",
		 	             graphicOpacity: 1.0,
		 	             graphicWidth: 16,
		 	             graphicHeight: 26,
		 	             graphicYOffset: -26
		            }
		        ),
		        circle
		    ]);
		   
		    try{
	    		  escala= parseFloat(sitmunProperties["reneix.escalaGeoLocalizacion"]);	
	    	}catch(e){console.error("Falta definir una escala",e);}
	    		
	    	console.log("\t escala: ",escala);
	    	if (escala>0)map.zoomToScale(escala, true);
	    	map.setCenter(vector.getDataExtent().getCenterLonLat());
		    pulsate(circle);
		});
		geolocate.events.register("locationfailed",this,function() {
			$.mobile.hidePageLoadingMsg( 'Searching' );
		    OpenLayers.Console.log('Location detection failed');
		});
		*/
	} catch (e) {
		console.error("Error en addGeolocateControl: ",e);
	}
}

var timer_geolocate;
function initGeolocate() {
	clearTimeout(timer_geolocate); //Amb aixï¿½ es  pot prevenir fer peticions a cada click en el checkbox.  Si es cliquen en < x ms, no s'executa
	timer_geolocate=setTimeout(function(){									  
										doGeolocate();												
									},1000);
}

function initGeolocate9() {
	alert("geolocate9");
}

function doGeolocate(){	
	$.mobile.showPageLoadingMsg( 'Searching' );
	var vector=map.getLayersByName("geolocateVector")[0];
	var geolocate = map.getControlsByClass("OpenLayers.Control.Geolocate")[0];
	
	vector.removeAllFeatures();
    geolocate.deactivate();
    geolocate.watch = false;
    geolocate.activate();
}

function maxExtensionMap () {
	map.zoomToMaxExtent();
}

/**
* Configuraciï¿½n de proyecciones, extensiones, escalas, resoluciones
*/
function setMapConfig(olConfig,map) {
	if (olConfig.projection!=null && olConfig.projection.length>0){
		map.projection=olConfig.projection;
	}
	if (olConfig.units!=null && olConfig.units.length>0){
		map.units=olConfig.units;
	}
	if (olConfig.tilesizeX!=null && olConfig.tilesizeY!=null){
		map.tileSize=new OpenLayers.Size(olConfig.tilesizeX,olConfig.tilesizeY);
	}
	if (olConfig.extensionMaximaXMin>0 && olConfig.extensionMaximaXMax>0 && olConfig.extensionMaximaYMin>0 && olConfig.extensionMaximaYMax>0){
		var b=new OpenLayers.Bounds(olConfig.extensionMaximaXMin,olConfig.extensionMaximaYMin,olConfig.extensionMaximaXMax,olConfig.extensionMaximaYMax);
		map.maxExtent=b;
	} else {
		console.error("Territorio sin extensiï¿½n mï¿½xima definida. Revisa la configuraciï¿½n del territorio.");
		map.maxExtent=new OpenLayers.Bounds(250425,4506575,580700,4677900);
	}
	if (olConfig.extensionRestringidaXMin>0 && olConfig.extensionRestringidaXMax>0 && olConfig.extensionRestringidaYMin>0 && olConfig.extensionRestringidaYMax>0){
		var b=new OpenLayers.Bounds(olConfig.extensionRestringidaXMin,olConfig.extensionRestringidaYMin,olConfig.extensionRestringidaXMax,olConfig.extensionRestringidaYMax);
		map.restrictedExtent=b;
	}
	if (olConfig.scales!=null && olConfig.scales.length>0){
		var limitScaleByTerritorio=sitmunProperties["mapa.lista.escalas"] && sitmunProperties["mapa.lista.escalas"]=="territorio";
		//var idealResolution = Math.max( map.maxExtent.getWidth()  / map.getSize().w,
		//		map.maxExtent.getHeight() / map.getSize().h );
		//console.log("idealResolution scale",OpenLayers.Util.getScaleFromResolution(idealResolution,map.units));
		var resArray=new Array();
		for(var nesc=olConfig.scales.length-1;nesc>=0;nesc--){
			var res;
			// si han especificado las resoluciones, las utilizamos antes que el scale calculado, para evitar errores de calculo.
			if (typeof(olConfig.resolutions)!="undefined" && olConfig.resolutions!==null && olConfig.resolutions.length>0) res=olConfig.resolutions[nesc];
			else res=OpenLayers.Util.getResolutionFromScale(olConfig.scales[nesc],map.units);
			//console.log(idealResolution,"    ",olConfig.scales[nesc],"   ", res, "     ",(res<=idealResolution));
			 resArray.push(res);
			// si el scale ya cubre la extensiï¿½n necesaria para ver todo el territorio, despreciamos el resto.
			// if (limitScaleByTerritorio && res>idealResolution) nesc=-1;
		}
		map.resolutions=resArray.reverse();
	} 
}

/**
 * 
 * @param functionIni
 * @param functionEvent
 */
var layerCenter = null;
function addMarkerCenter(functionIni, functionEvent) {
	
	/*Creamos marker de centro par aseguimiento del centro*/
	var center = map.getCenter();
	layerCenter = new OpenLayers.Layer.Markers( "center_marker" );
	layerCenter.setVisibility(false);
	map.addLayer(layerCenter);
	var size = new OpenLayers.Size(30, 30);
	var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
	var icon = new OpenLayers.Icon('img/locate-high.png', size, offset);
	layerCenter.addMarker(new OpenLayers.Marker(center, icon));
	
	functionIni();
	
	/*Aï¿½adimos evento al map para el seguimiento del centro de este*/
	map.events.register("moveend", map , function(e) { 
		layerCenter.clearMarkers();
		layerCenter.addMarker(new OpenLayers.Marker(map.getCenter(), icon));
		
		functionEvent();
	});
}

/**
 * Inicializaciï¿½n de los layers de OL al inicial el visor
 * @param olConfig
 * @param map
 * @return
 */
function setMapLayers(olConfig,map) {
	try {
		// creamos lista con los ids de carto de fondo. estos deben inicializarse siempre
		var fondoCartoIds=new Array();
		for (var i=0; i<olConfig.cartografiaFondo.length; i++) {
			//console.log("setMapLayers >>>>",olConfig.cartografiaFondo[i].cartoCodigos);
			fondoCartoIds=fondoCartoIds.concat(olConfig.cartografiaFondo[i].cartoCodigos);
		}
		//console.log("setMapLayers.fondoCartoIds ",fondoCartoIds);
		
		// recorrem services del legend per anar definint layers de l'OL.
		var numberOfLayers=olConfig.cartografias.length;
	
		// posem sempre un layer buit.
		var base = new OpenLayers.Layer("dummy",{isBaseLayer: true});
		map.addLayer(base);
	
		for (var i=0; i<numberOfLayers; i++) {
			var cartografia=olConfig.cartografias[i];
			
			//var isFondo=dojo.indexOf(fondoCartoIds,cartografia.carCodigo)>-1;
			var isFondo=fondoCartoIds.indexOf(cartografia.carCodigo)>-1;
			//console.log("setMapLayers  ",cartografia,"   ",isFondo);
			// creamos layers si estan visibles, si tienen el identify activado o si la cartografia forma parte de un fondo
			if (cartografia.carVisible==1 
					/*|| cartografia.carQueryact==1 // al hacer info solo con layers activos, ya no hace falta mantenerlos a no visibles en OL. */
					|| isFondo 
			) {
				var layer=createLayerOL(cartografia,isFondo);
				//console.log("   added");
			}
		}// for
	} catch (e) {
		console.error ("Error a setMapLayers()",e);
	}
}

/**
 * Crea el layer OL a partir de la configuraciï¿½n del objeto cartografia del param.
 * 
 * @param cartografia la definiciï¿½n del layer
 * @param isFondo Defecto=false. Indica si el layer a crear es para un boton de fondo, en cuyo caso se asigna un efecto de resize.
 * @param addToMap Defecto=true. Aï¿½adir el layer al mapa principal, o bien solo definirlo y devolver la referencia. (para mapa_situacion.js)
 * @return el layer OL.
 */
function createLayerOL(cartografia,isFondo,addToMap) {
	try {
		if (typeof(isFondo)=="undefined") isFondo=false;
		if (typeof(addToMap)=="undefined") addToMap=true;
		
		var layers=map.getLayersByName(cartografia.carCodigo);
		if (addToMap && layers.length>0) {
			console.info("createLayerOL: El layer ya existe en OL. carCodigo='"+cartografia.carCodigo+"'");
			return layers[0];
		}
		var service=cartografia.stmServicio;
		// Para ciertos tipos que no son wms, tambien queremos que se aï¿½adan los parametros de url.
		var serTipo=cartografia.stmServicio.serTipo;
		if (serTipo=="TC"||serTipo=="TILECACHE"||serTipo=="ARCGISSERVER") serTipo="WMS";
		var serviceUrlParams=getParamsObj(service.stmParamsers,serTipo);
		
		var serviceLayerParams=getParamsObj(service.stmParamsers,"OLPARAM");
		//console.log("carto: "+cartografia.id+" ("+service.tipo+") limites: "+cartografia.escalaMin+"  "+cartografia.escalaMax);
		
		//alert(cartografia.stmServicio.serInfourl? cartografia.stmServicio.serInfourl:cartografia.stmServicio.serUrl + "  " + cartografia.carQueryabl + "  " + cartografia.carQuerylay);
		
		var otherParams={
			visibility: cartografia.carVisible==1,
			singleTile: true,
			ratio:1, // ratio del width a ampliar en la imagen.
			transitionEffect:(isFondo==true)?"resize":"",
			opacity: 1-cartografia.carTransp/100
			,displayOutsideMaxExtent: true
			,order:cartografia.carOrden//importante!
			,isBaseLayer: false
			,carCodigo: (isFinite(cartografia.carCodigo))?cartografia.carCodigo:null // para WMC. solo ponemos si es de sitmun. Los del visor dejamos a null.
			,projection:service.serProjects
			,tematico:(cartografia.tematico)?true:false
			,tematicoUrl:(cartografia.tematico)?service.serUrl:""
			//Si la cartografia es queryable lo aï¿½adimos al layer para preguntarlo en el WMSGetFeatureInfo
			,esQueryable:cartografia.carQueryabl
			,capasQueryable:cartografia.carQuerylay
			,urlQueryable:cartografia.stmServicio.serInfourl? cartografia.stmServicio.serInfourl:cartografia.stmServicio.serUrl
		};
		
		// definimos escala mï¿½nima i mï¿½xima.
		var minScaleOn=false;
		if (cartografia.carEscMin!==null && !isNaN(parseFloat(cartografia.carEscMin))){
			otherParams.minResolution=OpenLayers.Util.getResolutionFromScale(parseFloat(cartografia.carEscMin),map.units);// l'escala especificada es visualitzarï¿½.
			otherParams.alwaysInRange=false;
			minScaleOn=true;
		}
		if (cartografia.carEscMax!==null && !isNaN(parseFloat(cartografia.carEscMax)) && cartografia.carEscMax>0){
			otherParams.maxResolution=OpenLayers.Util.getResolutionFromScale(parseFloat(cartografia.carEscMax),map.units);
			otherParams.alwaysInRange=false;
		} else if (minScaleOn) {
			otherParams.maxResolution=map.getMaxResolution();
		}
		// sobreescribimos los param. por defecto del layer
		for (param in serviceLayerParams) otherParams[param]=(serviceLayerParams[param]==null)?'':serviceLayerParams[param];
		//console.log("layer otherParams : ",service.serCodigo,otherParams);
		
		// si la url necesita autenticaciï¿½n, aï¿½adimos el proxy.
		//PARA PETICIONES DINAMICAS CON AUTORIZACION
		var needsAuth=sitmunProperties["proxy.serverurl"]!=null && service.serUrl.indexOf(sitmunProperties["proxy.serverurl"])>-1 || service.serAuth;
		//Miramos tambien la autorizacion para varios wms
		var i=1;
		while(sitmunProperties["proxy.wms."+i+".serverurl"] !=null){
			if(service.serUrl.indexOf(sitmunProperties["proxy.wms."+i+".serverurl"])>0){
				needsAuth=true;
				break;
			}
			i++;
		}
		var j=1;
		while(sitmunProperties["proxy.wfs."+j+".serverurl"] !=null){
			if(service.serUrl.indexOf(sitmunProperties["proxy.wfs."+j+".serverurl"])>0){
				needsAuth=true;
				break;
			}
			j++;
		}
		urlProxy		= "http://ide.cime.es/sitmun/proxy?url=";
		var url=(proxyOn && needsAuth)?urlProxy+escape(service.serUrl):service.serUrl;
		
		//alert(url + "\n " + urlProxy + "\n" + proxyOn + "\n" + needsAuth);
		
		
		// revisamos que el mï¿½todo para este tipo de capa este definido.
		if (window["createLayer"+service.serTipo.toUpperCase()]) {
			// creamos el layer OL dependiendo del tipo. A partir del tipo deducimos el mï¿½todo a llamar para crearlo.
			var func=eval("createLayer"+service.serTipo.toUpperCase());// mï¿½todos definidos en el layers.js

			//console.log("createLayer function: ",func,cartografia.carNombre);
			
			
			if (func==null || typeof(func)!="function") { 
				console.error("Cartografia con tipo desconocido. carto:'"+cartografia.carCodigo + "' tipo:'"+service.serTipo+"'");
			} else {
				var layer = func(cartografia.carCodigo,replaceSessionParams(url),cartografia.carCapas,serviceUrlParams,otherParams, cartografia, addToMap);
				if (layer != null){
				//Puede ser que el layer no le haya dado tiempo a crearse caso WFS cuando tiene que investigar el GeometryName i FeatureNS
				
					layer.carNombre=cartografia.carNombre;// aï¿½adimos nombre para mostrarlo en el layer switcher
					layer.order=cartografia.carOrden;//importante!
					if(cartografia.carTransp != null) layer.setOpacity((100 - cartografia.carTransp)/100);
					if (addToMap) {
						map.addLayer(layer);
						raiseLayerOrder(layer);
					}
					if (layer.CLASS_NAME=="OpenLayers.Layer.Vector") {
						// workaround: al aï¿½adir por 1a vez un layer vector, no lo dibuja correctamente.
						layer.redraw();
					}
				}
			}
			return layer;
		} else {
			alert("Error: Capa con un tipo no soportado: "+service.serTipo.toUpperCase());
			return null;
		}
	} catch (e) {
		console.error ("Error a createLayerOL()",e);
		alert("cartografia: " + cartografia.carCodigo)
		return null;
	}
}

/**
 * Genera un objeto a partir de un array de una tabla de XXX_PARAMS para facilitar su uso.
 * Si tipoFilter<> null filtra los elementos cuyo tipo sea el indicado.
 * 
 * @param paramsArray
 * @param tipoFilter
 * @return
 */
function getParamsObj(paramsArray,tipoFilter) {
	var ret=new Object();
	for (var i=0; i<paramsArray.length; i++) {
		var item=paramsArray[i];
		if (tipoFilter==null || item.id.pseTipo.toLowerCase()==tipoFilter.toLowerCase()) {
			var obj=new Object();
			ret[item.id.pseNombre/*.toUpperCase()*/]=item.pseValor;
		}
	}
	return ret;
}

/**
* Devuelve el string pasado con las substituciones de los parï¿½metros de sesiï¿½n.
* 
* ejemplo:
* 		replaceSessionParams("SELECT * FROM table_name WHERE mun_ine ='${MUN_INE}'");
* 
* @param inputString
* @return
*/
function replaceSessionParams(inputString) {
	try {
		//return dojo.string.substitute(inputString,getSessionObject());
		console.warn("replaceSessionParams: METODE A IMPLEMENTAR EN JQUERY");
		return inputString;
	} catch (e) {
		console.log("Error en replaceSessionParams()",e.message);
	}
		
}

/**
 * Modifica el orden del layer pasado por param segun el valor del atributo order.
 * Ojo: puede haber layers que no se vean en el layerSwitcher pero que esten en la lista.
 * @param layer
 * @return
 */
function raiseLayerOrder(layer) {
	var overlayLayers=map.layers;//map.getLayersBy("CLASS_NAME","OpenLayers.Layer.WMS");

	// recorrem els layers mirant el seu order per calcular la posiciï¿½ on ha d'anar.
	var len=overlayLayers.length;
	if (len>1) {
		var i=len-2; var delta=0;
		var currentOrder=overlayLayers[len-1].order;
		if (typeof(currentOrder)=="undefined") console.error("Error aplicando ordenacion en raiseLayerOrder();");
		while (i>=0 && (typeof(overlayLayers[i].order)=="undefined" // layers que no tengan orden, ponemos arriba del resto. 
						|| currentOrder<overlayLayers[i].order)){
			i--;delta++;
		}
		if (delta>0) map.raiseLayer(layer,-delta);
	}
}

/**
* Evento de click en uno de los layers de selecciï¿½n de capas.
*/
function layerChanged(cartoid,elem) {
	console.log(cartoid,$(elem));

	var type=$(elem).attr("type");
	var checked=elem.checked;

	console.log("type: "+type+" visibility: ",checked);

	if (type=="checkbox") {
		mapChangeVisibility(null,cartoid,checked);

	} else if (type=="radio") {
		var radioName = $(elem).attr("name");

		$(".layersradio").each(function(){ 
		    //console.log(">>> ",$(this).val());
		    mapChangeVisibility(null,$(this).val(),false);
		});

		//activamos layer seleccionado
		mapChangeVisibility(null,cartoid,true);
	}


	/*
	if(check_anterior != check_actual) {
		//this._changeVisibility(check_anterior, false);
		//this._changeVisibility(check_actual, true);
		mapChangeVisibility(null,cartoid,true);
		$('#' + radioName).val(id);
	}
	*/
}

/**
 * Modifica la visibilidad de la cartografia del param.
 * Llamada realizada en el arbol.
 * @param id no utilizado
 * @param cartoid
 * @param visibility
 * @return
 */
function mapChangeVisibility(id,cartoid,visibility) {
	console.log("> mapChangeVisibility cartoid: "+cartoid+" visibility: "+visibility);
	try {
		if (cartoid==0) return;	// carpeta: nada a hacer.
		
		var cartografia=getCartografiaByCodigo(cartoid);
		var layers=map.getLayersByName(cartoid);
		
		if (cartografia==null) console.warn("mapChangeVisibility: Cartografia no encontrada para el id="+cartoid);
		cartografia.carVisible=visibility;
	
		if (visibility){
			// aï¿½adimos nuevo layer
			if (layers.length>0) {
				console.warn("Intentando hacer visible un layer existente. Es normal si tiene el info activo.");
				layers[0].setVisibility(visibility);
				if(cartografia.carTransp != null) layers[0].setOpacity((100 - cartografia.carTransp)/100);
			} else {
				console.log("mapChangeVisibility carto ",cartografia);
				createLayerOL(cartografia);
			}
		} else {
			if (layers.length>0) {
				/*if (cartografia.carQueryact) layers[0].setVisibility(visibility);// identify on: mantenemos layer + no visible
				else layers[0].destroy();// identify off: eliminamos layer*/
				
				// al hacer info solo con layers activos, ya no hace falta mantenerlos a no visibles en OL.
				layers[0].destroy();
			}
		}
	} catch (e) {
		console.error(e);
	}
}


/**
 * Obtiene el objeto cartografia con el codigo del param. Si no lo encuentra devuelve null.
 * @param codigo
 * @return
 */
function getCartografiaByCodigo(codigo) {
	var found=false;
	var i=0;
	while (!found && i<config.olConfig.cartografias.length){
		if (config.olConfig.cartografias[i].carCodigo==codigo) found=true;
		else i++;
	}
	if (found)return config.olConfig.cartografias[i];
	else return null;
}

/*
initBuscadorCarrersDone=false;
function navBarClick() {
	try {

		var subMenuItem = $(this).text();
		console.log("navBarClick: ",subMenuItem);
		if (subMenuItem.trim()==nls.MA_CERCA) {
			// click a cerca
			//initBuscador();
			
		} else if (subMenuItem.trim()==nls.MA_DIRECCION && !initBuscadorCarrersDone) {
			initBuscadorCarrers();
			initBuscadorCarrersDone=true;
		}
	} catch(e) {
		console.error("Error a navBarClick()",e);
	}
}*/


/**
 * Afegeix un marcador a la geometria WKT passada i torna a la plana del mapa.
 * 
 * @param the_geom
 */
function addMarker(the_geom) {
	try{
		if(!the_geom) return;
		// convertimos wkt a feature
	    var wkt = new OpenLayers.Format.WKT();
	    var features = wkt.read(the_geom);
	    
	    //volvemos a mapa
	    $.mobile.changePage('#mainContainer');
	    //mostramos resultado en OL
	    var localizadorLayer=getLayerBuscador();
	    localizadorLayer.addFeatures(features);

		escala= parseFloat(sitmunProperties["reneix.escalaCandidato"]);	
		
		console.log("\t escala: ",escala);
		if (escala>0)map.zoomToScale(escala, true);					
		map.setCenter(features.geometry.getBounds().getCenterLonLat());		
	}catch(e){console.error("Error en addMarker",e);}
}

/**
 * Aï¿½ade un layer OL para mostrar los resultados de la busqueda.
 * En caso de encontrar el layer ya definido, elimina los features que tenga.
 * @returns
 */
function getLayerBuscador() {
	 if (map.getLayersByName("buscador").length==0) {
     	var layerOptions={
 				displayInLayerSwitcher:true,
 	            styleMap: new OpenLayers.StyleMap({
 	                externalGraphic: "http://ide.cime.es/sitmun/mobile/reneix/img/mobile-loc.png",
 	                graphicOpacity: 1.0,
 	                graphicWidth: 16,
 	                graphicHeight: 26,
 	                graphicYOffset: -26,
 	                fillColor: "green", fillOpacity: 1, strokeColor: "black"
 	            })
 	            //,rendererOptions: {zIndexing: true}
 	        };
 		var localizadorLayer=new OpenLayers.Layer.Vector("buscador",layerOptions);
 		map.addLayer(localizadorLayer);
 		return localizadorLayer;
     } else {
    	 var localizadorLayer=map.getLayersByName("buscador")[0];
    	 localizadorLayer.removeAllFeatures();
    	 return localizadorLayer;
    	 
     }
}

/**
* Devuelve un objeto con todos los parï¿½metros de sesiï¿½n actuales.
*/
function getSessionObject() {
	try {
		var obj=new Object();
		obj.MUN_INE=config.territorioCodigo;
		obj.EXTENSION_MAX_X0=config.olConfig.extensionMaximaXMin;
		obj.EXTENSION_MAX_Y0=config.olConfig.extensionMaximaYMin;
		obj.EXTENSION_MAX_X1=config.olConfig.extensionMaximaXMax;
		obj.EXTENSION_MAX_Y1=config.olConfig.extensionMaximaYMax;
		obj.APP_CODIGO=config.aplicacionId;
		obj.TER_CODIGO=config.territorioId;
		obj.USU_CODIGO=config.usuarioId;
		obj.PROYECCION=config.olConfig.projection;
		obj.LANG=OpenLayers.Lang.getCode();//se establece en visor.jsp
		obj.DATE = new Date().format("d/m/Y H:i:s");
		obj.USUARIO=config.usuario;
		try {
			// controlamos errores el llamadas antes de inic. el mapa.
			obj.CENTRO=map.getCenter().toShortString();
			obj.EXTENSION=map.getExtent().toBBOX();
			obj.ESCALA=Math.round(map.getScale());
			obj.CENTRO_X=map.getCenter().lon;
			obj.CENTRO_Y=map.getCenter().lat;
		} catch(e) {}
		if (config.territorioCodigosIne) obj.MUN_INES=config.territorioCodigosIne.join(",");
		else obj.MUN_INES=null;
		return obj;
		} catch(e) {
			console.error("Error a getSessionObject()",e);
		}
}

//Simulates PHP's date function (http://jacwright.com/projects/javascript/date_format)

Date.prototype.format = function(format) {
	var returnStr = '';
	var replace = Date.replaceChars;
	for (var i = 0; i < format.length; i++) {
		var curChar = format.charAt(i);
		if (replace[curChar]) {
			returnStr += replace[curChar].call(this);
		} else {
			returnStr += curChar;
		}
	}
	return returnStr;
};
Date.replaceChars = {
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	
	// Day
	d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
	D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
	j: function() { return this.getDate(); },
	l: function() { return Date.replaceChars.longDays[this.getDay()]; },
	N: function() { return this.getDay() + 1; },
	S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
	w: function() { return this.getDay(); },
	z: function() { return "Not Yet Supported"; },
	// Week
	W: function() { return "Not Yet Supported"; },
	// Month
	F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
	m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
	M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
	n: function() { return this.getMonth() + 1; },
	t: function() { return "Not Yet Supported"; },
	// Year
	L: function() { return (((this.getFullYear()%4==0)&&(this.getFullYear()%100 != 0)) || (this.getFullYear()%400==0)) ? '1' : '0'; },
	o: function() { return "Not Supported"; },
	Y: function() { return this.getFullYear(); },
	y: function() { return ('' + this.getFullYear()).substr(2); },
	// Time
	a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
	A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
	B: function() { return "Not Yet Supported"; },
	g: function() { return this.getHours() % 12 || 12; },
	G: function() { return this.getHours(); },
	h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
	H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
	i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
	s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
	// Timezone
	e: function() { return "Not Yet Supported"; },
	I: function() { return "Not Supported"; },
	O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
	P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':' + (Math.abs(this.getTimezoneOffset() % 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() % 60)); },
	T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
	Z: function() { return -this.getTimezoneOffset() * 60; },
	// Full Date/Time
	c: function() { return this.format("Y-m-d") + "T" + this.format("H:i:sP"); },
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
};

/**
 * Cierra el menu principal si la pantalla ï¿½s de tamaï¿½o movil.
 *
 */
function cerrarMenuMobil(btnId) {

	var btn = $('#' + btnId);
	if(btn.attr("status") == "open") btn.click();
}

/**
 * 
 */
function tareasInit() {
	try {
		if (typeof(tareas)!="undefined") {
			for (var i=0; i<tareas.length; i++) {
				try {
					var nombreTarea=tareas[i].name;
					// tarea edicion inicializaciï¿½n especial: para poder instanciar varias veces.
					if(tareas[i].name=="edicion") tareas[i].ref=eval("tarea_"+nombreTarea+"=new Tarea_"+nombreTarea+"();");
					else tareas[i].ref=eval("tarea_"+nombreTarea+"=new tarea_"+nombreTarea+"();");
					
					tareas[i].init=true;//indicador de inic. correcta
					if(tareas[i].name=="tematicos" && tematicoIdInicio != null)
						tarea_tematicos.tematicoInicio=tematicoIdInicio;
					
					
				} catch (e) {
					console.error("Error inicializado tarea: "+nombreTarea);
					tareas[i].init=false;
				}
			}
		} else console.warn("tareasInit: Ninguna tarea definida.");
	} catch (e) {
		alert ("Error a tareasInit()\n"+e.message);
	}
}
