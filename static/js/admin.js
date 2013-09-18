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
var itemArray = Array('user','client','group','data','info');

var pageSize = 30;
var strMaxLength = 15;
var url_prefix = {
	domain  : 'http://new.meepotech.com',
	control : 'http://new.meepotech.com/0',
	data    : 'http://new.meepotech.com/c0' 
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
	//group
	group_info :         servers.group + '/{0}/info?token={1}',
	group_search : 		 servers.group + '/search?query={0}&token={1}',
	group_list:			 servers.group + '?token={0}&filters=group.type>=20',
	group_update:		 servers.group + '/{0}/update?token={1}',
};

$(function(){
	$('#login_submit').click(login);
	$('#quota_group_search').click(quotaGroupSearch);
	$('#quota_submit').click(quotaChangeSubmit);
	$('#userManage').click(userManage);
	$('#clientManage').click(clientManage);
	$('#groupManage').click(groupManage);
	//User
	$('#user_edit_manage').click(userEditManage);
	$('#user_cacel_manage').click(userCancelManage);
	//Group
	$('#slide_back').click(slideBack);
	$('#group_search_submit').click(groupSearch);
	$('#group_edit_manage').click(groupEditManage);
	$('#group_check_manage').click(groupCheckManage);
	$('#group_cancel_manage').click(groupCancel);
	$('#group_alert_close').click(groupAlertClose);
	$('#group_success_close').click(groupAlertClose);
});

function flush_local_data(){
	
}

function check_logging(){
	if(!localStorage.logging && !sessionStorage.logging){
		flush_local_data();
		self.location.href="login.html";
	}
	else{
		local_data = JSON.parse(localStorage.data);
	}
}

function login(){
	var username = $('#username').val();
	var password = $('#password').val();
	
	function after_login(data,status){
		var local_data = {};
		if(status == "error"){
			
		}
		else{
			local_data.adminname = username;
			local_data.token = data.token;
			local_data.device = data.device_id;
			if($('#remember_me').attr("check")){
				localStorage.setItem("logging",true);
			}
			else{
				sessionStorage.setItem("logging",true);
			}
			localStorage.setItem("data",JSON.stringify(local_data));
			self.location.href="index.html";
		}
	}
	
	var completeUrl = String.format(url_templates.login,LANG,encodeURIComponent(username),encodeURIComponent(password));
	request(completeUrl,'','post',after_login);
}

function login_keyDown(){
	if(event.keyCode == 13){
		login();
	}
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
}

function userManage(){
	switchItem('user');
	listUser();
}

function clientManage(){
	switchItem('client');
}

function groupManage(){
	switchItem('group');
	listGroup();
}

function listUser(){
	function after_list(data,status){
		if(status == 'error'){
		}
		else{
			//Construct data
			var dataVal = [];
			for(var index = 0 ; index < data.users.length ; index++){
				var userVal = data.users[index];
				dataVal[index] = [];
				dataVal[index][0] = index;
				dataVal[index][1] = '<input type="checkbox">';
				dataVal[index][2] = userVal.user_name;
				dataVal[index][3] = userVal.display_name;
				dataVal[index][4] = userVal.email;
				dataVal[index][5] = '4GB';
				dataVal[index][6] = userVal.registered_str;
				dataVal[index][7] = '<a>重置</a>';
				dataVal[index][8] = '<a onClick="changeUserState(\'0\',this)">已启用</a>';
			}
			clearTable('user_table');
			createTable('user_table',dataVal);
		}
	}
	var completeUrl = String.format(url_templates.user_list,local_data.token);
	request(completeUrl,"","get",after_list);
}

