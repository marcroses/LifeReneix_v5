<%@page import="com.nexusgeografics.sitmun.entities.StmTareaUi, 
			com.nexusgeografics.sitmun.entities.*,
			java.util.*,
			java.util.Iterator, 
			java.io.File, 
			flexjson.JSONSerializer,
			java.util.Properties,
			java.io.InputStream,
			com.nexusgeografics.sitmun.base.ChildReference"
%><%@ taglib uri="http://packtag.sf.net" prefix="pack"
%><%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"
%><%!
	/**
	*	Metodo que dado un item del arbol, lo renderiza como un elemento jquery para la ventana de menú.
	*/
	public String drawTreeNode (StmArbolnod item, HashMap<Long, StmArbolnod> nodes, Properties nls, boolean transparencySlider) {
		String ret = "";
		String type = (item.isRadio()) ? "radio" : "checkbox";
		String classe="";
		//String onClick = (item.isRadio()) ? "swhichLayer" : "actDesactLayer";
		String checked = "";		
		String radioCheck_pos = (transparencySlider) ? "left" : "right";
		
		for(ChildReference ref : item.children) {
			StmArbolnod node_actual = nodes.get(ref.get_reference());
			
			if(node_actual.getStmCarto() == null) {
				ret += "<fieldset data-role=\"controlgroup\"><legend>" + node_actual.getArnNombre() + "</legend>";
				ret += drawTreeNode(node_actual, nodes, nls, transparencySlider);
				ret += "</fieldset>";
			} else {
				classe =  nls.getProperty(node_actual.getArnNombre()+"_IMG");
				if (classe==null) classe="generic";
				
				if(transparencySlider) {
					ret += "<input class=\"carto-slider-transparency\" cartoId=\"" + node_actual.getCartoid() + "\" name=\"slider-fill-" + item.getArnCodigo() + "\" id=\"slider-fill-" + item.getArnCodigo() + "\" value=\"100\" min=\"0\" max=\"100\" />";
				}
				
				ret += "<input type=\"" + type + "\" name=\"layers"+type+"\" class=\"layers"+type+"\" id=\"" 
					+ type + "-choice-" + node_actual.getArnCodigo() + "\" value=\"" + node_actual.getCartoid() + "\"";
				ret += (node_actual.getArnActivo()) ? " checked=\"checked\"" : "";
				ret += " onClick=\"layerChanged('" + node_actual.getCartoid() + "', this)\"/>";
				
				ret += "<label for=\""+ type + "-choice-" + node_actual.getArnCodigo() + "\" data-iconpos=\"" + radioCheck_pos + "\">";
						
				ret += "<div class=\"treeCartoItemImg treeCartoItemImg_" +classe +"\">&nbsp;</div>";
				ret += nls.getProperty(node_actual.getArnNombre(), node_actual.getArnNombre()) + "</label>";
			}
			
			if(item.isRadio() && node_actual.getArnActivo()) checked = node_actual.getCartoid()+"";
		}
		
		if(item.isRadio()) ret += "<input type=\"hidden\" id=\"" + type + "-choice-" + item.getArnCodigo() + "\" value=\"" + checked + "\"/>";
		
		return ret;
	}

	public void mergeStmParamtta (StmParamtta a, StmParamtta b) {
		if(a.getPttAyuda() == null && b.getPttAyuda() != null) a.setPttAyuda(b.getPttAyuda());
		if(a.getPttDefault() == null && b.getPttDefault() != null) a.setPttDefault(b.getPttDefault());
		if(a.getPttEditable() == null && b.getPttEditable() != null) a.setPttEditable(b.getPttEditable());
		if(a.getPttFiltrorel() == null && b.getPttFiltrorel() != null) a.setPttFiltrorel(b.getPttFiltrorel());
		if(a.getPttFormato() == null && b.getPttFormato() != null) a.setPttFormato(b.getPttFormato());
		if(a.getPttMaxlen() == null && b.getPttMaxlen() != null) a.setPttMaxlen(b.getPttMaxlen());
		if(a.getPttNombre() == null && b.getPttNombre() != null) a.setPttNombre(b.getPttNombre());
		if(a.getPttOblig() == null && b.getPttOblig() != null) a.setPttOblig(b.getPttOblig());
		if(a.getPttOrden() == null && b.getPttOrden() != null) a.setPttOrden(b.getPttOrden());
		if(a.getPttSelect() == null && b.getPttSelect() != null) a.setPttSelect(b.getPttSelect());
		if(a.getPttSelectabl() == null && b.getPttSelectabl() != null) a.setPttSelectabl(b.getPttSelectabl());
		if(a.getPttTipo() == null && b.getPttTipo() != null) a.setPttTipo(b.getPttTipo());
		if(a.getPttValor() == null && b.getPttValor() != null) a.setPttValor(b.getPttValor());
		if(a.getPttValorrel() == null && b.getPttValorrel() != null) a.setPttValorrel(b.getPttValorrel());
	}

