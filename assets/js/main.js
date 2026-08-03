function initMenuSlider(){

    const track=document.querySelector(".slider-track");

    const slides=[...document.querySelectorAll(".slide")];

    const prev=document.querySelector(".slider-btn.prev");

    const next=document.querySelector(".slider-btn.next");

    if(!track) return;

    function updateActive(){

        const center=track.scrollLeft+track.offsetWidth/2;

        let closest=null;

        let distance=Infinity;

        slides.forEach(slide=>{

            const slideCenter=slide.offsetLeft+slide.offsetWidth/2;

            const d=Math.abs(center-slideCenter);

            if(d<distance){

                distance=d;

                closest=slide;

            }

            slide.classList.remove("active");

        });

        closest?.classList.add("active");

    }

    updateActive();

    track.addEventListener("scroll",()=>{

        requestAnimationFrame(updateActive);

    });

    const amount=430;

    prev.addEventListener("click",()=>{

        track.scrollBy({

            left:-amount,

            behavior:"smooth"

        });

    });

    next.addEventListener("click",()=>{

        track.scrollBy({

            left:amount,

            behavior:"smooth"

        });

    });

let isDown=false;

let startX;

let scrollLeft;

track.addEventListener("mousedown",(e)=>{

isDown=true;

startX=e.pageX-track.offsetLeft;

scrollLeft=track.scrollLeft;

});

track.addEventListener("mouseleave",()=>{

isDown=false;

});

track.addEventListener("mouseup",()=>{

isDown=false;

});

track.addEventListener("mousemove",(e)=>{

if(!isDown) return;

e.preventDefault();

const x=e.pageX-track.offsetLeft;

const walk=(x-startX)*2;

track.scrollLeft=scrollLeft-walk;

});    

}