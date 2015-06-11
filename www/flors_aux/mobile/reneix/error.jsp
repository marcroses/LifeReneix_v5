<%
	// comprovem si el missatge es de falta usuari en sessió, per redirigir, que es crei la sessió i evitar mostrar l'error.
	if (request.getParameter("desc")!=null && request.getParameter("desc").indexOf("Falta usuario en")>-1)
	 response.sendRedirect(".");

%><!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>SITMUN - Error</title>
</head>
<body>
titol: <%= request.getParameter("title") %>
<br/>
desc: <b><%= request.getParameter("desc") %></b>
</body>
</html>