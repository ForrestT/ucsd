importPackage(org.apache.commons.httpclient);
importPackage(org.apache.commons.httpclient.methods);


function get_tag_value(body, tag) {
	start_index = body.search("<"+tag+">") + tag.length + 2;
	end_index = body.search("</"+tage+">");
	value_len = end_index - start_index;
	return body.substr(start_index, value_len);
}


//Get any task inputs, Set other variables/constants
var strURL = "http://proteus-lab.lab.spectrum-health.org/Services/API";
var strSoapAction = "";
var apiMethod = "getEntityByName";
var parentId = "0"
var entityName = "Lab"
var entityType = "Configuration"
var cookie = input.proteus_session_cookie;

//Set SOAP XML for API call
var apiXML ="<parentId>"+parentId+"</parentId>"
			+"<name>"+entityName+"</name>"
			+"<type>"+entityType+"</type>";
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
					+"<ns1:"+apiMethod+">"
						+apiXML
					+"</ns1:"+apiMethod+">"
				+"</ns2:Body>"
			+"</SOAP-ENV:Envelope>";

//Set the HTTP Client
var post = new PostMethod(strURL);
var entity = new StringRequestEntity(msgXML, "text/xml", "ISO-8859-1");
post.setRequestEntity(entity);
post.setRequestHeader("SOAPAction", strSoapAction);
var httpclient = new HttpClient();

//POST API Call to Proteus and GET Response
logger.addInfo("Executing Proteus SOAP API Method: " + apiMethod);
var result = httpclient.executeMethod(post);
var reponse = post.getResponseBodyAsString();

//Parse info ou of result if reponse is successful, else error out of task
if (result == 200) { 
	logger.addInfo("Response status code: " + result);
	logger.addInfo("Status message : " + post.getStatusText());
	logger.addInfo("Response body: " + response);

    config_id = get_tag_value(response, "id")

	output.proteus_config_id = config_id;
}
else {
	logger.addError("Proteus SOAP API call '"+apiMethod+"()' failed with code: " + result);
	ctxt.setFailed("Unable to login to Proteus SOAP API");
}