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
	data    : url_prefix.control + '/admin_groups',
	constants:url_prefix.control + '/constants'
};

var url_templates = {
	login :              servers.account + '/login?locale={0}&device_name=web-control&user_name={1}&password={2}',
	logout:              servers.account + '/logout?token={0}',
	//user
	user_list:			 servers.user + '?offset={0}&count={1}&token={2}',
	user_search:		 servers.user + '/search?query={0}&offset={1}&count={2}&token={3}',
	user_info:			 servers.user + '/{0}/info?token={1}',
	user_update:		 servers.user + '/{0}/update?token={1}',
	user_update_password:servers.user + '/{0}/password?new_password={1}&token={2}',
	user_update_quota:	 servers.group+ '/{0}/quota?quota={1}&token={2}',
	//group
	group_info :         servers.group + '/{0}/info?token={1}',
	group_search : 		 servers.group + '/search?query={0}&offset={1}&count={2}&token={3}',
	group_list:			 servers.group + '?offset={0}&count={1}&token={2}&filters=group.type>=10',
	group_update:		 servers.group + '/{0}/update?token={1}',
	group_updata_quota:  servers.group + '/{0}/quota?quota={1}&token={2}',
	//group user
	group_user_update:   servers.group + '/{0}/users/{1}/update?token={2}',
	
	//constants
	group_type:			 servers.constants + '/group_types?token={0}',
	relation_positions:  servers.constants + '/relation_positions?token={0}',
};

var user_role = {
	supervisor    : 0,
	administrator : 10,
	user		  : 20,
	blocked		  : 90
};

var group_type = {
	reserved  : 0,
	private   : 10,
	protected : 20,
	public	  : 90
};

var group_status = {
	normal  : 0,
	blocked : 90
};

var relation_position = {
	owner		  : 0,
	administrator : 10,
	member		  : 20,
	blocked		  : 90
};

function getGroupSearch(searchVal){
	if(searchVal){
		return "可搜索";
	}
	else{
		return "不可搜索";
	}
}