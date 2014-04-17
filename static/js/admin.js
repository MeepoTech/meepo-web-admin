/*=============================================================================
#     FileName: admin.js
#         Desc: 
#       Author: Aizhiyuan
#        Email: aizhiyuan@meepotech.com
#     HomePage: 
#      Version: 0.0.1
#   LastChange: 2013-9-4 20:53:30
#      History:
=============================================================================*/
//Global variable
var itemArray = Array('user','quota','group','data','info','client');

var pageSize = 20;
var strMaxLength = 15;
var pageNumberShowed = 5;
var topLimit = 10;

var GROUP_TYPE = [];
var USER_POSITION = [];

$(function(){
	//Supervisor
	$('.popbox').popbox();
	$('#reset_passowrd_submit').click(resetPasswordSubmit);
	//Quota group
	$('#quota_group_search').click(quotaGroupSearch);
	$('#quota_group_slide_back').click(quotaGroupSlideBack);
	$('#quota_group_submit').click(quotaGroupSubmit);
	$('#quota_group_cancel').click(quotaGroupCancel)
	$('#quota_group_success_close').click(quotaGroupAlertClose);
	$('#quota_group_page_first').click(quotaGroupPageFirst);
	$('#quota_group_page_right').click(quotaGroupPageRight);
	$('#quota_group_page_left').click(quotaGroupPageLeft);
	$('#quota_group_page_last').click(quotaGroupPageLast);
	
	//Quota user
	$('#quota_user_search').click(quotaUserSearch);
	$('#quota_user_slide_back').click(quotaUserSlideBack);
	$('#quota_user_submit').click(quotaUserSubmit);
	$('#quota_user_cancel').click(quotaUserCancel)
	$('#quota_user_success_close').click(quotaUserAlertClose);
	$('#quota_user_page_first').click(quotaUserPageFirst);
	$('#quota_user_page_right').click(quotaUserPageRight);
	$('#quota_user_page_left').click(quotaUserPageLeft);
	$('#quota_user_page_last').click(quotaUserPageLast);
	
	$('#userManage').click(userManage);
	$('#quotaManage').click(quotaManage);
	$('#groupManage').click(groupManage);
	$('#dataManage').click(dataManage);
	$('#infoManage').click(infoManage);
	$('#clientManage').click(clientManage);
	
	//User
	$('#user_edit_manage').click(userEditManage);
	$('#user_cancel_manage').click(userCancelManage);
	$('#user_delete_manage').click(userDeleteManage);
	$('#user_check_manage').click(userCheckManage);
	$('#user_search_submit').click(userSearchSubmit);
	$('#user_error_close').click(userAlertClose);
	$('#user_success_close').click(userAlertClose);
	$('#user_page_first').click(userPageFirst);
	$('#user_page_right').click(userPageRight);
	$('#user_page_left').click(userPageLeft);
	$('#user_page_last').click(userPageLast);
	
	//Group
	$('#slide_back').click(slideBack);
	$('#group_search_submit').click(groupSearchSubmit);
	$('#group_edit_manage').click(groupEditManage);
	$('#group_check_manage').click(groupCheckManage);
	$('#group_cancel_manage').click(groupCancelManage);
	$('#group_alert_close').click(groupAlertClose);
	$('#group_success_close').click(groupAlertClose);
	$('#group_page_first').click(groupPageFirst);
	$('#group_page_right').click(groupPageRight);
	$('#group_page_left').click(groupPageLeft);
	$('#group_page_last').click(groupPageLast);
	
	$('#group_delete_manage').click(groupDeleteManage);
	
	//Group User
	$('#group_user_edit_manage').click(groupUserEditManage);
	$('#group_user_check_manage').click(groupUserCheckManage);
	$('#group_user_page_first').click(groupUserPageFirst);
	$('#group_user_page_right').click(groupUserPageRight);
	$('#group_user_page_left').click(groupUserPageLeft);
	$('#group_user_page_last').click(groupUserPageLast);
	$('#group_user_search_submit').click(groupUserSearchSubmit);
	$('#group_user_add').click(groupUserAdd);
	$('#group_adduser_search_submit').click(groupAdduserSearchSubmit);
	$('#group_adduser_submit').click(groupAdduserSubmit);
	
	//Import
	$('#data_import').click(dataImport);
	$('#import_user').click(importUser);
	$('#import_group').click(importGroup);
	$('#import_execution').click(importExecution);
	$('#import_user_down').click(importUserDown);
	$('#import_group_down').click(importGroupDown);
	$('#import_result_close').click(resultClose);
	
	//Export
	$('#data_export').click(dataExport);
	$('#export_user').click(exportUser);
	$('#export_group').click(exportGroup);
	$('#export_execution').click(exportExecution);
	//Initialization
	initEnvironment();
	
	//Logout
	$('#admin_logout').click(logout);
});

function initEnvironment(){
	getGroupType();
	getGroupUserPosition();
	listUser();
}

function flush_local_data(){
	sessionStorage.clear();
	localStorage.clear();
}

function check_logging(){
	if(!localStorage.logging && !sessionStorage.logging){
		flush_local_data();
		self.location.href="/";
	}
	else{
		local_data = JSON.parse(localStorage.data);
	}
}

function clean_environment(){
	slideBack();
	quotaGroupSlideBack();
	quotaUserSlideBack();
	clearTable('quota_group_table');
	clearTable('quota_user_table');
	//Clean all search content
	$('#user_search_name').val('');
	$('#quota_user_search_name').val('');
	$('#quota_group_search_name').val('');
	$('#group_search_name').val('');
	$('#group_user_search_name').val('');
	$('#data_import_text').val('');
	//Cancel
	groupCancel();
	userCancelManage();
	
	//clean page number
	$('#user_page_select_flag').val(0);
	$('#group_page_select_flag').val(0);
}

function switchItem(itemName){
	for(var index = 0 ; index < itemArray.length ; index++){
		var indexName = itemArray[index];
		if(itemName == indexName){
			$('#'+indexName+"Manage").addClass('active');
			$('#'+indexName+"_manage").css('display','block');
		}
		else{
			$('#'+indexName+"Manage").removeClass('active');
			$('#'+indexName+"_manage").css('display','none');
		}
	}
	clean_environment();
}

function logout(){
	function after_logout(data,status){
		if(status == 'error'){
			alert('无法注销');
		}
		else{
			flush_local_data();
			window.location.href='/';
		}
	}
	var completeUrl = String.format(url_templates.logout,local_data.token);
	request(completeUrl,"","post",after_logout);
}

function userManage(){
	switchItem('user');
	listUser();
}

function quotaManage(){
	switchItem('quota');
}

function groupManage(){
	switchItem('group');
	listGroup();
}

function dataManage(){
	switchItem('data');
	//clearTableHeader('data_import_table');
	//clearTable('data_import_table');
	//dataProgressInit('import',0);
}

function infoManage(){
	switchItem('info');
	listInformation();
}

function clientManage(){
	switchItem('client');
}

function resetPasswordSubmit(){
	var lastPassword = $('#last_password').val();
	var newPassword = $('#new_password').val();
	var newPasswordConfirm = $('#new_password_confirm').val();
	
	function after_reset(data,status){
		if(status == "error"){
		}
		else{
			alert("密码修改成功，请重新登录！");
			flush_local_data();
			window.location.href="/";
		}
	}
	
	if( typeof lastPassword == "undefined" || lastPassword == null || lastPassword == ""
	  ||typeof newPassword == "undefined" || newPassword == null || newPassword == ""
	  ||typeof newPasswordConfirm == "undefined" || newPasswordConfirm == null || newPasswordConfirm == ""){
		  alert("所有项不能为空！");
		  return;
	}
	else{
		if(newPassword.length < 4 && newPassword.length > 20){
			alert("密码需要在5~20个字符间！");
			return;
		}
		if(newPassword != newPasswordConfirm){
			alert("两次密码必须相同！");
			return;
		}
		var completeUrl = String.format(url_templates.change_password,local_data.adminname,lastPassword,newPassword);
		request(completeUrl,"","post",after_reset);
	}
}

function listUser(){
	clearTable('user_table');
	var currentPageNumber = parseInt($('#user_page_current_number').val());
	var offset = (currentPageNumber-1)*pageSize;
	
	function after_list(data,status){
		if(status == 'error'){
		}
		else{
			var dataVal = [];
			var saveDataVal = [];
			if(currentPageNumber == 1){
				//Create page number
				var totalPageNumber = calcPageTotalCount(data.total,pageSize);
				$('#user_page_total_number').val(totalPageNumber);
				$('#user_page_label').text('Page 1 of '+totalPageNumber);
			}
			for(var index = 0,pos = 0 ; index < data.count ; index++){
				if(data.users[index].user_id != "00000000-0000-0000-0000-000000000000"){
					//Construct data
					var user = data.users[index];
					dataVal[pos] = [];
					dataVal[pos][0] = offset+pos+1;
					dataVal[pos][1] = '<input type="checkbox" value="'+user.user_id+'" name="'+pos+'">';
					dataVal[pos][2] = user.user_name;
					dataVal[pos][3] = user.display_name;
					dataVal[pos][4] = user.email;
					dataVal[pos][5] = user.registered_str;
					dataVal[pos][6] = user.groups_can_own;
					dataVal[pos][7] = '<a onClick="resetPassword(\''+user.user_id+'\')">重置</a>';
					if(user.role != user_role.blocked){
						dataVal[pos][8] = '<a style="color:#0088cc" onClick="changeUserState(\'0\',this,8)">已启用</a>';
					}
					else{
						dataVal[pos][8] = '<a style="color:#ff0000" onClick="changeUserState(\'1\',this,8)">已禁用</a>';
					}
				
					saveDataVal[pos] = [];
					saveDataVal[pos][0] = user.user_id;
					saveDataVal[pos][1] = user.user_name;
					saveDataVal[pos][2] = user.role;
					saveDataVal[pos][3] = user.groups_can_own;
					pos = pos + 1;
				}
			}
			localStorage.setItem('userTableData',JSON.stringify(saveDataVal));
			createTable('user_table',dataVal);
		}
	}
	var completeUrl = String.format(url_templates.user_list,offset,pageSize,local_data.token);
	request(completeUrl,"","get",after_list);
}

