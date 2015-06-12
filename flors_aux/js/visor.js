// referencia al mapa
var map;
// objeto con la config. recibida por json
var treeData;
// menu contextual del arbol
var treeContextMenu;
//menu contextual del mapa
var mapContextMenu;
// array con la lista de cambios del arbol para aplicar en hacer click al boton de aplicar.
var refreshActionsStack=new Array();

var visible=true;// workaround pel bug en IE que fa que no carregui l'arbre.
// referencia al panel principal de herramientas
var toolsPanel;

// inicializadores a ejecutar en cargarse la plana.
dojo.addOnLoad(mapInit);
dojo.addOnLoad(legendQuery);
dojo.addOnLoad(tareasInit);
//dojo.addOnLoad(addLayoutSplitterEvents);//utilizar en definir un layout con splitters.

/**
 * Inicializa los bloques con cartografia.
 * @return
 */
function legendQuery() {
	dojo.require("nexusDojo.CheckBoxTree");
	setTimeout("legendQueryDelayed('"+aplicacionId+"');",1000);
}

function legendQueryDelayed(aplicacionId) {
	
	var cartoidsArray=new Array();
	for (var i=0; i<config.olConfig.cartografias.length; i++) cartoidsArray.push(config.olConfig.cartografias[i].carCodigo);
	
	console.log("legendQueryDelayed - cartoids: "+cartoidsArray.join(","));
	
	ConfigManager.getArbolJson(aplicacionId,cartoidsArray,legendInit);
}

/**
 * Recibe la respuesta de carga de un arbol json para dojo. Lo inicializa y asigna eventos del arbol.
 * @param treeJSON
 * @return
 */
function legendInit(treeJSON) {
	
	try {
		// controlamos si hace falta inic. el arbol.
		var treeDiv=document.getElementById('treeOne');
		if (!treeDiv) {
			console.warn("Sin contenedor para el arbol. Este no sera visible.");
			return;
		}
		
		treeJSON='{ "identifier": "arnCodigo","label": "arnNombre","items": '+treeJSON+'}';
		treeData = dojo.fromJson(treeJSON);
		console.log("treeData: ",treeData);
		if (treeData.items.error) {
			alert(treeData.items.error);
			return;
		}
		
		store = new dojo.data.ItemFileWriteStore( {
			data :treeData
		});
		//console.log("store: ",store);
		var model = new nexusDojo.CheckBoxStoreModel( {
					store: store,
					query: {"raiz":true},//selector: importante que coincida o no cargarà nada.
					rootLabel: '(oculto)',
					labelAttr: "arnNombre",// atributo para la etiqueta
					childrenAttrs: ["children"],
					checkboxIdent: "arnActivo",
					checkboxIdentifyIdent: "checkboxI",//avb
					checkboxAll:  true,
					checkboxRoot: false,
					checkboxState: true,
					checkboxStrict: true
					}); 
		//console.log("model: ",model);
		tree = new nexusDojo.CheckBoxTree( {
					model: model,
					id: "MenuTree",
					//checkboxStyle: "HTML",
					//dndController: "dijit.tree.dndSource",
					//betweenThreshold: 5, // Distance from upper/lower edge of node to allow drop to reorder nodes 
					//checkAcceptance:dragAccept ,
					//checkItemAcceptance:dropAccept,
					allowMultiState: true,
					branchIcons: true,
					nodeIcons: true,
					openOnClick: false,// obrir/tancar al click nom.
					persist: false,
					showRoot: false // hide root node
					});
		//console.log("tree: ",tree);
		tree.placeAt( "treeOne" );
		dojo.connect( tree,"onClick",tree, treeNodeClicked);
		dojo.connect( tree,"onOpen",tree, treeNodeOpened);// evento de abrir carpeta
		dojo.connect( tree,"onNodeChecked",tree, treeNodeChecked);
		dojo.connect( tree,"onNodeUnchecked",tree, treeNodeUnchecked);
		dojo.connect( tree,"onNodeIdentifyChecked",tree, treeNodeIdentifyChecked);
		dojo.connect( tree,"onNodeIdentifyUnchecked",tree, treeNodeIdentifyChecked);
		
		treeContextMenuInit();
		
	} catch (e) {
		console.error(e);
		alert ("Error a legendInit()\n"+e.message);
	}
}


/**
 * Evento de click a un nodo del arbol. 
 * Al hacer click en el check de visibilidad tambien se ejecuta este metodo.
 * @param storeItem
 * @param nodeWidget
 * @return
 */
