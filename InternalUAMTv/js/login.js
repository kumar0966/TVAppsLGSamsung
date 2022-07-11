var init = function () {
       
	  document.getElementById("email").focus();
    initLoginElements();
    initTizenKeys();
    
    
    
   
    
    
};


window.onload = init;






function initTizenKeys()
{
	 // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
    		keyLeft();
    		break;
    	case 38: //UP arrow
    		keyUp();
    		break;
    	case 39: //RIGHT arrow
    		keyRight();
    		break;
    	case 40: //DOWN arrow
    		keyDown();
    		break;
    	case 13: //OK button
    		keyOk();
    		
    	//	console.log(document.getElementById("email").value);
    		break;
    	case 10009: //RETURN button
		tizen.application.getCurrentApplication().exit();
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
}


function keyLeft()
{
	if(document.activeElement.id === "loginButton")
		{
		rememberFocus();
		removeFocus("loginButton");
	    document.getElementById("remember").focus();
		}
}


function keyRight()
{
	if(document.activeElement.id === "remember")
		{
		removeFocus("remember");
		loginStyleChange();
	    document.getElementById("loginButton").focus();
		}
}


function keyOk()
{
	if(document.activeElement.id === "loginButton")
		{
			loginStyleChange();
			login();
		}
	else if(document.activeElement.id === "subscribe")
		{
		  	location.href = "signup/signup.html";
		}
}

function keyUp()
{
	if(document.activeElement.id === "pass")
	{
    document.getElementById("email").focus();
	}
	else if(document.activeElement.id === "remember") {
		removeFocus("remember");
	    document.getElementById("pass").focus();
	}
	else if(document.activeElement.id === "loginButton") {
		removeFocus("loginButton");
	    document.getElementById("pass").focus();
	}
	else if(document.activeElement.id === "subscribe") {
		removeFocus("subscribe");
		changeStyle();
	    document.getElementById("forgotPassword").focus();
	}
	else if(document.activeElement.id === "forgotPassword") {
		rememberFocus();
		removeFocus("forgotPassword");
	    document.getElementById("remember").focus();
	   
	}
}



function keyDown() {
	
	if(document.activeElement.id === "email")
	{
    document.getElementById("pass").focus();
	}
else if(document.activeElement.id === "pass")
	{
	rememberFocus();
    document.getElementById("remember").focus();
	}
else if(document.activeElement.id === "loginButton")
	{
	removeFocus("loginButton");	
	changeStyle();
	document.getElementById("forgotPassword").focus();
	}
else if(document.activeElement.id === "remember")
	{
	removeFocus("remember");
	changeStyle();
	document.getElementById("forgotPassword").focus();
	}
else if(document.activeElement.id === "forgotPassword")
	{
	removeFocus("forgotPassword");
	signUpNOw();
	document.getElementById("subscribe").focus();
	}

	
}




//to change css of active elements...
function changeStyle() {
	document.getElementById("forgotPassword").classList.add('activeClass_Forget_Password');		
}
function signUpNOw(){
	document.getElementById("subscribe").classList.add('activeClass');
}
function loginStyleChange() {
	document.getElementById("loginButton").classList.add('loginBtn_style');
}
function rememberFocus(){
	
	document.getElementById("remmber_label").classList.add('remember_label_style');
}



//remove focus....
function removeFocus(id)
{
	if(id === "subscribe")
		{
		var el = document.getElementsByClassName("activeClass")[0].id;
	    document.getElementById(el).classList.remove("activeClass");
		}
	else if(id === "forgotPassword")
		{
		var el = document.getElementsByClassName("activeClass_Forget_Password")[0].id;
	    document.getElementById(el).classList.remove("activeClass_Forget_Password");
		}
	else if(id === "loginButton")
		{
		var el = document.getElementsByClassName("loginBtn_style")[0].id;
		document.getElementById(el).classList.remove("loginBtn_style");
		}
	else if(id === "remember")
		{
		var el = document.getElementsByClassName("remember_label_style")[0].id;
	    document.getElementById(el).classList.remove("remember_label_style");
		}
}