function listGroup(){
	clearTable('group_table');
	var currentPageNumber = parseInt($('#group_page_current_number').val());
	var offset = (currentPageNumber-1)*pageSize;
	
	function after_list(data,status){
		if(status == "error"){
		}
		else{
			var dataVal = [];
			var saveDataVal = [];
			if(currentPageNumber == 1){
				//Create page number
				var totalPageNumber = calcPageTotalCount(data.total,pageSize);
				$('#group_page_total_number').val(totalPageNumber);
				$('#group_page_label').text('Page 1 of '+totalPageNumber);
			}
			
			for(var index = 0 ; index < data.count ; index++){
				var group = data.groups[index];
				dataVal[index] = [];
				dataVal[index][0] = offset+index+1;
				dataVal[index][1] = '<input type="checkbox" value="'+group.group_id+'" name="'+index+'">';
				dataVal[index][2] = '<a onClick="userList(\''+group.group_id+'\')">'+stringThumbnail(group.group_name)+'</a>';
				dataVal[index][3] = stringThumbnail(group.description);
				var tags = "";
				if(group.tags.length > 0){
					tags = group.tags[0];
					for(var tagIndex = 1 ; tagIndex < group.tags.length ; tagIndex ++){
						tags = tags + ',' + group.tags[tagIndex];
					}
				}
				dataVal[index][4] = stringThumbnail(tags);
				
				dataVal[index][5] = group.type_str;
				dataVal[index][6] = getGroupSearch(group.visible_to_search);
				dataVal[index][7] = group.established_str;
				if(data.groups[index].status == group_status.normal){
					dataVal[index][8] = '<a style="color:#0088cc" onClick="changeGroupState(\'0\',this)">已启用</a>';
				}
				else{
					dataVal[index][8] = '<a style="color:#ff0000" onClick="changeGroupState(\'1\',this)">已禁用</a>';;
				}
				
				saveDataVal[index] = [];
				saveDataVal[index][0] = group.group_name;
				saveDataVal[index][1] = group.description;
				saveDataVal[index][2] = tags;
				saveDataVal[index][3] = group.type;
				saveDataVal[index][4] = group.group_id;
				saveDataVal[index][5] = group.type_str;
				saveDataVal[index][6] = group.visible_to_search;
			}
			//Save data
			localStorage.setItem('groupTableData',JSON.stringify(saveDataVal));
			createTable('group_table',dataVal);
		}
	}
	
	var completeUrl = String.format(url_templates.group_list,offset,pageSize,local_data.token);
	request(completeUrl,"","get",after_list);
}

function listGroupUser(){
	var groupID = $('#current_group_id').val();
	clearTable('group_user_table');
	var currentPageNumber = parseInt($('#group_user_page_current_number').val());
	var offset = (currentPageNumber-1)*pageSize;
	function after_list(data,status){
		if(status == "error"){
			
		}
		else{
			var dataVal = [];
			var saveDataVal = [];
			if(currentPageNumber == 1){
				//Create page number
				var totalPageNumber = calcPageTotalCount(data.users.total,pageSize);
				$('#group_user_page_total_number').val(totalPageNumber);
				$('#group_user_page_label').text('Page 1 of '+totalPageNumber);
			}
			for(var index = 0 ; index < data.users.users.length ; index++){
				dataVal[index] = [];
				dataVal[index][0] = index+1;
				dataVal[index][1] = '<input type="checkbox" value="'+data.users.users[index].user_id+'" name="'+index+'">';
				dataVal[index][2] = data.users.users[index].user_name;
				dataVal[index][3] = data.users.users[index].display_name;
				dataVal[index][4] = data.users.users[index].email;
				dataVal[index][5] = data.users.users[index].relation.position_str;
				
				saveDataVal[index] = [];
				saveDataVal[index][0] = groupID;
				saveDataVal[index][1] = data.users.users[index].user_id;
				saveDataVal[index][2] = data.users.users[index].relation.position_str;
				saveDataVal[index][3] = data.users.users[index].relation.position;
			}
			//$('#group_table').css('display','none');
			localStorage.setItem('groupUserTableData',JSON.stringify(saveDataVal));
			createTable('group_user_table',dataVal);
		}
	}
	
	var completeUrl = String.format(url_templates.group_info,groupID,offset,pageSize,local_data.token);
	request(completeUrl,"","get",after_list);
}

function changeUserState(currentState,currentTR,tdIndex){
	var tr = currentTR.parentNode.parentNode;
	var userID = tr.cells[1].firstChild.value;
	var userRole = user_role.blocked;
	
	if(currentState == 0){
		userRole = user_role.blocked;
	}
	else{
		userRole = user_role.user;
	}
	
	function after_update(data,status){
		if(status == 'error'){
			
		}
		else{
			if(currentState == 0){
				tr.cells[tdIndex].innerHTML = '<a style="color:#ff0000" onClick="changeUserState(\'1\',this,'+tdIndex+')">已禁用</a>';
			}
			else{
				tr.cells[tdIndex].innerHTML = '<a style="color:#0088cc" onClick="changeUserState(\'0\',this,'+tdIndex+')">已启用</a>';
			}
		}
	}
	
	var form = JSON.stringify({
		"role" : userRole
	});
	
	var completeUrl = String.format(url_templates.user_update,userID,local_data.token);
	request(completeUrl,form,"post",after_update);
}

//Quota group
function quotaGroupSearch(){
	quotaGroupSlideBack();
	var groupName = $('#quota_group_search_name').val();
	clearTable('quota_group_table');
	var currentPageNumber = parseInt($('#quota_group_page_current_number').val());
	var offset = (currentPageNumber - 1) * parseInt(pageSize / 2);
	
	function after_search(data,status){
		if(status == 'error'){
		}
		else{
			if(data.total == 0){
			}
			else{
				var dataVal = [];
				if(currentPageNumber == 1){
					//Create page number
					var totalPageNumber = calcPageTotalCount(data.total,pageSize);
					$('#quota_group_page_total_number').val(totalPageNumber);
					$('#quota_group_page_label').text('Page 1 of '+totalPageNumber);
				}
				for(var index = 0 ; index < data.groups.length ; index ++){
					dataVal[index] = [];
					var group = data.groups[index];
					dataVal[index][0] = offset+index+1;
					dataVal[index][1] = group.group_name;
					dataVal[index][2] = group.description;
					var tags = "";
					if(group.tags.length > 0){
						tags = group.tags[0];
						for(var tagIndex = 1 ; tagIndex < group.tags.length ; tagIndex ++){
							tags = tags + ',' + group.tags[tagIndex];
						}
					}
					dataVal[index][3] = tags;
					dataVal[index][4] = '<a onClick="groupQuotaChange(\''+group.group_id+'\')">修改 &rarr;</a>';
				}
				createTable('quota_group_table',dataVal);
			}
		}
	}
	var completeUrl = String.format(url_templates.group_search,groupName,offset,parseInt(pageSize / 2),local_data.token);
	request(completeUrl,"","get",after_search);
}

function quotaGroupSubmit(){
	var group_id = $('#quota_group_id').val();
	var group_quota = $('#quota_group_quota').val();
	
	function after_update(data,status){
		if(status == 'error'){
		}
		else{
			$('#quota_group_success_prompt').css('display','block');
			var usage = parseInt($('#quota_group_usage_number').val());
			usage = usage / group_quota * 100;
			usage = Number(usage).toFixed(2);
			$('#quota_group_usage').css('width',usage+"%");
			$('#quota_group_usage_str').text(usage+"%");
		}
	}
	
	if(!valid_int.test(group_quota)
	   ||parseInt(group_quota)<0
	   ||parseInt(group_quota)>10000){
		$('#quota_group_quota_controls').addClass('error');
	}
	else{
		$('#quota_group_quota_controls').removeClass('error');
		group_quota = parseInt(group_quota) * 1024 * 1024 * 1024;
		var completeUrl = String.format(url_templates.group_updata_quota,group_id,group_quota,local_data.token);
		request(completeUrl,"","post",after_update);
	}
}

function quotaGroupCancel(){
	$('#quota_group_search_name').val("");
	$('#quota_group_id').val("");
	$('#quota_group_name').val("");
	$('#quota_group_usage').css('width',"0%");
	$('#quota_group_usage_str').text("0%");
	$('#quota_group_quota').val("");
	$('#quota_group_submit').attr('disabled',true);
	quotaGroupAlertClose();
}

function quotaGroupAlertClose(){
	$('#quota_group_success_prompt').css('display','none');
}

function quotaUserAlertClose(){
	$('#quota_user_success_prompt').css('display','none');
}

function groupQuotaChange(groupID){
	$('#quota_group_slide').animate({marginLeft:'-1158px'},500);
	
	function after_getInfo(data,status){
		if(status == 'error'){
			
		}
		else{
			$('#quota_group_id').val(data.group_id);
			$('#quota_group_name').val(data.group_name);
			$('#quota_group_usage_number').val(data.usage.used);
			var usage = parseInt(data.usage.used) / parseInt(data.usage.quota) * 100;
			usage = Number(usage).toFixed(2);
			$('#quota_group_usage').css('width',usage+"%");
			$('#quota_group_usage_str').text(usage+"%");
			var quotaToGB = parseInt(data.usage.quota) / (1024 * 1024 * 1024);
			$('#quota_group_quota').val(quotaToGB);
			$('#quota_group_submit').removeAttr('disabled');
		}
	}
	
	var completeUrl = String.format(url_templates.group_info,groupID,0,0,local_data.token);
	request(completeUrl,"","get",after_getInfo);
}

function quotaGroupSlideBack(){
	$('#quota_group_slide').animate({marginLeft:'0px'},500);
}

//Quota user
function quotaUserSearch(){
	quotaUserSlideBack();
	var userName = $('#quota_user_search_name').val();
	clearTable('quota_user_table');
	var currentPageNumber = parseInt($('#quota_user_page_current_number').val());
	var offset = (currentPageNumber - 1) * parseInt(pageSize / 2);
	
	function after_search(data,status){
		if(status == 'error'){
		}
		else{
			if(data.total == 0){
			}
			else{
				var dataVal = [];
				if(currentPageNumber == 1){
					//Create page number
					var totalPageNumber = calcPageTotalCount(data.total,pageSize);
					$('#quota_user_page_total_number').val(totalPageNumber);
					$('#quota_user_page_label').text('Page 1 of '+totalPageNumber);
				}
				for(var index = 0 ; index < data.users.length ; index++){
					dataVal[index] = [];
					var user = data.users[index];
					dataVal[index][0] = offset+index+1;
					dataVal[index][1] = user.user_name;
					dataVal[index][2] = user.display_name;
					dataVal[index][3] = user.email;
					dataVal[index][4] = '<a onClick="userQuotaChange(\''+user.user_id+'\')">修改 &rarr;</a>';
				}
				createTable('quota_user_table',dataVal);
			}
		}
	}
	var completeUrl = String.format(url_templates.user_search,userName,offset,parseInt(pageSize / 2),local_data.token);
	request(completeUrl,"","get",after_search);
}