function listGroup(){
	clearTable('group_table');
	
	var pos = 0;
	var dataVal = [];
	var saveDataVal = [];
	var eachPageCount = pageSize;
	function after_detail(data,status){
		if(status == "error"){
		}
		else{
			dataVal[pos] = [];
			dataVal[pos][0] = pos+1;
			dataVal[pos][1] = '<input type="checkbox" value="'+data.group_id+'" name="'+pos+'">';
			dataVal[pos][2] = '<a onClick="userList(\''+data.group_id+'\')">'+stringThumbnail(data.group_name)+'</a>';
			dataVal[pos][3] = stringThumbnail(data.description);
			var tags = "";
			if(data.tags.length > 0){
				tags = data.tags[0];
				for(var tagIndex = 1 ; tagIndex < data.tags.length - 1 ; tagIndex ++){
					tags = tags + ',' + data.tags[tagIndex];
				}
			}
			dataVal[pos][4] = stringThumbnail(tags);
			
			dataVal[pos][5] = '++++';
			dataVal[pos][6] = '++++';
			dataVal[pos][7] = data.usage.quota_str; 
			dataVal[pos][8] = data.established_str;
			dataVal[pos][9] = '<a onClick="changeGroupState(\'0\',this)">已启用</a>';
			
			saveDataVal[pos] = [];
			saveDataVal[pos][0] = data.group_name;
			saveDataVal[pos][1] = data.description;
			saveDataVal[pos][2] = tags;
			saveDataVal[pos][3] = data.usage.quota_str;
			saveDataVal[pos][4] = data.type;
			saveDataVal[pos][5] = data.group_id;
			pos = pos +1;
			if(pos >= eachPageCount){
				//Save data
				localStorage.setItem('groupTableData',JSON.stringify(saveDataVal));
				createTable('group_table',dataVal);
			}
		}
	}
	
	function after_list(data,status){
		if(status == "error"){
		}
		else{
			eachPageCount = data.count < eachPageCount ? data.count : eachPageCount; 
			for(var index = 0 ; index < data.count ; index++){
				var group = data.groups[index];
				var completeUrl = String.format(url_templates.group_info,group.group_id,local_data.token);
				request(completeUrl,"","get",after_detail);
			}
		}
	}
	
	var completeUrl = String.format(url_templates.group_list,local_data.token);
	request(completeUrl,"","get",after_list);
}

function listGroupUser(groupID){
	clearTable('group_user_table');
	function after_list(data,status){
		if(status == "error"){
			
		}
		else{
			var dataVal = [];
			for(var index = 0 ; index < data.users.users.length ; index++){
				dataVal[index] = [];
				dataVal[index][0] = index+1;
				dataVal[index][1] = '<input type="checkbox" value="'+data.users.users[index].user_id+'" name="'+index+'">';
				dataVal[index][2] = data.users.users[index].user_name;
				dataVal[index][3] = data.users.users[index].display_name;
				dataVal[index][4] = data.users.users[index].email;
				dataVal[index][5] = 'role';
				dataVal[index][6] = '<a>重置</a>';
				dataVal[index][7] = '<a onClick="changeUserState(\'0\',this)">已启用</a>';
			}
			createTable('group_user_table',dataVal);
		}
	}
	
	var completeUrl = String.format(url_templates.group_info,groupID,local_data.token);
	request(completeUrl,"","get",after_list);
}

function changeUserState(currentState,currentTR){
	var tr = currentTR.parentNode.parentNode;
	if(currentState == 0){
		tr.cells[8].innerHTML = '<a style="color:#ff0000" onClick="changeUserState(\'1\',this)">已禁用</a>';
	}
	else{
		tr.cells[8].innerHTML = '<a style="color:#0088cc" onClick="changeUserState(\'0\',this)">已启用</a>';
	}
}

function quotaGroupSearch(){
	var $table = $('#quota_group_table');
	var groupName = $('#quota_groupName').val();
	function after_getInfo(data,status){
		if(status == 'error'){
			
		}
		else{
			$('#quota_group_table tr:eq(2) td:eq(1)').text(data.usage.quota_str);
		}
	}
	
	function after_search(data,status){
		if(status == 'error'){
		}
		else{
			if(data.total == 0){
			}
			else{
				$('#quota_group_table').css('display','block');
				var group = data.groups[0];
				$('#quota_group_table tr:eq(0) td:eq(1)').text(group.group_name);
				$('#quota_group_table tr:eq(1) td:eq(1)').text(group.description);
				
				var completeUrl = String.format(url_templates.group_info,group.group_id,local_data.token);
				request(completeUrl,"","get",after_getInfo);
			}
		}
	}
	var completeUrl = String.format(url_templates.group_search,groupName,local_data.token);
	request(completeUrl,"","get",after_search);
}

function changeUnits(units){
	$('#quota_units').html(units+'<span class="caret"></span>');
	$('#unit_hidden').text(units);
}