function treeNodeClicked(storeItem,nodeWidget) { 
	console.log("EVENT - treeNodeClicked",nodeWidget);
	
	var isCarpeta=nodeWidget.item.cartoid[0]==0;
	if (isCarpeta) {
		console.log("treeNodeClicked - es una carpeta");
		treeContextMenu.getChildren().forEach(function(i) {// deshab. todos
			i.attr('disabled', true);
		});
	} 
	
	// buscamos layer y carto actuales
	var layer=map.getLayersByName(nodeWidget.item.cartoid[0])[0];
	if (!isCarpeta) var cartografia=getCartografiaByCodigo(nodeWidget.item.cartoid[0]);
	else {
		var cartografia=getCartografiaByCodigo(nodeWidget.item.cartoid[0]);
	}
	
	// habilitamos/desh los elem. del menu
	treeContextMenu.getChildren().forEach(function(i) {
		if (i.label==getNls("LEYENDA")) {
			var carto=getCartografiaByCodigo(nodeWidget.item.cartoid[0]);
			var enabled=carto && typeof(carto.carLeyendtip)=="string";
			i.attr('disabled', !enabled);
		} else if (i.label==getNls("ADJUNTOS") && typeof(tarea_adjuntos)!="undefined") 
			i.attr('disabled', !tarea_adjuntos.isAdjuntos(nodeWidget.item.cartoid[0]));// activamos si tiene adjuntos
		else if (i.label==getNls("VISOR_CAPA_DINAM") && typeof(tarea_capas_visor)!="undefined")
			i.attr('disabled', isCarpeta);
		else if (i.label==getNls("TRANSPARENCIA")){
			//i.attr('disabled', nodeWidget.item.cartoid[0]==0);
			i.attr('disabled', false);// siempre activo. carpeta + nodo
		}else if (i.label==getNls("METADADES")){
			var carto=getCartografiaByCodigo(nodeWidget.item.cartoid[0]);
			var enabled=carto && typeof(carto.carMetaurl)=="string";
			i.attr('disabled', !enabled);
		}		
		else i.attr('disabled', false);
	});
	
	// creamos var. globales a utilizar en el menu contextual.
	treeSelectedNode=nodeWidget;
	//treeSelectedLayer=layer;
	//treeSelectedCartografia=cartografia;
	//console.warn("treeSelectedNode",treeSelectedNode);

	// modificamos valor de opacity y el label del dialog de transp.
	var slider=dijit.byId("dialogTransparenciaContainer");
	dojo.byId("dialogTransparenciaLayer").innerHTML=treeSelectedNode.label;
	if (cartografia!=null) {
		slider.attr("value",1-cartografia.carTransp/100);
	} 
	
	
}

/**
 * Inicializa el menu contextual del mapa
 * @param targetId
 * @return
 */
function mapContextMenuInit(targetId) {
	mapContextMenu = new dijit.Menu({
		//leftClickToOpen: true,
		targetNodeIds: [targetId]
	});
	
	mapContextMenu.addChild(new dijit.MenuItem({
	    label: getNls("CENTRAR_AQUI"),
	    onClick: function(e) {
			//console.log("hola",e," coordenada pasada por OL: ",this.clickCoord);
			map.panTo(this.clickCoord);
		}
	}));
	mapContextMenu.startup();
}

/**
 * Inicializa el menu contextual del arbol.
 * @return
 */
