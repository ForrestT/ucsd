importPackage(org.apache.commons.httpclient);
importPackage(org.apache.commons.httpclient.methods);

//Get any task inputs, Set other variables/constants
var strURL = input.proteus_API_URL;
var strSoapAction = "";
var apiMethod = "logout";
var cookie = input.proteus_session_cookie;

//Set SOAP XML for API call
var msgXML = "<SOAP-ENV:Envelope "
				+"xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" "
				+"xmlns:ns0=\"http://schemas.xmlsoap.org/soap/encoding/\" "
				+"xmlns:ns1=\"http://api.proteus.bluecatnetworks.com\" "
				+"xmlns:ns2=\"http://schemas.xmlsoap.org/soap/envelope/\" "
				+"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
				+"xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" "
				+"SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">"
				+"<SOAP-ENV:Header/>"
				+"<ns2:Body>"
					+"<ns1:"+apiMethod+"/>"
				+"</ns2:Body>"
			+"</SOAP-ENV:Envelope>";

//Set the HTTP Client
var post = new PostMethod(strURL);
var entity = new StringRequestEntity(msgXML, "text/xml", "ISO-8859-1");
post.setRequestEntity(entity);
post.setRequestHeader("SOAPAction", strSoapAction);
post.setRequestHeader("Cookie", cookie);
var httpclient = new HttpClient();

//POST API call to Proteus and cache response
logger.addInfo("Executing Proteus SOAP API Method: " + apiMethod);
var result = httpclient.executeMethod(post);

//Parse info out of result if reponse is successful, else error out of task
if (result == 200) { 
	logger.addInfo("Response status code: " + result);
	logger.addInfo("Status message : "+post.getStatusText());
	logger.addInfo("Response body: "+post.getResponseBodyAsString());
}
else {
	logger.addError("Proteus SOAP API call '"+apiMethod+"()' failed with code: " + result);
	ctxt.setFailed("Proteus SOAP API call returned an error, see log");
}