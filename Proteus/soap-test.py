from suds.client import Client
import getpass

#suds lib doesn't seem to work properly with python3.4, use 2.7

url = 'http://proteus-lab.lab.spectrum-health.org/Services/API?wsdl'
client = Client(url)

def write_api_to_file(client):
	temp = str(client)
	temp = temp.split('<p>')
	with open('soap-api.txt','w') as f:
		for line in temp:
			f.write(line + '\n')


username = raw_input('Username: ')
password = getpass.getpass()

client.service.login(username,password)

configID = 7
client.service.getEntityById(7)
client.service.getIP4Address(7,'10.168.50.70')

subnetID = 22
properties = "offset=10.168.50.70|excludeDHCPRange=False"
client.service.getNextIP4Address(subnetID, properties)







#Get the IP Block from an IP address:
configID = 7
result = client.service.getIPRangedByIP(7,'IP4Block','10.168.50.2')
"""result:
(APIEntity){
   id = 21
   name = "CTIS-LAB"
   properties = "CIDR=10.168.0.0/16|allowDuplicateHost=disable|inheritAllowDupli
cateHost=false|pingBeforeAssign=disable|inheritPingBeforeAssign=false|inheritDef
aultDomains=true|inheritDefaultView=true|inheritDNSRestrictions=true|"
   type = "IP4Block"
 }
 """

#Get the IP Network from an IP address:
result = client.service.getIPRangedByIP(7,'IP4Network','10.168.50.0')
"""result:
(APIEntity){
   id = 22
   name = "VM Servers"
   properties = "CIDR=10.168.50.0/24|allowDuplicateHost=disable|inheritAllowDupl
icateHost=true|pingBeforeAssign=disable|inheritPingBeforeAssign=true|gateway=10.
168.50.1|inheritDefaultDomains=true|inheritDefaultView=true|inheritDNSRestrictio
ns=true|"
   type = "IP4Network"
 }
 """


#Getting Entities
"""
>>> client.service.getEntityById(7)
(APIEntity){
   id = 7
   name = "Lab"
   properties = None
   type = "Configuration"
 }
>>> client.service.getEntityByName(0,'Lab','Configuration')
(APIEntity){
   id = 7
   name = "Lab"
   properties = None
   type = "Configuration"
 """
 