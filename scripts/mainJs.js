let displayPet = document.getElementById("pet");
let submitBtn = document.getElementById("submitBtn");

const env = "testx";

let SearchCriteria = {
    animal: "dog",
    output: "full",
    callback: "revealpet",
    count: 12,
    location: "77338",
    size: "",
    age: "",
    sex: "",
    offset: 0
}; 

///// FILTERS OUT THE WEIRD CHARACTERS RETURNED BY THE API
function filterJunk(str) {
    let code;
    let newStr = ""; 
    for (let i = 0; i < str.length; i++){
      code = str.charCodeAt(i);
      if ( 
          !(code === 10) && 
          !(code === 40) && 
          !(code === 41) && 
          !(code > 43 && code < 60) &&  
          !(code > 64 && code < 91) &&  
          !(code > 96 && code < 123) && 
          !(code === 32) && 
          !(code === 33) &&  
          !(code === 34) &&  
          !(code === 36) &&  
          !(code === 38) &&  
          !(code === 39) &&  
          !(code === 42) &&  
          !(code === 61) && 
          !(code === 63) && 
          !(code === 64) &&
          !(code === 95) &&
          !(code === 166) 
        ){  
      }else{
        newStr += str[i];
      }
    }
    return(newStr); 
  };
 
//// REPOSITIONS THE ANIMAL POP UP WHEN SCREEN IS SCROLLED
function setWindow(){ 
    if( getComputedStyle(document.getElementById("viewPet")).position === "absolute"){
        document.getElementById("viewPet").style.top = (window.pageYOffset) +  "px";  
   } else{
        document.getElementById("viewPet").style.top = "0px"; 
   } 
}

////// CALLBACK FROM APPEND  
function revealpet( data ){  
    if( data.petfinder.header.status.code.$t === "100"){
        document.getElementById("zip_error").style.display = "none";
        let pet = data.petfinder.pets.pet; 
        searchedPets = pet; 
        SearchCriteria.offset = data.petfinder.lastOffset.$t;
        let nBody = "";
        for(let i=0; i<pet.length; i++){
            nBody += `
                <div class="petCard">
                    <a class="petLink" href="#" id="${pet[i].id.$t}"><span>View Pet</span></a>
                    <p class="petName"> ${ filterJunk(pet[i].name.$t) } </p>`; 
            if("photos" in pet[i].media){
                nBody += `<div class="petImage" style="background-image: url(${ pet[i].media.photos.length < 2 ?  pet[i].media.photos.photo[1].$t : pet[i].media.photos.photo[2].$t })"></div>`;
            }else{
                 nBody += `<div class="petImage" style="background-image:  url(images/${ SearchCriteria.animal }.svg)"></div>`;
            } 

            if( "$t" in pet[i].description ){
                nBody += `
                <div class="descr">${ filterJunk( pet[i].description.$t.split(' ').slice(0, 40).join(' ')) }...</div>`;
            }else{
                nBody += `
                <div class="descr">No description available for this pet.</div>`;
            }
            nBody += `</div>`;
        }
         
        displayPet.innerHTML = nBody;
        document.getElementById("mainBody").style.display = "block";
        
        for(let i=0; i<document.getElementsByClassName("petLink").length; i++){
            document.getElementsByClassName("petLink")[i].addEventListener("click", (e)=>{
                e.preventDefault();
                showPet(document.getElementsByClassName("petLink")[i].getAttribute("id"));
            });
        }
    } else if(data.petfinder.header.status.message.$t === "Invalid geographical location"){
        //If status not 100 Check for zipcode error
        document.getElementById("zip_error").style.display = "block";
    }

}
 
/////// MAKES THE SEARCH
function makeSearch() {
   let url = "https://api.petfinder.com/pet.find?"; 
    //Builds the url with all the search params
    for(let i=0; i< Object.keys(SearchCriteria).length; i++ ){ 
        if(SearchCriteria[Object.keys(SearchCriteria)[i]] !== ""){
            if(i > 0){ url += "&"; }
            url += Object.keys(SearchCriteria)[i] + "=" + SearchCriteria[Object.keys(SearchCriteria)[i]]; 
        }
    }  
    let callUrl = `https://petseek.herokuapp.com`;
    fetch(callUrl, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({petUrl: url})
    })
        .then(resp => resp.json())
        .then( resp => revealpet(resp));

    document.getElementById("prevPage").style.display = SearchCriteria.offset > 0 ? "block" : "none";
}

