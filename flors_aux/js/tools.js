/**
*	Retorna l'amplada disponible al navegador
*	http://www.quirksmode.org/viewport/compatibility.html
*/
function getAvailableWidth() {
	var x;
	if (self.innerHeight) // all except Explorer
	{
	x = self.innerWidth;
	}
	else if (document.documentElement && document.documentElement.clientHeight)
	// Explorer 6 Strict Mode
	{
	x = document.documentElement.clientWidth;
	}
	else if (document.body) // other Explorers
	{
	x = document.body.clientWidth;
	}
	return x;
}

/**
*	Retorna l'amplada disponible al navegador
*	http://www.quirksmode.org/viewport/compatibility.html
*/
function getAvailableHeight() {
	var y;
	if (self.innerHeight) // all except Explorer
	{
	y = self.innerHeight;
	}
	else if (document.documentElement && document.documentElement.clientHeight)
	// Explorer 6 Strict Mode
	{
	y = document.documentElement.clientHeight;
	}
	else if (document.body) // other Explorers
	{
	y = document.body.clientHeight;
	}
	return y;
}

// Simulates PHP's date function (http://jacwright.com/projects/javascript/date_format)

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
*
* @param {String} key - the name of the key in the translation file
* @param {Object or Array?} substitutes - in cases where the translated  
*   string is a template for string substitution, this parameter
*   holds the values to be used by dojo.string.substitute on that  
*   template
*/
function getNls(/*String*/ key, /*Object or Array?*/ substitutes) {
	var str = nls[key];
	if (typeof(str)=="undefined") {
		console.warn("Error i18n para el codigo '"+key+"'. Valor no encontrado.")
		return key;
	}else return (substitutes)? dojo.string.substitute(str,substitutes): str;
}

/**
 * helper function to create a form
 */
function getNewSubmitForm(){
	var submitForm = document.createElement("FORM");
	document.body.appendChild(submitForm);
	submitForm.method = "POST";
	return submitForm;
}

/**
 * helper function to add elements to the form
 * @param inputForm
 * @param elementName
 * @param elementValue
 * @return
 */