function quotaUserSubmit(){
	var user_id = $('#quota_user_id').val();
	var user_quota = $('#quota_user_quota').val();
	
	function after_update(data,status){
		if(status == 'error'){
		}
		else{
			$('#quota_user_success_prompt').css('display','block');
			var usage = parseInt($('#quota_user_usage_number').val());
			usage = usage / user_quota * 100;
			usage = Number(usage).toFixed(2);
			$('#quota_user_usage').css('width',usage+"%");
			$('#quota_user_usage_str').text(usage+"%");
		}
	}

	if(!valid_int.test(user_quota)
	   ||parseInt(user_quota)<0
	   ||parseInt(user_quota)>10000){
		$('#quota_user_quota_controls').addClass('error');
	}
	else{
		$('#quota_user_quota_controls').removeClass('error');
		user_quota = parseInt(user_quota) * 1024 * 1024 * 1024;
		var completeUrl = String.format(url_templates.user_update_quota,user_id,user_quota,local_data.token);
		request(completeUrl,"","post",after_update);	
	}
}

function quotaUserCancel(){
	$('#quota_user_search_name').val("");
	$('#quota_user_id').val("");
	$('#quota_user_name').val("");
	$('#quota_user_usage').css('width',"0%");
	$('#quota_user_usage_str').text("0%");
	$('#quota_user_quota').val("");
	$('#quota_user_submit').attr('disabled',true);
	quotaUserAlertClose();
}

function quotaUserAlertClose(){
	$('#quota_user_success_prompt').css('display','none');
}

function userQuotaChange(userID){
	$('#quota_user_slide').animate({marginLeft:'-1158px'},500);
	function after_getInfo(data,status){
		if(status == 'error'){
			
		}
		else{
			$('#quota_user_id').val(data.user_id);
			$('#quota_user_name').val(data.user_name);
			$('#quota_user_usage_number').val(data.usage.used);
			var usage = parseInt(data.usage.used) / parseInt(data.usage.quota) * 100;
			usage = Number(usage).toFixed(2);
			$('#quota_user_usage').css('width',usage+"%");
			$('#quota_user_usage_str').text(usage+"%");
			var quotaToGB = parseInt(data.usage.quota) / (1024 * 1024 * 1024);
			$('#quota_user_quota').val(quotaToGB);
			$('#quota_user_submit').removeAttr('disabled');
		}
	}
	var completeUrl = String.format(url_templates.user_info,userID,local_data.token);
	request(completeUrl,"","get",after_getInfo);
}

function quotaUserSlideBack(){
	$('#quota_user_slide').animate({marginLeft:'0px'},500);
}

//Table operation
function clearTable(tableID){
	$('#'+tableID+">tbody tr").remove();
}

function clearTableHeader(tableID){
	$('#'+tableID+">thead>tr td").remove();
}


function createTable(tableID,data){
	if(data != null && typeof data != "undefined"){
		var $table = $('#'+tableID+'>tbody');
		for(var i = 0 ; i < data.length ; i++){
			$table.append(createRow(data[i]));
		}
	}
}

function createTableHeader(tableID,data){
	if(data != null && typeof data != 'undefined'){
		var $table = $('#'+tableID+'>thead>tr');
		for(var i = 0 ; i < data.length ; i++){
			$table.append('<td>'+data[i]+'</td>');
		}
	}
}

function createRow(data){
	var code = "<tr>";
	for(var index = 0 ; index < data.length ; index++){
		var td = "<td>"+data[index]+"</td>";
		code = code + td;
	}
	code = code + "</tr>";
	return code;
}

function calcPageTotalCount(itemCount,pageSize){
	return parseInt(((parseInt(itemCount)-1) / pageSize)) + 1;
}

//User
function userEditManage(){
	var val = $('#user_edit_manage').val();
	if(val == 0){
		userEdit();
	}
	else{
		userSave();
	}
}

function userEdit(){
	var $checkedList = $('#user_table >tbody input:checkbox:checked');
	if($checkedList.length == 0){
	}
	else{
		$checkedList.each(function(index, element) {
            var pos = element.name;
			var userID = element.value;
			var saveData = JSON.parse(localStorage.getItem("userTableData"));
			var groupCanOwn = saveData[pos][3];
			var groupCanOwnHTML = '<div class="control-group"><input type="text" class="span1" value="'+groupCanOwn+'"></div>';
			$('#user_table > tbody tr:eq('+pos+') td:eq(6)').html(groupCanOwnHTML);
        });
		activateEdit('user');
	}
}

function userSave(){
	var $checkedList = $('#user_table >tbody input:checkbox:checked');
	if($checkedList.length == 0){
	}
	else{
		var errorFlag = false;
		$checkedList.each(function(index, element) {
			var pos = element.name;
			var eachErrorFlag = false;
			var groupCanOwn = $('#user_table > tbody tr:eq('+pos+') td:eq(6) input[type="text"]').val();
			var userID = $('#user_table > tbody tr:eq('+pos+') td:eq(1) input[type="checkbox"]').val();
			//Check data format
			if(!valid_int.test(groupCanOwn)){
				eachErrorFlag = true;
				$('#user_table > tbody tr:eq('+pos+') td:eq(6) .control-group').addClass('error');
			}
			
			if(eachErrorFlag){
				errorFlag = true;
			}
			else{
				$('#user_table > tbody tr:eq('+pos+') td:eq(6)').html(groupCanOwn);
				//update localStorage
				var saveData = JSON.parse(localStorage.getItem('userTableData'));
				saveData[pos][3] = groupCanOwn;
				localStorage.setItem('userTableData',JSON.stringify(saveData));
				element.checked = false;
				updateUserInfo(userID,groupCanOwn);
			}
		});
		
		if(!errorFlag){
			deactivateEdit('user');
			$('#user_error_prompt').css('display','none');
			$('#user_success_prompt').css('display','block');
		}
		else{
			$('#user_error_prompt').css('display','block');
			$('#user_success_prompt').css('display','none');
		}
	}
}


function userCancelManage(){
	//Restore the data
	var savedData = JSON.parse(localStorage.getItem('userTableData'));
	if(typeof savedData != 'undefined' && savedData != null){
		for(var pos = 0 ; pos < savedData.length ; pos++){
			$('#user_table > tbody tr:eq('+pos+') td:eq(6)').html(savedData[pos][3]);
		}
		deactivateEdit('user');
	}
}

function userDeleteManage(){
}

function userCheckManage(){
	if($('#user_check_manage').is(':checked')){
		$('#user_table >tbody input:checkbox').each(function(index, element) {
            element.checked = true;
        });
	}
	else{
		$('#user_table >tbody input:checkbox').each(function(index, element) {
            element.checked = false;
        });
	}
}

function updateUserInfo(userID,groupCanOwn){
	var form = JSON.stringify({
		"groups_can_own" : groupCanOwn
	});
	function after_update(data,status){
		if(status == 'error'){
		}
		else{
		}
	}
	
	var completeUrl = String.format(url_templates.user_update,userID,local_data.token);
	request(completeUrl,form,"post",after_update);
}

function resetPassword(userID){
	var result = window.confirm("您是否确定将此用户的密码重新设置成123456?");
	if(result == true){
		function after_update(data,status){
			if(status == 'error'){
			}
			else{
				alert('密码重置成功');
			}
		}
		//var new_password = SHA256_hash('123456');
		var new_password = '123456';
		var completeUrl = String.format(url_templates.user_update_password,userID,new_password,local_data.token);
		request(completeUrl,"","post",after_update);
	}
	else{
	}
}

function userSearchSubmit(){
	$('#user_page_current_number').val(1);
	$('#user_page_select_flag').val(1);
	userSearch();
}

function userSearch(){
	var userName = $('#user_search_name').val();
	clearTable('user_table');
	var currentPageNumber = parseInt($('#user_page_current_number').val());
	var offset = (currentPageNumber-1)*pageSize;
	
	function after_search(data,status){
		if(status == 'error'){
		}
		else{
			var dataVal = [];
			var saveDataVal = [];
			if(currentPageNumber == 1){
				//Create page number
				var totalPageNumber = calcPageTotalCount(data.total,pageSize);
				$('#user_page_total_number').val(totalPageNumber);
				$('#user_page_label').text('Page 1 of '+totalPageNumber);
			}
			
			for(var index = 0,pos = 0 ; index < data.count ; index++){
				if(data.users[index].user_id != "00000000-0000-0000-0000-000000000000"){
					//Construct data
					var user = data.users[index];
					dataVal[pos] = [];
					dataVal[pos][0] = pos+1;
					dataVal[pos][1] = '<input type="checkbox" value="'+user.user_id+'" name="'+pos+'">';
					dataVal[pos][2] = user.user_name;
					dataVal[pos][3] = user.display_name;
					dataVal[pos][4] = user.email;
					dataVal[pos][5] = user.registered_str;
					dataVal[pos][6] = user.groups_can_own;
					dataVal[pos][7] = '<a onClick="resetPassword(\''+user.user_id+'\')">重置</a>';
					dataVal[pos][8] = '<a onClick="changeUserState(\'0\',this,8)">已启用</a>';
				
					saveDataVal[pos] = [];
					saveDataVal[pos][0] = user.user_id;
					saveDataVal[pos][1] = user.user_name;
					saveDataVal[pos][2] = user.role;
					saveDataVal[pos][3] = user.groups_can_own;
					pos = pos + 1;
				}
			}
			localStorage.setItem('userTableData',JSON.stringify(saveDataVal));
			createTable('user_table',dataVal);
		}
	}
	var completeUrl = String.format(url_templates.user_search,userName,offset,pageSize,local_data.token);
	request(completeUrl,"","get",after_search);
}

function userAlertClose(){
	$('#user_error_prompt').css('display','none');
	$('#user_success_prompt').css('display','none');
}

//User page switch
function userPageFirst(){
	if(pageFirst('user')){
		var val = $('#user_page_select_flag').val();
		if(val == 0){
			listUser();
		}
		else{
			userSearch();
		}
	}
}

