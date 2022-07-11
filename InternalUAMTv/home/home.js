  
const URL = "https://api.uam.tv/";
var categoryList = [];
var categoryMovieList = [];
var favList = [];
var mostRecentsList = [];
var mostViewedList = [];
var randomBannerList = [];
var activeSubscription;



var selectedBannerIndex = 0;






var selectedCatPos = 0,
    selectedViewedPos = 0,
    selectedRecentPos = 0,
    selectedScreenCatPos = 0; 
	selectedScreenFavPos = 0;

var init = function() {

    viewLoader();

    // set Focus on details text....

    setFocus("watch_btn_id", "watch_btn");
    setFocus("watch_btn_id", "onLeft");
   
    initTizenKeys();
    
    
    
    
    
    //get token...
    var token = localStorage.getItem("jwt token");

    if (token !== null) {
    	
    	
    	
    	
    	//check token expiration...
    	var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        activeSubscription = JSON.parse(jsonPayload).state;
        
       
         
        var exp = JSON.parse(jsonPayload).exp;
        var refreshToken = JSON.parse(jsonPayload).refreshtoken;

       if (Date.now() >= exp * 1000) {
     	  
    	   refreshMyToken(token , refreshToken);
    	   
       }
       else
       {
    	   
    	   if(activeSubscription == "Active")
    		   {
    			  localStorage.setItem("subscribed", "true");
  		   		document.getElementById('unsubscribeUser').style.display = "none"

    		   }
    		   else {
     			  localStorage.setItem("subscribed", "false");
   			   document.getElementById('button_layout_id').style.display = "none"


    		   }
    	   
     	  getHomeScreenData();
       }
    
       
       
     
    	
    } else {
        console.log("No token found");
        location.href = "../login.html";
    }


    
    


};




window.onload = init;


//refresh my token if expire...
function refreshMyToken(token , refreshToken){
	
	
	 var app = tizen.application.getCurrentApplication();

	 
	  let params = {
		        "devicehash": webapis.productinfo.getDuid(),
		        "devicefriendlyname":  "Samsung " + webapis.productinfo.getModel(),
		        "platform" : "Tizen " + webapis.tvinfo.getVersion(),
		        "version" :  app.appInfo.version
		    };

		    let query = Object.keys(params)
		        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		        .join('&');

		    fetch(URL + 'v3/users/auth/renew.php?' + query, {
		            headers: {
		                'Authorization': "Bearer " + refreshToken
		            },
		        })
		        .then(response => response.json())
		        .then(data => {

		        	localStorage.setItem("jwt token", data["jwt"]);
		        	
		        	var base64Url = data["jwt"].split('.')[1];
		            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
		                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		            }).join(''));

		        	activeSubscription = JSON.parse(jsonPayload).state;
		            
		        	   if(activeSubscription == "Active"){
		     			    localStorage.setItem("subscribed", "true");
		    		   		document.getElementById('unsubscribeUser').style.display = "none"

		        	   }
		    		   else {
		     			   localStorage.setItem("subscribed", "false");
		    			   document.getElementById('button_layout_id').style.display = "none"


		    		   }
		    	   
		        	    heartbeatPost(data["jwt"] , app.appInfo.version);
		        	
		            	getHomeScreenData();

		        })
		        .catch((error) => {
		            console.error('Err:', error);
		            hideLoader();
		        });

	
}




function heartbeatPost(token , version)
{
	
	
	
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



function changeBackgroundImg(index) {
	
	
	if( selectedBannerIndex +  (index) < 0)
		{
		selectedBannerIndex = randomBannerList.length - 1;
		 
		  
		  	changeBg(randomBannerList[selectedBannerIndex]["image"]);
		    document.getElementById('random-title').innerHTML = randomBannerList[selectedBannerIndex]["title"];
		    document.getElementById('desc').innerHTML = randomBannerList[selectedBannerIndex]["desc"];


		    localStorage.setItem("detail", JSON.stringify(randomBannerList[selectedBannerIndex]));
			
		}
	else if(selectedBannerIndex +  (index) > randomBannerList.length-1)
		{
		selectedBannerIndex = 0;
		 
		  
		  	changeBg(randomBannerList[selectedBannerIndex]["image"]);
		    document.getElementById('random-title').innerHTML = randomBannerList[selectedBannerIndex]["title"];
		    document.getElementById('desc').innerHTML = randomBannerList[selectedBannerIndex]["desc"];


		    localStorage.setItem("detail", JSON.stringify(randomBannerList[selectedBannerIndex]));
			
		}
		else
			{
			  selectedBannerIndex = selectedBannerIndex  +  (index);
			  
				changeBg(randomBannerList[selectedBannerIndex]["image"]);
			    document.getElementById('random-title').innerHTML = randomBannerList[selectedBannerIndex]["title"];
			    document.getElementById('desc').innerHTML = randomBannerList[selectedBannerIndex]["desc"];


			    localStorage.setItem("detail", JSON.stringify(randomBannerList[selectedBannerIndex]));
			}
	
	
}


function initTizenKeys() {
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 37: // LEFT arrow
            	
                moveLeft();
                break;
            case 38: // UP arrow
            
                moveUp();
                break;
            case 39: // RIGHT arrow
                moveRight();
                break;
            case 40: // DOWN arrow
                moveDown();
                break;
            case 13: // OK button
                moveOk();


                break;
            case 10009: // RETURN button
//                tizen.application.getCurrentApplication().exit();
                
            	 location.href = "../home/home.html";
            	break;
            default:
                console.log('Key code : ' + e.keyCode);
                break;
        }
    });
}


