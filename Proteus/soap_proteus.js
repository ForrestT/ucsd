importPackage(org.apache.commons.httpclient);
importPackage(org.apache.commons.httpclient.methods);

var strURL = "http://proteus-lab.lab.spectrum-health.org/Services/API";
var strSoapAction = "";
 
var userName = "bluecatapi"; //input.userName;
var password = "1234qwer"; //input.password;
// var deviceName = input.deviceName;
// var network = input.network;

var xmlHeader = "<SOAP-ENV:Envelope xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:ns0=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:ns1=\"http://api.proteus.bluecatnetworks.com\" xmlns:ns2=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><SOAP-ENV:Header/>";

var loginXML = xmlHeader
    +"<ns2:Body>"
      +"<ns1:login>"
        +"<username>"+userName+"</username>"
        +"<password>"+password+"</password>"
      +"</ns1:login>"
    +"</ns2:Body>"
  +"</SOAP-ENV:Envelope>";

logger.addInfo(loginXML);

var post = new PostMethod(strURL);

var entity = new StringRequestEntity(loginXML, "text/xml", "ISO-8859-1");
post.setRequestEntity(entity);
post.setRequestHeader("SOAPAction", strSoapAction);
var httpclient = new HttpClient();

var result = httpclient.executeMethod(post);
logger.addInfo("Response status code: " + result);
logger.addInfo("Status message : "+post.getStatusText());
logger.addInfo("Response body: "+post.getResponseBodyAsString());
// headers = post.getResponseHeaders();
// for (var i = 0; i < headers.length; i++) {
//   if (headers[i].search("Set-Cookie") > -1) {
//     start_index = headers[i].search("JSESSIONID");
//     end_index = headers[i].search(";");
//     cookie_length = end_index - start_index
//     cookie = headers[i].substr(start_index, cookie_length);
//     break;
//   }
// }
cookie_header = post.getResponseHeader("Set-Cookie").toString();
start_index = cookie_header.search("JSESSIONID");
end_index = cookie_header.search(";");
cookie_length = end_index - start_index
cookie = cookie_header.substr(start_index, cookie_length);

var logoutXML = xmlHeader
    +"<ns2:Body>"
      +"<ns1:logout/>"
    +"</ns2:Body>"
  +"</SOAP-ENV:Envelope>";

logger.addInfo(logoutXML);

var entity = new StringRequestEntity(logoutXML, "text/xml", "ISO-8859-1");
post.setRequestEntity(entity);
post.setRequestHeader("SOAPAction", strSoapAction);
post.setRequestHeader("Cookie", cookie);

var result = httpclient.executeMethod(post);
logger.addInfo("Response status code: " + result);
logger.addInfo("Status message : "+post.getStatusText());
logger.addInfo("Response body: "+post.getResponseBodyAsString());
logger.addInfo("Response headers: "+post.getResponseHeaders());