%><%
	String language=request.getParameter("lang");
	boolean debugOn=false;
	try  {
		debugOn=request.getParameter("debugOn")!=null && request.getParameterValues("debugOn")[0].equalsIgnoreCase("1");
	} catch (Exception e) {debugOn=false;}
	String minify=""+!debugOn;
		
	/**
	* Generación del arbol para Jquery Mobile
	*/
	List<Long> cartoIds = new ArrayList<Long>();
	String logCarto = "";
	for(StmCarto carto : conf.olConfig.cartografias) {cartoIds.add(carto.getCarCodigo()); logCarto += carto.getCarCodigo() + ","; }
	ArbolManager toc = new ArbolManager ();
	logger.error("mobile arbol jquery:  - cartoIds[" + cartoIds.size() + "] = " + logCarto);
	
	boolean transparencySlider = false;
	for(StmParamapp param : conf.aplicacionParams) {
		transparencySlider = (param.getPapNombre().equals("TRANSPARENCY") && param.getPapValor().equals("true"));
		if(transparencySlider) break;
	}
	logger.error("mobile arbol jquery:  - modo transparencias: " + transparencySlider);
	
	// recorremos arbol asignado a la aplicación para generar menú de capas.
	List<StmArbolnod> arbolNodes = toc.getArbolNodes(conf.aplicacionId, -1, cartoIds);
	List<StmArbolnod> nodesPrincipals = new ArrayList<StmArbolnod>();
	HashMap<Long, StmArbolnod> nodes = new HashMap<Long, StmArbolnod>();

	for (Iterator<StmArbolnod> iter = arbolNodes.iterator(); iter.hasNext();) {
		StmArbolnod item = iter.next();
		if (item.isRaiz()) nodesPrincipals.add(item);
		nodes.put(new ChildReference(item.getArnCodigo()).get_reference(), item);
	}
	
	String layersHtml = "";
	for (Iterator<StmArbolnod> iter = nodesPrincipals.iterator(); iter.hasNext();) {
		StmArbolnod item = iter.next();
		
		if(item.getStmCarto() == null) {
			// carpeta: generamos título.
			layersHtml += "<fieldset data-role=\"controlgroup\"><legend>" + nls.getProperty(item.getArnNombre(),item.getArnNombre()) + "</legend>";
			layersHtml += drawTreeNode(item, nodes, nls, transparencySlider);
			layersHtml += "</fieldset>";
		} else {
			// nodo: generamos selector, que puede ser radio checkbox segun configurado en el admin.
			String type = (item.isRadio()) ? "radio" : "checkbox";
			
			layersHtml += "<input type=\"" + type + "\" name=\"" + type + "-choice-root\" id=\"" 
				+ type + "-choice-" + item.getArnCodigo() + "\" value=\"" + item.getArnCodigo() + "\"";
			layersHtml += (item.getArnActivo()) ? "checked=\"checked\"" : "";
			layersHtml += " />";
			
			layersHtml += "<label for=\""+ type + "-choice-" + item.getArnCodigo() + "\" data-iconpos=\"right\">" + nls.getProperty( item.getArnNombre(),item.getArnNombre()) + "</label>";
		}
	}
	

	/**
	* Generación de los textos de idiomas para JS.
	*/
	String nlsJS="";
	try {
		// serializacion de los textos in18n
		JSONSerializer serializer = new JSONSerializer();
		nlsJS="var nls="+serializer.serialize( nls )+";";
		
	} catch(Exception e) {
		logger.error("Error serializando textos de idiomas",e);
	}
	
	/**
	* Generación de las propiedades para JS.
	*/
    Properties sitmunProperties = new Properties();
	try{
		InputStream is = config.getServletContext().getResourceAsStream("/WEB-INF/sitmun.properties");
		sitmunProperties.load(is);
		is.close();
	}catch(Exception e){
		logger.error("Error cargando sitmun.properties en visor-scripts.jsp.");
		throw new Exception("Error cargando sitmun.properties en visor-scripts.jsp.");
	}
	String sitmunPropertiesJS="";
	try {
		// serializar como objeto js una seleccion de las propiedades
		Hashtable ht=new Hashtable();
		for (java.util.Enumeration keys=sitmunProperties.keys(); keys.hasMoreElements();) {
			String key=(String)keys.nextElement();
			if (key.startsWith("visor.")) ht.put(key.replaceAll("visor.",""),sitmunProperties.get(key));	
		}
		JSONSerializer serializer = new JSONSerializer();
		sitmunPropertiesJS="var sitmunProperties="+serializer.serialize( ht );
	} catch(Exception e) {
		logger.error("Error serializando sitmunProperties",e);
	}
	
	//Para inicializar tareas
	String tareasJS = "var tareas=new Array();";

