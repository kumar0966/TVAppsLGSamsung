const URL = "https://api.uam.tv/";

var init = function () {
       
	
	viewLoader();
	
	 var subscribed = localStorage.getItem("subscribed");
	    
	    if(subscribed == "true"){
	     	document.getElementById('unsubscribeUser').style.display = "none"
	    }
	    else {
			 
		    document.getElementById('setting_section_id').style.display = "none"


		   }

	
	getProfileData();
    initTizenKeys();
};


window.onload = init;






function initTizenKeys()
{
	 // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
    	//	moveLeft();
    		break;
    	case 38: //UP arrow
    		moveUp();
    		break;
    	case 39: //RIGHT arrow
    	//	moveRight();
    		break;
    	case 40: //DOWN arrow
    		moveDown();
    		break;
    	case 13: //OK button
    		//moveOk();
    
    		
       		break;
    	case 10009: //RETURN button
    		location.href = "../home/home.html";
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
}



function moveDown(){

	
	
	if(document.getElementsByClassName("viewBorder")[0] !== undefined)
		{
			var el = document.getElementsByClassName('viewBorder')[0].id;
			
			if(el === "profile_border"){
				removeFocus("viewBorder");
				setFocus("subscription_border" , "viewBorder");
				
				showSubscriptionSection();
			}
			
			else if(el === "subscription_border"){
				removeFocus("viewBorder");
				setFocus("register_border" , "viewBorder");
				
				showRegisterSection();
			}
			
			else if(el === "register_border"){
				removeFocus("viewBorder");
				setFocus("help_border" , "viewBorder");
				
				showHelpSection();
			}
			
			else if(el === "help_border"){
				removeFocus("viewBorder");
				setFocus("contact_border" , "viewBorder");
				
				showContactSection();
			}
			
			else if(el === "contact_border"){
				removeFocus("viewBorder");
				setFocus("about_border" , "viewBorder");
				
				showAboutSection();
			}
		
			
		}
	
}

function moveUp(){

	
	
	if(document.getElementsByClassName("viewBorder")[0] !== undefined)
		{
			var el = document.getElementsByClassName('viewBorder')[0].id;
			
			if(el === "subscription_border"){
				removeFocus("viewBorder");
				setFocus("profile_border" , "viewBorder");
				
				showProfileSection();
			}
			
			else if(el === "register_border"){
				removeFocus("viewBorder");
				setFocus("subscription_border" , "viewBorder");
				
				showSubscriptionSection();
			}
			
			else if(el === "help_border"){
				removeFocus("viewBorder");
				setFocus("register_border" , "viewBorder");
				
				showRegisterSection();
			}
			
			else if(el === "contact_border"){
				removeFocus("viewBorder");
				setFocus("help_border" , "viewBorder");
				
				showHelpSection();
			}
			
			else if(el === "about_border"){
				removeFocus("viewBorder");
				setFocus("contact_border" , "viewBorder");
				
				showContactSection();
			}
		
			
		}
	
}



function setFocus(id, clas) {

    document.getElementById(id).classList.add(clas);

}

function removeFocus(clas) {

    var el = document.getElementsByClassName(clas)[0].id;
    document.getElementById(el.toString()).classList.remove(clas);


}

function getProfileData() {
	
	
	
	
	var token = localStorage.getItem("jwt token");
	
	if(token !== null)
		{
			
			fetch(URL + 'v3/users/get.php', {
				  headers: {
					  'Authorization' : "Bearer " + token
				  },
				})
				.then(response => response.json())
				.then(data => {
			
				
						document.getElementById('user_name_id').innerHTML = data["data"][0]["fname"];
						document.getElementById('profile_name_section_id').innerHTML = data["data"][0]["fname"] + " " +  data["data"][0]["lname"];
						document.getElementById('profile_email_section_id').innerHTML = data["data"][0]["email"];
						

				
						//get Subscription details...
						getSubscriptionDetails(token);
						
							
				

				  
				})
				.catch((error) => {
				  console.error('Err:', error);
//				  hideLoader();
				});
			
		}
	else
		{
			console.log("No token found");
			location.href = "../login.html";
		}
	
	
		
	
}