/////////////////////// SHOW PET ///////////////
/////////////////////// SHOW PET ///////////////
/////////////////////// SHOW PET ///////////////
/////////////////////// SHOW PET ///////////////
function showPet(thisPet){ 
    curPet = (searchedPets.filter(pet=> pet.id.$t === thisPet))[0]; 

    let checkEl = (title, element) =>{
        elItem = `<li> <strong>${title}: </strong>`;
        elItem += "$t" in element ? `${element.$t}` : `Not provided` 
        return elItem +  `</li>`;
    } 
    let petCont = `
        <button class='btn btn-danger' id='closeBtn'>x | Close</button> 
        <h1>${ filterJunk(curPet.name.$t) }</h1>
        `;
         
    petCont += `
    <ul> 
        ${ checkEl("Age", curPet.age) }
        ${ checkEl("Breed", curPet.breeds.breed) }
        ${ checkEl("Sex", curPet.sex) }
        ${ checkEl("Email", curPet.contact.email) }
        ${ checkEl("Phone", curPet.contact.phone) }
    </ul>`; 

    let imgCollect = []; 
    if("photos" in curPet.media){
        for(let i=0; i< curPet.media.photos.photo.length; i++){
            if(curPet.media.photos.photo[i]["@size"] === "x"){
                imgCollect.push(curPet.media.photos.photo[i].$t);
            }
        } 
    }else{
        let img = curPet.animal.$t === "Dog" ? "images/dog.svg" : "images/cat.svg";
        imgCollect.push(img);
    }
     
    petCont += "<div id='imgzGallery'></div>"
    petCont += "<p class='vpdescr'>";
    petCont += "$t" in curPet.description ? `${ filterJunk(curPet.description.$t) }` : `No description provided.`
    petCont +=  "</p> <p class='clearIt'></p>";

    document.getElementById("petContent").innerHTML = petCont; 

    let petGal = new gallerySet(imgCollect, "imgzGallery");
    petGal.setImages();

    document.getElementById("viewPet").style.display = "block";
    document.getElementById("shadow").style.display = "block";
    document.getElementById("shadowImg").style.display = "block";   

    document.getElementById("closeBtn").addEventListener("click", ()=>{
        document.getElementById("viewPet").style.display = "none";
        document.getElementById("shadow").style.display = "none";
        document.getElementById("shadowImg").style.display = "none"; 
    });

    setWindow(); 
}

///// EVENT LISTENERS
submitBtn.addEventListener("click", ()=>{ 
    SearchCriteria.offset = 0;
    makeSearch(); 
}); 

if( env === "test"){
    makeSearch();
}
window.addEventListener("scroll", function(){
    if(getComputedStyle(document.getElementById("viewPet")).display !== "none"){
        let top = document.getElementById("viewPet").style.top.replace("px", "");
        let height = getComputedStyle(document.getElementById("viewPet")).height.replace("px", ""); 

        if(window.pageYOffset < (parseInt(top) - 20) || window.pageYOffset > (parseInt(top) + parseInt(height) + 400)){
            setWindow();
        }
    }
});
document.getElementById("zCode").addEventListener("keyup", ()=>{
     SearchCriteria.location = document.getElementById("zCode").value; 
});

let inputs = document.getElementsByClassName("inputWatch");
for(let i=0; i< inputs.length; i++){
    inputs[i].addEventListener("change", ()=>{
        SearchCriteria[inputs[i].getAttribute("id")] = inputs[i].value;
    });
}
document.getElementById("nextPage").addEventListener("click", ()=>{
    event.preventDefault();
    makeSearch();
});
document.getElementById("prevPage").addEventListener("click", ()=>{
    event.preventDefault(); 
    SearchCriteria.offset = SearchCriteria.offset - (SearchCriteria.count * 2);  
    makeSearch();
});

/* Inline functions */
function chooseAnimal(thisAnimal){
    if(document.getElementsByClassName("chosen").length > 0){
        document.getElementsByClassName("chosen")[0].classList.remove("chosen");
    }
   document.getElementById("choose" + thisAnimal).classList.add("chosen");
   SearchCriteria.animal = thisAnimal;
}
window.addEventListener('resize', function(){
    setWindow();
}, true);