%>
		<script type="text/javascript" src="/sitmun/library/jquery-1.10/jquery-1.10.1.min.js"></script>
		<script src="/sitmun/library/jquery-mobile/jquery.mobile-1.3.2.min.js"></script>
		
		<!-- PHOTOSWIPE -->
		<script src="/sitmun/library/jquery/photoswipe/lib/klass.min.js"></script>
		<script src="/sitmun/library/jquery/photoswipe/code.photoswipe.jquery-3.0.5.min.js"></script>
		<link rel="stylesheet" href="/sitmun/library/jquery/photoswipe/photoswipe.css" type="text/css">
			
<% if (debugOn) { %>
		<script type="text/javascript" src="/sitmun/library/OpenLayers-2.13.1/lib/OpenLayers.js"></script>
		<link rel="stylesheet" href="/sitmun/library/OpenLayers-2.13.1/theme/default/style.mobile.css" type="text/css">
		<!-- <script type="text/javascript" src="https://getfirebug.com/firebug-lite.js#startOpened=true"></script> -->
<% } else { %>
		<script type="text/javascript" src="/sitmun/library/OpenLayers-2.13.1/OpenLayers.mobile.js"></script>
		<link rel="stylesheet" href="/sitmun/library/OpenLayers-2.13.1/theme/default/style.mobile.css" type="text/css">
<% } %>
		<script type="text/javascript" src="/sitmun/library/proj4js/proj4js-combined.js"></script>

