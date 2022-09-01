//selecting all required elements
const filterItem = document.querySelector(".items");
const filterImg = document.querySelectorAll(".gallery .image");

window.onload = ()=>{ //after window loaded
	filterItem.onclick = (selectedItem)=>{ //if user click on filterItem div
		if(selectedItem.target.classList.contains("item"))
		{ //if user selected item has .item class
		  filterItem.querySelector(".active").classList.remove("active"); //remove the active class which is in first item
		  selectedItem.target.classList.add("active"); //add that active class on user selected item
		  let filterName = selectedItem.target.getAttribute("data-name"); //getting data-name value of user selected item and store in a filtername variable
		  filterImg.forEach((image) => {
			let filterImges = image.getAttribute("data-name"); //getting image data-name value
			//if user selected item data-name value is equal to images data-name value
			//or user selected item data-name value is equal to "all"
			if((filterImges == filterName) || (filterName == "all"))
			{
			  image.classList.remove("hide"); //first remove the hide class from the image
			  image.classList.add("show"); //add show class in image
			}
			else
			{
			  image.classList.add("hide"); //add hide class in image
			  image.classList.remove("show"); //remove show class from the image
			}
		  });
		}
	}
	for (let i = 0; i < filterImg.length; i++) 
	{
		filterImg[i].setAttribute("onclick", "preview(this)"); //adding onclick attribute in all available images
	}
	
	executeFLOW();
}

function executeFLOW()
{
    var flowUrl = "https://prod-189.westeurope.logic.azure.com:443/workflows/98755ab0e97d43bf94db526090b6324d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=OkIJsBew5neDB8DY4RlayCSyxC9AOV2I0m1b9vQrgNw";
   
    var req = new XMLHttpRequest();
    req.open("POST", flowUrl, true);
    req.setRequestHeader('Content-Type', 'application/json');

	////Response
	req.onreadystatechange = function () 
	{
        if (this.readyState === 4) 
		{ 
            req.onreadystatechange = null;
            if (this.status === 200)
			{
                var result = this.response;
				const myArr = result.split("|");				
                for (var i = 0; i < myArr.length; i++)
				{
					var gallery= $(".gallery");
					gallery.append("<div class='image' data-name='"+i+"' onclick='preview(this)'><span><img src='data:image/png;base64," + myArr[i] + "' alt=''></span></div>");
				}
            }
            else if(this.status === 400)
			{
                alert(this.statusText);
				var result = this.response; 
                alert("Error" + result);
            }
        }
    };  
	////End
    req.send();
}

//fullscreen image preview function
//selecting all required elements
const previewBox = document.querySelector(".preview-box"),
categoryName = previewBox.querySelector(".title p"),
previewImg = previewBox.querySelector("img"),
closeIcon = previewBox.querySelector(".icon"),
shadow = document.querySelector(".shadow");

function preview(element)
{
	//once user click on any image then remove the scroll bar of the body, so user can't scroll up or down
	document.querySelector("body").style.overflow = "hidden";
	let selectedPrevImg = element.querySelector("img").src; //getting user clicked image source link and stored in a variable
	let selectedImgCategory = element.getAttribute("data-name"); //getting user clicked image data-name value
	previewImg.src = selectedPrevImg; //passing the user clicked image source in preview image source
	categoryName.textContent = selectedImgCategory; //passing user clicked data-name value in category name
	previewBox.classList.add("show"); //show the preview image box
	shadow.classList.add("show"); //show the light grey background
	closeIcon.onclick = ()=>{ //if user click on close icon of preview box
		previewBox.classList.remove("show"); //hide the preview box
		shadow.classList.remove("show"); //hide the light grey background
		document.querySelector("body").style.overflow = "auto"; //show the scroll bar on body
	}
}
