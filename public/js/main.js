$(document).ready(function(){
    for (var i=1; i <= $('.slider__slide').length; i++){
      $('.slider__indicators').append('<div class="slider__indicator" data-slide="'+i+'"></div>')
    }
    setTimeout(function(){
      $('.slider__wrap').addClass('slider__wrap--hacked');
    }, 2000);
    
    function goToSlide(number){
        $('.slider__slide').removeClass('slider__slide--active');
        $('.slider__slide[data-slide='+number+']').addClass('slider__slide--active');
    }
    
    let click = ()=>{
        var currentSlide = Number($('.slider__slide--active').data('slide'));
        var totalSlides = $('.slider__slide').length;
        currentSlide++
        console.log(currentSlide);
        if (currentSlide > totalSlides){
            currentSlide = 1;
        }
        goToSlide(currentSlide);
    };
    goToSlide(1);
    $('#go-to-next1').click(click);
    $('#go-to-next2').click(click);
    $('#go-to-next3').click(click);
})