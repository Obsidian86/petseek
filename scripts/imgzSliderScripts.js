class gallerySet{
    constructor(images, targ){
        this.target = document.getElementById(targ);
        this.images = images;
        this.currentImage = -1; 
    } 

    changeImage(direction){
        if( this.currentImage > -1){ 
            document.getElementsByClassName("selectedImage")[0].classList.remove("selectedImage"); 
        } 
        if(direction === "next") { 
            this.currentImage++; 
            if( this.currentImage === this.images.length ){
                this.currentImage = 0;
            }
        }else{ 
            this.currentImage--;  
            if( this.currentImage === -1){
                this.currentImage = this.images.length - 1;
            }
        }
        document.getElementById("imgzCount").innerText = this.currentImage +1;
        document.getElementById("slideImg" + this.currentImage).classList.add("selectedImage");  
    }

    setButtons(){
        for(let i=0; i< document.getElementsByClassName("imgzBtn").length; i++){
            let thisBtn = document.getElementsByClassName("imgzBtn")[i]; 
            if(i===1){
                thisBtn.style.right = "0";
                thisBtn.addEventListener("click", ()=> this.changeImage("next") );
            }else{ 
                thisBtn.addEventListener("click", ()=> this.changeImage("prev") );
            }
          if(this.images.length < 2){ thisBtn.style.display = "none"; }
        }
    }

    setImages(){
        let setBuild = "<div id='imgzSlider'><button class='imgzBtn'>Prev</button>"; 
        for(let i=0; i< this.images.length; i++){
            setBuild += "<img src='" + this.images[i] + "' id='slideImg" + i + "' class='slidezImage' />"; 
        }
        this.target.innerHTML = setBuild + `
            <button class='imgzBtn'>Next</button>
            </div>
            <p id='imgNumbers'>
                Image 
                <span id='imgzCount'>1</span> 
                of  ${this.images.length} 
            </p>
        `; 
        this.setButtons();
        this.changeImage("next"); 
    }

} 