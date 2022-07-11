const URL = "https://api.uam.tv/";
var selectedCatPos = 0;


var categoryList = [];

var init = function () {
       
    initTizenKeys();
    hideSection("not_found_id");
    document.getElementById("search_field_id").focus();
    setFocus("search_field_id" , "activeField");
    document.getElementById("user_name_id").innerHTML = localStorage.getItem("username");
    
    
    
    document.getElementById('search_field_id').addEventListener('focus', function() {
  	  console.log("input element is focused and ready to get user input.");
  	});

  	document.getElementById('search_field_id').addEventListener('blur', function() {
  	  console.log("input element loses focus.");
  	});

  	document.getElementById('search_field_id').addEventListener('change', function() {
  	  console.log("input element value is changed.");
  	});



  	document.body.addEventListener('search_field_id', function(event) {
  	  switch (event.keyCode) {
  	    case 65376: // Done
  	      document.getElementById('search_field_id').blur();
  	      break;
  	    case 65385: // Cancel
  	      document.getElementById('search_field_id').blur();
  	      break;
  	  }
  	});
  	
    
   
};


window.onload = init;




function initTizenKeys()
{
	 // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
    		moveLeft();
    		break;
    	case 38: //UP arrow
    		moveUp();
    		break;
    	case 39: //RIGHT arrow
    		moveRight();
    		break;
    	case 40: //DOWN arrow
    		moveDown();
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


function moveOk(){
	
	if(document.getElementsByClassName("searchStyleAfterClick")[0] !== undefined)
	searchButtonStyle();
	
	else if(document.getElementsByClassName("activeCategory")[0] !== undefined){
		
		localStorage.setItem("detail-movie-id", categoryList[selectedCatPos]["id_movie"]);
		
		
        location.href = "../detail/detail.html";
		
	}
	
}

function moveDown(){
	
	if(document.getElementsByClassName("searchStyleAfterClick")[0] !== undefined){
		
		
		if(categoryList.length > 0){
			
			// scrollToTop();
			
			removeFocus("searchStyleAfterClick");
			
			
			 setFocus("categories " + selectedCatPos, "activeCategory");
		        setFocus("cat-wrap " + selectedCatPos, "cardhover");

		}
		
	}
	else if(document.getElementsByClassName("activeField")[0] !== undefined){
		
		
		if(categoryList.length > 0){
			
			scrollToTop();
			
			removeFocus("activeField");
			document.getElementById("search_field_id").blur();

			
			 setFocus("categories " + selectedCatPos, "activeCategory");
		        setFocus("cat-wrap " + selectedCatPos, "cardhover");

		}
		
	}
	
	
}

function moveUp(){
	
	if(document.getElementsByClassName("activeCategory")[0] !== undefined){
		if(selectedCatPos == 0 || selectedCatPos == 1 || selectedCatPos == 2 || selectedCatPos == 3){
			
			scrollToTop();
			
			
			removeFocus("activeCategory");
			removeFocus("cardhover");
			selectedCatPos = 0;
			
				
			document.getElementById("search_field_id").focus();
		    setFocus("search_field_id" , "activeField");
			
		}
	}
}


function moveLeft(){
	
	if(document.getElementsByClassName("searchStyleAfterClick")[0] !== undefined){
		
		removeFocus("searchStyleAfterClick");
		document.getElementById("search_field_id").focus();
	    setFocus("search_field_id" , "activeField");
		
		
	}
	else if(document.getElementsByClassName("activeCategory")[0] !== undefined){
		 if (selectedCatPos !== 0) {

	           if (selectedCatPos % 4 == 0) {
	               scroll('-=340px');
	           }

	           selectedCatPos--;
	           removeFocus("activeCategory");
	           removeFocus("cardhover");
	           setFocus("categories " + selectedCatPos, "activeCategory");
	           setFocus("cat-wrap " + selectedCatPos, "cardhover");



	       }
	}
	
	  
}

function moveRight() {
	
	
	if(document.getElementsByClassName("activeField")[0] !== undefined){
	
		removeFocus("activeField");
	    document.getElementById("search_field_id").blur();
		setFocus("serachBtn" , "searchStyleAfterClick");
		
		
	}
	else if(document.getElementsByClassName("activeCategory")[0] !== undefined){
		if (selectedCatPos !== (categoryList.length - 1)) {
	        selectedCatPos++;
	        removeFocus("activeCategory");
	        removeFocus("cardhover");

	        setFocus("categories " + selectedCatPos, "activeCategory");
	        setFocus("cat-wrap " + selectedCatPos, "cardhover");

	        if (selectedCatPos % 4 == 0) {
	        	
	            scroll('+=340px');
	        	
	        }
	    } else {
	    	
	    	// scrollToTop();
	    	
	        selectedCatPos = 0;

	        removeFocus("activeCategory");
	        removeFocus("cardhover");

	        setFocus("categories " + selectedCatPos, "activeCategory");
	        setFocus("cat-wrap " + selectedCatPos, "cardhover");

	    }
	}
	

	
}

function doSearch(text , token){
	
	
	viewLoader();
	
	  let params = {
		        "term": text,
		    };

		    let query = Object.keys(params)
		        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		        .join('&');

		    fetch(URL + 'v3/movies/onair/search.php?' + query, {
		            headers: {
		                'Authorization': "Bearer " + token
		            },
		        })
		        .then(response => response.json())
		        .then(data => {

		        	
		        	
		        	if(data["data"].length > 0){
		        		
		        		data["data"].forEach((result, idx) => {

			        		  var obj = {
			                          "fullId": result["id_full"],
			                          "image": "https://media.uam.tv/images/media/slider/" + result["id_full"] + ".jpg",
			                          "id_movie": result["id_movie"]
			                     
			                      };

			        		  categoryList.push(obj);
			        		
			        	    })
			        	
			        	    addCategoriesToCategoryScreen();
		        			showSection("container-fluid_id");

		        		
		        		
		        	}
		        	else
		        		{
		        			showSection("not_found_id");
		        		}
		        	
		        	hideLoader();
		        	
		        	

		        })
		        .catch((error) => {
		            console.error('Err:', error);
		            hideLoader();
		            showSection("not_found_id");
		        });

	
	
}


function addCategoriesToCategoryScreen() {
    document.getElementById("container-fluid_id").innerHTML = ``;


    var rowId = "-1";


    categoryList.forEach((result, idx) => {


        console.log(idx);

        if (idx % 4 == 0) {
          
        	if(idx === 0 ){
        		
        		var showcase = document.getElementById("container-fluid_id");
                rowId = idx;

                showcase.innerHTML += `<div id="row-category ${rowId.toString()}" class="row"></div>`;

        		
        	}
        	else {
        		
        		var showcase = document.getElementById("container-fluid_id");
                rowId = idx;

                showcase.innerHTML += `<div id="row-category ${rowId.toString()}" class="row mt-5"></div>`;

				
			}
                
         

        }


        var row = document.getElementById("row-category " + rowId);
        var temp = `
      
    	<div id="categories ${idx}" class="col-3">
   			<div id="cat-wrap ${idx}" class="card searchCard">
   				<img class="img-fluid" src="${result["image"]}" alt="Card image cap">
   			</div>
   		</div>
        
        `;

        row.innerHTML += temp;

        

    })
   
    setFocus("categories " + selectedCatPos, "activeCategory");
    setFocus("cat-wrap " + selectedCatPos, "cardhover");
    
}


function viewLoader(){
	 document.getElementById("serachBtn").classList.add('searchStyleAfterClick');
	 document.getElementById("loadingSpinner").classList.add('ldio-eon67kjyqwt');
	
	 hideSection("container-fluid_id");
	 hideSection("not_found_id");
	
}


function hideLoader(){
	 
	 var el = document.getElementsByClassName("searchStyleAfterClick")[0].id;
	 document.getElementById(el.toString()).classList.remove("searchStyleAfterClick");
	 
	 var el1 = document.getElementsByClassName("ldio-eon67kjyqwt")[0].id;
	 document.getElementById(el1.toString()).classList.remove("ldio-eon67kjyqwt");
	 
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

// function scrollToTop(){
// 	document.body.scrollTop = 0;
//     document.documentElement.scrollTop = 0;
// }

function scroll(by) {
	    $('html, body').animate({
	        scrollTop: by
	    }, 300);
}



function searchButtonStyle(){
   
    
    var token = localStorage.getItem("jwt token");

    
    categoryList.length = 0;
    var text = document.getElementById('search_field_id').value;
    
    if (token !== null) {
    	doSearch(text , token);
    }
    else{
    	  console.log("No token found");
          location.href = "../login.html";
    }
    
    }