function showSection(id) {

    document.getElementById(id).style.display = "block";

}

function hideSection(id) {


    document.getElementById(id).style.display = "none";

}

function setFocus(id, clas) {

    document.getElementById(id).classList.add(clas);

}

function removeFocus(clas) {

    var el = document.getElementsByClassName(clas)[0].id;
    document.getElementById(el.toString()).classList.remove(clas);


}

function moveOk() {

    if (document.getElementsByClassName("activeDetail")[0] !== undefined) {
    	
    	localStorage.setItem("detail-movie-id", randomBannerList[selectedBannerIndex]["uid"]);
		
        location.href = "../detail/detail.html";
        
    } else if (document.getElementsByClassName("activeCategory")[0] !== undefined) {

    	getMoviesByCat(categoryList[selectedCatPos]["fullId"] , categoryList[selectedCatPos]["title"]);

    
    } else if (document.getElementsByClassName("activeViewed")[0] !== undefined) {
    	
    	localStorage.setItem("detail-movie-id", mostViewedList[selectedViewedPos]["movieId"]);
		
        location.href = "../detail/detail.html";

    } else if (document.getElementsByClassName("activeRecents")[0] !== undefined) {
    		
    	localStorage.setItem("detail-movie-id", mostRecentsList[selectedRecentPos]["movieId"]);
		
        location.href = "../detail/detail.html";   
    } 
   
    
    else if (document.getElementsByClassName("activeScreenCategory")[0] !== undefined) {
        
    	getMoviesByCat(categoryList[selectedScreenCatPos]["fullId"] , categoryList[selectedScreenCatPos]["title"]);
    	
    	
    }else if (document.getElementsByClassName("button_play")[0] !== undefined) {
    	setMovie("full");
    }else if (document.getElementsByClassName("button_favourite")[0] !== undefined) {
    	setMovie("trailer");
    }
    else if(document.getElementsByClassName("activeSeeMoreCat")[0] !== undefined){
    	
    	removeFocus("activeSeeMoreCat");

        removeFocus("watch_btn");
        setFocus("category_btn_id", "watch_btn");

        
        showCategorySection();   
           	 
        setFocus("categoryScreen " + selectedScreenCatPos, "activeScreenCategory");        
        setFocus("categories-wrap " + selectedScreenCatPos, "catCardHover");
        
    }
    
    else if(document.getElementsByClassName("activeSeeMoreView")[0] !== undefined)
    	{
    	
    	     localStorage.setItem("movie_screen_title", "I più visti");
    	     localStorage.setItem("movies", JSON.stringify(mostViewedList));
    		 viewMovieListScreen();
    	}
    else if(document.getElementsByClassName("activeSeeMoreRecent")[0] !== undefined)
	{
    	
	     localStorage.setItem("movie_screen_title", "Ultime uscite");
	     localStorage.setItem("movies", JSON.stringify(mostRecentsList));
		 viewMovieListScreen();
	}
    else if (document.getElementsByClassName("activeScreenFav")[0] !== undefined){
    	
    	localStorage.setItem("detail-movie-id", favList[selectedScreenFavPos]["movie_id"]);
		
        location.href = "../detail/detail.html";
    	
    }
    else if (document.getElementsByClassName("button_left")[0] !== undefined) {
        
    	var el = document.getElementsByClassName("button_left")[0].id;
    	
    	if(el === "left_back_id"){
    		    changeBackgroundImg(-1);
       	}
    	else{
		    	changeBackgroundImg(1);
    	}

    }
    
 else if (document.getElementsByClassName("watch_btn")[0] !== undefined){
    	
    	
    	var el = document.getElementsByClassName("watch_btn")[0].id;
    	
    	if(el === "logout_btn_id"){
    		
    		
    		var value = confirm("Do you want to logout? ");
    	
    		
    		if(value == true){
    	
    			
        		localStorage.removeItem("jwt token");
        		localStorage.removeItem("remembered");
        		location.href = "../login.html";
    			
    		}
    		

    		
    	}
   
    }
 
    


}