function userPageRight(){
	if(pageRight('user')){
		var val = $('#user_page_select_flag').val();
		if(val == 0){
			listUser();
		}
		else{
			userSearch();
		}
	}
}

function userPageLeft(){
	if(pageLeft('user')){
		var val = $('#user_page_select_flag').val();
		if(val == 0){
			listUser();
		}
		else{
			userSearch();
		}
	}
}

function userPageLast(){
	if(pageLast('user')){
		var val = $('#user_page_select_flag').val();
		if(val == 0){
			listUser();
		}
		else{
			userSearch();
		}
	}
}

//Group page switch
function groupPageFirst(){
	if(pageFirst('group')){
		var val = $('#group_page_select_flag').val();
		if(val == 0){
			listGroup();
		}
		else{
			groupSearch();
		}
	}
}

function groupPageRight(){
	if(pageRight('group')){
		var val = $('#group_page_select_flag').val();
		if(val == 0){
			listGroup();
		}
		else{
			groupSearch();
		}
	}
}

function groupPageLeft(){
	if(pageLeft('group')){
		var val = $('#group_page_select_flag').val();
		if(val == 0){
			listGroup();
		}
		else{
			groupSearch();
		}
	}
}

function groupPageLast(){
	if(pageLast('group')){
		var val = $('#group_page_select_flag').val();
		if(val == 0){
			listGroup();
		}
		else{
			groupSearch();
		}
	}
}

//Group user page switch
function groupUserPageFirst(){
	if(pageFirst('group_user')){
		listGroupUser();
	}
}

function groupUserPageRight(){
	if(pageRight('group_user')){
		listGroupUser();
	}
}

function groupUserPageLeft(){
	if(pageLeft('group_user')){
		listGroupUser();
	}
}

function groupUserPageLast(){
	if(pageLast('group_user')){
		listGroupUser();
	}
}

//Quota group page switch
function quotaGroupPageFirst(){
	if(pageFirst('quota_group')){
		quotaGroupSearch();
	}
}

function quotaGroupPageRight(){
	if(pageRight('quota_group')){
		quotaGroupSearch();
	}
}

function quotaGroupPageLeft(){
	if(pageLeft('quota_group')){
		quotaGroupSearch();
	}
}

function quotaGroupPageLast(){
	if(pageLast('quota_group')){
		quotaGroupSearch();
	}
}

//Quota user page switch
function quotaUserPageFirst(){
	if(pageFirst('quota_user')){
		quotaUserSearch();
	}
}

function quotaUserPageRight(){
	if(pageRight('quota_user')){
		quotaUserSearch();
	}
}

function quotaUserPageLeft(){
	if(pageLeft('quota_user')){
		quotaUserSearch();
	}
}

function quotaUserPageLast(){
	if(pageLast('quota_group')){
		quotaUserSearch();
	}
}

//Page switch
function pageFirst(pageItemName){
	var pageNumber = parseInt($('#'+pageItemName+'_page_current_number').val());
	var totalNumber = parseInt($('#'+pageItemName+'_page_total_number').val());
	if(pageNumber != 1){
		pageNumber = 1;
		var pageStr = 'Page '+pageNumber+' of '+totalNumber;
		$('#'+pageItemName+'_page_label').text(pageStr);
		$('#'+pageItemName+'_page_current_number').val(pageNumber);
		return true;
	}
	else{
		return false;
	}
}

function pageRight(pageItemName){
	var pageNumber = parseInt($('#'+pageItemName+'_page_current_number').val());
	var totalNumber = parseInt($('#'+pageItemName+'_page_total_number').val());
	if(pageNumber < totalNumber){
		pageNumber = pageNumber + 1;
		var pageStr = 'Page '+pageNumber+' of '+totalNumber;
		$('#'+pageItemName+'_page_label').text(pageStr);
		$('#'+pageItemName+'_page_current_number').val(pageNumber);
		return true;
	}
	else{
		return false;
	}
}

function pageLeft(pageItemName){
	var pageNumber = parseInt($('#'+pageItemName+'_page_current_number').val());
	var totalNumber = parseInt($('#'+pageItemName+'_page_total_number').val());
	if(pageNumber > 1){
		pageNumber = pageNumber - 1;
		var pageStr = 'Page '+pageNumber+' of '+totalNumber;
		$('#'+pageItemName+'_page_label').text(pageStr);
		$('#'+pageItemName+'_page_current_number').val(pageNumber);
		return true;
	}
	else{
		return false;
	}
}

function pageLast(pageItemName){
	var pageNumber = parseInt($('#'+pageItemName+'_page_current_number').val());
	var totalNumber = parseInt($('#'+pageItemName+'_page_total_number').val());
	if(pageNumber != totalNumber){
		pageNumber = totalNumber;
		var pageStr = 'Page '+pageNumber+' of '+totalNumber;
		$('#'+pageItemName+'_page_label').text(pageStr);
		$('#'+pageItemName+'_page_current_number').val(pageNumber);
		return true;
	}
	else{
		return false;
	}
}

//Group
function userList(groupID){
	$('#group_slide').animate({marginLeft:'-1158px'},500);
	$('#group_edit_manage').css('display','none');
	$('#group_user_edit_manage').css('display','inline-block');
	$('#group_user_add').css('display','inline-block');
	$('#group_delete_manage').val(1);
	$('#group_cancel_manage').val(1);
	$('#current_group_id').val(groupID);
	listGroupUser();
}

function slideBack(){
	$('#group_slide').animate({marginLeft:'0px'},500);
	$('#group_edit_manage').css('display','inline-block');
	$('#group_user_edit_manage').css('display','none');
	$('#group_delete_manage').val(0);
	$('#group_cancel_manage').val(0);
	$('#group_user_add').css('display','none');
	//Clean checkbox
	deactivateEdit('group_user');
	//$('#group_table').css('display','table');
}

function groupSearchSubmit(){
	$('#group_page_current_number').val(1);
	$('#group_page_select_flag').val(1);
	groupSearch();
}

function groupSearch(){
	var groupName = $('#group_search_name').val();
	clearTable('group_table');
	var currentPageNumber = parseInt($('#group_page_current_number').val());
	var offset = (currentPageNumber-1)*pageSize;
	
	function after_search(data,status){
		if(status == "error"){
		}
		else{
			var dataVal = [];
			var saveDataVal = [];
			if(currentPageNumber == 1){
				//Create page number
				var totalPageNumber = calcPageTotalCount(data.total,pageSize);
				$('#group_page_total_number').val(totalPageNumber);
				$('#group_page_label').text('Page 1 of '+totalPageNumber);
			}
			
			for(var index = 0 ; index < data.count ; index++){
				var group = data.groups[index];
				dataVal[index] = [];
				dataVal[index][0] = index+1;
				dataVal[index][1] = '<input type="checkbox" value="'+group.group_id+'" name="'+index+'">';
				dataVal[index][2] = '<a onClick="userList(\''+group.group_id+'\')">'+stringThumbnail(group.group_name)+'</a>';
				dataVal[index][3] = stringThumbnail(group.description);
				var tags = "";
				if(group.tags.length > 0){
					tags = group.tags[0];
					for(var tagIndex = 1 ; tagIndex < group.tags.length ; tagIndex ++){
						tags = tags + ',' + group.tags[tagIndex];
					}
				}
				dataVal[index][4] = stringThumbnail(tags);
				
				dataVal[index][5] = group.type_str;
				dataVal[index][6] = getGroupSearch(group.visible_to_search);
				dataVal[index][7] = group.established_str;
				if(data.groups[index].status == group_status.normal){
					dataVal[index][8] = '<a style="color:#0088cc" onClick="changeGroupState(\'0\',this)">已启用</a>';
				}
				else{
					dataVal[index][8] = '<a style="color:#ff0000" onClick="changeGroupState(\'1\',this)">已禁用</a>';;
				}
				
				saveDataVal[index] = [];
				saveDataVal[index][0] = group.group_name;
				saveDataVal[index][1] = group.description;
				saveDataVal[index][2] = tags;
				saveDataVal[index][3] = group.type;
				saveDataVal[index][4] = group.group_id;
				saveDataVal[index][5] = group.type_str;
			}
			//Save data
			localStorage.setItem('groupTableData',JSON.stringify(saveDataVal));
			createTable('group_table',dataVal);
		}
	}
	var completeUrl = String.format(url_templates.group_search,groupName,offset,pageSize,local_data.token);
	request(completeUrl,"","get",after_search);
}

function changeGroupState(currentState,currentTR){
	var tr = currentTR.parentNode.parentNode;
	var groupID = tr.cells[1].firstChild.value;
	var groupStatus = 0;
	
	if(currentState == 0){
		groupStatus = group_status.blocked;
	}
	else{
		groupStatus = group_status.normal;
	}
	
	function after_update(data,status){
		if(status == 'error'){
		}
		else{
			if(currentState == 0){
				tr.cells[8].innerHTML = '<a style="color:#ff0000" onClick="changeGroupState(\'1\',this)">已禁用</a>';
			}
			else{
				tr.cells[8].innerHTML = '<a style="color:#0088cc" onClick="changeGroupState(\'0\',this)">已启用</a>';
			}
		}
	}
	
	var form = JSON.stringify({
		"status" : groupStatus
	});
	
	var completeUrl = String.format(url_templates.group_update,groupID,local_data.token);
	request(completeUrl,form,"post",after_update);
}

function groupEditManage(){
	var val = $('#group_edit_manage').val();
	if(val == 0){
		groupEdit();
	}
	else{
		groupSave();
	}
}

function groupUserEditManage(){
	var val = $('#group_user_edit_manage').val();
	if(val == 0){
		groupUserEdit();
	}
	else{
		groupUserSave();
	}
}

function getGroupType(){
	function after_get(data,status){
		if(status == 'error'){
		}
		else{
			for(var index = 0 ; index < data.length ; index++){
				GROUP_TYPE[index] = new Object();
				GROUP_TYPE[index].type_str = data[index].type_details;
				GROUP_TYPE[index].type = data[index].type;
			}
		}
	}
	var completeUrl = String.format(url_templates.group_type,local_data.token);
	request(completeUrl,"","get",after_get);
}