function treeContextMenuInit() {
	
	treeContextMenu = new dijit.Menu({
		//leftClickToOpen: true,
		targetNodeIds: ["treeOne"]
	});
	
	treeContextMenu.addChild(new dijit.MenuItem({
	    label: getNls("LEYENDA"),
	    //disabled: typeof(treeSelectedNode.item.leyendaUrl)=="undefined",
	    iconClass: "dijitEditorIcon dijitEditorIconInsertUnorderedList",
	    onClick: function() {
	    	try{
				var carto=getCartografiaByCodigo(treeSelectedNode.item.cartoid[0]);
				if(carto.carLeyendtip =="CAPABILITIES" && typeof(tarea_leyenda) != "undefined"){
					var urls=new Array();
					//Hacemos la peticion del capabilities para obtener la imagen
					string= tarea_leyenda.getStringFromCarto(carto);
					urls.push(string);
					
					var idioma ="es"; //ponemos idioma por defecto el castellano
					var urlLang=window.location.href;
					if(urlLang.indexOf("lang=")>-1) 
						idioma= urlLang.substr(urlLang.indexOf("lang=")+5,2);
		
					var legendServiceConnectTimeout= sitmunProperties["leyenda.legendServiceConnectTimeout"];
					var legendServiceReadTimeout= sitmunProperties["leyenda.legendServiceReadTimeout"];
					var callMetaData = { 
							callback:callLegend, 
							scope: this
					};
					LegendManager.getLegend(urls, idioma, legendServiceConnectTimeout,legendServiceReadTimeout,callMetaData);
				}
				else if(carto.carLeyendtip =="LINK"){
					window.open(carto.carLeyendurl);
				}	
				else console.error("carLeyendTip no te valor valid");
				
			} catch (e) {
				console.error("Error en click legend" + e.message);
			}
		}
	}));
	
	var dialogTransparencia = createTransparencyDialog();
	
	treeContextMenu.addChild(new dijit.MenuItem({
	    label: getNls("TRANSPARENCIA"),
	    iconClass: "dijitEditorIcon dijitEditorIconTransparency",
	    disabled: false,
	    onClick: function () {
			dialogTransparencia.show();
		}
	}));
	
	treeContextMenu.addChild(new dijit.MenuItem({
	    label: getNls("ADJUNTOS"),
	    disabled: true,
	    iconClass: "dijitEditorIcon dijitEditorIconSave",
	    onClick: function() {
			//window.open(treeSelectedNode.item.leyendaUrl);
			tarea_adjuntos.doAdjuntos(treeSelectedNode.item.cartoid[0]);
		}
	}));
	
	if (typeof(tarea_capas_visor)!="undefined")  {
		treeContextMenu.addChild(new dijit.MenuItem({
		    label: getNls("VISOR_CAPA_DINAM"),
		    disabled: true,
		    iconClass: "dijitEditorIcon dijitEditorIconInsertUnorderedList",
		    onClick: function() {
		    	console.log("convertir capa a dinamica: ", treeSelectedNode.item);
				//var obj=treeSelectedNode.item;
				
				tarea_capas_visor.anadirCarto(getCartografiaByCodigo(treeSelectedNode.item.cartoid[0]));
			}
		}));
	}
	
	//Metadados
	treeContextMenu.addChild(new dijit.MenuItem({
	    label: getNls("METADADES"),
	    disabled: true,
	    iconClass: "dijitEditorIcon dijitEditorIconInsertUnorderedList",
	    onClick: function() {
	    	var url=getCartografiaByCodigo(treeSelectedNode.item.cartoid[0]).carMetaurl;
	    	url=replaceSessionParams(url);
	    	window.open(url);
		}
	}));	

	
	if (debugOn===true) {
		treeContextMenu.addChild(new dijit.MenuSeparator());
		treeContextMenu.addChild(new dijit.MenuItem({
		    label: getNls("PROPIEDADES"),
		    iconClass: "dijitEditorIcon dijitEditorIconInsertTable",
		    disabled: false,
		    onClick: function() {
				console.log(treeSelectedNode.item);
				var obj=treeSelectedNode.item;
				var str="";
				for (var i in obj) {
				  if (typeof(obj[i])!="function" ) str+="\n> "+i+"  "+(typeof(obj[i]))+" : "+obj[i];
				}
				alert(str);
			}
		}));
	}
	
	// Metodo muy importante para que al hacer right-click en un nodo, se haga la llamada de selección
	// del nodo. Sin esto el menu contextual sale del ultimo elemento al que se ha hecho left-click.
	dojo.connect(treeContextMenu, "_openMyself", this, function(e) {
        // get a hold of, and log out, the tree node that was the source of this open event
        var tn = dijit.getEnclosingWidget(e.target);
        //console.debug(tn);
        // now inspect the data store item that backs the tree node:
        //console.debug(tn.item);
        treeNodeClicked(null,tn);
    });
	
	setTimeout('treeContextMenu.startup()',500);
}

/**
 * Crea el dialog de modificar la transparencia de un layer.
 * Tambien permite aplicar transp. a una carpeta, y tenemos que mod. la transp a todos los nodos hijos.
 * @return
 */
function createTransparencyDialog() {
	var dialogTransparencia = new dijit.Dialog({
		id:"dialogTransparenciaId",
		title: getNls("TRANSPARENCIA"),
		style: "width: 300px",
		content: "<div id='dialogTransparenciaLayer'>"
					+"nombre del layer"
				+"</div><br/><div id='dialogTransparenciaContainer'/>"
	});
	var slider = new dijit.form.HorizontalSlider({
		name: "slider",
		value: 0,
		minimum: 0,
		maximum: 1,
		discreteValues: 1,
		intermediateChanges: false,// executar onChange només al fer mouse up?
		//clickSelect: true,// executar al fer click?
		style: "width:200px;",
		onChange: function(value) {
			//if (treeSelectedLayer!=null) treeSelectedLayer.setOpacity(value);
			//if (treeSelectedCartografia!=null) treeSelectedCartografia.carTransp=100-100*value;
			
			//console.log("treeSelectedLayer ",treeSelectedNode);
			treeNodeApplyRecursive(treeSelectedNode.item,value,
					function(node,value){
						//console.log("    > ",node.arnNombre,value);
						
						if(node.cartoid && node.cartoid[0]!=0) {
							// modifiquem transp. del layer OL
							var layer=map.getLayersByName(node.cartoid[0])[0];
							if (layer!=null) layer.setOpacity(value);
							
							// modifiquem transp. de l'objecte carto. 
							var carto=getCartografiaByCodigo(node.cartoid[0]);
							if (carto!=null) carto.carTransp=100-100*value;
						}
						
					}
			);
			return false;
		}
	},"dialogTransparenciaContainer");
	return dialogTransparencia;
}

/**
 * Llamada recursiva para modificar la  de los layers en OL.
 * @param item
 * @param visibility
 * @return
 */
