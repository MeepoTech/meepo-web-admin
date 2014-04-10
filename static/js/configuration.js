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
	data    : 'http://admin.meepotech.com/c0', 
	new_control:'http://admin.meepotech.com/admin_1'
};

var servers = {
	account : url_prefix.control + '/account',
	user	: url_prefix.control + '/admin_users',
	group   : url_prefix.control + '/admin_groups',
	file    : url_prefix.control + '/admin_groups',
	trash   : url_prefix.control + '/admin_groups',
	device  : url_prefix.control + '/devices',
	data    : url_prefix.control + '/admin_groups',
	constants:url_prefix.control + '/constants',
	new_constants:url_prefix.new_control + '/consts',
	statistics:url_prefix.new_control + '/statistics',
	new_group:url_prefix.new_control + '/groups'
};

var url_templates = {
	login :              servers.account + '/login?locale={0}&device_name=web-control&user_name={1}&password={2}',
	logout:              servers.account + '/logout?token={0}',
	change_password:	 servers.account + '/change_password?user_name={0}&password={1}&new_password={2}',
	//user
	user_list:			 servers.user + '?offset={0}&count={1}&token={2}',
	user_search:		 servers.user + '/search?query={0}&offset={1}&count={2}&token={3}',
	user_info:			 servers.user + '/{0}/info?token={1}',
	user_update:		 servers.user + '/{0}/update?token={1}',
	user_update_password:servers.user + '/{0}/password?new_password={1}&token={2}',
	user_update_quota:	 servers.group+ '/{0}/quota?quota={1}&token={2}',
	user_register_and_activate:servers.user + '?password={0}&token={1}',
	//group
	group_info :         servers.group + '/{0}/info?offset={1}&count={2}&token={3}',
	group_search : 		 servers.group + '/search?query={0}&offset={1}&count={2}&token={3}',
	group_list:			 servers.group + '?offset={0}&count={1}&token={2}&filters=group.type>=10',
	group_update:		 servers.group + '/{0}/update?token={1}',
	group_updata_quota:  servers.group + '/{0}/quota?quota={1}&token={2}',
	group_remove_user:   servers.group + '/{0}/users/{1}?token={2}',
	group_disband:		 servers.group + '/{0}?token={1}',
	group_establish:	 servers.group + '?owner_id={0}&token={1}',
	new_group_update:	 servers.new_group + '/{0}/update?token={1}',
	//group user
	group_user_update:   servers.group + '/{0}/users/{1}/update?token={2}',
	group_add_user:		 servers.group + '/{0}/users?user_id={1}&token={2}',
	group_user_search:	 servers.new_group + '/{0}/users/search?query={1}&offset={2}&count={3}&token={4}',
	
	//constants
	group_type:			 servers.new_constants + '/group/types?token={0}',
	relation_positions:  servers.constants + '/relation_positions?token={0}',
	
	//statistics
	real_time:			 servers.statistics + '/real_time?token={0}',
	summary:			 servers.statistics + '/summary?time={0}&token={1}',
	top:				 servers.statistics + '/top?limit={0}&token={1}',
	trend:				 servers.statistics + '/trend?token={0}',
	spaceUsage:			 '/stats'
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
	admin		  : 10,
	member		  : 20,
	blocked		  : 90
};

var export_user_header = {
	user_name : "用户名",
	display_name : "昵称",
	email : "邮箱",
	groups_can_own : "可用群组数",
	password : "密码" 
};

var export_group_header = {
	group_name : "群组名",
	description : "描述",
	group_tags : "标签",
	group_type : "类型",
	group_visible: "是否可搜索",
	group_user_count: "导入成员数"
};

function getGroupSearch(searchVal){
	if(searchVal){
		return "可搜索";
	}
	else{
		return "不可搜索";
	}
}