function moveUp() {

    // on left not null ie. control is on side nav bar...
    if (document.getElementsByClassName("onLeft")[0] !== undefined) {

        var el = document.getElementsByClassName("watch_btn")[0].id;

        if (el === "category_btn_id") {

            removeFocus("watch_btn");
            setFocus("watch_btn_id", "watch_btn");

            showWatchSection();

        } else if (el === "fav_btn_id") {
            removeFocus("watch_btn");
            setFocus("category_btn_id", "watch_btn");

            showCategorySection();

        }
        else if (el === "logout_btn_id") {
            removeFocus("watch_btn");
            setFocus("fav_btn_id", "watch_btn");

            showFavouriteSection();

        }
   		else if(el === "watch_btn_id"){
   				
   				removeFocus("watch_btn");
   				
    			console.log("inside");
                location.href = "../Search/search.html";
    		}
    		
   	
   	
   	


    }


    // start else..
    else {

        if (document.getElementsByClassName("activeCategory")[0] !== undefined) {
           
            setFocus("see_more_cat_list_id" , "activeSeeMoreCat");

            removeFocus("activeCategory");
            removeFocus("cardhover");

        } 
        
        else if(document.getElementsByClassName("activeSeeMoreCat")[0] !== undefined){
        	
        	setFocus("left_back_id", "button_left");
            
            removeFocus("activeSeeMoreCat");

        	
        }
        
        else if(document.getElementsByClassName("button_left")[0] !== undefined){
        	  if(activeSubscription == "Active"){
        		  setFocus("add_play_btn", "button_play");
                  document.getElementById("add_play_btn").style.opacity = 0.5;

        	  }
        	  else{
        		  setFocus("detail", "activeDetail");
        	  }
        	
            
            removeFocus("button_left");
        }
        
        
        else if (document.getElementsByClassName("button_play")[0] !== undefined) {

            setFocus("detail", "activeDetail");
            document.getElementById("add_play_btn").style.opacity = 1;


            removeFocus("button_play");
        } else if (document.getElementsByClassName("button_favourite")[0] !== undefined) {

            setFocus("detail", "activeDetail");

            removeFocus("button_favourite");
        } else if (document.getElementsByClassName("activeViewed")[0] !== undefined) {
           
        	
        	setFocus("see_more_view_list_id" , "activeSeeMoreView");

            removeFocus("activeViewed");
            removeFocus("cardhover");


        } 
        
        else if(document.getElementsByClassName("activeSeeMoreView")[0] !== undefined){
        	
        	scroll('-=500px');

        	 setFocus("categories " + selectedCatPos, "activeCategory");
        	 setFocus("cat-wrap " + selectedCatPos, "cardhover");
            
            removeFocus("activeSeeMoreView");

        	
        }
        
     
        
        
        else if (document.getElementsByClassName("activeRecents")[0] !== undefined) {

        	
        	
        	setFocus("see_more_recent_list_id" , "activeSeeMoreRecent");

           
            removeFocus("activeRecents");
            removeFocus("cardhover");

        }
        
        else if(document.getElementsByClassName("activeSeeMoreRecent")[0] !== undefined){
        	
        	 scroll('-=200px');

             setFocus("viewed " + selectedViewedPos, "activeViewed");
             setFocus("viewed-wrap " + selectedViewedPos, "cardhover");
            
            removeFocus("activeSeeMoreRecent");
            
            

        	
        }


    }

    // end else..

}


function moveDown() {

    // on left not null ie. control is on side nav bar...
    if (document.getElementsByClassName("onLeft")[0] !== undefined) {

        var el = document.getElementsByClassName("watch_btn")[0].id;

        if (el === "watch_btn_id") {
            removeFocus("watch_btn");
            setFocus("category_btn_id", "watch_btn");

            showCategorySection();
        } else if (el === "category_btn_id") {

            removeFocus("watch_btn");
            setFocus("fav_btn_id", "watch_btn");

            showFavouriteSection();
        } else if (el === "fav_btn_id") {
        	removeFocus("watch_btn");
            setFocus("logout_btn_id", "watch_btn");

            
        }
        else if(el === "logout_btn_id"){
        	 removeFocus("watch_btn");
             setFocus("setting_btn_id", "watch_btn");

             settingsNavigate();
        }


    } else {

        if (document.getElementsByClassName("activeDetail")[0] !== undefined) {
          
        	  if(activeSubscription == "Active"){
        			setFocus("add_play_btn", "button_play");
                    document.getElementById("add_play_btn").style.opacity = 0.5;

        	  }
  		   		
  		   else {
  			       setFocus("left_back_id" , "button_left");   
  		   }
  			   
        
            removeFocus("activeDetail");

        }
        
        else if (document.getElementsByClassName("button_play")[0] !== undefined) {
            setFocus("left_back_id" , "button_left");
            document.getElementById("add_play_btn").style.opacity = 1;
            removeFocus("button_play");
        } 
        
        else if(document.getElementsByClassName("button_left")[0] !== undefined){
        	 setFocus("see_more_cat_list_id" , "activeSeeMoreCat");
             removeFocus("button_left");
        }
        
        else if (document.getElementsByClassName("button_favourite")[0] !== undefined) {
            setFocus("see_more_cat_list_id" , "activeSeeMoreCat");
            removeFocus("button_favourite");
        }
        
        // focus on see more category...
        
        else if(document.getElementsByClassName("activeSeeMoreCat")[0] !== undefined) {

        	setFocus("categories " + selectedCatPos, "activeCategory");
            setFocus("cat-wrap " + selectedCatPos, "cardhover");

            removeFocus("activeSeeMoreCat");
        }
        
        
        
        else if (document.getElementsByClassName("activeCategory")[0] !== undefined) {

            scroll('+=400px');


            removeFocus("activeCategory");
            removeFocus("cardhover");

            setFocus("see_more_view_list_id" , "activeSeeMoreView");


        }
        
 // focus on see more viewed...
        
        else if(document.getElementsByClassName("activeSeeMoreView")[0] !== undefined) {

        	 setFocus("viewed " + selectedViewedPos, "activeViewed");
             setFocus("viewed-wrap " + selectedViewedPos, "cardhover");

             removeFocus("activeSeeMoreView");
        }
        
        
        else if(document.getElementsByClassName("activeSeeMoreRecent")[0] !== undefined) {

        	 setFocus("recent " + selectedRecentPos, "activeRecents");
             setFocus("recent-wrap " + selectedRecentPos, "cardhover");

            removeFocus("activeSeeMoreRecent");
       }
        
        // focus on see more recents...

        else if (document.getElementsByClassName("activeViewed")[0] !== undefined) {

        	
        	 scroll('+=300px');

        	 removeFocus("activeViewed");
             removeFocus("cardhover");

             setFocus("see_more_recent_list_id" , "activeSeeMoreRecent");

      
        }

    }


}




