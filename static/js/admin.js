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

$(function(){
	//Quota group
	$('#quota_group_search').click(quotaGroupSearch);
	$('#quota_group_submit').click(quotaGroupSubmit);
	$('#quota_group_cancel').click(quotaGroupCancel)
	$('#quota_group_success_close').click(quotaGroupAlertClose);
	$('#quota_user_success_close').click(quotaUserAlertClose);
	
	//Quota user
	$('#quota_user_search').click(quotaUserSearch);
	$('#quota_user_submit').click(quotaUserSubmit);
	$('#quota_user_cancel').click(quotaUserCancel)
	$('#quota_user_success_close').click(quotaUserAlertClose);
	
	$('#userManage').click(userManage);
	$('#quotaManage').click(quotaManage);
	$('#groupManage').click(groupManage);
	$('#clientManage').click(clientManage);
	
	//User
	$('#user_edit_manage').click(userEditManage);
	$('#user_cancel_manage').click(userCancelManage);
	$('#user_delete_manage').click(userDeleteManage);
	$('#user_check_manage').click(userCheckManage);
	$('#user_search_submit').click(userSearch);
	$('#user_error_close').click(userAlertClose);
	$('#user_success_close').click(userAlertClose);
	$('#user_page_first').click(userPageFirst);
	$('#user_page_right').click(userPageRight);
	$('#user_page_left').click(userPageLeft);
	$('#user_page_last').click(userPageLast);
	
	//Group
	$('#slide_back').click(slideBack);
	$('#group_search_submit').click(groupSearch);
	$('#group_edit_manage').click(groupEditManage);
	$('#group_check_manage').click(groupCheckManage);
	$('#group_cancel_manage').click(groupCancel);
	$('#group_alert_close').click(groupAlertClose);
	$('#group_success_close').click(groupAlertClose);
	$('#group_page_first').click(groupPageFirst);
	$('#group_page_right').click(groupPageRight);
	$('#group_page_left').click(groupPageLeft);
	$('#group_page_last').click(groupPageLast);
	
	//Initialization
	initEnvironment();
});

function initEnvironment(){
	listUser();
}

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

function quotaManage(){
	switchItem('quota');
}

function groupManage(){
	switchItem('group');
	listGroup();
}

function clientManage(){
	switchItem('client');
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
					dataVal[pos][7] = '<a>重置</a>';
					dataVal[pos][8] = '<a onClick="changeUserState(\'0\',this)">已启用</a>';
				
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
				dataVal[index][0] = index+1;
				dataVal[index][1] = '<input type="checkbox" value="'+group.group_id+'" name="'+index+'">';
				dataVal[index][2] = '<a onClick="userList(\''+group.group_id+'\')">'+stringThumbnail(group.group_name)+'</a>';
				dataVal[index][3] = stringThumbnail(group.description);
				var tags = "";
				if(group.tags.length > 0){
					tags = group.tags[0];
					for(var tagIndex = 1 ; tagIndex < group.tags.length - 1 ; tagIndex ++){
						tags = tags + ',' + group.tags[tagIndex];
					}
				}
				dataVal[index][4] = stringThumbnail(tags);
				
				dataVal[index][5] = getGroupType(data.groups[index].type);
				dataVal[index][6] = getGroupSearch(data.groups[index].visible_to_search);
				dataVal[index][7] = group.established_str;
				dataVal[index][8] = '<a onClick="changeGroupState(\'0\',this)">已启用</a>';
				
				saveDataVal[index] = [];
				saveDataVal[index][0] = group.group_name;
				saveDataVal[index][1] = group.description;
				saveDataVal[index][2] = tags;
				saveDataVal[index][3] = group.type;
				saveDataVal[index][4] = group.group_id;
			}
			//Save data
			localStorage.setItem('groupTableData',JSON.stringify(saveDataVal));
			createTable('group_table',dataVal);
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
				dataVal[index][5] = getRelationPosition(data.users.users[index].relation.position);
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

//Quota group
function quotaGroupSearch(){
	var groupName = $('#quota_group_search_name').val();
	function after_getInfo(data,status){
		if(status == 'error'){
			
		}
		else{
			$('#quota_group_id').val(data.group_id);
			$('#quota_group_name').val(groupName);
			var usage = parseInt(parseInt(data.usage.used) / parseInt(data.usage.quota));
			$('#quota_group_usage').css('width',usage+"%");
			$('#quota_group_usage_str').text(usage+"%");
			$('#quota_group_quota').val(data.usage.quota_str.split(' ')[0]);
			$('#quota_group_submit').removeAttr('disabled');
		}
	}
	
	function after_search(data,status){
		if(status == 'error'){
		}
		else{
			if(data.total == 0){
			}
			else{
				var completeUrl = String.format(url_templates.group_info,data.groups[0].group_id,local_data.token);
				request(completeUrl,"","get",after_getInfo);
			}
		}
	}
	var completeUrl = String.format(url_templates.group_search,groupName,local_data.token);
	request(completeUrl,"","get",after_search);
}

