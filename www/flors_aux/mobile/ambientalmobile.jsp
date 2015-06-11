<%@ page import = "java.util.Enumeration"
%><%@ page import = "com.nexusgeografics.viewer.ConfigManager" 
%><% 
	try {
		// si no es una nueva sesión, hacemos un clear de los parámetros. 
		// El include del inicio.defs debe ser posterior, para evitar perder el lang.
		if (!session.isNew()) {
			session.invalidate();
			session=request.getSession(true);
		}
	} catch(Exception e) {
		logger.error("Error creando nueva sesión en idemenorca.jsp",e);
	}
%><%@ include file="../inicio-defs.jsp" 
%><%
	String aplicacion="13";
	String territorio="1";
	String pagCarga="reneix/visor.jsp";//jsp redirección

	String usuarioParam="marcus";	//usuario
	String passwordParam="password";	//constraseña	
	
	try {
		// guardamos en sesión los parámetros disponibles.
		setParametros(aplicacion, territorio, session);
	} catch(Exception e) {
		logger.error("Error cargando parámetros de sesion en idemenorca.jsp",e);
	}

	int res=setUsuario(usuarioParam, passwordParam, session);//validación usuario
	// if(res==1)response.sendRedirect(pagCarga+"?app="+aplicacion+"&ter="+territorio);
	if(res==1)request.getRequestDispatcher("" + pagCarga+"?app="+aplicacion+"&ter="+territorio).forward(request, response);
	else response.sendError(401,"El usuario y password de la petición no son correctos."+res);

%>