#Sample subnetting script
import timeit

ALL_ONES = 4294967295	# 2**32 - 1
MASK_1 = 4278190080		# 2**24 * 255
MASK_2 = 16711680		# 2**16 * 255
MASK_3 = 65280			# 2**8  * 255
MASK_4 = 255			# 2**0  * 255

def ipv4_to_int(ip):
	o = [int(octect) for octect in ip.split('.')]
	num = o[0] << 24 | o[1] << 16 | o[2] << 8 | o[3]
	return num

def int_to_ipv4(num):
	o = []
	o.append(str(num >> 24 & 255))
	o.append(str(num >> 16 & 255))
	o.append(str(num >> 8 & 255))
	o.append(str(num & 255))
	ip = '.'.join(o)
	return ip

def int_to_ipv4_2(num):
	o = []
	o.append(str((num & MASK_1)//2**24))
	o.append(str((num & MASK_2)//2**16))
	o.append(str((num & MASK_3)//2**8))
	o.append(str(num & MASK_4))
	ip = '.'.join(o)
	return ip

def int_to_ipv4_3(num):
	o = []
	o.append(str(num // 2**24))
	o.append(str((num % 2**24) // 2**16))
	o.append(str((num % 2**16) // 2**8))
	o.append(str(num % 2**8))
	ip = '.'.join(o)
	return ip

def test(num):
	#print(int_to_ipv4(num))
	print(timeit.timeit("str(4294967295 >> 24 & 255)+'.'+str(4294967295 >> 16 & 255)+'.'+str(4294967295 >> 8 & 255)+'.'+str(4294967295 & 255)"))
	#print(int_to_ipv4_2(num))
	print(timeit.timeit("str((4294967295 & 4278190080)//2**24)+'.'+str((4294967295 & 16711680)//2**16)+'.'+str((4294967295 & 65280)//2**8)+'.'+str(4294967295 & 255)"))
	#print(int_to_ipv4_3(num))
	print(timeit.timeit("str(4294967295 // 2**24)+'.'+str((4294967295 % 2**24) // 2**16)+'.'+str((4294967295 % 2**16) // 2**8)+'.'+str(4294967295 % 2**8)"))

def binary(num):
	print(bin(num)[2:].zfill(32))

def cidr_to_mask(cidr):
	num = ALL_ONES ^ (2**(32-cidr) - 1)
	mask = int_to_ipv4(num)
	return mask, num

def get_net_info_from_cidr(ip_cidr):
	ip,cidr = ip_cidr.split('/')
	mask, num_mask = cidr_to_mask(int(cidr))
	num_ip = ipv4_to_int(ip)
	num_net = num_ip & num_mask
	net = int_to_ipv4(num_net)
	gw = int_to_ipv4(num_net + 1)
	print('\n\nCIDR: ' + ip_cidr)
	print('IP  : ' + ip)
	print('MASK: ' + mask)
	print('NET : ' + net)
	print('GW  : ' + gw)


get_net_info_from_cidr('172.30.26.187/12')
get_net_info_from_cidr('192.168.123.45/19')