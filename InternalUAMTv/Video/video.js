const URL = "https://api.uam.tv/";
var player;
var percentage;
var isHit = false;

var init = function () {
       
    initTizenKeys();
    
    setPlayer();
    
    
    
    
    console.log(localStorage.getItem("videoId"));
    
    
    	setInterval(function(){
    	     
    		
    		
    		if(isHit == false){
    			
    			if(player.duration() > 0){
    	    		
        			percentage = (5/100) * player.duration();
        			if(player.currentTime() >= percentage){
        				
        				
        				//hit view api....
        				 var token = localStorage.getItem("jwt token");

        				   
        				 if (token !== null) {
        					 viewApi(localStorage.getItem("videoId") , token);
        				    } else {
        				        console.log("No token found");
        				        location.href = "../login.html";
        				    }
        				
        			}
        			else
        				{
        					console.log("no");
        				}
        		}
    			
    		}
    		
    		
    	}, 2000);
   
};


window.onload = init;



function viewApi(videoId , token){
	
	isHit = true;
	
	 let params = {
		        "idmovie": videoId
		    };

		    let query = Object.keys(params)
		        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		        .join('&');

	
	fetch('https://api.uam.tv/v3/movies/view/post.php?' + query, {
		  headers: {
			  'Authorization' : "Bearer " + token,
		  },
		})
		.then(response => response.json())
		.then(data => {

			if(data["meta"]["response"] == true)
				{
					
					console.log("api successful");
				}
			
			else 
				{
				isHit = false;
				console.log("api error");
				}
				

		  
		})
		.catch((error) => {
		  console.log("Err : " , error);
		  location.href = "../login.html";
		  
		});
	}
	
	





function setPlayer() {

	 player = videojs('player_one');
	    var url = localStorage.getItem("video");
	    
	    player.src({
	     type: 'application/x-mpegURL',
	     src: url
	    });
	   
//	    player.nuevo({
//	    	title: "Nuevo plugin for VideoJs Player"
//	    });
//	   
//	    player.hotkeys({
//	    	volumeStep: 0.1,
//	    	seekStep: 5
//	    	});
	    
	    
	    var geo = localStorage.getItem("geo");
	    
	    console.log("geo" , geo);
	    
	 //   if(geo == "true")
	    headRequest(url);
	    
	    
}

function headRequest(pathToResource) {
	  fetch(pathToResource, {
	    method: 'HEAD'
	  })

	  .then(data => {

		  if (data.status == 401) {
			  alert("Attualmente questo titolo non è disponibile nel tuo paese. Nella home page c'è molto altro da scoprire");
		}
		  
		  
          })
          .catch((error) => {
              console.log('Err:', error);
              
          });
	}




function initTizenKeys()
{
	 // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
    		moveLeft();
    		break;
    	case 38: //UP arrow
    		
    		break;
    	case 39: //RIGHT arrow
    		moveRight();
    		break;
    	case 40: //DOWN arrow
    		
    		break;
    	case 13: //OK button
    		moveOk();
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


function moveRight(){
	
	player.currentTime(player.currentTime() + 10);
}

function moveLeft(){
	
	player.currentTime(player.currentTime() - 10);
}


function moveOk() {
	
	
		  if (player.paused()) {
			  player.play();
		  }
		  else {
			  player.pause();
		  }
		
	
}

