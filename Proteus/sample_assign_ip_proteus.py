from suds.client import Client
from time import sleep
import getpass

url = 'http://proteus-lab.lab.spectrum-health.org/Services/API?wsdl'
client = Client(url)

username = 'bluecatapi'
password = '1234qwer'
# username = raw_input('Username: ')
# password = getpass.getpass()
net_addr = raw_input('Network: ')
hostname = raw_input('Hostname: ')

deployment_status = {-1:'EXECUTING',
					0:'INITIALIZING',
					1:'QUEUED',
					2:'CANCELLED',
					3:'FAILED',
					4:'NOT_DEPLOYED',
					5:'WARNING',
					6:'INVALID',
					7:'DONE',
					8:'NO_RECENT_DEPLOYMENT'}


action = 'MAKE_STATIC'
mac_addr = ''
net_properties = 'offset=10.168.50.31|excludeDHCPRange=False'
hostinfo = ''
ip_properties = 'name=' + hostname

client.service.login(username,password)
result = client.service.getEntityByName(0,'Lab','Configuration')
config_id = result['id']
result = client.service.getIPRangedByIP(config_id,'IP4Network',net_addr)
net_id = result['id']
net_name = result['name']
net_details = result['properties'].split('|')
for detail in net_details:
	if 'CIDR=' in detail:
		net_cidr = detail.split('=')[1]
	elif 'gateway=' in detail:
		net_gw = detail.split('=')[1]
assigned_ip = client.service.getNextIP4Address(net_id, net_properties)
ip_id = client.service.assignIP4Address(config_id, assigned_ip, mac_addr, hostinfo, action, ip_properties)
result = client.service.getIP4Address(net_id, assigned_ip)

result = client.service.getDeploymentRoles(net_id)
deployment_id = result[0][0]['id']
result = client.service.getServerForRole(deployment_id)
server_id = result['id']
client.service.deployServerConfig(server_id, 'services=DHCP')

while True:
	status = client.service.getServerDeploymentStatus(server_id,'')
	print('DHCP Config Deployment Status:\t' + deployment_status[status])
	if status in [2,3,7,8]:
		break
	else:
		sleep(5)

client.service.logout()

print('\nIP address  : ' + assigned_ip)
print('Network CIDR: ' + net_cidr)
print('Gateway IP  : ' + net_gw)