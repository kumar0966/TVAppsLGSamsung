const URL = "https://api.uam.tv/";


//Initialize function
var init = function () {
       
    
	
    var token = localStorage.getItem("jwt token");
    
    var remembered = localStorage.getItem("remembered");
   
    
    console.log("remembered" , remembered);
    
    //launch next screen after 2 seconds....
//    setInterval(function(){
//    	
    	
    
    setTimeout(function(){ 
    	
    	 if(token === null)
		 {
		
		 location.href = "login.html";
		 }
		 
	 else
		 {
		
			 if(remembered === "true")
		 		{
		 		  
				    location.href = "home/home.html";
		 		  
		 		}
		 	else
		 		location.href = "login.html";
	
		 }
    	
    	
    	
    }, 3000);
    	
    	
//    },2000);
   
    
 
};

window.onload = init;