function createGroupTypeSelect(itemNumber,itemName){
	var htmlStr = '<select id="group_type">';
	if(GROUP_TYPE.length > 0){
		for(var index = 0 ; index < GROUP_TYPE.length ; index++){
			if(itemName == GROUP_TYPE[index].type_str){
				htmlStr = htmlStr + '<option value="'+GROUP_TYPE[index].type+'">'+GROUP_TYPE[index].type_str+'</option>';
			}
		}
		
		for(var index = 0 ; index < GROUP_TYPE.length ; index++){
			if(itemName != GROUP_TYPE[index].type_str){
				htmlStr = htmlStr + '<option value="'+GROUP_TYPE[index].type+'">'+GROUP_TYPE[index].type_str+'</option>';
			}
		}
	}
	htmlStr = htmlStr + '</select>';
	return htmlStr;
}

function getGroupUserPosition(){
	function after_get(data,status){
		if(status == 'error'){
		}
		else{
			for(var index = 0 ; index < data.length ; index++){
				USER_POSITION[index] = new Object();
				USER_POSITION[index].position_str = data[index].position_str;
				USER_POSITION[index].position = data[index].position;
			}
		}
	}
	var completeUrl = String.format(url_templates.relation_positions,local_data.token);
	request(completeUrl,"","get",after_get);
}

function createGroupUserPositionSelect(itemNumber,itemName){
	var htmlStr = '<select id="group_user_position" class="span6">';
	if(USER_POSITION.length > 0){
		htmlStr = htmlStr + '<option value="'+itemNumber+'">'+itemName+'</option>';
		for(var index = 0 ; index < USER_POSITION.length ; index++){
			if(itemNumber != USER_POSITION[index].position){
				htmlStr = htmlStr + '<option value="'+USER_POSITION[index].position+'">'+USER_POSITION[index].position_str+'</option>';
			}	
		}
	}
	htmlStr = htmlStr + '</select>';
	return htmlStr;
}

function createGroupVisibleSelect(itemName){
	var htmlStr = '<select id="group_visible" class="span12">';
	if(itemName){
		htmlStr = htmlStr + '<option value="true">'+getGroupSearch(true)+'</option>';
		htmlStr = htmlStr + '<option value="false">'+getGroupSearch(false)+'</option>';
	}
	else{
		htmlStr = htmlStr + '<option value="false">'+getGroupSearch(false)+'</option>';
		htmlStr = htmlStr + '<option value="true">'+getGroupSearch(true)+'</option>';
	}
	htmlStr = htmlStr + '</select>';
	return htmlStr;
}

function groupEdit(){
	var $checkedList = $('#group_table >tbody input:checkbox:checked');
	if($checkedList.length == 0){
	}
	else{
		$checkedList.each(function(index, element) {
			var pos = element.name;
			var groupID = element.value;
			//var description = $('#group_table > tbody tr:eq('+pos+') td:eq(3)').html();
			var saveData = JSON.parse(localStorage.getItem('groupTableData'));
			
			var tags = saveData[pos][2];
			var description =saveData[pos][1];
			
			var tagsHTML = '<div class="control-group"><input type="text" class="span8" value="'+tags+'"></div>';
			var descriptionHTML = '<div class="control-group"><textarea row="1">'+description+'</textarea></div>';
			var selectHTML = createGroupTypeSelect(saveData[pos][3],saveData[pos][5]);
			var visibleHTML = createGroupVisibleSelect(saveData[pos][6]);
			
			$('#group_table > tbody tr:eq('+pos+') td:eq(4)').html(tagsHTML);
			$('#group_table > tbody tr:eq('+pos+') td:eq(3)').html(descriptionHTML);
			$('#group_table > tbody tr:eq('+pos+') td:eq(5)').html(selectHTML);
			$('#group_table > tbody tr:eq('+pos+') td:eq(6)').html(visibleHTML);
        });
		activateEdit('group');
	}
}

function groupSave(){
	var $checkedList = $('#group_table >tbody input:checkbox:checked');
	if($checkedList.length == 0){
	}
	else{
		var errorFlag = false;
		$checkedList.each(function(index, element) {
			var eachErrorFlag = false;
			var pos = element.name;
            var description = $('#group_table > tbody tr:eq('+pos+') td:eq(3) textarea').val();
			var tags = $('#group_table > tbody tr:eq('+pos+') td:eq(4) input[type="text"]').val();
			var type = $('#group_table > tbody tr:eq('+pos+') td:eq(5) select').find('option:selected').val();
			var type_str = $('#group_table > tbody tr:eq('+pos+') td:eq(5) select').find('option:selected').text();
			var visible = $('#group_table > tbody tr:eq('+pos+') td:eq(6) select').find('option:selected').val();
			var visible_str = $('#group_table > tbody tr:eq('+pos+') td:eq(6) select').find('option:selected').text();
			//Check data format
			if(invalid_letters.test(description)){
				eachErrorFlag = true;
				$('#group_table > tbody tr:eq('+pos+') td:eq(3) .control-group').addClass('error');
			}
			
			if(invalid_letters.test(tags)){
				eachErrorFlag = true;
				$('#group_table > tbody tr:eq('+pos+') td:eq(4) .control-group').addClass('error');
			}
			
			if(eachErrorFlag){
				errorFlag = true;
			}
			else{
				$('#group_table > tbody tr:eq('+pos+') td:eq(3)').html(stringThumbnail(description));
				$('#group_table > tbody tr:eq('+pos+') td:eq(4)').html(stringThumbnail(tags));
				$('#group_table > tbody tr:eq('+pos+') td:eq(5)').html(type_str);
				$('#group_table > tbody tr:eq('+pos+') td:eq(6)').html(visible_str);
				//update localStorage
				var saveData = JSON.parse(localStorage.getItem('groupTableData'));
				saveData[pos][1] = description;
				saveData[pos][2] = tags;
				saveData[pos][5] = type_str;
				saveData[pos][6] = visible;
				localStorage.setItem('groupTableData',JSON.stringify(saveData));
				element.checked = false;
				updateGroupInfo(saveData[pos][4],description,tags,type,visible);
			}
        });
		if(!errorFlag){
			deactivateEdit('group');
			$('#group_error_prompt').css('display','none');
			$('#group_success_prompt').css('display','block');
		}
		else{
			$('#group_error_prompt').css('display','block');
			$('#group_success_prompt').css('display','none');
		}
	}
}

function groupUserSearchSubmit(){
	var groupID = $('#current_group_id').val();
	var query = $('#group_user_search_name').val();
	clearTable('group_user_table');
	var currentPageNumber = 1;
	var offset = (currentPageNumber-1)*pageSize;
	function after_search(data,status){
		if(status == "success"){
			var dataVal = [];
			var saveDataVal = [];
			if(currentPageNumber == 1){
				//Create page number
				var totalPageNumber = calcPageTotalCount(data.total,pageSize);
				$('#group_user_page_total_number').val(totalPageNumber);
				$('#group_user_page_label').text('Page 1 of '+totalPageNumber);
			}
			for(var index = 0 ; index < data.users.length ; index++){
				dataVal[index] = [];
				dataVal[index][0] = index+1;
				dataVal[index][1] = '<input type="checkbox" value="'+data.users[index].user_id+'" name="'+index+'">';
				dataVal[index][2] = data.users[index].name;
				dataVal[index][3] = data.users[index].full_name;
				dataVal[index][4] = data.users[index].email;
				dataVal[index][5] = data.users[index].relation.role_details;
				
				saveDataVal[index] = [];
				saveDataVal[index][0] = groupID;
				saveDataVal[index][1] = data.users[index].user_id;
				saveDataVal[index][2] = data.users[index].relation.role_details;
				saveDataVal[index][3] = relation_position[data.users[index].relation.role];
			}
			//$('#group_table').css('display','none');
			localStorage.setItem('groupUserTableData',JSON.stringify(saveDataVal));
			createTable('group_user_table',dataVal);
		}
	}
	
	var completeUrl = String.format(url_templates.group_user_search,groupID,query,offset,pageSize,local_data.token);
	request(completeUrl,"","get",after_search);
}

function groupUserAdd(){
	$('#group_adduser_modal').modal('show');
}

function groupAdduserSearchSubmit(){
	var userName = $('#group_adduser_search_name').val();
	clearTable('group_adduser_table');
	function after_search(data,status){
		if(status == 'error'){
		}
		else{
			var dataVal = [];
			for(var index = 0,pos = 0; index < data.count; index++){
				var user = data.users[index];
				if(user.user_id != "00000000-0000-0000-0000-000000000000"){
					dataVal[pos] = [];
					dataVal[pos][0] = user.user_name;
					dataVal[pos][1] = user.display_name;
					dataVal[pos][2] = user.email;
					dataVal[pos][3] = user.registered_str;
					dataVal[pos][4] = '<a onClick="addUserToAlternativeBox(\''+user.user_name+'\',\''+user.user_id+'\')">添加</a>';
				}
			}
			createTable('group_adduser_table',dataVal);
		}
	}
	var completeUrl = String.format(url_templates.user_search,userName,0,-1,local_data.token);
	request(completeUrl,"","get",after_search);
}

function addUserToAlternativeBox(userName,userID){
	var flag = false;
	$userList = $('#group_adduser_result_box button');
	if($userList.length != 0){
		$userList.each(function(index, element) {
            if(userID == element.value){
				flag = true;
			}
        });
	}
	if(!flag){
		var appendHtml = '<span class="badge badge-info badge-pos">'+userName+'<button type="button" class="myClose" value="'+userID+'" onClick="deleteUserFromAlternativeBox(this)">&times;</button></span>';
		$('#group_adduser_result_box').append(appendHtml);
	}
	else{
		alert('该用户已经添加过!!');
	}
}

function deleteUserFromAlternativeBox(element){
	$(element).parent().remove();
}

function groupAdduserSubmit(){
	var groupID = $('#current_group_id').val();
	$userList = $('#group_adduser_result_box button');
	var length = $userList.length;
	var count = 0;
	if($userList.length == 0){
	}
	else{
		function after_add(data,status){
			if(status == 'error'){
			}
			else{
			}
			count = count + 1;
			if(count >= length){
				$('#group_adduser_result_box span').remove();
			}
		}
		$userList.each(function(index, element) {
            var userID = element.value;
			var completeUrl = String.format(url_templates.group_add_user,groupID,userID,local_data.token);
			request(completeUrl,"","post",after_add);
        });
	}
}

function clearAlternativeBox(){
	$('#group_adduser_result_box span').remove();
	clearTable('group_adduser_table');
	$('#group_adduser_search_name').val("");
	$('#group_adduser_modal').modal('hide');
	listGroupUser();
}

