importPackage(org.apache.commons.httpclient);
importPackage(org.apache.commons.httpclient.methods);


function get_tag_value(body, tag) {
	start_index = body.search("<"+tag+">") + tag.length + 2;
	end_index = body.search("</"+tag+">");
	value_len = end_index - start_index;
	return body.substr(start_index, value_len);
}


//Get any task inputs, Set other variables/constants
var strURL = "http://proteus-lab.lab.spectrum-health.org/Services/API";
var strSoapAction = "";
var apiMethod = "getIPRangedByIP";
var containerId = input.proteus_configuration_id;
var entityType = "IP4Network";
var net_addr = input.proteus_network_address;
var cookie = input.proteus_session_cookie;

//Set SOAP XML for API call
var apiXML ="<containerId>"+containerId+"</containerId>"
			+"<type>"+entityType+"</type>"
			+"<address>"+net_addr+"</address>";
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
post.setRequestHeader("Cookie", cookie);
var httpclient = new HttpClient();

//POST API Call to Proteus and GET Response
logger.addInfo("Executing Proteus SOAP API Method: " + apiMethod);
var result = httpclient.executeMethod(post);
var response = post.getResponseBodyAsString();

//Parse info ou of result if reponse is successful, else error out of task
if (result == 200) { 
	logger.addInfo("Response status code: " + result);
	logger.addInfo("Status message : " + post.getStatusText());
    network_id = get_tag_value(response, "id");
    properties = get_tag_value(response, "properties").split("|");
    temp = properties[0].split("=");
    network_cidr = temp[1];
    temp = properties[5].split("=");
    network_gateway = temp[1];
	output.proteus_network_id = network_id;
	output.proteus_network_cidr = network_cidr;
	output.proteus_network_gateway = network_gateway;
}
else {
	logger.addError("Proteus SOAP API call '"+apiMethod+"()' failed with code: " + result);
	ctxt.setFailed("Error Executing Proteus SOAP API: " + apiMethod);
}