function moveLeft() {

    if (document.getElementsByClassName("button_favourite")[0] !== undefined) {

        setFocus("add_play_btn", "button_play");
        document.getElementById("add_play_btn").style.opacity = 0.5;


        removeFocus("button_favourite");
    } else if (document.getElementsByClassName("activeCategory")[0] !== undefined) {
        if (selectedCatPos !== 0) {

            if (selectedCatPos % 4 == 0) {
                document.getElementById("category_control_left").click();
            }

            selectedCatPos--;
            removeFocus("activeCategory");
            removeFocus("cardhover");
            setFocus("categories " + selectedCatPos, "activeCategory");
            setFocus("cat-wrap " + selectedCatPos, "cardhover");



        } else {
            removeFocus("activeCategory");
            removeFocus("cardhover");

            var onLeftElementId = document.getElementsByClassName("watch_btn")[0].id;
            setFocus(onLeftElementId, "onLeft");

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
    } else if (document.getElementsByClassName("activeViewed")[0] !== undefined) {
        if (selectedViewedPos !== 0) {

            if (selectedViewedPos % 4 == 0) {
                document.getElementById("viewed_control_left").click();
            }

            selectedViewedPos--;
            removeFocus("activeViewed");
            removeFocus("cardhover");

            setFocus("viewed " + selectedViewedPos, "activeViewed");
            setFocus("viewed-wrap " + selectedViewedPos, "cardhover");



        } else {
            removeFocus("activeViewed");
            removeFocus("cardhover");

            var onLeftElementId = document.getElementsByClassName("watch_btn")[0].id;
            setFocus(onLeftElementId, "onLeft");

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

        }


    } else if (document.getElementsByClassName("activeRecents")[0] !== undefined) {
        if (selectedRecentPos !== 0) {

            if (selectedRecentPos % 4 == 0) {
                document.getElementById("recent_control_left").click();
            }

            selectedRecentPos--;

            removeFocus("activeRecents");
            removeFocus("cardhover");

            setFocus("recent " + selectedRecentPos, "activeRecents");
            setFocus("recent-wrap " + selectedRecentPos, "cardhover");


        } else {
            removeFocus("activeRecents");
            removeFocus("cardhover");

            var onLeftElementId = document.getElementsByClassName("watch_btn")[0].id;
            setFocus(onLeftElementId, "onLeft");

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }

    }
    else if (document.getElementsByClassName("button_left")[0] !== undefined) {
       
    	var el = document.getElementsByClassName("button_left")[0].id;
    	if(el === "right_back_id"){
    		removeFocus("button_left");
    		setFocus("left_back_id" , "button_left");
    	}

    }


    // activeScreenCategory
    else if (document.getElementsByClassName("activeScreenCategory")[0] !== undefined) {
        if (selectedScreenCatPos !== 0) {


            if (selectedScreenCatPos % 4 === 0) {
                scroll('-=200px');
            }
            selectedScreenCatPos--;
            removeFocus("activeScreenCategory");
            removeFocus("catCardHover");
            
            setFocus("categoryScreen " + selectedScreenCatPos, "activeScreenCategory");
            setFocus("categories-wrap " + selectedScreenCatPos, "catCardHover");
       
        } else {
            removeFocus("activeScreenCategory");
            removeFocus("catCardHover");
            
            var onLeftElementId = document.getElementsByClassName("watch_btn")[0].id;
            setFocus(onLeftElementId, "onLeft");

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
    }
    
    
    
    // activeScreenFavorite
    else if (document.getElementsByClassName("activeScreenFav")[0] !== undefined) {
        if (selectedScreenFavPos !== 0) {


            if (selectedScreenFavPos % 4 === 0) {
                scroll('-=200px');
            }
            selectedScreenFavPos--;
            removeFocus("activeScreenFav");
            removeFocus("catCardHover");
            
          
            setFocus("favoriteScreen " + selectedScreenFavPos, "activeScreenFav");
            setFocus("fav-wrap " + selectedScreenFavPos, "catCardHover");
       
        } else {
            removeFocus("activeScreenFav");
            removeFocus("catCardHover");
            
            var onLeftElementId = document.getElementsByClassName("watch_btn")[0].id;
            setFocus(onLeftElementId, "onLeft");

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
    }



    // move to side navigation drawer
    else if (document.getElementsByClassName("activeDetail")[0] !== undefined) {
        removeFocus("activeDetail");
        var onLeftElementId = document.getElementsByClassName("watch_btn")[0].id;
        setFocus(onLeftElementId, "onLeft");

        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

    } else if (document.getElementsByClassName("button_play")[0] !== undefined) {
        removeFocus("button_play");
        document.getElementById("add_play_btn").style.opacity = 1;

        var onLeftElementId = document.getElementsByClassName("watch_btn")[0].id;
        setFocus(onLeftElementId, "onLeft");
    }
}



function settingsNavigate() {
    location.href = "../settings/settings.html";

}


function scroll(by) {
    $('html, body').animate({
        scrollTop: by
    }, 300);
}


function moveRight() {
    // on left not null ie. control is on side nav bar...
    if (document.getElementsByClassName("onLeft")[0] !== undefined) {

       
        var onLeftElementId = document.getElementsByClassName("watch_btn")[0].id;
        if (onLeftElementId === "watch_btn_id") {
        	 removeFocus("onLeft");
            setFocus("detail", "activeDetail");
        } else if (onLeftElementId === "category_btn_id") {

        	 removeFocus("onLeft");
        	 
            setFocus("categoryScreen " + selectedScreenCatPos, "activeScreenCategory");        
            setFocus("categories-wrap " + selectedScreenCatPos, "catCardHover");
        }
        else if (onLeftElementId === "fav_btn_id") {

        	
        	if(favList.length > 0)
        		{
        		
        			removeFocus("onLeft");
        	     
        			setFocus("favoriteScreen " + selectedScreenFavPos, "activeScreenFav");        
        			setFocus("fav-wrap " + selectedScreenFavPos, "catCardHover");
        		}
        }

    }

    // start else
    else {

        if (document.getElementsByClassName("button_play")[0] !== undefined) {

            document.getElementById("add_play_btn").style.opacity = 1;

            removeFocus("button_play");
            setFocus("add_fav_btn", "button_favourite");


        } else if (document.getElementsByClassName("activeCategory")[0] !== undefined) {
            if (selectedCatPos !== (categoryList.length - 1)) {
                selectedCatPos++;
                removeFocus("activeCategory");
                removeFocus("cardhover");

                setFocus("categories " + selectedCatPos, "activeCategory");
                setFocus("cat-wrap " + selectedCatPos, "cardhover");

                if (selectedCatPos % 4 == 0) {
                    document.getElementById("category_control_right").click();
                }
            } else {
                selectedCatPos = 0;

                removeFocus("activeCategory");
                removeFocus("cardhover");

                setFocus("categories " + selectedCatPos, "activeCategory");
                setFocus("cat-wrap " + selectedCatPos, "cardhover");

                document.getElementById("category_control_right").click();
            }

        } else if (document.getElementsByClassName("activeViewed")[0] !== undefined) {
            if (selectedViewedPos !== (mostViewedList.length - 1)) {
                selectedViewedPos++;
                removeFocus("activeViewed");
                removeFocus("cardhover");

                setFocus("viewed " + selectedViewedPos, "activeViewed");
                setFocus("viewed-wrap " + selectedViewedPos, "cardhover");

                if (selectedViewedPos % 4 == 0) {
                    document.getElementById("viewed_control_right").click();
                }
            } else {
                selectedViewedPos = 0;
                removeFocus("activeViewed");
                removeFocus("cardhover");

                setFocus("viewed " + selectedViewedPos, "activeViewed");
                setFocus("viewed-wrap " + selectedViewedPos, "cardhover");

                document.getElementById("viewed_control_right").click();
            }


        } else if (document.getElementsByClassName("activeRecents")[0] !== undefined) {
            if (selectedRecentPos !== (mostRecentsList.length - 1)) {
                selectedRecentPos++;
                removeFocus("activeRecents");
                removeFocus("cardhover");

                setFocus("recent " + selectedRecentPos, "activeRecents");
                setFocus("recent-wrap " + selectedRecentPos, "cardhover");

                if (selectedRecentPos % 4 == 0) {
                    document.getElementById("recent_control_right").click();
                }
            } else {
                selectedRecentPos = 0;
                removeFocus("activeRecents");
                removeFocus("cardhover");

                setFocus("recent " + selectedRecentPos, "activeRecents");
                setFocus("recent-wrap " + selectedRecentPos, "cardhover");

                document.getElementById("recent_control_right").click();
            }


        } 
        
        else if (document.getElementsByClassName("button_left")[0] !== undefined) {
            
        	var el = document.getElementsByClassName("button_left")[0].id;
        	if(el === "left_back_id"){
        		removeFocus("button_left");
        		setFocus("right_back_id" , "button_left");
        	}

        }
        
        else if (document.getElementsByClassName("activeScreenCategory")[0] !== undefined) {
            if (selectedScreenCatPos !== (categoryList.length - 1)) {
                selectedScreenCatPos++;
                removeFocus("activeScreenCategory");
                removeFocus("catCardHover");
                
                
                setFocus("categoryScreen " + selectedScreenCatPos, "activeScreenCategory");
                setFocus("categories-wrap " + selectedScreenCatPos, "catCardHover");

                if (selectedScreenCatPos % 4 === 0) {
                    scroll('+=200px');
                }

            } else {
                selectedScreenCatPos = 0;
                removeFocus("activeScreenCategory");
                removeFocus("catCardHover");

                
                setFocus("categoryScreen " + selectedScreenCatPos, "activeScreenCategory");
                setFocus("categories-wrap " + selectedScreenCatPos, "catCardHover");

                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }
        
        else if (document.getElementsByClassName("activeScreenFav")[0] !== undefined) {
            if (selectedScreenFavPos !== (favList.length - 1)) {
            	selectedScreenFavPos++;
                removeFocus("activeScreenFav");
                removeFocus("catCardHover");
                
                
                setFocus("favoriteScreen " + selectedScreenFavPos, "activeScreenFav");        
                setFocus("fav-wrap " + selectedScreenFavPos, "catCardHover");
                
                

                if (selectedScreenFavPos % 4 === 0) {
                    scroll('+=200px');
                }

            } else {
            	
            	selectedScreenFavPos = 0;
                removeFocus("activeScreenFav");
                removeFocus("catCardHover");

                
                setFocus("favoriteScreen " + selectedScreenFavPos, "activeScreenFav");        
                setFocus("fav-wrap " + selectedScreenFavPos, "catCardHover");

                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }
        
        

        // end else
    }


}

function getHomeScreenData() {


    var token = localStorage.getItem("jwt token");

    if (token !== null) {
    	
    	getProfileData(token);
    	
    } else {
        console.log("No token found");
        location.href = "../login.html";
    }


}


function getProfileData(token) {
	
	
	
		fetch(URL + 'v3/users/get.php', {
				  headers: {
					  'Authorization' : "Bearer " + token
				  },
				})
				.then(response => response.json())
				.then(data => {
			
				
					var username = data["data"][0]["fname"];	
					document.getElementById('user_name_id').innerHTML = username;
						
					     localStorage.setItem("username", username);
						

						getRandomMovies(token);


				})
				.catch((error) => {
				  console.error('Err:', error);
				});
			
		

	
}



function getRandomMovies(token) {
    fetch(URL + 'v3/movies/onair/getRandomSelection.php', {
            headers: {
                'Authorization': "Bearer " + token
            },
        })
        .then(response => response.json())
        .then(data => {

            data.forEach((result, index) => {


                // add categories to list.....
                var obj = {
                    "fullId": result["src"]["id_full"],
                    "year": result["meta"]["year"],
                    "length": result["meta"]["lenght"],
                    "cast": result["meta"]["cast"],
                    "director": result["meta"]["directors"],
                    "title": result["langs"]["it"]["title"],
                    "image": "https://media.uam.tv/images/media/frames/" + result["src"]["id_full"] + ".jpg",
                    "desc": result["langs"]["it"]["logline"],
                    "tag": result["langs"]["it"]["tags"],
                    "geolimits": result["meta"]["geolimits"],
                    "trailerId": result["src"]["id_trailer"],
                    "uid": result["uid"],
                    "movie_id" : result["uid"]
               
                };

                randomBannerList.push(obj);
            })

            addBackground();
            getCategories(token);


        })
        .catch((error) => {
            console.error('Err:', error);
            // hideLoader();
        });
}


function getFavourites(token){
	
				    fetch(URL + 'v3/users/favourites/get.php', {
			            headers: {
			                'Authorization': "Bearer " + token
			            },
			        })
			        .then(response => response.json())
			        .then(data => {

			        	if(data["data"] != null)
			        		{
			        		 data["data"].forEach((result, index) => {


					                
			                     // add favorites to list.....
			                     var obj = {
			                         "fullId" : result["id_full"],
			                          "title" : result["title"],
			                         "image": "https://media.uam.tv/images/media/slider/" + result["id_full"] + ".jpg",
			                         "movie_id" : result["id_movie"]
			                     };

			                     favList.push(obj);
			           

			             })

			        		}

			             getMostRecents(token);

			        	
							
			        })
			        .catch((error) => {
			            console.error('Err:', error);
			            // hideLoader();
			        });
	
	
}

function getCategories(token) {
    fetch(URL + 'v3/movies/categories/get.php', {
            headers: {
                'Authorization': "Bearer " + token
            },
        })
        .then(response => response.json())
        .then(data => {

            data["data"][0].forEach((result, index) => {


                if (result[0] !== -1 && result[0] !== 0) {
                    // add categories to list.....
                    var obj = {
                        "fullId": result[0],
                        "title": result[1],
                        "image": "https://media.uam.tv/images/media/category/" + result[0] + ".jpg",
                     
                    };

                    categoryList.push(obj);
                }

            })



            addCategories(token);
            

        })
        .catch((error) => {
            console.error('Err:', error);
            // hideLoader();
        });
}


function getMostRecents(token) {
    fetch(URL + 'v3/movies/onair/getMostRecent.php', {
            headers: {
                'Authorization': "Bearer " + token
            },
        })
        .then(response => response.json())
        .then(data => {

            data.forEach((result, index) => {

                // add most recents to list.....
                var obj = {
                    "fullId": result["src"]["id_full"],
                    "image": "https://media.uam.tv/images/media/slider/" + result["src"]["id_full"] + ".jpg",
                    "movieId" : result["uid"]
                };

                mostRecentsList.push(obj);

            })

            addMostRecents();
            getMostViewed(token);

        })
        .catch((error) => {
            console.error('Err:', error);
            // hideLoader();
        });
}

function getMostViewed(token) {
    fetch(URL + 'v3/movies/onair/getMostViewed.php', {
            headers: {
                'Authorization': "Bearer " + token
            },
        })
        .then(response => response.json())
        .then(data => {

            data["data"].forEach((result, index) => {

                // add most viewed to list.....

                var obj = {
                    "fullId": result["id_full"],
                    "image": "https://media.uam.tv/images/media/slider/" + result["id_full"] + ".jpg",
                    "movieId" : result["id_movie"]
                };

                mostViewedList.push(obj);

            })

            addMostViewed();

        })
        .catch((error) => {
            console.error('Err:', error);
            // hideLoader();
        });
}

function addBackground() {
    changeBg(randomBannerList[0]["image"]);
    document.getElementById('random-title').innerHTML = randomBannerList[0]["title"];
    document.getElementById('desc').innerHTML = randomBannerList[0]["desc"];


    localStorage.setItem("detail", JSON.stringify(randomBannerList[0]));

}

function addCategoriesToCategoryScreen() {
    document.getElementById("container-fluid-category-id").innerHTML = ``;


    var rowId = "-1";


    categoryList.forEach((result, idx) => {


        console.log(idx);

        if (idx % 4 == 0) {
            if (idx == 0) {

                var showcase = document.getElementById("container-fluid-category-id");
                rowId = idx;

                showcase.innerHTML += `<div id="row-category ${rowId.toString()}" class="row"></div>`;

            } else {

                var showcase = document.getElementById("container-fluid-category-id");
                rowId = idx;

                showcase.innerHTML += `<div id="row-category ${rowId.toString()}" class="row mt-5"></div>`;
            }

        }


        var row = document.getElementById("row-category " + rowId);
        var temp = `
        <div id="categoryScreen ${idx}" class="col-lg-3 mt-4">
        <div id="categories-wrap ${idx}" class="card" style="width: 18rem;">
            <img class="card-img-top image_placeholder" src="${result["image"]}" alt="Card image cap">
            <p class="category_type">${result["title"]}</p>
        </div>
    </div> 
        
        `;

        row.innerHTML += temp;


    })
    removeFocusHome();
    hideSection("watch_section_id");
    hideSection("favourite_setion");
    showSection("category_setion");

}

function addCategories(token) {

    var rowId = "-1";

    console.log(categoryList.length, categoryList);

    categoryList.forEach((result, idx) => {


        console.log(idx);

        if (idx % 4 == 0) {
            if (idx == 0) {

                var showcase = document.getElementById("category-carousel-item activeId");
                rowId = idx;

                showcase.innerHTML += `<div id="row ${rowId.toString()}" class="row"></div>`;

            } else {

                var mainContainer = document.getElementById("category-carousel-innerId");

                mainContainer.innerHTML += `<div id="item ${rowId.toString()}" class="carousel-item"></div>`;
                var showcase = document.getElementById("item " + rowId);

                rowId = idx;
                showcase.innerHTML += `<div id="row ${rowId.toString()}" class="row"></div>`;
            }
        }

        var row = document.getElementById("row " + rowId);
        var temp = `      
        <div id="categories ${idx}" class="col-sm-3">
        <div id="cat-wrap ${idx}" class="thumb-wrapper">
            <div class="img-box">
                <img src= "${result["image"]}" class="img-fluid image_placeholder" alt="">
                <p class="catagory_name_style ml-2">${result["title"]}</p>
            </div>
        </div>
    </div>      
        `;

        row.innerHTML += temp;


    })
    
    
    getFavourites(token);
    
}


function addMostRecents() {

    var rowId = "-1";


    mostRecentsList.forEach((result, idx) => {


        console.log(idx);

        if (idx % 4 == 0) {
            if (idx == 0) {

                var showcase = document.getElementById("recent-carousel-item activeId");
                rowId = idx;

                showcase.innerHTML += `<div id="recent-row ${rowId.toString()}" class="row"></div>`;

            } else {

                var mainContainer = document.getElementById("recent-carousel-innerId");

                mainContainer.innerHTML += `<div id="recent-item ${rowId.toString()}" class="carousel-item"></div>`;
                var showcase = document.getElementById("recent-item " + rowId);

                rowId = idx;
                showcase.innerHTML += `<div id="recent-row ${rowId.toString()}" class="row"></div>`;
            }


        }

        var row = document.getElementById("recent-row " + rowId);
        var temp = `
     
        <div id="recent ${idx}" class="col-sm-3">
        <div id="recent-wrap ${idx}" class="thumb-wrapper">
            <div class="img-box">
                <img src= "${result["image"]}" class="img-fluid image_placeholder" alt="">
        
            </div>
        </div>
    </div>  
        
        `;

        row.innerHTML += temp;


    })
}


function addMostViewed() {

    var rowId = "-1";


    mostViewedList.forEach((result, idx) => {


        console.log(idx);

        if (idx % 4 == 0) {
            if (idx == 0) {

                var showcase = document.getElementById("viewed-carousel-item activeId");
                rowId = idx;

                showcase.innerHTML += `<div id="viewed-row ${rowId.toString()}" class="row"></div>`;

            } else {

                var mainContainer = document.getElementById("viewed-carousel-innerId");

                mainContainer.innerHTML += `<div id="viewed-item ${rowId.toString()}" class="carousel-item"></div>`;



                var showcase = document.getElementById("viewed-item " + rowId);

                rowId = idx;
                showcase.innerHTML += `<div id="viewed-row ${rowId.toString()}" class="row"></div>`;
            }


        }


        var row = document.getElementById("viewed-row " + rowId);
        var temp = `
        
        
        
        
        <div id="viewed ${idx}" class="col-sm-3">
        <div id="viewed-wrap ${idx}" class="thumb-wrapper">
            <div class="img-box">
                <img src= "${result["image"]}" class="img-fluid image_placeholder" alt="">
        
            </div>
        </div>
    </div>
       
        `;

        row.innerHTML += temp;
        hideLoader();
    })


}


function addFavouritesToFavouritesScreen() {



    document.getElementById("container-fluid-favourite-id").innerHTML = ``;


    var rowId = "-1";


    favList.forEach((result, idx) => {


        console.log(idx);

        if (idx % 4 == 0) {
            if (idx == 0) {

                var showcase = document.getElementById("container-fluid-favourite-id");
                rowId = idx;

                showcase.innerHTML += `<div id="row-favourite ${rowId.toString()}" class="row"></div>`;

            } else {

                var showcase = document.getElementById("container-fluid-favourite-id");
                rowId = idx;

                showcase.innerHTML += `<div id="row-favourite ${rowId.toString()}" class="row mt-5"></div>`;
            }


        }


        var row = document.getElementById("row-favourite " + rowId);
        var temp = `      
        <div id="favoriteScreen ${idx}" class="col-lg-3 mt-4">
        <div id="fav-wrap ${idx}" class="card" style="width: 18rem;">
            <img class="card-img-top image_placeholder" src="${result["image"]}" alt="Card image cap">
        </div>
    </div>
                
        `;

        row.innerHTML += temp;
    })

    // scroll to top of home...

    removeFocusHome();

    hideSection("watch_section_id");
    showSection("favourite_setion");
    hideSection("category_setion");
}

function showCategorySection() {
    addCategoriesToCategoryScreen();
}


function showWatchSection() {
    showSection("watch_section_id");
    hideSection("favourite_setion");
    hideSection("category_setion");

    removeFocusHome();

}

function showFavouriteSection() {

    addFavouritesToFavouritesScreen();
}


function changeBg(image) {

    var d = {
        img: image,
    }
    var img = d.img;
    var a = "linear-gradient(rgba(21, 9, 36, 0.6), rgba(20, 9, 34, .7), rgba(21, 9, 36, .7)),"
    var b = "url(" + img + ")";
    var c = a + b;
    console.log(c);
    document.getElementById('split_right').style.backgroundImage = c;


}



function setMovie(type) { // check geolimit

    viewLoader();


    var moviePlay;
    var movie = JSON.parse(localStorage.getItem("detail"));

   if(type === "full")
	   {
	  		if (movie["geolimits"] === true) {
	  				moviePlay = {
	  					"geolimits": 2,
	  					"contentId": movie["fullId"]
	  				};
	  		} else {
	  				moviePlay = {
	  						"geolimits": 1,
	  						"contentId": movie["fullId"]
	  				};
	  		}
	   }
   else
	   {
	   			moviePlay = {
					"geolimits": 1,
					"contentId": movie["trailerId"]
				};
	   		
	   	}
	   


    var token = localStorage.getItem("jwt token");

    if (token !== null) {
        getMovieSource(moviePlay, token);
    } else {
        console.log("No token found");
        location.href = "../login.html";
    }

}

function getMovieSource(moviePlay, token) { // hit stream api...

    let params = {
        "contentID": moviePlay["contentId"],
        "prop": moviePlay["geolimits"]
    };

    let query = Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');

    fetch(URL + 'v3/movies/streams/get.php?' + query, {
            headers: {
                'Authorization': "Bearer " + token
            },
        })
        .then(response => response.json())
        .then(data => {

            // set to storage

            var videoUrl = data["data"]["embedUrlList"][0]["https"]["abr"]["hls"];
            
            if(moviePlay["geolimits"] == 2){
            	localStorage.setItem("geo", "true");
            }
            else
            	localStorage.setItem("geo", "false");

            
            var movie = JSON.parse(localStorage.getItem("detail"));
            localStorage.setItem("video", videoUrl);
            localStorage.setItem("videoId",  movie["movie_id"]);
            
            
            location.href="../Video/video.html"
            


            hideLoader();

        })
        .catch((error) => {
            console.error('Err:', error);
            hideLoader();
        });

}



function getMoviesByCat(catid , catName) {
    
	 var token = localStorage.getItem("jwt token");

	    if (token !== null) {
	    	
	    	viewLoader();
	    
	    	
	    	let params = {
			        "catid": catid,
			    };

	    	
	    	 let query = Object.keys(params)
		        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		        .join('&');
	    	 
	    	fetch(URL + 'v3/movies/onair/getByCategory.php?' + query, {
	            headers: {
	                'Authorization': "Bearer " + token
	            },
	        })
	        .then(response => response.json())
	        .then(data => {

	            data["data"].forEach((result, index) => {

	            	 var obj = {
	                         "fullId": result["src"]["id_full"],
	                         "image": "https://media.uam.tv/images/media/slider/" + result["src"]["id_full"] + ".jpg",
	                         "movieId" : result["id_movie"]
	                     };
	            	 
	            	 
	            	 categoryMovieList.push(obj);
	            	 
	            	
	            	
	            })
	            
	            
	            localStorage.setItem("movie_screen_title", catName);
	    	    localStorage.setItem("movies", JSON.stringify(categoryMovieList));
	    	    
	    	    viewMovieListScreen();
	            

	        })
	        .catch((error) => {
	            console.error('Err:', error);
	        });
	    	
	    } else {
	        console.log("No token found");
	        location.href = "../login.html";
	    }
	

}




function viewMovieListScreen(){
    window.location.href="../Cat_Rec_Most_view/categories.html"
    }

function viewLoader() {
    document.getElementById("parentRightSection").classList.add('parent_right_section');
    document.getElementById("spinner_display_id").classList.add('loadingio-spinner-spinner-rexyx9adxl');

}


function hideLoader() {
    document.getElementById("parentRightSection").classList.remove('parent_right_section');
    document.getElementById("spinner_display_id").classList.remove('loadingio-spinner-spinner-rexyx9adxl');
}

function removeFocusHome() {

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Assign focus to detail button....
    if (document.getElementsByClassName("activeDetail")[0] !== undefined) {
        remove("activeDetail");
    }

    if (document.getElementsByClassName("activeCategory")[0] !== undefined) {
        removeFocus("activeCategory");
    } else if (document.getElementsByClassName("button_play")[0] !== undefined) {
        removeFocus("button_play");
    } else if (document.getElementsByClassName("button_favourite")[0] !== undefined) {
        removeFocus("button_favourite");
    } else if (document.getElementsByClassName("activeViewed")[0] !== undefined) {
        removeFocus("activeViewed");
    } else if (document.getElementsByClassName("activeRecents")[0] !== undefined) {
        removeFocus("activeRecents");
    }
}