function quotaGroupSubmit(){
	var group_id = $('#quota_group_id').val();
	var group_quota = $('#quota_group_quota').val();
	group_quota = parseInt(group_quota) * 1024 * 1024 * 1024;
	
	function after_update(data,status){
		if(status == 'error'){
		}
		else{
			$('#quota_group_success_prompt').css('display','block');
		}
	}
	var completeUrl = String.format(url_templates.group_updata_quota,group_id,group_quota,local_data.token);
	request(completeUrl,"","post",after_update);
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

//Quota user
function quotaUserSearch(){
	var userName = $('#quota_user_search_name').val();
	function after_getInfo(data,status){
		if(status == 'error'){
			
		}
		else{
			$('#quota_user_id').val(data.user_id);
			$('#quota_user_name').val(userName);
			var usage = parseInt(parseInt(data.usage.used) / parseInt(data.usage.quota));
			$('#quota_user_usage').css('width',usage+"%");
			$('#quota_user_usage_str').text(usage+"%");
			$('#quota_user_quota').val(data.usage.quota_str.split(' ')[0]);
			$('#quota_user_submit').removeAttr('disabled');
		}
	}
	
	function after_search(data,status){
		if(status == 'error'){
		}
		else{
			if(data.total == 0){
			}
			else{
				var completeUrl = String.format(url_templates.user_info,data.users[0].user_id,local_data.token);
				request(completeUrl,"","get",after_getInfo);
			}
		}
	}
	var completeUrl = String.format(url_templates.user_search,userName,local_data.token);
	request(completeUrl,"","get",after_search);
}

function quotaUserSubmit(){
	
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
				updateUserInfo();
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
	for(var pos = 0 ; pos < savedData.length ; pos++){
		$('#user_table > tbody tr:eq('+pos+') td:eq(6)').html(savedData[pos][3]);
	}
	deactivateEdit('user');
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

function updateUserInfo(){
	
}

function userSearch(){
	var userName = $('#user_search_name').val();
	clearTable('user_table');
	
	function after_search(data,status){
		if(status == 'error'){
		}
		else{
			var dataVal = [];
			var saveDataVal = [];
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
					dataVal[pos][7] = '<a>重置</a>';
					dataVal[pos][8] = '<a onClick="changeUserState(\'0\',this)">已启用</a>';
				
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
	var completeUrl = String.format(url_templates.user_search,userName,local_data.token);
	request(completeUrl,"","get",after_search);
}

function userAlertClose(){
	$('#user_error_prompt').css('display','none');
	$('#user_success_prompt').css('display','none');
}

//User page switch
function userPageFirst(){
	if(pageFirst('user')){
		listUser();
	}
}

function userPageRight(){
	if(pageRight('user')){
		listUser();
	}
}

function userPageLeft(){
	if(pageLeft('user')){
		listUser();
	}
}

function userPageLast(){
	if(pageLast('user')){
		listUser();
	}
}

//Group page switch
function groupPageFirst(){
	if(pageFirst('group')){
		listGroup();
	}
}

function groupPageRight(){
	if(pageRight('group')){
		listGroup();
	}
}

function groupPageLeft(){
	if(pageLeft('group')){
		listGroup();
	}
}

function groupPageLast(){
	if(pageLast('group')){
		listGroup();
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
	listGroupUser(groupID);
}

function slideBack(){
	$('#group_slide').animate({marginLeft:'0px'},500);
}

function groupSearch(){
	var groupName = $('#group_search_name').val();
	clearTable('group_table');
	function after_search(data,status){
		if(status == "error"){
		}
		else{
			var dataVal = [];
			var saveDataVal = [];
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
					for(var tagIndex = 1 ; tagIndex < group.tags.length - 1 ; tagIndex ++){
						tags = tags + ',' + group.tags[tagIndex];
					}
				}
				dataVal[index][4] = stringThumbnail(tags);
				
				dataVal[index][5] = getGroupType(data.groups[index].type);
				dataVal[index][6] = getGroupSearch(data.groups[index].visible_to_search);
				dataVal[index][7] = group.established_str;
				dataVal[index][8] = '<a onClick="changeGroupState(\'0\',this)">已启用</a>';
				
				saveDataVal[index] = [];
				saveDataVal[index][0] = group.group_name;
				saveDataVal[index][1] = group.description;
				saveDataVal[index][2] = tags;
				saveDataVal[index][3] = group.type;
				saveDataVal[index][4] = group.group_id;
			}
			//Save data
			localStorage.setItem('groupTableData',JSON.stringify(saveDataVal));
			createTable('group_table',dataVal);
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
			
			var tags = saveData[pos][2];
			var description =saveData[pos][1];
			
			var tagsHTML = '<div class="control-group"><input type="text" class="span8" value="'+tags+'"></div>';
			var descriptionHTML = '<div class="control-group"><textarea row="1">'+description+'</textarea></div>';
			$('#group_table > tbody tr:eq('+pos+') td:eq(4)').html(tagsHTML);
			$('#group_table > tbody tr:eq('+pos+') td:eq(3)').html(descriptionHTML);
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
				//update localStorage
				var saveData = JSON.parse(localStorage.getItem('groupTableData'));
				saveData[pos][1] = description;
				saveData[pos][2] = tags;
				localStorage.setItem('groupTableData',JSON.stringify(saveData));
				element.checked = false;
				updateGroupInfo(saveData[pos][4],description,tags,saveData[pos][3]);
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
	}
	deactivateEdit('group');
}

function deactivateEdit(tableItems){
	$('#'+tableItems+'_edit_manage').val(0);
	$('#'+tableItems+'_edit_manage').text('Edit');
	//Enable checkbox
	$('#'+tableItems+'_table input:checkbox').removeAttr('disabled');
	$('#'+tableItems+'_table input:checkbox').each(function(index, element) {
        element.checked = false;
    });
}

function activateEdit(tableItems){
	$('#'+tableItems+'_edit_manage').val(1);
	$('#'+tableItems+'_edit_manage').text('Save');
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