function quotaChangeSubmit(){
	var units = $('#unit_hidden').text();
	switch(units){
		case 'GB' :
		break;
		case 'TB' :
		break;
		case 'PB' :
		break;
	}
}

function clearTable(tableID){
	$('#'+tableID+">tbody tr").remove();
}

function createTable(tableID,data){
	if(data != null && typeof data != "undefined"){
		var $table = $('#'+tableID+'>tbody');
		for(var i = 0 ; i < data.length ; i++){
			$table.append(createRow(data[i]));
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

//User


//Group
function userList(groupID){
	slideForward();
	listGroupUser(groupID);
}

function slideForward(){
	var length = parseInt($('#group_slide').css('margin-left'));
	if(length > -1158){
		length = length - 80;
		$('#group_slide').css('margin-left',length+'px');
		window.setTimeout(slideForward,5);
	}
	else{
		$('#group_slide').css('margin-left','-1158px');
	}
}

function slideBack(){
	var length = parseInt($('#group_slide').css('margin-left'));
	if(length < 0){
		length = length + 80;
		$('#group_slide').css('margin-left',length+'px');
		window.setTimeout(slideBack,5);
	}
	else{
		$('#group_slide').css('margin-left','0px');
	}
}

function groupSearch(){
	var groupName = $('#group_search_name').val();
	var $table = $('#group_table');
	var dataVal = [];
	var saveDataVal = [];
	var eachPageCount = pageSize;
	var pos = 0;
	clearTable('group_table');
	
	function after_detail(data,status){
		if(status == 'error'){
			
		}
		else{
			var dataVal = [];
			dataVal[pos] = [];
			dataVal[pos][0] = pos;
			dataVal[pos][1] = '<input type="checkbox" value="'+data.group_id+'" name="'+pos+'">';
			dataVal[pos][2] = '<a onClick="userList(\''+data.group_id+'\')">'+stringThumbnail(data.group_name)+'</a>';
			dataVal[pos][3] = stringThumbnail(data.description);
			var tags = "";
			if(data.tags.length > 0){
				tags = data.tags[0];
				for(var tagIndex = 1 ; tagIndex < data.tags.length - 1 ; tagIndex ++){
					tags = tags + ',' + data.tags[tagIndex];
				}
			}
			dataVal[pos][4] = stringThumbnail(tags);
			dataVal[pos][5] = '++++';
			dataVal[pos][6] = '++++';
			dataVal[pos][7] = data.usage.quota_str;
			dataVal[pos][8] = data.established_str;
			dataVal[pos][9] = '<a onClick="changeGroupState(\'0\',this)">已启用</a>';
			
			saveDataVal[pos] = [];
			saveDataVal[pos][0] = data.group_name;
			saveDataVal[pos][1] = data.description;
			saveDataVal[pos][2] = tags;
			saveDataVal[pos][3] = data.usage.quota_str;
			saveDataVal[pos][4] = data.type;
			saveDataVal[pos][5] = data.group_id;
			pos = pos +1;
			if(pos >= eachPageCount){
				//Save data
				localStorage.setItem('groupTableData',JSON.stringify(saveDataVal));
				createTable('group_table',dataVal);
			}
		}
	}
	function after_search(data,status){
		if(status == 'error'){
		}
		else{
			if(data.count == 0){
			}
			else{
				eachPageCount = data.count < eachPageCount ? data.count : eachPageCount;
				for(var index = 0 ; index < data.count ; index++){
					var group = data.groups[index];
					var completeUrl = String.format(url_templates.group_info,group.group_id,local_data.token);
					request(completeUrl,"","get",after_detail);
				}
			}
		}
	}
	var completeUrl = String.format(url_templates.group_search,groupName,local_data.token);
	request(completeUrl,"","get",after_search);
}

function changeGroupState(currentState,currentTR){
	var tr = currentTR.parentNode.parentNode;
	if(currentState == 0){
		tr.cells[9].innerHTML = '<a style="color:#ff0000" onClick="changeGroupState(\'1\',this)">已禁用</a>';
	}
	else{
		tr.cells[9].innerHTML = '<a style="color:#0088cc" onClick="changeGroupState(\'0\',this)">已启用</a>';
	}
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
			var quotaStr = saveData[pos][3];
			var quotaInt = quotaStr.split(" ")[0];
			
			var tags = saveData[pos][2];
			var description =saveData[pos][1];
			
			var quotaHTML = '<div class="input-append control-group"><input type="text" class="span3" value="'+quotaInt+'"><span class="add-on">GB</span></div>';
			var tagsHTML = '<div class="control-group"><input type="text" class="span8" value="'+tags+'"></div>';
			var descriptionHTML = '<div class="control-group"><textarea row="1">'+description+'</textarea></div>';
			$('#group_table > tbody tr:eq('+pos+') td:eq(7)').html(quotaHTML);
			$('#group_table > tbody tr:eq('+pos+') td:eq(4)').html(tagsHTML);
			$('#group_table > tbody tr:eq('+pos+') td:eq(3)').html(descriptionHTML);
        });
		activateEdit();
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
			var quotaInt = $('#group_table > tbody tr:eq('+pos+') td:eq(7) input[type="text"]').val();
			var tags = $('#group_table > tbody tr:eq('+pos+') td:eq(4) input[type="text"]').val();
			//Check data formate
			if(invalid_letters.test(description)){
				eachErrorFlag = true;
				$('#group_table > tbody tr:eq('+pos+') td:eq(3) .control-group').addClass('error');
			}
			
			if(invalid_letters.test(tags)){
				eachErrorFlag = true;
				$('#group_table > tbody tr:eq('+pos+') td:eq(4) .control-group').addClass('error');
			}
			
			if(!valid_int.test(quotaInt)){
				eachErrorFlag = true;
				$('#group_table > tbody tr:eq('+pos+') td:eq(7) .control-group').addClass('error');
			}
			
			if(eachErrorFlag){
				errorFlag = true;
			}
			else{
				$('#group_table > tbody tr:eq('+pos+') td:eq(3)').html(stringThumbnail(description));
				$('#group_table > tbody tr:eq('+pos+') td:eq(4)').html(stringThumbnail(tags));
				$('#group_table > tbody tr:eq('+pos+') td:eq(7)').html(quotaInt+" GB");
				//update localStorage
				var saveData = JSON.parse(localStorage.getItem('groupTableData'));
				saveData[pos][1] = description;
				saveData[pos][2] = tags;
				saveData[pos][3] = quotaInt+" GB";
				localStorage.setItem('groupTableData',JSON.stringify(saveData));
				element.checked = false;
				//updateGroupInfo(saveData[pos][5],description,tags,saveData[pos][4]);
			}
        });
		if(!errorFlag){
			deactivateEdit();
			$('#group_error_prompt').css('display','none');
			$('#group_success_prompt').css('display','block');
		}
		else{
			$('#group_error_prompt').css('display','block');
			$('#group_success_prompt').css('display','none');
		}
	}
}