function treeNodeApplyRecursive(item,value,func) {
	//console.log(">> treeNodeApplyRecursive: ",item);
	
	// aplicamos funcion al nodo actual
	func(item,value);
	
	// llamada recursiva.
	if (item.children) {
		for (var i=0; i<item.children.length; i++) treeNodeApplyRecursive(item.children[i],value,func);
	}
}

/**
 * Recibe el evento de nodo desactivado
 * @param storeItem
 * @param nodeWidget
 * @return
 */
function treeNodeUnchecked(storeItem, nodeWidget){
	console.log("EVENT - treeNodeUnchecked. cartoid:"+nodeWidget.item.cartoid);
	console.log("\t storeItem ",storeItem);
	console.log("\t nodeWidget ",nodeWidget);
	
	// mod. los layers OL.
	if (storeItem.radio && storeItem.radio[0]) {
		//console.warn("RADIO");
		this.tree.model.updateCheckbox(storeItem,false);
		treeNodeChangeVisibility(nodeWidget.item,false);// desactivamos OL
	} else {
		treeNodeChangeVisibility(nodeWidget.item,storeItem.arnActivo[0]);
	}
}

/**
 * Recibe el evento de nodo desactivado
 * @param storeItem
 * @param nodeWidget
 * @return
 */
function treeNodeChecked(storeItem, nodeWidget){
	console.log("EVENT - treeNodeChecked. cartoid:"+nodeWidget.item.cartoid);
	console.log("\t storeItem ",storeItem);
	console.log("\t nodeWidget ",nodeWidget);
	
	if (storeItem.radio && storeItem.radio[0]) {
		if (nodeWidget.item.cartoid==0) {
			// carpeta: desactivamos los checks de los hijos
			this.tree.model.updateCheckbox(storeItem,false);
			treeNodeChangeVisibility(nodeWidget.item,false);
			// activamos el primer hijo y solo si es uno con carto
			if (storeItem.children.length>0 && storeItem.children[0].cartoid[0]!=0) {
				this.tree.model.updateCheckbox(storeItem.children[0],true);
				treeNodeChangeVisibility(storeItem.children[0],true);
			}
		} else {
			var parent=nodeWidget.getParent();
			console.warn("\t parent: ",parent);
			
			if (parent) {
				this.tree.model.updateCheckbox(parent.item,false);
				this.tree.model.updateCheckbox(storeItem,true);
				//parent.item.arnActivo[0]=false;
	//			for (var i=0; i<parent.item.children.length; i++) {
	//				if (parent.item.children[i].arnCodigo!=storeItem.arnCodigo) parent.item.children[i].arnActivo[0]=false;
	//			}	
				treeNodeChangeVisibility(parent.item,false);// desactivamos todos
			}
			treeNodeChangeVisibility(nodeWidget.item,storeItem.arnActivo[0]);// mod. los layers OL.
		}
	} else {
		// carpeta o nodo con check (no radio)
		treeNodeChangeVisibility(nodeWidget.item,storeItem.arnActivo[0]);// mod. los layers OL.
	}
	
	
}



/**
 * Llamada recursiva para modificar visibilidad de los layers en OL.
 * @param item
 * @param visibility
 * @return
 */
function treeNodeChangeVisibility(item,visibility) {
	//console.log(">> "+item.id + " "+item.name+" visibility: "+visibility);
	if (autoRefresh) mapChangeVisibility(item.id,item.cartoid,visibility);
	else {
		refreshActionsStack.push({"id":item.id,"cartoid":item.cartoid,"visibility":visibility});
	}
	
	// llamada recursiva.
	if (item.children) {
		for (var i=0; i<item.children.length; i++) {
			treeNodeChangeVisibility(item.children[i],visibility);
		}
	}
}



/**
 * boton de identificable del arbol activado o desactivado.
 * @param storeItem
 * @param nodeWidget
 * @return
 */