<% if (conf.cssMov != null && conf.cssMov.length() > 0) { %>
		<% if (debugOn) { %>
		<link rel="stylesheet" href="/sitmun/mobile/css/<%= conf.cssMov %>/<%= conf.cssMov %>.css" />
		<% } else { %>
		<link rel="stylesheet" href="/sitmun/mobile/css/<%= conf.cssMov %>/<%= conf.cssMov %>.min.css" />
		<% } %>
		<link rel="stylesheet" href="/sitmun/mobile/css/jquery.mobile.structure-1.3.2.min.css" />
		<link rel="stylesheet" href="/sitmun/mobile/css/<%= conf.cssMov %>/style.css">
<% } %>
		<!-- Librerias Sitmun -->
		<% if (conf.tareaLoaders!=null && conf.tareaLoaders.size()>0) { %>
			<pack:script minify="<%= minify %>" enabled="<%= !debugOn %>">
				<%
				// definimos un elemento para cada tarea. Se cargan TODOS los JS del directorio de la tarea.
				for (Iterator<StmTareaUi> iter = conf.tareaLoaders.iterator(); iter.hasNext();) {
					StmTareaUi t=iter.next();
					// comprobamos que el directorio exista o dara un error al intentar cargar los js de la tarea.
					try {
						File f= new File(application.getRealPath("mobile/tareas/"+t.getTuiNombre()));
						if (f.exists()) {
							out.println("<src>/mobile/tareas/"+t.getTuiNombre()+"/**</src>");
							tareasJS+="tareas.push({name:'"+t.getTuiNombre()+"',init:false,ref:null});";	
						} else {
							logger.error("visor-scripts.jsp - Tareas: Error cargando tarea: '"+t.getTuiNombre()+"'. Directorio no encontrado. Sigue la carga sin esta tarea...");
						}
					} catch(Exception e) {
						logger.error("Error definiendo JS de tarea.",e);
					}
				 } 
				%>
			</pack:script>
		<% } %>
		
		<pack:script minify="<%= minify %>" enabled="<%= !debugOn %>">
			<src>../visor.js</src>
			<src>/js/layers.js</src>
		</pack:script>
		<script>
			var config=<%= conf.serialization %>;

			var debugOn=<%=debugOn%>;
			OpenLayers.DOTS_PER_INCH=96;
			OpenLayers.Lang.setCode("<%= session.getAttribute("lang") %>");
			<!--OpenLayers.ImgPath = "library/dojo/themes/css JSP/ol_img/";-->
			
			var hostname		= document.location.protocol+"//"+document.location.host;
			var context			= "<%=request.getContextPath() %>";
			var urlProxy		= hostname+context+'/<%=sitmunProperties.getProperty("proxy.url")%>';
			var urlOpenImprimir = hostname+context+'/<%=sitmunProperties.getProperty("printer.url")%>';
			var urlImprimirLayout = hostname+context+'/<%=sitmunProperties.getProperty("printerLayout.url")%>';
			var urlImatges 		= hostname+context+'/img/';
			var urlDescargas	= '<%=sitmunProperties.getProperty("descargas.url")%>';
			var proxyOn			= <%= "ON".equalsIgnoreCase(sitmunProperties.getProperty("proxy")) %>;
			// variables utilizadas para inicializar la extensión inicial del visor:
			var scaleInit		= <%= session.getAttribute("scale") %>;
			var bboxInit		= <%= (session.getAttribute("bbox")==null)? "null":"'"+session.getAttribute("bbox")+"'" %>;
			
			//Abans es recollia la variable directament que hi havia en el visor-defs
			var wktInit			= <%= (session.getAttribute("wktInit")==null)? "null":"'"+session.getAttribute("wktInit")+"'" %>;
			
			OpenLayers.ProxyHost=urlProxy;	//proxy utilitzat a l'OL per peticions WFS, GFI, ...

			//boton de refrescar layers activo. False indica que los eventos se propagan al hacer click al layer y no en el boton refrescar.
			var autoRefresh=<%=conf.autoRefrescarCapas%>;
			var tematicoIdInicio=<%= session.getAttribute("tem") %>;
			var lang="<%= language %>";
			var transparencySliders = <%=transparencySlider%>;
			<%= tareasJS %>
			<%= nlsJS %>
			<%= sitmunPropertiesJS %>
		</script>