function groupUserEdit(){
	var $checkedList = $('#group_user_table >tbody input:checkbox:checked');
	if($checkedList.length == 0){
	}
	else{
		$checkedList.each(function(index, element) {
			var pos = element.name;
			var userID = element.value;
			var saveData = JSON.parse(localStorage.getItem('groupUserTableData'));
			var selectHTML = createGroupUserPositionSelect(saveData[pos][3],saveData[pos][2]);
			
			$('#group_user_table > tbody tr:eq('+pos+') td:eq(5)').html(selectHTML);
        });
		activateEdit('group_user');
	}
}

function groupUserSave(){
	var $checkedList = $('#group_user_table >tbody input:checkbox:checked');
	if($checkedList.length == 0){
	}
	else{
		$checkedList.each(function(index, element) {
			var pos = element.name;
			var position = $('#group_user_table > tbody tr:eq('+pos+') td:eq(5) select').find('option:selected').val();
            var position_str = $('#group_user_table > tbody tr:eq('+pos+') td:eq(5) select').find('option:selected').text();
			$('#group_user_table > tbody tr:eq('+pos+') td:eq(5)').html(position_str);
			
			//Update localStorage
			var saveData = JSON.parse(localStorage.getItem('groupUserTableData'));
			saveData[pos][2] = position_str;
			saveData[pos][3] = position;
			localStorage.setItem('groupUserTableData',JSON.stringify(saveData));
			element.checked = false;
			updateGroupUserInfo(saveData[pos][0],saveData[pos][1],position);
        });
		deactivateEdit('group_user');
	}
}

function updateGroupInfo(groupID,description,tags,type,visible){
	/*var tagArray = tags.split(',');
	for(var index = 0; index < tagArray.length ; index++)
		tagArray[index] = Trim(tagArray[index]).toLowerCase();*/
		
	var form = JSON.stringify({
		"intro" : description,
		"tags" : tags,
		"type" : type,
		"is_visible" : visible
	});
	
	function after_update(data,status){
		if(status == "error"){
		}
		else{
		}
	}
	var completeUrl = String.format(url_templates.new_group_update,groupID,local_data.token);
	request(completeUrl,form,"post",after_update);
}

function updateGroupUserInfo(groupID,userID,position){
	var form = JSON.stringify({
		"position" : position
	});
	function after_update(data,status){
		if(status == 'error'){
		}
		else{
		}
	}
	var completeUrl = String.format(url_templates.group_user_update,groupID,userID,local_data.token);
	request(completeUrl,form,"post",after_update);
}

function groupCancelManage(){
	var val = $('#group_cancel_manage').val();
	if(val == 0){
		groupCancel();
	}
	else{
		groupUserCancel();
	}
}

function groupCancel(){
	//Restore the data
	var savedData = JSON.parse(localStorage.getItem('groupTableData'));
	if(typeof savedData != 'undefined' && savedData != null){
		for(var pos = 0 ; pos < savedData.length ; pos++){
			$('#group_table > tbody tr:eq('+pos+') td:eq(3)').html(stringThumbnail(savedData[pos][1]));
			$('#group_table > tbody tr:eq('+pos+') td:eq(4)').html(stringThumbnail(savedData[pos][2]));
			$('#group_table > tbody tr:eq('+pos+') td:eq(5)').html(savedData[pos][5]);
			$('#group_table > tbody tr:eq('+pos+') td:eq(6)').html(getGroupSearch(savedData[pos][6]));
		}
		deactivateEdit('group');
	}
}

function groupUserCancel(){
	//Restore the data
	var savedData = JSON.parse(localStorage.getItem('groupUserTableData'));
	if(typeof savedData != 'undefined' && savedData != null){
		for(var pos = 0 ; pos < savedData.length ; pos++){
			$('#group_user_table > tbody tr:eq('+pos+') td:eq(5)').html(savedData[pos][2]); 
		}
		deactivateEdit('group_user');
	}
}

function deactivateEdit(tableItems){
	$('#'+tableItems+'_edit_manage').val(0);
	$('#'+tableItems+'_edit_manage').text('编辑');
	//Enable checkbox
	$('#'+tableItems+'_table input:checkbox').removeAttr('disabled');
	$('#'+tableItems+'_table input:checkbox').each(function(index, element) {
        element.checked = false;
    });
}

function activateEdit(tableItems){
	$('#'+tableItems+'_edit_manage').val(1);
	$('#'+tableItems+'_edit_manage').text('保存');
	//Disable checkbox
	$('#'+tableItems+'_table input:checkbox').attr('disabled',true);
}

function groupCheckManage(){
	if($('#group_check_manage').is(':checked')){
		$('#group_table >tbody input:checkbox').each(function(index, element) {
            element.checked = true;
        });
	}
	else{
		$('#group_table >tbody input:checkbox').each(function(index, element) {
            element.checked = false;
        });
	}
}

function groupAlertClose(){
	$('#group_error_prompt').css('display','none');
	$('#group_success_prompt').css('display','none');
}

function groupDeleteManage(){
	var val = $('#group_delete_manage').val();
	if(val == 0){
		groupDelete();
	}
	else{
		groupUserDelete();
	}
}

function groupDelete(){
	var $checkedList = $('#group_table >tbody input:checkbox:checked');
	if($checkedList.length == 0){
	}
	else{
		$checkedList.each(function(index, element) {
			var pos = element.name;
			var groupID = $('#group_table > tbody tr:eq('+pos+') td:eq(1) input[type="checkbox"]').val();
			disbandGroup(groupID);
		});
	}
}

function disbandGroup(groupID){
	function after_disband(data,status){
		if(status == 'error'){ 
		}
		else{
			listGroup();
		}
	}
	var completeUrl = String.format(url_templates.group_disband,groupID,local_data.token);
	request(completeUrl,"","delete",after_disband);
}

function groupUserDelete(){
	var $checkedList = $('#group_user_table >tbody input:checkbox:checked');
	if($checkedList.length == 0){
	}
	else{
		$checkedList.each(function(index, element) {
			var pos = element.name;
			var groupID = $('#current_group_id').val();
			var userID = $('#group_user_table > tbody tr:eq('+pos+') td:eq(1) input[type="checkbox"]').val();
			deleteUserFromGroup(groupID,userID);
		});
	}
}

function deleteUserFromGroup(groupID,userID){
	function after_delete(data,status){
		if(status == 'error'){
		}
		else{
			listGroupUser();
		}
	}
	
	var completeUrl = String.format(url_templates.group_remove_user,groupID,userID,local_data.token);
	request(completeUrl,"","delete",after_delete);
}

//Group user
function groupUserCheckManage(){
	if($('#group_user_check_manage').is(':checked')){
		$('#group_user_table >tbody input:checkbox').each(function(index, element) {
            element.checked = true;
        });
	}
	else{
		$('#group_user_table >tbody input:checkbox').each(function(index, element) {
            element.checked = false;
        });
	}
}

//Import
function dataImport(){
	$('#data_slide').animate({marginLeft:'0px'},500);
}

function importUser(){
	$('#data_file_search').click();
	$('#import_execution').val(1);
	$('#data_file_search').change(importUserOnchange);
}

function importGroup(){
	$('#data_file_search').click();
	$('#import_execution').val(2);
	$('#data_file_search').change(importGroupOnchange);
}

function importUserOnchange(){
	var file = this.files[0];
	if(file.type != "text/plain"){
		alert("请上传TXT格式的文件!!");
	}
	else{
		$('#data_import_text').val(this.value);
		if(window.File && window.FileReader && window.FileList && window.Blob){
			var fileReader = new FileReader();
			fileReader.onloadend = function(e){
				var fileArray = fileStrToArray(e.target.result);
				createPreviewTable(fileArray,pageSize);
				dataProgressInit('import',fileArray.length-1);
			};
			fileReader.readAsText(file,'UTF-8');
		}
		else{
			alert('此浏览器的版本过低！');
		}
	}
}

function importGroupOnchange(){
	var file = this.files[0];
	if(file.type != "text/plain"){
		alert("请上传TXT格式的文件!!");
	}
	else{
		$('#data_import_text').val(this.value);
		if(window.File && window.FileReader && window.FileList && window.Blob){
			var fileReader = new FileReader();
			fileReader.onloadend = function(e){
				var fileArray = fileStrToArray(e.target.result);
				var previewArray = groupDataPretreatment(fileArray);
				createPreviewTable(previewArray,pageSize);
				dataProgressInit('import',previewArray.length-1);
			}; 
			fileReader.readAsText(file,'UTF-8');
		}
		else{
			alert('此浏览器的版本过低！');
		}
	}
}

function importUserDown(){
	var text = "";
		text = text + export_user_header.user_name + ',';
		text = text + export_user_header.display_name + ',';
		text = text + export_user_header.password + ',';
		text = text + export_user_header.email + '\n';
	
	var blob = new Blob([text],{type: "text/plain;charset=utf-8"});
	if(blob){
		saveAs(blob,"user_templates.txt");
	}
}

function importGroupDown(){
	var text = "";
		text = text + export_group_header.group_name + ',';
		text = text + export_group_header.description + ',';
		text = text + export_group_header.group_tags + ',';
		text = text + export_group_header.group_type +',';
		text = text + export_group_header.group_visible + ',';
		text = text + export_group_header.group_user_count + '\n';
		
	var blob = new Blob([text],{type: "text/plain;charset=utf-8"});
	if(blob){
		saveAs(blob,"group_templates.txt");
	}
}

function importExecution(){
	var val = parseInt($('#import_execution').val());
	if(val == 1){
		importUserExec();
	}
	else if(val == 2){
		importGroupExec();
	}
	else{
		alert('请先选择导入选项');
	}
}

function importUserExec(){
	var file = document.getElementById('data_file_search').files[0];
	if(window.File && window.FileReader && window.FileList && window.Blob){
		var fileReader = new FileReader();
		fileReader = new FileReader();
		fileReader.onloadend=function(e){
			var fileArray = fileStrToArray(e.target.result);
			registerUser(fileArray);
		};
		fileReader.readAsText(file,'UTF-8');
	}
	else{
		alert('此浏览器的版本过低！不支持文件读写！');
	}
}