function getSubscriptionDetails(token){
	
	fetch(URL + 'v3/users/subscription/get.php', {
		  headers: {
			  'Authorization' : "Bearer " + token
		  },
		})
		.then(response => response.json())
		.then(data => {
	
			
			
			console.log(data);
			
		
				document.getElementById("type_sub_id").innerHTML = toUpper(data["data"]["payment-method"]) + " " + toUpper(data["data"]["frequency"]) + " Subscription";

				if(data["data"]["start-date"] != null && data["data"]["start-date"] != "")
				document.getElementById("effective_date_sub_id").innerHTML = formatDate(data["data"]["start-date"]);
				
				if(data["data"]["expiration-date"] != null && data["data"]["expiration-date"] != "")
				document.getElementById("expiration_date_sub_id").innerHTML = formatDate(data["data"]["expiration-date"]);
			

				
				getDeviceListDetails(token)
				
			
		

		  
		})
		.catch((error) => {
		  console.error('Err:', error);
//		  hideLoader();
		});
	
	
}


function getDeviceListDetails(token){
	
	
	var device_showcase = document.getElementById("device_name_list");
	
	device_showcase.innerHTML = ``;
	
	
	fetch(URL + 'v3/users/devices/get.php', {
		  headers: {
			  'Authorization' : "Bearer " + token
		  },
		})
		.then(response => response.json())
		.then(data => {
	
			
			
			
			document.getElementById("device_number_id").innerHTML = data.length;
			
			data.forEach((result, index) => {
				
	 		
				console.log(data.toString());
				
				
				var temp = `<p>${data[index]["friendly_name"]}</p>`;
				
					device_showcase.innerHTML += temp;		
					
							        
				})
			
			
				hideLoader();
						
				//show profile section...
			    setFocus("profile_border" , "viewBorder");
				showProfileSection();	
				
		

		  
		})
		.catch((error) => {
		  console.error('Err:', error);
//		  hideLoader();
		});
	
	
}



function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}


function toUpper(str) {
	return str
	    .toLowerCase()
	    .split(' ')
	    .map(function(word) {
	        return word[0].toUpperCase() + word.substr(1);
	    })
	    .join(' ');
	 }


function showProfileSection()
{
	
	  showSection("profile_section_id");
	  hideSection("subscription_section_id");
	  hideSection("register_section_id");
	  hideSection("help_section_id");
	  hideSection("about_section_id");
	  hideSection("contact_section_id");
     

}


function showSubscriptionSection()
{
  hideSection("profile_section_id");
  showSection("subscription_section_id");
  hideSection("register_section_id");
  hideSection("help_section_id");
  hideSection("about_section_id");
  hideSection("contact_section_id");
 

}

function showRegisterSection()
{
  hideSection("profile_section_id");
  hideSection("subscription_section_id");
  showSection("register_section_id");
  hideSection("help_section_id");
  hideSection("about_section_id");
  hideSection("contact_section_id");


}


function showHelpSection()
{
  hideSection("profile_section_id");
  hideSection("subscription_section_id");
  hideSection("register_section_id"); 
  showSection("help_section_id");
  hideSection("about_section_id");
  hideSection("contact_section_id");
 
}

function showContactSection()
{
  hideSection("profile_section_id");
  hideSection("subscription_section_id");
  hideSection("register_section_id");
  hideSection("help_section_id");
  hideSection("about_section_id");
  showSection("contact_section_id");
 
}


function showAboutSection()
{
  hideSection("profile_section_id");
  hideSection("subscription_section_id");
  hideSection("register_section_id");
  hideSection("help_section_id");
  showSection("about_section_id");
  hideSection("contact_section_id");
 

}


function showSection(id){

	document.getElementById(id).style.display = "block";
	
	
}


function hideSection(id){
	
	
	document.getElementById(id).style.display = "none";
	
}



function viewLoader(){
	document.getElementById('spinner_display_id').classList.add('showLoader');
	document.getElementById('parentRightSection').classList.add('hideLoader');
	}


function hideLoader(){
	  document.getElementById('spinner_display_id').classList.remove('showLoader');
	  document.getElementById('spinner_display_id').classList.add('hideLoader');
	  document.getElementById('parentRightSection').classList.remove('hideLoader');
	  document.getElementById('parentRightSection').classList.add('showLoader');
		
	
		}


