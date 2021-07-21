const API_key = "JeEMRksLDV54PQ3v7IELaJvwFiGLSKyudfabEYJz";

let jsonRovers = {};

let selectedRoverId = null;


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


        console.log($roverSelect.value,":" ,"Días máximos", maxSol)

    } 
      
    let $solSelect = document.querySelector(".select-sol");

    console.log("Sol seleccionado: ",$solSelect.value)
     
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


async function getPhotos() {
   try {

       let $roverSelect = document.querySelector(".rover-select").value;
    
       const $selectSol = document.querySelector(".select-sol").value;
    
       const $selectCamera = document.querySelector(".select-camera").value;

       
    
       const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${$roverSelect}/photos?sol=${$selectSol}&camera=${$selectCamera}&api_key=${API_key}`;
    
       console.log(url);

       const response = await fetch(url);

       const {photos} = await response.json();

       const $contNoPhotos = document.querySelector(".container-no-photos");

       const $contDown = document.querySelector(".container-down");

       console.log("fotos: ",photos, photos.length);


       //---------------------------------------------------------------
       function carrousel($contDown){
        $contDown.addEventListener("click", el => {
               let atras = $contDown.querySelector(".atras");
               let adelante = $contDown.querySelector(".adelante");
               let img = $contDown.querySelector("img");
               let tgt = el.target;

               if (tgt === atras){

                   if (cont > 0){
                       img.src = myArray[cont - 1];
                       cont--;
                   }else {
                       img.src = myArray[myArray.length - 1];
                       cont = myArray.length - 1;
                   }

               }else if (tgt === adelante) {
                if (cont < myArray.length - 1){
                    img.src = myArray[cont + 1];
                    cont++;
                }else {
                    img.src = myArray[0];
                    cont = 0;
                }
               }
           })
       }
       //-------------------------------------------------------------

       $contDown.innerHTML = "";
       $contNoPhotos.style.display = "none";
       
       if (photos.length > 0) {


           
           
           photos.forEach(({img_src}, index) => {
              $img = document.createElement("img");
              $img.setAttribute("src", img_src);
              $img.setAttribute("alt", "camera image");
              $img.className = "image-rover";
              $img.setAttribute("id", index);

                           
              $contDown.appendChild($img);
           })


           $nodeList = document.querySelectorAll(".container-down img");

           let myArray = Array.from($nodeList);

           let num = 0;

           //console.log("Lista", myArray);

           
          
           $contDown.addEventListener("click", (event) => {
               if (event.target.tagName.toLowerCase() === "img") {

                   
                   $contenedor = document.querySelector(".contenedor");
                   $modal.style.display = "flex";
                   $contenedor.style.display = "flex";
                   $up.style.display = "none";
                   
                   //console.log(event.target.id);

                   $contenedor.appendChild(event.target);
                   $modal.appendChild($contenedor);


                   // Carrousel -------------------------------------------------------------
                   const $arrowLeft = document.querySelector(".arrow-left");
                   const $arrowRight = document.querySelector(".arrow-right");

                   $arrowLeft.addEventListener("click", () => {
                       num--;

                       if (num<0){
                           num = myArray.length -1;
                       }
                       
                       //console.log(myArray[num].src); 
                       $contenedor.appendChild(myArray[num]);
                       $modal.appendChild($contenedor);  
                   }) 

                   $arrowRight.addEventListener("click", () => {

                       num++;
                       if (num>myArray.length -1){
                        num = 0;
                       }
                
                       //console.log(myArray[num].src);  
                       $contenedor.appendChild(myArray[num]);
                       $modal.appendChild($contenedor);
                    }) 

                   


                   //--------------------------------------------------------------------------------

                   $closePhotos.addEventListener("click", () => {
                    $modal.style.display = "none";
                    $contDown.appendChild(event.target);
                    $up.style.display = "flex";

                })
                   
               }   
           
          })

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


