<%@page import="com.nexusgeografics.sitmun.entities.*,java.util.*,com.nexusgeografics.viewer.data.*,
				flexjson.JSONSerializer,com.nexusgeografics.sitmun.base.ChildReference" 
%><%@ include file="/visor-defs.jsp"
%><!doctype html>
<html lang="ca">
	<head>
		<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes">
		<title><%= conf.aplicacionTitulo %></title>
		
		<%@ include file="../visor-mobReneix.jsp" %>
		
		<script src="mobile/reneix/js/reneix.js" type="text/javascript"></script>
		
	</head>
	<body>
		<!-- 1. pàgina principal -->
		<div id="mainContainer" data-role="page">
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<h1></h1>
				<a href="credits.html" class="ui-btn-right" data-icon="info" data-iconpos="notext" data-rel="dialog" data-transition="fade"><%= nls.getProperty("MA_CREDITS") %></a>
				<a href="#pageIdioma" class="ui-btn-right" data-icon="gear" data-iconpos="notext" data-rel="dialog" data-transition="fade" style="position:absolute;right:40px;">Idioma</a>
				<a data-role="none" class="ui-btn-left">
				<span id="logoIde"></span>
				</a>
				<a target="_blank" href="http://lifereneix.cime.es" data-role="none" class="ui-btn-left" id="logoLink">
				<span id="logo"></span>
				</a>
			</div>
			<div data-role="content" role="main">
				<a id="geolocateButton" href="#" data-role="button" data-iconpos="notext" data-icon="user-pos" onClick="initGeolocate()"></a>
				<div id="mapa"></div>
			</div>
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		<!-- Debug en dispositius mòbils: No eliminar -->
		<div style="display:none; position: absolute; top: 170px; left: 10px; z-index: 9999999;" onclick="javascript: deb();">aaaa</div>
		<div style="display:none; position: absolute; top: 200px; left: 10px; z-index: 9999999; border:1px solid blue;" id="debres"></div>
		
		
		<!-- 2. página BUSCADOR TOPÒNIMS -->
		<div id="buscador" data-role="page">
		
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a href="#mainContainer" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_CERCA") %></h1>
			</div>
			
			<div data-role="content">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem ui-btn-active ui-state-persist" href="#buscador"><%=nls.getProperty("MA_TOPONIM") %></a></li>
						<li><a class="footerMenuItem" href="#searchpageCarrers1"><%=nls.getProperty("MA_DIRECCION") %></a></li>
						<li><a class="footerMenuItem" href="#searchpageOferta"><%=nls.getProperty("MA_OFERTA") %></a></li>
					</ul>
				</div>
				<p></p>
				<ul id="autocomplete_topo" data-role="listview" data-filter-theme="d" data-filter-placeholder="<%=nls.getProperty("MA_TOPONIM_TEXT") %>" data-filter="true" data-inset="true"></ul>
			</div>
			
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem ui-btn-active" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		
		<!-- 2. página BUSCADOR TURISTIC -->
		<div id="searchpageOferta" data-role="page">
		
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a href="#mainContainer" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_CERCA") %></h1>
			</div>
			
			<div data-role="content">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#buscador"><%=nls.getProperty("MA_TOPONIM") %></a></li>
						<li><a class="footerMenuItem" href="#searchpageCarrers1"><%=nls.getProperty("MA_DIRECCION") %></a></li>
						<li><a class="footerMenuItem ui-btn-active ui-state-persist" href="#searchpageOferta"><%=nls.getProperty("MA_OFERTA") %></a></li>
					</ul>
				</div>
				<p></p>
				<ul id="autocomplete_oferta" data-role="listview" data-filter-theme="d" data-filter-placeholder="<%=nls.getProperty("MA_OFERTA_TEXT") %>" data-filter="true" data-inset="true"></ul>
			</div>
			
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem ui-btn-active" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		
		
		
		<!-- ############################################################## -->
		<!--
            PÀGINA: CARRERS - Llista Municipis       
        -->
        <div data-role="page" id="searchpageCarrers1"> 
            <div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a href="#mainContainer" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_CERCA") %></h1>
			</div>
            
			<div data-role="content">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#buscador"><%=nls.getProperty("MA_TOPONIM") %></a></li>
						<li><a class="footerMenuItem ui-btn-active ui-state-persist" href="#searchpageCarrers1"><%=nls.getProperty("MA_DIRECCION") %></a></li>
						<li><a class="footerMenuItem" href="#searchpageOferta"><%=nls.getProperty("MA_OFERTA") %></a></li>
					</ul>
				</div>
				<div data-role="controlgroup">
					<p><%=nls.getProperty("MA_ADDR_MUNICIPI") %></p>
					
					<ul id="llistaMunicipis" data-role="listview">
						<li key="002" >Alaior</li>
						<li key="023" >Ferreries</li>
						<li key="015" >Ciutadella</li>
						<li key="032" >Ma&oacute;</li>
						<li key="037" >Es Mercadal</li>
						<li key="052" >Sant Llu&iacute;s</li>
						<li key="064" >Es Castell</li>
						<li key="902" >Es Migjorn Gran</li>
					</ul>
				</div>
			</div>
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem ui-btn-active" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
        </div> 	
		
        <!--
            PÀGINA: CARRERS - Llista Nuclis       
        -->
        <div data-role="page" id="searchpageCarrers2"> 
            <!--Header-->
            <div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a href="#mainContainer" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_CERCA") %></h1>
			</div>
            <!--fieldcontain--> 	
			<div data-role="content" >
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#buscador"><%=nls.getProperty("MA_TOPONIM") %></a></li>
						<li><a class="footerMenuItem ui-btn-active ui-state-persist" href="#searchpageCarrers1"><%=nls.getProperty("MA_DIRECCION") %></a></li>
						<li><a class="footerMenuItem" href="#searchpageOferta"><%=nls.getProperty("MA_OFERTA") %></a></li>
					</ul>
				</div>
				<a href="#searchpageCarrers1" id="btMunicipi1" data-role="button"><%=nls.getProperty("MA_MUNICIPI") %>:</a>			
				
				<div data-role="controlgroup">
					<p><%=nls.getProperty("MA_ADDR_NUCLI") %></p>
					<ul id="llistaNuclis" data-role="listview"><li><%=nls.getProperty("MA_CARREGANT") %></li></ul>
				</div> 
			</div>
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem ui-btn-active" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
        </div> 		

        <!--
            PÀGINA: CARRERS - Llista Carrers       
        -->
        <div data-role="page" id="searchpageCarrers3"> 
            <div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a href="#mainContainer" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_CERCA") %></h1>
			</div>
            <!--fieldcontain--> 	
			<div data-role="content">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#buscador"><%=nls.getProperty("MA_TOPONIM") %></a></li>
						<li><a class="footerMenuItem ui-btn-active ui-state-persist" href="#searchpageCarrers1"><%=nls.getProperty("MA_DIRECCION") %></a></li>
						<li><a class="footerMenuItem" href="#searchpageOferta"><%=nls.getProperty("MA_OFERTA") %></a></li>
					</ul>
				</div>
				<a href="#searchpageCarrers1" id="btMunicipi2" data-role="button"><%=nls.getProperty("MA_TOPONIM") %></a>
				<a href="#searchpageCarrers2" id="btNucli1" data-role="button"><%=nls.getProperty("MA_NUCLI") %></a>
				
				<div data-role="controlgroup">
					<p><%=nls.getProperty("MA_ADDR_CARRER") %></p>
					<ul id="llistaCarrers" data-role="listview"></ul>
				</div> 
			</div>
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem ui-btn-active" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
        </div> 		
		
        <!--
            PÀGINA: CARRERS - Llista Portals       
        -->
        <div data-role="page" id="searchpageCarrers4"> 
            <div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a href="#mainContainer" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_CERCA") %></h1>
			</div>
            <!--fieldcontain--> 	
			<div data-role="content">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#buscador"><%=nls.getProperty("MA_TOPONIM") %></a></li>
						<li><a class="footerMenuItem ui-btn-active ui-state-persist" href="#searchpageCarrers1"><%=nls.getProperty("MA_DIRECCION") %></a></li>
						<li><a class="footerMenuItem" href="#searchpageOferta"><%=nls.getProperty("MA_OFERTA") %></a></li>
					</ul>
				</div> 
				<a href="#searchpageCarrers1" id="btMunicipi3" data-role="button"><%=nls.getProperty("MA_MUNICIPI") %></a>
				<a href="#searchpageCarrers2" id="btNucli2" data-role="button"><%=nls.getProperty("MA_NUCLI") %></a>
				<a href="#searchpageCarrers3" id="btCarrer1" data-role="button"><%=nls.getProperty("MA_CARRER") %></a>
				 
				<div data-role="controlgroup">
					<p><%=nls.getProperty("MA_ADDR_PORTAL") %></p>
					<ul id="llistaPortals" data-role="listview"></ul>
				</div> 
			</div>
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem ui-btn-active" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
        </div> 		
        <!-- ############################################################### -->
		
		
		<!-- 2.1. página BUSCADOR CARRERS -->
		<div id="buscador_adreces" data-role="page">
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a href="#mainContainer" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_CERCA") %></h1>
			</div>
			
			<div data-role="content">
				 <div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#buscador"><%=nls.getProperty("MA_TOPONIM") %></a></li>
						<li><a class="footerMenuItem ui-btn-active ui-state-persist" href="#buscador_adreces"><%=nls.getProperty("MA_DIRECCION") %></a></li>
						<li><a class="footerMenuItem" href="#searchpageOferta"><%=nls.getProperty("MA_OFERTA") %></a></li>
					</ul>
				</div>
				<label for="buscadorAdrMunicipi" class="select"><%=nls.getProperty("MA_ADDR_MUNICIPI") %></label>
				<div  data-role="controlgroup" data-type="horizontal">
					
					<select name="buscadorAdrMunicipi" id="buscadorAdrMunicipi" data-native-menu="false">
						<option value=""><%=nls.getProperty("MA_CARREGANT") %></option>		
					</select>
					<input type="button" value="Centrar" data-inline="true"/>
				</div>
				<label for="buscadorAdrNucli" class="select"><%=nls.getProperty("MA_ADDR_NUCLI") %></label>
				<select name="buscadorAdrNucli" id="buscadorAdrNucli" data-native-menu="false"></select>
				
				<label for="buscadorAdrCarrer" class="select"><%=nls.getProperty("MA_ADDR_CARRER") %></label>
				<select name="buscadorAdrCarrer" id="buscadorAdrCarrer" data-native-menu="false"></select>
				
				<label for="buscadorAdrPortal" class="select"><%=nls.getProperty("MA_ADDR_PORTAL") %></label>
				<select name="buscadorAdrPortal" id="buscadorAdrPortal" data-native-menu="false"></select>
			</div>
			
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem ui-btn-active" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		
		
		<!-- 3. pàgina CAPES -->
		<div id="capes" data-role="page">
			
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a href="#mainContainer" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>	
				<h1><%= nls.getProperty("MA_CAPES") %></h1>
				<a href="#mainContainer" data-role="button" data-icon="arrow-r"><%= nls.getProperty("MA_APLICA") %></a>
			</div>
			
			<div data-role="content">
				<form>
					<%= layersHtml %>
				</form>
			</div>
			
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem ui-btn-active" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
			
		</div>
		
		<!-- 4. pàgina Informació: llista de tipus -->
		<div id="infoList" data-role="page">
			
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a href="#mainContainer" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
			</div>
			<div data-role="content">
				<label for="slider-fill"><%= nls.getProperty("MA_CERCAR_INFO") %>:</label>
				<input type="range" name="slider-fill" id="infoListDistance" value="0" min="0" max="20000" data-highlight="true" step="100" />
				<div><%= nls.getProperty("MA_SOBRE") %>:</div>
				<!-- Div que s'omple amb els botons de tipus segons consulta d'admin. -->
				<div id="infoListButtons"></div>
			</div>
			
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		
		<!-- 4.1. pàgina Informació: candidats del tipus -->
		<div id="infoCand" data-role="page">
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a href="#infoList" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
			</div>
			
			<div data-role="content">
				<div class="center-div">
					<ul id="infoCandListview" data-role="listview">
						<li data-role="list-divider" role="heading"><%= nls.getProperty("MA_CAND_RESULTATS") %></li>
						<li><a class="footerMenuItem" href="#pois_vistaDetallada">Pampal&ograve;nia<br /><span>Descripci&oacute;...</span></a></li>
						<li><a class="footerMenuItem" href="#pois_vistaDetallada">Socarrell bord<br /><span>Descripci&oacute;...</span></a></li>
						<li><a class="footerMenuItem" href="#pois_vistaDetallada">Socarrell gros<br /><span>Descripci&oacute;...</span></a></li>
					</ul>
				</div>
				
			</div>
			
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		
		<!-- 4.2. pàgina Informació: Fitxa de informació per pois -->
		<div id="infoFitxaPOI" data-role="page">
			
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
			</div>
			
			<div data-role="content">
				<div class="center-div">
					<ul data-role="listview">
						<li id="infoFitxaPOIHeader" data-role="list-divider" role="heading">TITOL</li>
						<li>
							<p class="fitxa_nom" style="display:none">
								<b><%= nls.getProperty("MA_FITXA_NOM") %></b>
								<span id="infoFitxaPOINombre">Nom</span>
							</p>														
							<div class="fitxa_img">
								<center><img id="infoFitxaPOIImg" alt="" src="img/noimage.png" style="max-width:100%;"/></center>								
							</div>
							<p class="fitxa_desc" style="text-align:justify;">
								<b><%= nls.getProperty("MA_FITXA_DESC") %></b><p>
								<div id="infoFitxaPOIDesc" style="text-align:justify;font-size:12px;font-weight: 400;"></div>
							</p>
							<div>
								<center><a id="infoFitxaPOIMarker" data-role="button" data-iconpos="left" data-icon="mapa" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_CENTRAR") %></a></center>
							</div>
							
						</li>
					</ul>
				</div>
			</div>
			
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>						
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		
		<!-- 4.2. pàgina Informació: Image gallery -->
		<div id="infoFitxaImatges" data-role="page" class="gallery-page">
			
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a id="infoFitxaImatgesLink" data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
			</div>
			
			<div data-role="content">
				<div class="center-div">
				<ul id="gallery" class="gallery">
				</ul>
				</div>
			</div>
			
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		<!--
		<div id="infoFitxaRUTA" data-role="page">
			
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
			</div>
			
			<div data-role="content">
				<div class="center-div">
					<ul data-role="listview">
						<li id="infoFitxaRUTAHeader" data-role="list-divider" role="heading">TITOL</li>
						<li>
							<p class="fitxa_nom" style="display:none">
								<b><%= nls.getProperty("MA_FITXA_NOM") %></b>
								<span id="infoFitxaRUTANombre"></span>
							</p>
							<p class="fitxa_nom">
								<b><%= nls.getProperty("MA_FITXA_DISTANCIA") %></b>
								<span id="infoFitxaRUTADistancia"></span>
							</p>
							<p class="fitxa_nom">
								<b><%= nls.getProperty("MA_FITXA_TEMPS") %></b>
								<span id="infoFitxaRUTATiempo"></span>
							</p>
							<p class="fitxa_nom">
								<b><%= nls.getProperty("MA_FITXA_DESNIVELL") %></b>
								<span id="infoFitxaRUTADesnivel"></span>
							</p>
							<p class="fitxa_nom">
								<b><%= nls.getProperty("MA_FITXA_DIFICULTAT") %></b>
								<span id="infoFitxaRUTADificultad"></span>
							</p>
							<p class="fitxa_nom">
								<b><%= nls.getProperty("MA_FITXA_INTERES") %></b>
								<span id="infoFitxaRUTAInteres"></span>
							</p>
							<div class="fitxa_img">
								<img id="infoFitxaRUTAImg" alt="" src="img/noimage.png" />
							</div>
							<div>
								<a id="infoFitxaRUTAToHabitats" data-role="button" data-iconpos="left" data-icon="habitats" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_HABITATS") %></a>
							</div>
							<div>
								<a id="infoFitxaRUTAToEspecies" data-role="button" data-iconpos="left" data-icon="especies" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_ESPECIES") %></a>
							</div>
							<div>
								<a id="infoFitxaRUTAMarker" data-role="button" data-iconpos="left" data-icon="mapa" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_CENTRAR") %></a>
							</div>
							<p class="fitxa_desc">
								<b><%= nls.getProperty("MA_FITXA_DESC") %></b>
								<span id="infoFitxaRUTADesc"></span>
							</p>
						</li>
					</ul>
				</div>
			</div>
			
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		-->
		
		<div id="infoFitxaRUTA" data-role="page">
			
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
			</div>
			
			<div data-role="content">
				<div class="center-div">
					<ul data-role="listview">
						<li id="infoFitxaRUTAHeader" data-role="list-divider" role="heading">TITOL</li>
						<li>
							<div class="fitxa_img" style="max-width:100%;">
								<img id="infoFitxaRUTAImg" alt="" src="img/noimage.png" style="width:100%;"/>
							</div>	
							
							<center>
								<table width="75%;" border=0>
									<tbody>
										<tr>
											<td width="32"><img src="img/distancia.png" style="max-width:25px;" title=<%= nls.getProperty("MA_FITXA_DISTANCIA") %>></td>
											<td width="*/2"><div title="Distància" id="infoFitxaRUTADistancia" style="font-family: sans-serif; font-size: 12px;text-align:left;"></div></td>
											
											<td width="32"><img src="img/dificultat.png" style="max-width:25px;" title=<%= nls.getProperty("MA_FITXA_DIFICULTAT") %>></td>
											<td width="*/2"><div title="Dificultat" id="infoFitxaRUTADificultad" style="font-family: sans-serif; font-size: 12px;text-align:left;"></div></td>

											<td width="32"><img src="img/temps.png" style="max-width:25px;" title=<%= nls.getProperty("MA_FITXA_TEMPS") %>></td>
											<td width="*/2"><div title="Temps" id="infoFitxaRUTATiempo" style="font-family: sans-serif; font-size: 12px;text-align:left;"></div></td>
											
											<td width="32"><img src="img/desAcuMax.png" style="max-width:25px;" title=<%= nls.getProperty("MA_FITXA_DESNIVELL") %>></td>
											<td width="*/2"><div title="Desnivell" id="infoFitxaRUTADesnivel" style="font-family: sans-serif; font-size: 12px;text-align:left;">0 m.</div></td>
										</tr>
									</tbody>
								</table>	
							</center>							
							
							</p>
							<hr>							

							<p class="fitxa_nom" style="width:100%;text-align:justify;">
								<b><%= nls.getProperty("MA_FITXA_INTERES") %></b>
								<span id="infoFitxaRUTAInteres" style="width:100%;"></span>
							</p>							
							<p class="fitxa_desc" style="text-align:justify;">
								<b><%= nls.getProperty("MA_FITXA_DESC") %></b><br>
								<span id="infoFitxaRUTADesc" style="text-align:justify;"></span>
							</p>
							<p>&nbsp;								
							<div class="ui-grid-b">
								<div class="ui-block-a">
										<center><a id="infoFitxaRUTAToHabitats" data-role="button" data-iconpos="left" data-icon="habitats" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_HABITATS") %></a></center>
								</div>
								<div class="ui-block-b">
									<center><a id="infoFitxaRUTAToEspecies" data-role="button" data-iconpos="left" data-icon="especies" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_ESPECIES") %></a></center>
								</div>
								<div class="ui-block-c">
									<center><a id="infoFitxaRUTAMarker" data-role="button" data-iconpos="left" data-icon="mapa" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_CENTRAR") %></a></center>
								</div>
							</div>
							
						</li>
					</ul>
				</div>
			</div>
			
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		
		<div id="infoFitxaRUTAHabitats" data-role="page">
			
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
			</div>
			
			<div data-role="content">
				<div class="center-div">
					<ul id="GFICandidatsHabitats" data-role="listview" data-divider-theme="b" />
				</div>
			</div>
			
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>						
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		<div id="infoFitxaRUTAEspecies" data-role="page">
			
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
			</div>
			
			<div data-role="content">
				<div class="center-div">
					<ul id="GFICandidatsEspecies" data-role="listview" data-divider-theme="b" />
				</div>
			</div>
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>						
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		<!-- INFO -->
		<div data-role="page" id="dialog-info">
		<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_CERCA") %></h1>
			</div>
			<div data-role="content">
				<div class="center-div">
					<ul id="GFICandidats" data-role="listview" data-divider-theme="b" />
				</div>
			</div>
			
			<!-- footer -->
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>
		
		
		<!-- FITXA AREES CONCENTRACIO BIODIVERSITAT -->
		<div id="infoFitxaACB" data-role="page">
			
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
			</div>
			
			<div data-role="content">
				<div class="center-div">
					<ul data-role="listview">
						<li id="infoFitxaACBHeader" data-role="list-divider" role="heading">TITOL</li>
						<li>
							<div class="fitxa_img" style="max-width:100%;">
								<img id="infoFitxaACBImg" alt="" src="img/noimage.png" style="width:100%;"/>
							</div>	

							<p class="fitxa_desc" style="text-align:justify;">
								<b><%= nls.getProperty("MA_FITXA_DESC") %></b><br>&nbsp;<br>
								<span id="infoFitxaACBDesc" style="text-align:justify;"></span>
							</p>
							<p>&nbsp;								
							<div class="ui-grid-b">
								<div class="ui-block-a">
										<center><a id="infoFitxaACBToInteres" data-role="button" data-icon="info" data-iconpos="left" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_INTERES2") %></a></center>
								</div>
								<div class="ui-block-b">
									<center><a id="infoFitxaACBToConservacio" data-role="button" data-icon="habitats" data-iconpos="left" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_CONSERVACIO") %></a></center>
								</div>
								<div class="ui-block-c">
									<center><a id="infoFitxaACBMarker" data-role="button" data-iconpos="left" data-icon="mapa" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_CENTRAR") %></a></center>
								</div>
							</div>
							<div class="ui-grid-a">
								<div class="ui-block-a">
									<center><a id="infoFitxaACBToNoEndemiques" data-role="button" data-icon="endemiques" data-iconpos="left" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_ESPECIESNOENDEMIQUES") %></a></center>
								</div>
								<div class="ui-block-b">
									<center><a id="infoFitxaACBToEndemiques" data-role="button" data-icon="noendemiques" data-iconpos="left" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_ESPECIESENDEMIQUES") %></a></center>									
								</div>
							</div>
							
						</li>
					</ul>
				</div>
			</div>
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>		
		
				<!-- Elements d'interès-->
				<div id="FitxaACBToInteres" data-role="page">
					<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
						<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
						<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
					</div>
					
					<div data-role="content">
						<div class="center-div">
							<ul data-role="listview">
								<li id="infoFitxaACBToInteresHeader" data-role="list-divider" role="heading">TITOL</li>
								<li>
									<p class="fitxa_desc" style="text-align:justify;">
										<b><%= nls.getProperty("MA_FITXA_INTERES2") %>:</b><br>&nbsp;<br>
										<span id="infoFitxaACBToInteresDesc" style="text-align:justify;"></span>
									</p>
									<p>&nbsp;								
								</li>
							</ul>
						</div>
					</div>
				</div>		
				
				<!-- Conservació-->
				<div id="FitxaACBToConservacio" data-role="page">
					<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
						<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
						<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
					</div>
					
					<div data-role="content">
						<div class="center-div">
							<ul data-role="listview">
								<li id="infoFitxaACBToConservacioHeader" data-role="list-divider" role="heading">TITOL</li>
								<li>
									<p class="fitxa_desc" style="text-align:justify;">
										<b><%= nls.getProperty("MA_FITXA_CONSERVACIO") %>:</b><br>&nbsp;<br>
										<span id="infoFitxaACBToConservacioDesc" style="text-align:justify;"></span>
									</p>
									<p>&nbsp;								
								</li>
							</ul>
						</div>
					</div>
				</div>		

				<!-- Especiers endèmiques-->
				<div id="FitxaACBToEndemiques" data-role="page">
					<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
						<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
						<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
					</div>
					
					<div data-role="content">
						<div class="center-div">
							<ul data-role="listview">
								<li id="infoFitxaACBToEndemiquesHeader" data-role="list-divider" role="heading">TITOL</li>
								<li>
									<p class="fitxa_desc" style="text-align:justify;">
										<b><%= nls.getProperty("MA_FITXA_ESPECIESENDEMIQUES") %>:</b>
									</p>
								</li>
							</ul>
							<ul data-role="listview" id="llistaEndemiques">
								<li>hola</li>
							</ul>							
						</div>
					</div>
				</div>			
				
				<!-- Especiers No endèmiques-->
				<div id="FitxaACBToNoEndemiques" data-role="page">
					<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
						<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
						<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
					</div>
					
					<div data-role="content">
						<div class="center-div">
							<ul data-role="listview">
								<li id="infoFitxaACBToNoEndemiquesHeader" data-role="list-divider" role="heading">TITOL</li>
								<li>
									<p class="fitxa_desc" style="text-align:justify;">
										<b><%= nls.getProperty("MA_FITXA_ESPECIESNOENDEMIQUES") %>:</b>
									</p>
								</li>
							</ul>
							<ul data-role="listview" id="llistaNoEndemiques">
								<li>hola</li>
							</ul>							
						</div>
					</div>
				</div>					

				<!-- FITXA ESPECIE -->
				<div id="infoFitxaRUTAEspecies2" data-role="page">
					
					<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
						<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
						<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
					</div>
					
					<div data-role="content">
						<div class="center-div">
							<ul id="GFICandidatsEspecies2" data-role="listview" data-divider-theme="b" />
						</div>
					</div>
				</div>		

				
				
				
		<!-- FITXA NATURA2000 -->
		<div id="infoFitxaN2000" data-role="page">
			
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
			</div>
			
			<div data-role="content">
				<div class="center-div">
					<ul data-role="listview">
						<li id="infoFitxaN2000Header" data-role="list-divider" role="heading">TITOL</li>
						<li>
							<div class="fitxa_img" style="max-width:100%;">
								<img id="infoFitxaN2000Img" alt="" src="img/noimage.png" style="width:100%;"/>
							</div>	

							<p class="fitxa_desc" style="text-align:justify;">
								<b><%= nls.getProperty("MA_FITXA_SUPERFICIE") %></b><br>&nbsp;<br>
								<span id="infoFitxaN2000Sup" style="text-align:justify;"></span>
							</p>
							<p>&nbsp;								
							<p class="fitxa_desc" style="text-align:justify;">
								<b><%= nls.getProperty("MA_FITXA_ALTRES_FIGURES") %></b><br>&nbsp;<br>
								<span id="infoFitxaN2000AltresFigures" style="text-align:justify;"></span>
							</p>	
							<p>&nbsp;</p>
							<div class="ui-grid-a">
								<div class="ui-block-a">
										<center><a id="infoFitxaN2000ToMediFisic" data-role="button" data-icon="habitats" data-iconpos="left" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_MEDI_FISIC") %></a></center>
								</div>
								<div class="ui-block-b">
									<center><a id="infoFitxaN2000ToMediNatural" data-role="button" data-icon="habitats" data-iconpos="left" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_MEDI_NATURAL") %></a></center>
								</div>
								<!--
								<div class="ui-block-c">
									<center><a id="infoFitxaN2000ToLinks" data-role="button" data-icon="habitats" data-iconpos="left" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_LINKS") %></a></center>
								</div>
								-->
							</div>
							
						</li>
					</ul>
				</div>
			</div>
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>		
		
				<!-- Medi físic-->
				<div id="FitxaN2000ToMediFisic" data-role="page">
					<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
						<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
						<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
					</div>
					
					<div data-role="content">
						<div class="center-div">
							<ul data-role="listview">
								<li id="infoFitxaN2000ToMediFisicHeader" data-role="list-divider" role="heading">TITOL</li>
								<li>
									<p class="fitxa_desc" style="text-align:justify;">
										<b><%= nls.getProperty("MA_FITXA_MEDI_FISIC") %>:</b><br>&nbsp;<br>
										<span id="infoFitxaN2000ToMediFisicDesc" style="text-align:justify;"></span>
									</p>
									<p>&nbsp;								
								</li>
							</ul>
						</div>
					</div>
				</div>		
				
				<!-- Medi natural-->
				<div id="FitxaN2000ToMediNatural" data-role="page">
					<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
						<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
						<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
					</div>
					
					<div data-role="content">
						<div class="center-div">
							<ul data-role="listview">
								<li id="infoFitxaN2000ToMediNaturalHeader" data-role="list-divider" role="heading">TITOL</li>
								<li>
									<p class="fitxa_desc" style="text-align:justify;">
										<b><%= nls.getProperty("MA_FITXA_MEDI_NATURAL") %>:</b><br>&nbsp;<br>
										<span id="infoFitxaN2000ToMediNaturalDesc" style="text-align:justify;"></span>
									</p>
									<p>&nbsp;								
								</li>
							</ul>
						</div>
					</div>
				</div>		

				<!-- Links-->
				<!--
				<div id="FitxaN2000ToLinks" data-role="page">
					<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
						<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
						<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
					</div>
					
					<div data-role="content">
						<div class="center-div">
							<ul data-role="listview">
								<li id="infoFitxaN2000ToLinksHeader" data-role="list-divider" role="heading">TITOL</li>
								<li>
									<p class="fitxa_desc" style="text-align:justify;">
										<b><%= nls.getProperty("MA_FITXA_LINKS") %>:</b>
									</p>
								</li>
							</ul>
						</div>
					</div>
				</div>		
				-->
					
				
				
				
		<!-- FITXA PLATGES -->
		<div id="infoPlatges" data-role="page">
			
			<div data-role="header" data-position="fixed" data-id="headerFixed" data-tap-toggle="false">
				<a data-rel="back" data-role="button" data-icon="arrow-l"><%= nls.getProperty("MA_TORNA") %></a>
				<h1><%= nls.getProperty("MA_INFORMACIO") %></h1>
			</div>
			
			<div data-role="content">
				<div class="center-div">
					<ul data-role="listview">
						<li id="infoFitxaPlatgesHeader" data-role="list-divider" role="heading">TITOL</li>
						<li>
							<div class="fitxa_img" style="max-width:100%;">
								<img id="infoFitxaPlatgesImg" alt="" src="img/noimage.png" style="width:100%;"/>
							</div>	

							<p>&nbsp;</p>
							<center><a id="infoFitxaPlatgesPDF" data-role="button" data-icon="info" data-iconpos="left" data-mini="true" data-inline="true" class="fitxa_mapa"><%= nls.getProperty("MA_FITXA_PDF") %></a></center>
							
						</li>
					</ul>
				</div>
			</div>
			<div data-role="footer" data-position="fixed" data-id="footerFixed" data-tap-toggle="false">
				<div data-role="navbar">
					<ul>
						<li><a class="footerMenuItem ui-btn-active" href="#infoList" data-icon="reneix-aprop" data-iconpos="top"><%= nls.getProperty("MA_INFO") %></a></li>
						<li><a class="footerMenuItem" href="#capes" data-icon="reneix-capes" data-iconpos="top"><%= nls.getProperty("MA_CAPES") %></a></li>
						<li><a class="footerMenuItem" href="#buscador" data-icon="reneix-cerca" data-iconpos="top"><%= nls.getProperty("MA_CERCA") %></a></li>
					</ul>
				</div>
			</div>
		</div>					
				
				
        <!--
            PAGE IDIOMA
        -->
        <div id="pageIdioma" data-role="page" style="position:absolute;top:50px;">
            <div data-role="header" >
                <h1>Idioma</h1>
            </div>
            <div data-role="content" >

                    	<div data-role="controlgroup" style="padding:5px;">
                            <ul id="llistaIdioma" data-role="listview" data-theme="c">
                                <li key="cat" ><a href="visor.jsp?app=13&ter=1&lang=ca"><img src='img/lang_cat.png' style="height:35px;top:22px;left:15px;"/><div style="position:absolute;top:30px;">Catal&agrave;</div></a></li>
                                <li key="cas" ><a href="visor.jsp?app=13&ter=1&lang=es"><img src='img/lang_esp.png' style="height:35px;top:22px;left:15px;"/><div style="position:absolute;top:30px;">Castellano</div></a></li>
                            </ul>
                    	</div>    

            </div><!-- /content -->
        </div>				
		
	</body>
</html>