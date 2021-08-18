const API_key = "JeEMRksLDV54PQ3v7IELaJvwFiGLSKyudfabEYJz";
let jsonRovers = {};
let selectedRoverId = null;
let myArray = [];
let num = 0;
const modalImage = document.querySelector(".modal img"); 

function getRoverFieldByKey(fieldKey, requiredField) {
    const [key,value] = Object.entries(fieldKey)[0];
    return jsonRovers.rovers.find( (rover) => rover[key] === value)[requiredField];  
} 

function clearSelect(className) {
    var sel = document.querySelector(className);
        for (i = sel.length - 1; i >= 0; i--) {
	    sel.remove(i);
    }
}

async function traerRovers(){

    const apiRovers = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?&api_key=${API_key}`);
    jsonRovers = await apiRovers.json();

    jsonRovers.rovers.forEach(element => {

        const $roverSelect = document.querySelector(".rover-select");
        $option = document.createElement("option");
        $option.setAttribute("value", element.name);
        $option.textContent = element.name;
        $roverSelect.appendChild($option)
        
    });
}


function solNasa(){
    let $roverSelect = document.querySelector(".rover-select");
    clearSelect(".select-sol");

    if ($roverSelect.value !== "select") {

        const $sol = document.querySelector(".sol");
        $sol.style.display = "flex";
        const maxSol = getRoverFieldByKey({name: $roverSelect.value}, "max_sol");
        const $selectSol = document.querySelector(".select-sol");
        for(i=0; i<=maxSol; i++) {
            const option = document.createElement('option');
            option.setAttribute('value', i);
            option.innerHTML = i;
            $selectSol.appendChild(option);
        }
    }     
    let $solSelect = document.querySelector(".select-sol");   
}

function cameraNasa() {

    const $cam = document.querySelector(".camera");
    $cam.style.display = "flex";
    let $roverSelect = document.querySelector(".rover-select");
    clearSelect(".select-camera");
    const $selectCamera = document.querySelector(".select-camera");  
    const cameras = getRoverFieldByKey({name:$roverSelect.value}, "cameras");

    $option2 = document.createElement("option");
    $option2.setAttribute("value", "cam");
    $option2.textContent = "Select";
    $selectCamera.appendChild($option2)
    
    cameras.forEach(cam => {

        $option = document.createElement("option");
        $option.setAttribute("value", cam.name);
        $option.textContent = cam.full_name;
        $selectCamera.appendChild($option)
  
    });
}

const $modal = document.querySelector(".modal");
const $closePhotos = document.querySelector(".modal > button");
const $up = document.querySelector(".up");
const $contDown = document.querySelector(".container-down");
$contDown.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "img") {

        $contenedor = document.querySelector(".contenedor");
        $modal.style.display = "flex";
        $contenedor.style.display = "flex";
        $up.style.display = "none";
        modalImage.src = event.target.src;
        num = event.target.id;
    }   
})

// Carrousel -------------------------------------------------------------
const $arrowLeft = document.querySelector(".arrow-left");
const $arrowRight = document.querySelector(".arrow-right");

$arrowLeft.addEventListener("click", () => {
    num--;
    if (num<0){
        num = myArray.length -1;
    }
    modalImage.src = myArray[num].src; 
}) 

$arrowRight.addEventListener("click", () => {
    num++;
    if (num>myArray.length -1){
     num = 0;
    }
    modalImage.src = myArray[num].src;
 }) 

$closePhotos.addEventListener("click", () => {
 $modal.style.display = "none";
 $up.style.display = "flex";
})

async function getPhotos() {
   try {
       let $roverSelect = document.querySelector(".rover-select").value;    
       const $selectSol = document.querySelector(".select-sol").value;    
       const $selectCamera = document.querySelector(".select-camera").value;
       const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${$roverSelect}/photos?sol=${$selectSol}&camera=${$selectCamera}&api_key=${API_key}`;
       const response = await fetch(url);
       const {photos} = await response.json();
       const $contNoPhotos = document.querySelector(".container-no-photos");
       $contDown.innerHTML = "";
       $contNoPhotos.style.display = "none";

       if (photos.length > 0) {     
           
           photos.forEach(({img_src}, index) => {
              $img = document.createElement("img");
              $img.setAttribute("loading","lazy");
              $img.setAttribute("src", img_src);             
              $img.setAttribute("alt", "camera image");
              $img.className = "image-rover";
              $img.setAttribute("id", index);                       
              $contDown.appendChild($img);
           })
           $nodeList = document.querySelectorAll(".container-down img");
           myArray = Array.from($nodeList);

       }else {
        $contNoPhotos.style.display = "flex";   
        $noPhotos = document.querySelector(".no-photos");
        $noPhotos.textContent = "There are not photos in this camera";
        $imgNoPhotos = document.querySelector(".img-no-photos");
        $imgNoPhotos.style.display = "flex";
       }

   }catch(error){
       console.log(error)
   }
}

window.onscroll = function() {
    if (window.scrollY > 600) {
        $up.style.visibility = "visible";
    
    } else if (window.scrollY < 600) {  
        $up.style.visibility = "hidden";
    }
};

traerRovers();




