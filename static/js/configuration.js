/*=============================================================================
#     FileName: configuration.js
#         Desc: 
#       Author: Aizhiyuan
#        Email: aizhiyuan@meepotech.com
#     HomePage: 
#      Version: 0.0.1
#   LastChange: 2013-9-19 08:56:30
#      History:
=============================================================================*/
var url_prefix = {
	domain  : 'http://admin.meepotech.com',
	control : 'http://admin.meepotech.com/0',
	data    : 'http://admin.meepotech.com/c0' 
};

var servers = {
	account : url_prefix.control + '/account',
	user	: url_prefix.control + '/admin_users',
	group   : url_prefix.control + '/admin_groups',
	file    : url_prefix.control + '/admin_groups',
	trash   : url_prefix.control + '/admin_groups',
	device  : url_prefix.control + '/devices',
	data    : url_prefix.control + '/admin_groups'
};

var LANG = "&locale=zh_CN";

var url_templates = {
	login :              servers.account + '/login?locale={0}&device_name=web-control&user_name={1}&password={2}',
	
	//user
	user_list:			 servers.user + '?token={0}',
	user_search:		 servers.user + '/search?query={0}&token={1}',
	user_info:			 servers.user + '/{0}/info?token={1}',
	//group
	group_info :         servers.group + '/{0}/info?token={1}',
	group_search : 		 servers.group + '/search?query={0}&token={1}',
	group_list:			 servers.group + '?token={0}&filters=group.type>=20',
	group_update:		 servers.group + '/{0}/update?token={1}',
	group_updata_quota:  servers.group + '/{0}/quota?quota={1}&token={2}',
};