function createNewFormElement(inputForm, elementName, elementValue){
	var newElement = document.createElement("input");
	newElement.type="hidden";
	newElement.name=elementName;
	newElement.value = elementValue;
	inputForm.appendChild(newElement);
	return newElement;
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

/**
 * Obtiene el objeto cartografia con el codigo del param. Si no lo encuentra devuelve null.
 * @param codigo
 * @return
 */
function getCartografiaTematizableByCodigo(codigo) {
	
	var found=false;
	var i=0;
	while (!found && i<config.olConfig.cartografiasTematizables.length){
		if (config.olConfig.cartografiasTematizables[i].carCodigo==codigo) found=true;
		else i++;
	}
	if (found)return config.olConfig.cartografiasTematizables[i];
	else return null;
}

/**
 * Obtiene el objeto cartografia con el codigo del param. Si no lo encuentra devuelve null.
 * @param codigo
 * @return
 */
function getTareaByCodigo(codigo) {
	var found=false;
	var i=0;
	while (!found && i<config.tareas.length){
		if (config.tareas[i].tarCodigo==codigo) found=true;
		else i++;
	}
	if (found)return config.tareas[i];
	else return null;
}


/**
* Devuelve un objeto con todos los parámetros de sesión actuales.
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

/**
* Devuelve el string pasado con las substituciones de los parámetros de sesión.
* 
* ejemplo:
* 		replaceSessionParams("SELECT * FROM table_name WHERE mun_ine ='${MUN_INE}'");
* 
* @param inputString
* @return
*/
function replaceSessionParams(inputString) {
	try {
		return dojo.string.substitute(inputString,getSessionObject());
	} catch (e) {
		console.log("Error en replaceSessionParams()",e.message);
	}
		
}

/**
 * Implementación de un store de dojo utilitzado en localizadores y consultas y edición
 * para mostrar valores directamente en comboboxes.
 */
//http://java.sys-con.com/node/522907?page=0,1#comments-top
if(!dojo._hasResource["DWRReadStore"]){
	dojo._hasResource["DWRReadStore"] = true;
	dojo.provide("DWRReadStore");

	dojo.require("dojo.data.util.simpleFetch");

	dojo.declare("DWRReadStore", null,{
	    // The DWRReadStore implements the dojo.data.api.Read API and reads
	    // data from the server using DWR
		constructor: function(params){
			this._features = {'dojo.data.api.Identify':true};        
		    this._blankElement = typeof(params.blankElement)!="undefined" ? params.blankElement:false;     
		    this._dwrMethod = params.dwrMethod;
		    this._arguments = params.arguments;
		    this._inputsConfig = params.inputsConfig;// param. no obligatorio
		    this._valuesConfig= typeof(params.valuesConfig)!="undefined" ? params.valuesConfig : null ; 
		    this._currentInputConfig = params.currentInputConfig; 
		    this._searchAttrName= params.searchAttrName;
		    this._searchAttrValue= params.searchAttrValue;
		    this._items = [];
		    this._loadComplete = false;
		    this._loadInProgress = false;
		    this._encadenarDesplegable=null;
		    this._minLength = params.minLength || 0; // buscar a partir de x caràcteres. 
		    if (typeof(params.searchAttrName)=="undefined") console.error("Error en la configuración de DWRReadStore: param. searchAttrName no válido.");
		},
		
	    getFeatures: function(){
	        return this._features; 
	    },

	    /*
	     * This function takes three arguments, two of which are callback functions 
	     * to be invoked in the case of success or failure. The first argument is 
	     * a request object that encapsulates a number of input parameters from the 
	     * caller. The two that should be of interest to us are "query," which is 
	     * an associative array of filter parameters, and queryOptions
	     */
	    _fetchItems: function(args,findCallback,errorCallback){
	    	if (args.query && args.query.desc=="") return;
	    	var self = this;
	        // Function to apply filter to data set
	        var filter = function(args, items){
	        	try {
	        		// ---- ocultamos imagen de loading ---
	        		try {
	        			//dijit.byId(self._currentInputConfig.inputId).attr('readOnly',false);
	        			var obj=dijit.byId(self._currentInputConfig.inputId);
	        			if (obj) obj.downArrowNode.innerHTML="<img src='library/dojo/themes/sitmun/ol_img/down.gif'/>";
	        			
	        			var objCenter=dijit.byId(self._currentInputConfig.inputId+"_center");
	        			console.log("boton centrar:",objCenter);
	        			if (objCenter) objCenter.setDisabled(false);
	        			//dojo.style(objCenter.domNode,"visibility","visible");
                    } catch (e) {console.error(e);}
                    //-------------------------------------
	        		findCallback(items, args);
	        		// ja ens ve filtrat per l'input, podem retornar directament el resultat.
					//		            var filteredItems = [];
					//		            for(var i = 0; i < items.length; ++i){
					//		                var candidateItem = items[i];
					//		                if(self._testMatch(args, candidateItem)){
					//		                    filteredItems.push(candidateItem);
					//		                }
					//		            }
					//		            findCallback(filteredItems, args);
	        	} catch (e) {
	        		console.error("Error a DWRReadStore: _fetchItems filter function.",e);
	        	}
	        };

	        // If the data has already been return the previously loaded data
	        if(false // forcem que sempre s'executi el select cap a la bdd.
	        		&& this._loadComplete){
	            filter(args, self._items);
	        }else{
	            if(this._dwrMethod ){
	                // If a new request comes in before the previous one
	                // is finished, we will ignore the request. 
	                if(!this._loadInProgress && typeof(args) !="undefined"){
	                	if (args.query["desc"] && args.query["desc"].length<this._minLength+1) {
	                		console.log("DWRStore: evitamos petición, no tiene el tamaño mínimo.");
	                		return;
	                	}
	                    this._loadInProgress = true;
	                    //---- cargamos imagen de loading ---
	                    try {
	                    	//dijit.byId(self._currentInputConfig.inputId).attr('readOnly',true); 
	                    	//dijit.byId(self._currentInputConfig.inputId).downArrowNode.innerHTML="<img src='img/close.gif'/>";
	                    	var obj=dijit.byId(self._currentInputConfig.inputId);
		        			obj.dropdownbutton = obj.downArrowNode.innerHTML;
		        			obj.downArrowNode.innerHTML="<img src='library/dojo/themes/sitmun/ol_img/loading_m.gif'/>";
	                    } catch (e) {console.error(e);}
	                    //-------------------------------------
	                    var returnFunction=function(data){
	                    	try{
	                    		if (!data) {
	                        		alert("Error en la respuesta del servidor."); throw "Error en la respuesta del servidor.";
	                        		}
	                            self._items = data;
	                            if(self._blankElement){
	                            	var obj=new Object();
	                            	obj.id="blank_element";
	                            	obj.desc="";
	                            	self._items.splice(0,0, obj);
	                            }
	                            self._loadComplete = true;
	                            self._loadInProgress = false;
	                            filter(args, self._items);
	                            	
	                        }catch(e){
	                            self._loadComplete = true;
	                            self._loadInProgress = false;
	                            //debugger;
	                            errorCallback(e, args);
	                        }
	                    };
	                    // creamos la variable con los parámetros del método dwr.
	                    var arguments=dojo.clone(this._arguments);
	                    
	                    // creamos el último parámetro
	                    var inputParams=new Object();
	                    
	                    if (typeof(this._inputsConfig)!="undefined") {
	                    	console.log("DWR Store con inputsConfig");
	                    	for(var i=0; i<this._inputsConfig.length; i++){
	                    		if (this._inputsConfig[i]!=null) {
	                    			if (this._inputsConfig[i].inputId) {
	                    				var nombre=this._inputsConfig[i].nombre;
		                    			valor = dijit.byId(this._inputsConfig[i].inputId)!=null ? dijit.byId(this._inputsConfig[i].inputId).attr("value"): "";
		                    			//console.log(" - input "+nombre+" : "+valor);
		                    			inputParams[nombre]=valor;
	                    			}
	                    		}
	                    	}
	                    }
	                    
	                    inputParams[this._searchAttrName]=args.query[this._searchAttrValue].replace("*","");// dojo nos pone un *. no lo queremos.
	                    
	                    arguments.push(inputParams);
	                    arguments.push(returnFunction);
	                    console.log("DWR Store query arguments: ",arguments);	
	                    this._dwrMethod.apply(this,arguments);
	                }
	            }else{
	                errorCallback(new Error("DWR Method is undefined."), args);
	            }
	        }
	    },
	    
	    fetchItemsIdentity:function(idName,keywordArgs){
	    	var self = this;
	    	var filter = function(){
	        		// ---- ocultamos imagen de loading ---
	    			try {
	    				
                    	//dijit.byId(self._currentInputConfig.inputId).attr('readOnly',false);
	        			var obj=dijit.byId(self._currentInputConfig.inputId);
	        			if (obj) obj.downArrowNode.innerHTML="<img src='library/dojo/themes/sitmun/ol_img/down.gif'/>";
	        			
	        			var objCenter=dijit.byId(self._currentInputConfig.inputId+"_center");
	        			console.log("boton centrar:",objCenter);
	        			if (objCenter) objCenter.setDisabled(false);
	        			//dojo.style(objCenter.domNode,"visibility","visible");
                    } catch (e) {console.error(e);}
	            };
	    	
	    	if(this._dwrMethod ){
                // If a new request comes in before the previous one
                // is finished, we will ignore the request. 
                    this._loadInProgress = true;
                    //---- cargamos imagen de loading ---
                    try {
                    	//dijit.byId(self._currentInputConfig.inputId).attr('readOnly',true); 
                    	//dijit.byId(self._currentInputConfig.inputId).downArrowNode.innerHTML="<img src='img/close.gif'/>";
                    	var obj=dijit.byId(self._currentInputConfig.inputId);
                    	obj.dropdownbutton = obj.downArrowNode.innerHTML;
	        			obj.downArrowNode.innerHTML="<img src='library/dojo/themes/sitmun/ol_img/loading_m.gif'/>";
                    } catch (e) {console.error(e);}
                    //-------------------------------------
                    var returnFunction=function(data){
                    	try{
                        	var itemFinal=null;
                        	var item;
                        	if (!data) {
                        		alert("Error en la respuesta del servidor."); throw "Error en la respuesta del servidor.";
                        	}
                        	self._items = data;
                            self._loadComplete = true;
                            self._loadInProgress = false;
                            filter();
                            
                            if(self._blankElement){
                            	var obj=new Object();
                            	obj.id="blank_element";
                            	obj.desc="";
                            	self._items.splice(0, 0,obj);
                            }
                            
                            for ( var i = 0; i < self._items.length; i++) {
                				 item = self._items[i];
                				if (item[idName]==keywordArgs.identity){
                					itemFinal=item;
                				}
                			} 
                            if(keywordArgs.onItem && itemFinal != null){
                    			scope = keywordArgs.scope?keywordArgs.scope:dojo.global;
                    			keywordArgs.onItem.call(scope, itemFinal);
                    		}
                            
                          //Executem seguent Filtering Select
                            if(self._encadenarDesplegable!=null){
                            	self._encadenarDesplegable.call();
                            }
                        }catch(e){
                            self._loadComplete = true;
                            self._loadInProgress = false;
                            console.error("error en la funcion de retorno");
                        }
                    };
                    // creamos la variable con los parámetros del método dwr.
                    var arguments=dojo.clone(this._arguments);
                    
                    // creamos el último parámetro
                    var inputParams=new Object();
                    
                    if (typeof(this._inputsConfig)!="undefined") {
                    	console.log("DWR Store con inputsConfig");
                    	for(var i=0; i<this._inputsConfig.length; i++){
                    		if (this._inputsConfig[i]!=null) {
                    			if (this._inputsConfig[i].inputId) {
                    				var nombre=this._inputsConfig[i].nombre;
	                    			valor = dijit.byId(this._inputsConfig[i].inputId)!=null ? dijit.byId(this._inputsConfig[i].inputId).attr("value"): "";
	                    			//console.log(" - input "+nombre+" : "+valor);
	                    			inputParams[nombre]=valor;
                    			}
                    		}
                    	}
                    }
                   
                    inputParams[this._searchAttrName]="";//args.query[this._searchAttrValue].replace("*","");// dojo nos pone un *. no lo queremos.
                    
                    arguments.push(inputParams);
                    arguments.push(returnFunction);
                    console.log("DWR Store query arguments: ",arguments);	
                    this._dwrMethod.apply(this,arguments);
                }
	    },
	    
	    
	    
	    _containsValue: function(item,attribute,value){
	        var itemValue = this.getValue(item, attribute);
	        if (itemValue.indexOf(value.substr(0, value.length-1))  >= 0 ) {
	            return true;
	        }
	        return false;
	    },

	            
	    _testMatch: function(args, item) {
	        var self = this;
	        var match = true;
	        if(item === null){
	            match = false;
	        }else{
	            for(var key in args.query) {
	                var value = args.query[key];
	                if (!self._containsValue(item, key, value)){
	                    match = false;
	                }
	            }
	        }
	        return match;
	    },
	    
	    /**
	     * This function is defined in the Read API and is used by data
	     *  consumers to obtain the value for any attribute of an item.
	     */
	    getValue: function(item, attribute, defaultValue){
	        return item[attribute];
	    },

	    close: function(request){
	         // We do not have any special cleanup requirements
	    },
	    
	    // --- métodos añadidos para cumplir con dojo.data.api.Identify
	    // ver: http://phillipsb1.wordpress.com/dojo-lesson-3-adding-dojodataapiidentity/
	    getIdentity: function(item){
	    	console.log("DWR Store getIdentity item: ",item);
	    	return item.id; // Object || String
	    },
	    //Método necesario para hacer el attr("value",valor);
	    fetchItemByIdentity:function(/* Object */ keywordArgs){
	    	this.fetchItemsIdentity("id",keywordArgs);
	    },
	    
	    // método propio no oblig. del store
	    getItemAttr: function (idName,idValue,attribName) {
	    	for ( var i = 0; i < this._items.length; i++) {
				var item = this._items[i];
				if (item[idName]==idValue) return item[attribName];
			}
	    	return null;
	    }
	});

	dojo.extend(DWRReadStore,dojo.data.util.simpleFetch);
}

/**
 * NGSelect de dojo utilizado en la edicion de calles para los FilteringSelect y ampliar el metodo setStore
 */
if(!dojo._hasResource["dijit.form.NGSelect"]){
	
	dojo._hasResource["dijit.form.NGSelect"] = true;
	dojo.provide("dijit.form.NGSelect");

	dojo.declare("dijit.form.NGSelect", [dijit.form.Select], {
		setStore: function(/* dojo.data.api.Identity */ store,
				/* anything? */ selectedValue,
				/* Object? */ fetchArgs){
	// summary:
	//		Sets the store you would like to use with this select widget.
	//		The selected value is the value of the new store to set.  This
	//		function returns the original store, in case you want to reuse
	//		it or something.
	// store: dojo.data.api.Identity
	//		The store you would like to use - it MUST implement Identity,
	//		and MAY implement Notification.
	// selectedValue: anything?
	//		The value that this widget should set itself to *after* the store
	//		has been loaded
	// fetchArgs: Object?
	//		The arguments that will be passed to the store's fetch() function
	var oStore = this.store;
	fetchArgs = fetchArgs || {};
	if(oStore !== store){
	// Our store has changed, so update our notifications
	dojo.forEach(this._notifyConnections || [], dojo.disconnect);
	delete this._notifyConnections;
	if(store && store.getFeatures()["dojo.data.api.Notification"]){
		this._notifyConnections = [
			dojo.connect(store, "onNew", this, "_onNewItem"),
			dojo.connect(store, "onDelete", this, "_onDeleteItem"),
			dojo.connect(store, "onSet", this, "_onSetItem")
		];
	}
	this.store = store;
	}
	
	// Turn off change notifications while we make all these changes
	this._onChangeActive = false;
	
	// Remove existing options (if there are any)
	if(this.options && this.options.length){
	this.removeOption(this.options);
	}
	
	// Add our new options
	if(store){
	var cb = function(items){
		if(this.sortByLabel && !fetchArgs.sort && items.length){
			items.sort(dojo.data.util.sorter.createSortFunction([{
				attribute: store.getLabelAttributes(items[0])[0]
			}], store));
		}
	
		if(fetchArgs.onFetch){
			items = fetchArgs.onFetch(items);
		}
		// TODO: Add these guys as a batch, instead of separately
		dojo.forEach(items, function(i){
			this._addOptionForItem(i);
		}, this);
	
		// Set our value (which might be undefined), and then tweak
		// it to send a change event with the real value
		this._loadingStore = false;
		this.attr("value", (("_pendingValue" in this) ? this._pendingValue : selectedValue));
		delete this._pendingValue;
	
		if(!this.loadChildrenOnOpen){
			this._loadChildren();
		}else{
			this._pseudoLoadChildren(items);
		}
		this._fetchedWith = opts;
		this._lastValueReported = this.multiple ? [] : null;
		this._onChangeActive = true;
	};
	var opts = dojo.mixin({onComplete:cb, scope: this}, fetchArgs);
	this._loadingStore = true;
	store.fetch(opts);
	}else{
	delete this._fetchedWith;
	}
	return oStore;	// dojo.data.api.Identity
	},
	_updateSelection: function(){
		// summary:
		//		Sets the "selected" class on the item for styling purposes
		this.value = this._getValueFromOpts();
		var val = this.value;
		if(!dojo.isArray(val)){
			val = [val];
		}
		if(val && val[0]){
			dojo.forEach(this._getChildren(), function(child){
				var isSelected = dojo.some(val, function(v){
					return child.option && (v === child.option.value);
				});
				dojo.toggleClass(child.domNode, this.baseClass + "SelectedOption", isSelected);
				dijit.setWaiState(child.domNode, "selected", isSelected);
			}, this);
		}
		//this._handleOnChange(this.value);
	},
	_loadChildren: function(){
		// summary:
		//		Loads the children represented by this widget's options.
		//		reset the menu to make it "populatable on the next click
		if(this._loadingStore){ return; }
		dojo.forEach(this._getChildren(), function(child){
			child.destroyRecursive();
		});
		// Add each menu item
		dojo.forEach(this.options, this._addOptionItem, this);

		// Update states
		//this._updateSelection();
	}
});
}