function treeNodeIdentifyChecked(storeItem, nodeWidget){
	try {
		if (!storeItem.checkboxIVisible[0]) {
			//al hacer click en el espacio vacio se ejecuta igualmente. deshacemos la elección.
			storeItem.checkboxI[0]=false;
			return;
		}
		
		var cartoid=nodeWidget.item.cartoid;
		var cartografia=getCartografiaByCodigo(cartoid);
		console.log("> treeNodeIdentifyChecked cartografia:",cartografia);
		if (cartografia) {
			cartografia.carQueryact=storeItem.checkboxI[0];
			if (storeItem.checkboxI[0]==true) {
				console.log("\t añadimos layer");
				createLayerOL(cartografia);
			} else if (storeItem.checkboxI[0]==false && cartografia.carVisible==0){
				console.log("\t layer no visible + no ident: eliminamos.");
				var layers=map.getLayersByName(cartografia.carCodigo);
				if (layers.length>0) layers[0].destroy();
			}
		} else console.warn("> treeNodeIdentifyChecked: Cartografia no encontrada: "+cartoid);
	} catch (e) {
		console.error(e);
	}
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
			// añadimos nuevo layer
			if (layers.length>0) {
				console.warn("Intentando hacer visible un layer existente. Es normal si tiene el info activo.");
				layers[0].setVisibility(visibility);
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
 * evento de click al boton de refrescar layers.
 * @param evt
 * @return
 */
function cartografiaRefrescaOnClick(evt){
	var auxStack=refreshActionsStack;
	refreshActionsStack=new Array();
	
	for (var i=0;i<auxStack.length;i++) {
		var item=auxStack[i];
		console.log("cartografiaRefrescaOnClick: "+item.id+" "+item.cartoid+" "+item.visibility);
		mapChangeVisibility(item.id,item.cartoid,item.visibility);
	}
	
}

/**
 * Inicializa el mapa y sus layers con el objeto config.
 * @return
 */
function mapInit() {
	try {
		
		var olConfig=config.olConfig;
		
		var mapConfig ={
				controls:[],// evitamos que añada los controles por defecto.
				units: olConfig.units,
				projection: new OpenLayers.Projection(olConfig.projection)
		};
		map = new OpenLayers.Map( 'mapa' , mapConfig);
		
		// aquí es pot definir una acció quan hi ha un error carregant una imatge/tile
		/* activando OpenLayers.Util.onImageLoadError deja de funcionar la imagen de loading
		 * OpenLayers.Util.onImageLoadError = function() {
			console.warn("Error carregant imatge",this.src);
			//this.src = "img/blanc.gif";
			this.style.display = "none";
		};*/
		
		setMapConfig(olConfig,map);
		setMapLayers(olConfig,map);
		
		if(debugOn) {
			var ls=new OpenLayers.Control.LayerSwitcher();
			map.addControl(ls);
			//ls.maximizeControl();
		}
		
		// definimos un navigation oculto para que no se desactive y en otros botones como Identify tengamos el pan funcionando.
		var defaultNavigation=new OpenLayers.Control.Navigation();
		map.addControl(defaultNavigation);
		
		//-----------------------------------------------------------------------
		var dragPan=new OpenLayers.Control.Navigation({
						title:getNls("B_MOVER")
						,handleRightClicks: true
						,zoomWheelEnabled: false // desactivamos para evitar 2 saltos. Ya se gestiona con el defaultNavigation.
						,type:OpenLayers.Control.TYPE_TOOL // forzamos tool para que se desactive al utilizar oper. especiales.
						});
		var zoomIn = new OpenLayers.Control.ZoomBox({
						title:getNls("B_ZIN")
						,displayClass: "olControlZoomIn"});
		var zoomOut = new OpenLayers.Control.ZoomBox({
						out:true,
						title:getNls("B_ZOUT")
						,displayClass: "olControlZoomOut"});
	
        toolsPanel = new OpenLayers.Control.Panel({	
						defaultControl: dragPan,
						div: document.getElementById("navigationTools")
						}
        );
        var options={
        		titleBack:getNls("B_NAVIGATION_NEXT"),
        		titleNext:getNls("B_NAVIGATION_BACK")
        };
        
        var navigationHistory = new OpenLayers.Control.NGNavigationHistory(options);
        map.addControl(navigationHistory);

        toolsPanel.addControls([    
            dragPan
            ,zoomIn
            ,zoomOut
            ,new OpenLayers.Control.ZoomToMaxExtent({title:getNls("B_MAXEXT")})
            ,navigationHistory.next, navigationHistory.previous
        ]);
        map.addControl(toolsPanel);
       
        var options={granurality:5,prefix: "X: ",separator: " Y: ",suffix:" ("+map.projection+")"};
        
        var mp=new OpenLayers.Control.MousePosition(options);
        mp.formatOutput= function(lonLat) {
			newHtml = "<font style='font-size: 11px;'>" +
			this.prefix + lonLat.lon.toFixed(2) + this.separator + lonLat.lat.toFixed(2) + this.suffix +
			"</font>";
			return newHtml;
		};
        
        map.addControls([
						//new OpenLayers.Control.KeyboardDefaults(),
						new OpenLayers.Control.NGZoomBar(),
						new OpenLayers.Control.NGScale(),
						mp,
						new OpenLayers.Control.LoadingPanel()
        ]);
        
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
        	console.warn("Error inicializando extensión inicial.",e);
        	map.zoomToMaxExtent();
        }
		
		mapContextMenuInit("mapa");
		
		map.events.register('mousedown', map, function (e) {
			// ha de funcionar conjuntamente con Navigation:handleRightClicks.
			if (OpenLayers.Event.isRightClick(e)) {
				var pos=map.getLonLatFromViewPortPx(e.xy);
				//si queremos hacer un pan directo con boton derecho: map.panTo(pos);
				mapContextMenu.getChildren().forEach(function(i) {
					if (i.label==getNls("CENTRAR_AQUI")) i.clickCoord=pos;// guardamos la coord a centrar en el elemento del menu.
				});
			}
		});
		
		// asociamos event de cambio de escala para actualizar estado el del arbol
		map.events.register("zoomend", map, treeRefreshStyleByScale);
		
		// si una imagen no se carga bien, evitamos que se vea mal en IE
		OpenLayers.Util.onImageLoadError = function() {
			this.style.display = "none";
		};
		
	} catch(e) {
		console.error ("Error a mapInit()",e);
	}
}


/**
 * Evento llamado al expandir una carpeta.
 * @return
 */
function treeNodeOpened() {
	treeRefreshStyleByScale();
}

/**
 * Actualiza los nodos visibles segun tengan la cartografia dentro de rango.
 * Las carpetas no abiertas no se modifican, por eso asociamos esta función al evento "onOpen" del arbol. ver 
 * @return
 */
function treeRefreshStyleByScale() {
	var scale=map.getScale();
	//console.log("treeRefreshStyleByScale scale: ",scale);
	if (typeof(store)!="undefined") {
		store.fetch( { query: { cartoid: '*' },  queryOptions: {deep: true},
			onItem: function(item) {
				var id=store.getIdentity(item);
				
				var node=tree._itemNodesMap[id];
				//var node=tree.getNodesByItem(item);
				//console.log( "item ",id, item.cartoid , store.getLabel(item) ,item.min ,item.max,node);
				
				var scale=Math.round(map.getScale());
				if (node && item.cartoid[0]!=0) {
					if ((item.min[0]==0 && item.max[0]==0) // no especificado ninguno
							|| ((scale>=item.min[0]) && (scale<=item.max[0])) //los dos
							|| ( item.min[0]==0 && (scale<=item.max[0]))// solo max
							|| ( item.max[0]==0 && (scale>=item.min[0]))// solo min
					) var color="black";
					else var color="grey";
					
					console.log(scale, "   (",item.min," - ",item.max,")  > ",color, " ---  ", store.getLabel(item));
					node[0].labelNode.style.color=color;
				}
				/*tree.model.fetchItemByIdentity({identity: id, scope: this, onItem: function(item){
					console.log("byid",item);
				}});*/
	
			}
		});
	}
}


/**
* Configuración de proyecciones, extensiones, escalas, resoluciones
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
		console.error("Territorio sin extensión máxima definida. Revisa la configuración del territorio.");
		map.maxExtent=new OpenLayers.Bounds(250425,4506575,580700,4677900);
	}
	if (olConfig.extensionRestringidaXMin>0 && olConfig.extensionRestringidaXMax>0 && olConfig.extensionRestringidaYMin>0 && olConfig.extensionRestringidaYMax>0){
		var b=new OpenLayers.Bounds(olConfig.extensionRestringidaXMin,olConfig.extensionRestringidaYMin,olConfig.extensionRestringidaXMax,olConfig.extensionRestringidaYMax);
		map.restrictedExtent=b;
	}
	if (olConfig.scales!=null && olConfig.scales.length>0){
		var limitScaleByTerritorio=sitmunProperties["mapa.lista.escalas"] && sitmunProperties["mapa.lista.escalas"]=="territorio";
		var idealResolution = Math.max( map.maxExtent.getWidth()  / map.getSize().w,
				map.maxExtent.getHeight() / map.getSize().h );
		//console.log("idealResolution scale",OpenLayers.Util.getScaleFromResolution(idealResolution,map.units));
		var resArray=new Array();
		for(var nesc=olConfig.scales.length-1;nesc>=0;nesc--){
			var res;
			// si han especificado las resoluciones, las utilizamos antes que el scale calculado, para evitar errores de calculo.
			if (typeof(olConfig.resolutions)!="undefined" && olConfig.resolutions!==null && olConfig.resolutions.length>0) res=olConfig.resolutions[nesc];
			else res=OpenLayers.Util.getResolutionFromScale(olConfig.scales[nesc],map.units);
			//console.log(idealResolution,"    ",olConfig.scales[nesc],"   ", res, "     ",(res<=idealResolution));
			 resArray.push(res);
			// si el scale ya cubre la extensión necesaria para ver todo el territorio, despreciamos el resto.
			 if (limitScaleByTerritorio && res>idealResolution) nesc=-1;
		}
		map.resolutions=resArray.reverse();
	} 
}


/**
 * Inicialización de los layers de OL al inicial el visor
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
			
			var isFondo=dojo.indexOf(fondoCartoIds,cartografia.carCodigo)>-1;
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
 * Crea el layer OL a partir de la configuración del objeto cartografia del param.
 * 
 * @param cartografia la definición del layer
 * @param isFondo Defecto=false. Indica si el layer a crear es para un boton de fondo, en cuyo caso se asigna un efecto de resize.
 * @param addToMap Defecto=true. Añadir el layer al mapa principal, o bien solo definirlo y devolver la referencia. (para mapa_situacion.js)
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
		// Para ciertos tipos que no son wms, tambien queremos que se añadan los parametros de url.
		var serTipo=cartografia.stmServicio.serTipo;
		if (serTipo=="TC"||serTipo=="TILECACHE"||serTipo=="ARCGISSERVER") serTipo="WMS";
		var serviceUrlParams=getParamsObj(service.stmParamsers,serTipo);
		
		var serviceLayerParams=getParamsObj(service.stmParamsers,"OLPARAM");
		//console.log("carto: "+cartografia.id+" ("+service.tipo+") limites: "+cartografia.escalaMin+"  "+cartografia.escalaMax);
		
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
		};
		
		// definimos escala mínima i máxima.
		var minScaleOn=false;
		if (cartografia.carEscMin!==null && !isNaN(parseFloat(cartografia.carEscMin))){
			otherParams.minResolution=OpenLayers.Util.getResolutionFromScale(parseFloat(cartografia.carEscMin),map.units);// l'escala especificada es visualitzarà.
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
		
		// si la url necesita autenticación, añadimos el proxy.
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
		
		var url=(proxyOn && needsAuth)?urlProxy+escape(service.serUrl):service.serUrl;
		
		// revisamos que el método para este tipo de capa este definido.
		if (window["createLayer"+service.serTipo.toUpperCase()]) {
			// creamos el layer OL dependiendo del tipo. A partir del tipo deducimos el método a llamar para crearlo.
			var func=eval("createLayer"+service.serTipo.toUpperCase());// métodos definidos en el layers.js
			//console.log("createLayer function: ",func,cartografia.carNombre);
			
			if (func==null || typeof(func)!="function") 
				console.error("Cartografia con tipo desconocido. carto:'"+cartografia.carCodigo + "' tipo:'"+service.serTipo+"'");
			else {
				var layer = func(cartografia.carCodigo,replaceSessionParams(url),cartografia.carCapas,serviceUrlParams,otherParams, cartografia, addToMap);
				if (layer != null){
				//Puede ser que el layer no le haya dado tiempo a crearse caso WFS cuando tiene que investigar el GeometryName i FeatureNS
				
					layer.carNombre=cartografia.carNombre;// añadimos nombre para mostrarlo en el layer switcher
					layer.order=cartografia.carOrden;//importante!
					if (addToMap) {
						map.addLayer(layer);
						raiseLayerOrder(layer);
					}
					if (layer.CLASS_NAME=="OpenLayers.Layer.Vector") {
						// workaround: al añadir por 1a vez un layer vector, no lo dibuja correctamente.
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
		return null;
	}
}



function getVectorStyles(estilo){
	var myStyles = new OpenLayers.StyleMap({
		"default": new OpenLayers.Style({
			strokeWidth: sitmunProperties[estilo+".strokeWidth"],
			strokeOpacity: sitmunProperties[estilo+".strokeOpacity"],
			strokeColor:sitmunProperties[estilo+".strokeColor"],
			fillColor: sitmunProperties[estilo+".fillColor"],
			fillOpacity: sitmunProperties[estilo+".fillOpacity"],
			strokeDashstyle: sitmunProperties[estilo+".strokeDashstyle"],
			pointRadius: sitmunProperties[estilo+".pointRadius"],
			graphicZIndex: sitmunProperties[estilo+".graphicZIndex"]
		})
	});
	return myStyles;
	
}

/**
 * Modifica el orden del layer pasado por param segun el valor del atributo order.
 * Ojo: puede haber layers que no se vean en el layerSwitcher pero que esten en la lista.
 * @param layer
 * @return
 */
function raiseLayerOrder(layer) {
	var overlayLayers=map.layers;//map.getLayersBy("CLASS_NAME","OpenLayers.Layer.WMS");

	// recorremos los layers mirando su orden para calcular la posición donde tiene que ir
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
 * Carga el visor de la aplicación del param. manteniendo el territorio actual.
 * Utilizado en el selector de aplicaciones del visor.
 * Puede ser una aplicación externa, en cuyo caso se abre una nueva ventana.
 * @param id el código de aplicación al que queremos canviar.
 * @return
 */
function loadAplication(id) {
	try {
		var trobat;
		var i=0;
		while (!trobat && i<config.aplicaciones.length) {
			if (config.aplicaciones[i].appCodigo==id) trobat=true;
			else i++;
		}
		if (trobat) {
			if (config.aplicaciones[i].appTipo=="E") //ap. externa
				window.open(replaceSessionParams(config.aplicaciones[i].appTemplate));
			else {// ap. interna: cambio de ap.
				window.location.href=config.aplicaciones[i].appTemplate+"?ter="+territorioId+"&app="+id;
			}
		}
	} catch (e) {
		alert ("Error a loadAplication()\n"+e.message);
	}
}

/**
 * Recarga el visor con el territorio del param.
 * Utilizado en el selector de aplicaciones del visor.
 * @param id
 * @return
 */
function loadTerritorio(id) {
	try {
		window.location.href="http://"+window.location.host+window.location.pathname+"?ter="+id+"&app="+aplicacionId;
	} catch (e) {
		alert ("Error a loadTerritorio()\n"+e.message);
	}
}

/**
 * Inicializa las tareas definidas para esta ejecución
 * @param id
 * @return
 */
function tareasInit() {
	try {
		if (typeof(tareas)!="undefined") {
			for (var i=0; i<tareas.length; i++) {
				try {
					var nombreTarea=tareas[i].name;
					// tarea edicion inicialización especial: para poder instanciar varias veces.
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

/**
 * Define el content pane de la derecha, que sirve para mostrar resultados de tareas.
 * Si ya esta definido, lo elimina y lo vuelve a crear.
 * @return
 */
function addRightPanel(width) {
	if (typeof(width)=="undefined") width=250;
	
	var id="rightContentPane";
	var thePanel = dijit.byId(id);
	if(thePanel) removeRightPanel();
	var container = dijit.byId('mainContainer');
	var div = dojo.doc.createElement('div');
	div.innerHTML='trailing content';
	container.domNode.appendChild(div);
	thePanel = new dijit.layout.ContentPane({id: id, region:'trailing', style:'width:'+width+'px', splitter:false, minSize:150, maxSize:250}, div);
	container.addChild(thePanel);
	return div;

}

/**
 * Destruye el content pane de la derecha.
 * @return
 */
function removeRightPanel(){
	var id="rightContentPane";
	var thePanel = dijit.byId(id);
	if(thePanel){
		dijit.byId('mainContainer').removeChild(thePanel);
		thePanel.destroy();
	}
}

/**
 * Asocia los eventos de drag al splitter/panel de la izquierda
 * Solo debe utilizarse en definir un layout que requiera paneles redimensionables.
 * @return
 */
function addLayoutSplitterEvents() {
	
	var bc=dijit.byId("mainContainer");
	var spl = bc.getSplitter("left");

	dojo.connect(spl, "_startDrag", function() {
		console.log("left splitter _startDrag");
		dojo.style(spl.child.domNode, "opacity", 0.4);
	});

	dojo.connect(spl, "_stopDrag", function(evt) {
		console.log("left splitter _stopDrag");
		dojo.style(spl.child.domNode, "opacity", 1);
		map.updateSize();
	});
}

/**
 * Activa la herramienta de OL con la class_name pasada por param.
 * @param name class name de la herramienta a activar. ej: OpenLayers.Control.NGIdentify
 * @return
 */
function setDefaultTool(name) {
	//name="OpenLayers.Control.NGIdentify";
	if (typeof(name)=="undefined") name="";
	try {
		// desactivamos todas las herr. excepto las basicas
		map.controls.forEach(function(c) {
			//console.log("setDefaultTool "+c.CLASS_NAME+"  "+c.active);
			if (c.active 
				&& c.CLASS_NAME!="OpenLayers.Control.NavigationHistory"
				&& c.CLASS_NAME!="OpenLayers.Control.KeyboardDefaults"
				&& c.CLASS_NAME!="OpenLayers.Control.Panel"
			) c.deactivate();
			
		});
		// activamos la que queremos.
		var control=map.getControlsByClass(name)[0];
		if (control) control.activate();
		else {
			//console.log("setDefaultTool : activamos navigation");
			control=map.getControlsByClass("OpenLayers.Control.Navigation")[0];
			if (control) control.activate();
		}
	} catch(e) {
		console.error("Error en setDefaultTool(): "+e.message);
	}
}

/**
 * Redirección a la página de login.
 * @return
 */
function logout() {
	window.location="inicio.jsp";
}

/**
 * Obrim una nova finestra amb la url obtinguda
 */

function callLegend(json){
	try{
		
		var legendResult =dojo.fromJson(json);
		if (typeof(legendResult.errorMessage) != "undefined" && legendResult.errorMessage !="") { 
			alert("ERROR: " + legendResult.errorMessage); 
			return;
		}
		else if (legendResult.LegendUrls.length>0) {
			//Primero se ha de mirar si la url que tenemos la debemos pasar por el proxy
			var needsAuth=sitmunProperties["proxy.serverurl"]!=null && legendResult.LegendUrls[0].url.indexOf(sitmunProperties["proxy.serverurl"])>-1;
			//Miramos tambien la autorizacion para varios wms
			var j=1;
			while(sitmunProperties["proxy.wms."+j+".serverurl"] !=null){
				if(legendResult.LegendUrls[0].url.indexOf(sitmunProperties["proxy.wms."+j+".serverurl"])>0){
					needsAuth=true;
					break;
				}
				j++;
			}
			j=1;
			while(sitmunProperties["proxy.wfs."+j+".serverurl"] !=null){
				if(legendResult.LegendUrls[0].url.indexOf(sitmunProperties["proxy.wfs."+j+".serverurl"])>0){
					needsAuth=true;
					break;
				}
				j++;
			}			
			var url=(proxyOn && needsAuth)?urlProxy+escape(legendResult.LegendUrls[0].url):legendResult.LegendUrls[0].url;
			var x=window.open(url);
			if (x ==null) alert(getNls("BLOQUEIG_FINESTRA"));
		}
		else if(legendResult.LegendUrls.length==0) alert(getNls("SENSE_LLEGENDA"));
	}
	catch(e){console.error("error mostrant imatge de la llegenda", e);}
}