function importGroupExec(){
	var file = document.getElementById('data_file_search').files[0];
	if(window.File && window.FileReader && window.FileList && window.Blob){
		var fileReader = new FileReader();
		fileReader = new FileReader();
		fileReader.onloadend=function(e){
			var fileArray = fileStrToArray(e.target.result);
			var arrangedArray = groupDataArrange(fileArray);
			if(arrangedArray.length > 0){
				$('#import_result_label').css('display','block');
				$('#import_result_label .load-label-total').text(arrangedArray.length);
				$('#import_result_label .load-label-error').text(0);
				$('#import_result_label .load-label-success').text(0);
				for(var index = 0 ; index < arrangedArray.length ; index++){
					createGroupAndAddUser(arrangedArray[index],arrangedArray.length);
				}
			}
		};
		fileReader.readAsText(file,'UTF-8');
	}
	else{
		alert('此浏览器的版本过低！不支持文件读写！');
	}
}

function createGroupAndAddUser(groupInfo,total){
	var group = groupInfo.group;
	var user = groupInfo.user;
	var length = user.length;
	var count = 0;
	function after_add(data,status){
		if(status == 'error'){
		}
		else{
		}
		count++;
		if(count == length - 1){
			var currentCount = parseInt($('#import_statistic > strong').text());
			dataProgressExec('import',currentCount+1,total);
			var success = parseInt($('#import_result_label .load-label-success').text());
			$('#import_result_label .load-label-success').text(success+1)
		}
	}
	
	function after_create(data,status){
		if(status == 'error'){
			var currentCount = parseInt($('#import_statistic > strong').text());
			dataProgressExec('import',currentCount+1,total);
			var error = parseInt($('#import_result_label .load-label-error').text());
			$('#import_result_label .load-label-error').text(error+1);
		}
		else{
			for(var index = 1 ; index < user.length; index++){
				var userID = getUserID(user[index]);
				if(userID != null){
					var completeUrl = String.format(url_templates.group_add_user,data.group_id,userID,local_data.token);
					request(completeUrl,"","post",after_add);
				}
			}
		}
	}
	
	var form = JSON.stringify({
		'group_name' : group[0],
		'description' : group[1], 
		'tags' : group[2],
		'type' : group[3],
		'visible_to_search' : groupVisibleToSearch(group[4])
	});
	var ownerID = getUserID(user[0]);
	if(ownerID != null){
		var completeUrl = String.format(url_templates.group_establish,ownerID,local_data.token);
		request(completeUrl,form,"post",after_create);
	}
}

function fileStrToArray(str){
	var regStr = /\r|\n/g;
	var infoArray = str.split(regStr);
	var trimArray = [];
	for(var index = 0,pos = 0 ; pos < infoArray.length ; pos++){
		if(Trim(infoArray[pos]) != ""){
			trimArray[index] = infoArray[pos].split(',');
			index++;
		}
	}
	return trimArray;
}

function groupDataPretreatment(fileArray){
	if(fileArray.length > 1){
		var index,pos;
		var tableData = [];
		tableData[0] = fileArray[0];
		for(pos = 1,index = 1;index < fileArray.length ;pos++,index++){
			tableData[pos] = fileArray[index];
			tableData[pos][2] = transforGroupTags(fileArray[index][2]);
			var length = fileArray[index].length;
			var countStr = fileArray[index][length - 1];
			if(countStr != '*'){
				var count = parseInt(countStr);
				index = index + count;
			}
		}
		return tableData;
	}
}

function groupDataArrange(fileArray){
	var resultArray = [];
	var index,pos;
	for(index = 1,pos = 0;index < fileArray.length ;pos++,index++){
		resultArray[pos] = new Object();
		resultArray[pos].group = fileArray[index];
		resultArray[pos].group[2] = fileArray[index][2].split('/');
		var length = fileArray[index].length;
		var countStr = fileArray[index][length - 1];
		if(countStr != '*'){
			var count = parseInt(countStr);
			resultArray[pos].user = [];
			for(var userIndex = 0 ; userIndex < count ; userIndex++){
				index++;
				resultArray[pos].user[userIndex] = fileArray[index];
			}
		}
	}
	return resultArray;
}

function getUserID(userName){
	var userID;
	function after_search(data,status){
		if(status == 'error'){
		}
		else{
			if(data.count > 0)
				userID = data.users[0].user_id;
			else
				userID = null;
		}
	}
	var completeUrl = String.format(url_templates.user_search,userName,0,1,local_data.token);
	requestSync(completeUrl,"","get",after_search);
	return userID;
}

function groupVisibleToSearch(str){
	var flag = -1;
	if(str.length == 1){
		var type = str.toLowerCase();
		if(type == 'y')
			flag = "true";
		else if(type == 'n')
			flag = "false";
	}
	return flag;
}

function transforGroupTags(str){
	var tags = "";
	var tagArray = str.split('-');
	if(tagArray.length > 0){
		for(var index = 0 ; index < tagArray.length-1 ; index++){
			tags += tagArray[index] + ',';
		}
		tags += tagArray[tagArray.length-1];
	}
	return tags;
}

function createPreviewTable(dataArray,count){
	clearTableHeader('data_import_table');
	clearTable('data_import_table');
	if(dataArray.length > 1 && count > 0){
		var factCount = minVal(dataArray.length-1,count);
		createTableHeader('data_import_table',dataArray[0]);
		createTable('data_import_table',dataArray.slice(1,factCount+1));
	}
}

function registerUser(dataArray){
	var total = dataArray.length - 1;
	$('#import_result_label').css('display','block');
	$('#import_result_label .load-label-total').text(total);
	var success = 0;
	var error = 0;
	function after_register(data,status){
		if(status == 'error'){
			error = error + 1;
		}
		else{
			success = success + 1;
		}
		dataProgressExec('import',success+error,total);
		$('#import_result_label .load-label-success').text(success);
		$('#import_result_label .load-label-error').text(error);
	}
	for(var index =1 ; index <= total ; index++){
		var form = JSON.stringify({
			'user_name' : dataArray[index][0],
			'email' : dataArray[index][3],
			'display_name' : dataArray[index][1]
		});
		var password = SHA256_hash(dataArray[index][2]);
		var completeUrl = String.format(url_templates.user_register_and_activate,password,local_data.token);
		request(completeUrl,form,"post",after_register);
	}
}

function dataProgressInit(itemName,total){
	$('#'+itemName+'_progress').css('width','0%');
	$('#'+itemName+'_rate').text('0%');
	$('#'+itemName+'_statistic').html('已经导入<strong>0</strong>/'+total);
}

function dataProgressExec(itemName,count,total){
	var rate = Number(parseInt(count) / parseInt(total) * 100).toFixed(2);
	$('#'+itemName+'_progress').css('width',rate+'%');
	$('#'+itemName+'_rate').text(rate+'%');
	$('#'+itemName+'_statistic>strong').text(count);
}

function resultClose(){
	$('#import_result_label').css('display','none');
}

//Export
function dataExport(){
	$('#data_slide').animate({marginLeft:'-1158px'},500);
}

function exportUser(){
	$('#export_execution').val(1);
	clearTableHeader('data_export_table');
	clearTable('data_export_table');
	function after_list(data,status){
		if(status == 'error'){
		}
		else{
			var dataVal = [];
			var dataHeaderVal = [];
			dataHeaderVal[0] = export_user_header.user_name;
			dataHeaderVal[1] = export_user_header.display_name;
			dataHeaderVal[2] = export_user_header.email;
			dataHeaderVal[3] = export_user_header.groups_can_own;
			
			for(var index = 0 ; index < data.count ; index++){
				var user = data.users[index];
				dataVal[index] = [];
				dataVal[index][0] = user.user_name;
				dataVal[index][1] = user.display_name;
				dataVal[index][2] = user.email;
				dataVal[index][3] = user.groups_can_own;
			}
			$('#export_data_total').val(data.total);
			dataProgressInit('export',data.total);
			createTableHeader('data_export_table',dataHeaderVal);
			createTable('data_export_table',dataVal);
		}
	}
	var completeUrl = String.format(url_templates.user_list,0,pageSize,local_data.token);
	request(completeUrl,"","get",after_list);
}

function exportGroup(){
	$('#export_execution').val(2);
	clearTableHeader('data_export_table');
	clearTable('data_export_table');
	function after_list(data,status){
		if(status == 'error'){
			
		}
		else{
			var dataVal = [];
			var dataHeaderVal = [];
			dataHeaderVal[0] = export_group_header.group_name;
			dataHeaderVal[1] = export_group_header.description;
			dataHeaderVal[2] = export_group_header.group_tags;
			dataHeaderVal[3] = export_group_header.group_type;
			
			for(var index = 0 ; index < data.count ; index++){
				var group = data.groups[index];
				dataVal[index] = [];
				dataVal[index][0] = stringThumbnail(group.group_name);
				dataVal[index][1] = stringThumbnail(group.description,30);
				var tags = "";
				if(group.tags.length > 0){
					tags = group.tags[0];
					for(var tagIndex = 1 ; tagIndex < group.tags.length ; tagIndex ++){
						tags = tags + ',' + group.tags[tagIndex];
					}
				}
				dataVal[index][2] = tags;
				dataVal[index][3] = group.type_str;
			}
			$('#export_data_total').val(data.total);
			dataProgressInit('export',data.total);
			createTableHeader('data_export_table',dataHeaderVal);
			createTable('data_export_table',dataVal);
		}
	}
	var completeUrl = String.format(url_templates.group_list,0,pageSize,local_data.token);
	request(completeUrl,"","get",after_list);
}

function exportExecution(){
	var val = parseInt($('#export_execution').val());
	if(val == 1){
		exportUserExec();
	}
	else if(val == 2){
		exportGroupExec();
	}
	else{
		alert("请选择导入选项!!");
	}
}

function exportUserExec(){
	var total = parseInt($('#export_data_total').val());
	var curCount = 0 ,error = 0, success = 0;
	var text = "";
	
	function after_list(data,status){
		if(status == 'error'){
			error = error + 1;
		}
		else{
			for(var index = 0 ; index < data.count ; index++){
				var user = data.users[index];
				text = text + user.user_name + ",";
				text = text + user.display_name + ",";
				text = text + user.email + ",";
				text = text + user.groups_can_own + "\n";
				success = success + 1;
				dataProgressExec('export',success,total);
			}
		}
		$('#export_result_label .load-label-success').text(success);
		$('#export_result_label .load-label-error').text(error);
		
		if(success + error == total)
			writeToFile(text);
	}
	
	$('#export_result_label .load-label-total').text(total);
	$('#export_result_label').css('display','block');
	
	var times = total / pageSize;
	for(var i = 0 ; i < times ; i++){
		var completeUrl = String.format(url_templates.user_list,i*pageSize,pageSize,local_data.token);
		request(completeUrl,"","get",after_list);
	}
	if(times * pageSize < total){
		var completeUrl = String.format(url_templates.user_list,(times*pageSize),(total - times * pageSize),local_data.token);
		request(completeUrl,"","get",after_list);
	}
}