function showLoader()
{
	document.getElementById("spinner_display_id").classList.add('hide_loader');
	document.getElementById("opacity_effect").classList.add('add_opacity');
	
	
}

function hideLoader()
{
	var el = document.getElementsByClassName("add_opacity")[0].id;
    document.getElementById(el).classList.remove("add_opacity");
    
    var el1 = document.getElementsByClassName("hide_loader")[0].id;
    document.getElementById(el1).classList.remove("hide_loader");
    
    
  
}





//login function....
function login()
{
	
	
	
	
	//showLoader
	
	showLoader();
	
	
	 var app = tizen.application.getCurrentApplication();
	
	let formData = new FormData();
	formData.append('username', document.getElementById("email").value);
	formData.append('password', document.getElementById("pass").value);
	formData.append('devicehash', webapis.productinfo.getDuid());
	formData.append('devicefriendlyname', "Samsung " +  webapis.productinfo.getModel());
	formData.append('platform', "Tizen " + webapis.tvinfo.getVersion());
	formData.append('version', app.appInfo.version);
	
	fetch('https://api.uam.tv/v3/users/auth/get.php', {
	  method: 'POST', // or 'PUT'
	  body:formData,
	})
	.then(response => response.json())
	.then(data => {
	  console.log('Success:', data["jwt"]);
	  
	  if(document.getElementById("remember").checked){
		  localStorage.setItem("remembered", "true");
	  }
	  else{
		  	localStorage.setItem("remembered", "false");
		  }
	  
	  
	  localStorage.setItem("jwt token", data["jwt"]);
	
	  heartbeatPost(data["jwt"] , app.appInfo.version);
	
	  
	  
	})
	.catch((error) => {
	  console.error('Err:', error);
	  hideLoader();
	});
	

	
	
	
}




//init keyboard listener for textfields.....
function initLoginElements()
{

    //email field....
    document.getElementById('email').addEventListener('focus', function() {
    	  console.log("input element is focused and ready to get user input.");
    	});

    	document.getElementById('email').addEventListener('blur', function() {
    	  console.log("input element loses focus.");
    	});

    	document.getElementById('email').addEventListener('change', function() {
    	  console.log("input element value is changed.");
    	});



    	document.body.addEventListener('email', function(event) {
    	  switch (event.keyCode) {
    	    case 65376: // Done
    	      document.getElementById('email').blur();
    	      break;
    	    case 65385: // Cancel
    	      document.getElementById('email').blur();
    	      break;
    	  }
    	});
    	
    	
    	//password field...
    	  document.getElementById('pass').addEventListener('focus', function() {
    	  console.log("input element is focused and ready to get user input.");
    	});

    	document.getElementById('pass').addEventListener('blur', function() {
    	  console.log("input element loses focus.");
    	});

    	document.getElementById('pass').addEventListener('change', function() {
    	  console.log("input element value is changed.");
    	});



    	document.body.addEventListener('pass', function(event) {
    	  switch (event.keyCode) {
    	    case 65376: // Done
    	      document.getElementById('pass').blur();
    	      break;
    	    case 65385: // Cancel
    	      document.getElementById('pass').blur();
    	      break;
    	  }
    	});
    
    
}





function heartbeatPost(token , version)
{
	
	
	console.log("heartbeat");
	let formData = new FormData();
	formData.append('devicehash', webapis.productinfo.getDuid());
	formData.append('devicefriendlyname',  "Samsung " + webapis.productinfo.getModel());
	formData.append('platform', "Tizen " + webapis.tvinfo.getVersion());
	formData.append('version', version);
	
	
	fetch('https://api.uam.tv/v3/users/devices/heartbeat/post.php', {
	   	  method: 'POST',
		  body:formData,
		  headers: {
			  'Authorization' : "Bearer " + token,
		  },
		})
		.then(response => response.json())
		.then(data => {
	
			  hideLoader();
			  
			  location.href = "home/home.html";
			  
			  
			
		  
		})
		.catch((error) => {
		  console.log("Err : " , error);
		
		  
		});
	}

