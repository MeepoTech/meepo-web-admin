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
	user_list:			 servers.user + '?offset={0}&count={1}&token={2}',
	user_search:		 servers.user + '/search?query={0}&token={1}',
	user_info:			 servers.user + '/{0}/info?token={1}',
	user_update:		 servers.user + '/{0}/update?token={1}',
	//group
	group_info :         servers.group + '/{0}/info?token={1}',
	group_search : 		 servers.group + '/search?query={0}&token={1}',
	group_list:			 servers.group + '?token={0}&filters=group.type>=20',
	group_update:		 servers.group + '/{0}/update?token={1}',
	group_updata_quota:  servers.group + '/{0}/quota?quota={1}&token={2}',
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

//Constants
function getUserRole(roleVal){
	var roleStr = "";
	switch(roleVal){
		case user_role.supervisor :
			roleStr = "超级管理员";
		break;
			
		case user_role.administrator :
			roleStr = "管理员";
		break;
		
		case user_role.user :
			roleStr = "普通用户";
		break;
		
		case user_role.blocked :
			roleStr = "无访问权限";
		break;
	}
	return roleStr;
}

function getGroupType(typeVal){
	var typeStr = "";
	switch(typeVal){
		case group_type.reserved :
			typeStr = "个人空间";
		break;
		
		case group_type.private :
			typeStr = "不可加入";
		break;
		
		case group_type.protected :
			typeStr = "加入需审批";
		break;
		
		case group_type.public :
			typeStr = "加入无需审批";
		break;
	}
	return typeStr;
}

function getGroupStatus(statusVal){
	var statusStr = "";
	switch(statusVal){
		case group_status.normal :
			statusStr = "可以访问";
		break;
		
		case group_status.blocked:
			statusStr = "不可访问";
		break;
	}
	return statusStr;
}

function getRelationPosition(relationVal){
	var relationStr = "";
	switch(relationVal){
		case relation_position.owner : 
			relationStr = "群主";
		break;
		
		case relation_position.administrator :
			relationStr = "管理员";
		break;
		
		case relation_position.member :
			relationStr = "普通用户"; 
		break;
		
		case relation_position.blocked : 
			relationStr = "无访问权限";
		break;
	}
	return relationStr;
}

function getGroupSearch(searchVal){
	if(searchVal){
		return "可搜索";
	}
	else{
		return "不可搜索";
	}
}