function exportGroupExec(){
	var total = parseInt($('#export_data_total').val());
	var curCount = 0 ,error = 0, success = 0;
	var text = "";
	
	function after_list(data,status){
		if(status == 'error'){
			error = error + 1;	
		}
		else{
			for(var index = 0 ; index < data.count ; index++){
				var group = data.groups[index];
				var tags = "";
				if(group.tags.length > 0){
					tags = group.tags[0];
					for(var tagIndex = 1 ; tagIndex < group.tags.length ; tagIndex ++){
						tags = tags + '-' + group.tags[tagIndex];
					}
				}
				
				text = text + group.group_name + ",";
				text = text + group.description + ",";
				text = text + tags + ",";
				text = text + group.type_str + "\n";
				success = success + 1;
				dataProgressExec('export',success,total);
			}
		}
		$('#export_result_label .load-label-success').text(success);
		$('#export_result_label .load-label-error').text(error);
		
		if(success + error == total)
			writeToFile(text);
	}
	
	$('#export_result_label').css('display','block');
	$('#export_result_label .load-label-total').text(total);
	
	var times = total / pageSize;
	for(var i = 0 ; i < times ; i++){
		var completeUrl = String.format(url_templates.group_list,i*pageSize,pageSize,local_data.token);
		request(completeUrl,"","get",after_list);
	}
	if(times * pageSize < total){
		var completeUrl = String.format(url_templates.group_list,(times*pageSize),(total - times * pageSize),local_data.token);
		request(completeUrl,"","get",after_list);
	}
}

function writeToFile(text){
	var blob = new Blob([text],{type: "text/plain;charset=utf-8"});
	if(blob){
		var path = $('#data_export_text').val();
		if(path == "")
			path = "导出数据";
		saveAs(blob,path+".txt");
	}
}

//Information
function listInformation(){
	getRealTimeData();
	getTopData();
	getTrendData();
}

function getTopData(){
	function after_get(data,status){
		if(status == "error"){
			return;
		}
		var extensions = [];
		for(var index = 0 ; index < data.top_extensions.length ; index++){
			extensions[index] = {
				name : data.top_extensions[index].extension,
				value: parseFloat(Number((parseInt(data.top_extensions[index].count) / parseInt(data.top_extensions[index].total) * 100)).toFixed(1))
			};
		}
		$('#file_type_chart').highcharts(genBarOptions("文件类型统计Top10","百分比(%)","百分比",extensions));
		
		var userGroups = [];
		for(var index = 0 ; index < data.top_user_groups.length ; index++){
			userGroups[index] = {
				name : data.top_user_groups[index].name,
				value: data.top_user_groups[index].group_stat_info.user_count
			};
		}
		$('#group_user_chart').highcharts(genBarOptions("人数最多的群组Top10","人数(位)","人数",userGroups));

		var fileGroups = [];
		for(var index = 0 ; index < data.top_file_groups.length ; index++){
			fileGroups[index] = {
				name : data.top_file_groups[index].name,
				value: data.top_file_groups[index].group_stat_info.file_count
			};
		}
		$('#group_file_chart').highcharts(genBarOptions("文件数量最多的群组Top10","文件数(个)","文件数",fileGroups));

		var sizeGroups = [];
		for(var index = 0; index < data.top_size_groups.length ; index++){
			var size = data.top_size_groups[index].group_stat_info.used_bytes / (1024 * 1024 * 1024);
			size = parseFloat(Number(size).toFixed(2));
			sizeGroups[index] = {
				name : data.top_size_groups[index].name,
				value: size
			}
		}
		$('#group_usage_chart').highcharts(genBarOptions("空间使用量最多的群组Top10","使用量(GB)","使用量",sizeGroups));
	}
	
	var completeUrl = String.format(url_templates.top,topLimit,local_data.token);
	request(completeUrl,"","get",after_get);
}

function getRealTimeData(){
	getRealTimeCount();
	getSummaryCount();
}

function getRealTimeCount(){
	var completeUrl = String.format(url_templates.real_time,local_data.token);
	request(completeUrl,"","get",function(data,status){
		if(status == "success"){
			$('#info_manage').find('.userNum').text(data.user_count);
			$('#info_manage').find('.groupNum').text(data.group_count);
			$('#info_manage').find('.onlineNum').text(data.token_count);
		}
	});
}

function getSummaryCount(){
	var completeUrl = String.format(url_templates.summary,+new Date(),local_data.token);
	request(completeUrl,"","get",function(data,status){
		if(status == "success"){
			var extentsUrl = url_templates.spaceUsage;
			$.get(
				extentsUrl,
				function(statsData){
					var usageInfo = parseSize(data.bytes,statsData);
					var percent = usageInfo.used + "/" + usageInfo.quota;
					$('#info_manage').find('.bar').css("width",usageInfo.percent);
					$('#info_manage').find('.percent').text(percent);
				},
				'json'
			);
			$('#info_manage').find('.fileNum').text(data.file_count);
		}
	});
}

function parseSize(size,quota){
	var totalVolume = parseInt(quota) * 1024 * 1024 * 1024;
	var usage = size;
	if(usage <= 1024)
        usage += " B";
    else if( usage <= 1024*1024)
    {
        usage /= 1024;
        usage = usage.toFixed(2);
        usage += " KB";
    }
    else if(usage <= 1024*1024*1024)
    {
        usage /= (1024.0*1024);  
        usage = usage.toFixed(2);
        usage += " MB";
    }
    else
    {
        usage /= (1024*1024*1024);
        usage = usage.toFixed(2);
        usage += " GB";
    }
	
	return {
		used : usage,
		quota: quota + " GB",
		percent: Number(size / totalVolume * 100).toFixed(2) + "%"
	};
}

function getTrendData(){
	var completeUrl = String.format(url_templates.trend,local_data.token);
	request(completeUrl,"","get",function(data,status){
		if(status == "error"){
			return;
		}
		var userTrendData = [];
		var groupTrendData = [];
		var fileTrendData = [];
		userTrendData[0] = {
			name : "用户数",
			point: []
		};
		
		groupTrendData[0] = {
			name : "群组数",
			point: []
		};
		
		fileTrendData[0] = {
			name : "文件数",
			point: []
		};
		
		fileTrendData[1] = {
			name : "meta数",
			point : []
		};
		
		for(var index = 0 ; index < data.trend_stat_info.length ; index++){
			userTrendData[0].point[index] = {
				x : data.trend_stat_info[index].time_millis,
				y : data.trend_stat_info[index].user_count
			};
			
			groupTrendData[0].point[index] = {
				x : data.trend_stat_info[index].time_millis,
				y : data.trend_stat_info[index].group_count
			};
			
			fileTrendData[0].point[index] = {
				x : data.trend_stat_info[index].time_millis,
				y : data.trend_stat_info[index].file_count
			};
			
			fileTrendData[1].point[index] = {
				x : data.trend_stat_info[index].time_millis,
				y : data.trend_stat_info[index].meta_count
			};
		}
		$('#user_history_chart').highcharts(genLineOptions("历史用户数量","人数（位）",userTrendData));
		$('#group_history_chart').highcharts(genLineOptions("历史群组数量","群组数（个）",groupTrendData));
		$('#file_history_chart').highcharts(genLineOptions("历史文件与Meta数量","文件数（个）",fileTrendData));
	});
}

function genBarOptions(title,yText,itemName,data){
	var options = {
		chart : {
			type : "column"
		},
		title : {
			text : title
		},
		xAxis : {
			categories : [],
			labels : {
				rotation : -45,
				align : 'right',
				style : {
					fontSize : '13px',
					fontFamily : 'Verdana,sans-serif'
				}
			}
		},
		yAxis : {
			title : {
				text : yText
			},
			allowDecimals : true
		},
		series :[{
			name : itemName,
			data : []
		}]
	};
	for(var index = 0 ; index < data.length ; index++){
		options.xAxis.categories.push(data[index].name);
		options.series[0].data.push(data[index].value);
	}
	return options;
}

function genLineOptions(title,yText,data){
	var options = {
		chart : {
			type : 'line',
			animation : Highcharts.svg
		},
		title : {
			text : title
		},
		xAxis : {
			type : 'datetime',
			tickPixelInterval : 150
		},
		yAxis : {
			title : {
				text : yText,
			},
			plotLines :[{
				value : 0,
				width : 1,
				color : '#808080'
			}]
		},
		plotOptions : {
			line : {
				dataLabels : {
					enabled : false
				},
				enableMouseTracking : true
			}
		},
		tooltip: {
        	formatter: function() {
            	return '<b>'+ this.series.name +'</b><br/>'+
                	Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        exporting: {
        	enabled: false
        },
		series:[]
	};
	
	for(var i = 0 ; i < data.length ; i++){
		options.series[i] = {};
		options.series[i].name = data[i].name;
		options.series[i].data = [];
		for(var j = 0 ; j < data[i].point.length ; j++){
			options.series[i].data.push({
				x : data[i].point[j].x,
				y : data[i].point[j].y
			});
		}
	}
	
	return options;
}

function genPieOptions(title,data){
	var options = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: title
        },
        tooltip: {
    	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: []
        }]
    };
	
	var percentSum = 0;
	for(var index = 0 ; index < data.length ; index++){
		var name = data[index].extension;
		var percent = Number((parseInt(data[index].count) / parseInt(data[index].total) * 100)).toFixed(1);
		percentSum += percent;
		if(index == 0){
			options.series[0].data.push({
				name: name,
				y:	percent,
				sliced:true,
				selected:true
			});
			total = parseInt(data[index].total);
		}
		else{
			options.series[0].data.push([name,percent]);
		}
	}
	var lastPercent = 100-percentSum;
	options.series[0].data.push(["其他",lastPercent]);
	return options;
}


//key down
function keyDown(name){
	if(event.keyCode == 13){
		switch(name){
			case 'user_search':
			userSearchSubmit();
			break;
			
			case 'group_search':
			groupSearchSubmit();
			break;
			
			case 'quota_user_search':
			quotaUserSearch();
			break;
			
			case 'quota_group_search':
			quotaGroupSearch();
			break;
			
			case 'group_user_search':
			groupUserSearchSubmit();
			break;
		}
	}
}
