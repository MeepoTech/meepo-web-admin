/*=============================================================================
#     FileName: login.js
#         Desc: 
#       Author: Aizhiyuan
#        Email: aizhiyuan@meepotech.com
#     HomePage: 
#      Version: 0.0.1
#   LastChange: 2013-9-19 08:56:30
#      History:
=============================================================================*/
$(function(){
	$('#login_submit').click(login);
});

function checkRemember(){
	if(localStorage.logging){
		self.location.href="/home";
	}
}

function login(){
	var username = $('#username').val();
	var password = $('#password').val();
	
	function after_login(data,status){
		var local_data = {};
		if(status == "error"){
			alert('输入的用户名或密码错误！');
		}
		else{
			local_data.adminname = username;
			local_data.token = data.token;
			local_data.device = data.device_id;
			var rememberMe = document.getElementById('remember_me').checked;
			if(rememberMe){
				localStorage.setItem("logging",true);
			}
			else{
				sessionStorage.setItem("logging",true);
			}
			localStorage.setItem("data",JSON.stringify(local_data));
			self.location.href="/home";
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