function updateGroupInfo(groupID,description,tags,type){
	var tagArray = tags.split(',');
	for(var index = 0; index < tagArray.length ; index++)
		tagArray[index] = Trim(tagArray[index]).toLowerCase();
		
	var form = JSON.stringify({
		"description" : description,
		"tags" : tagArray,
		"type" : type
	});
	
	function after_update(data,status){
		if(status == "error"){
		}
		else{
		}
	}
	var completeUrl = String.format(url_templates.group_update,groupID,local_data.token);
	request(completeUrl,form,"post",after_update);
}

function groupCancel(){
	//Restore the data
	var savedData = JSON.parse(localStorage.getItem('groupTableData'));
	for(var pos = 0 ; pos < savedData.length ; pos++){
		$('#group_table > tbody tr:eq('+pos+') td:eq(3)').html(stringThumbnail(savedData[pos][1]));
		$('#group_table > tbody tr:eq('+pos+') td:eq(4)').html(stringThumbnail(savedData[pos][2]));
		$('#group_table > tbody tr:eq('+pos+') td:eq(7)').html(savedData[pos][3]);
	}
	deactivateEdit();
}

function deactivateEdit(){
	$('#group_edit_manage').val(0);
	$('#group_edit_manage').text('Edit');
	//Enable checkbox
	$('#group_table input:checkbox').removeAttr('disabled');
	$('#group_table input:checkbox').each(function(index, element) {
        element.checked = false;
    });
}

function activateEdit(){
	$('#group_edit_manage').val(1);
	$('#group_edit_manage').text('Save');
	//Disable checkbox
	$('#group_table input:checkbox').attr('disabled',true);
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