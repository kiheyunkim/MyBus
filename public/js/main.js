
let setTimeTableEvent=()=>{
  $("#daylist li").click(
    (event)=>{
      $(event.target).parent().siblings().find('.dayselect').removeClass("dayselect");
      $(event.target).addClass("dayselect");

      $.post('common/RequestBusList',{request:event.target.innerHTML},(result)=>{
        let results = Array.from(result.buses);
        let listParent = $('#timelist')[0];
        $('#timelist').empty();        
        for(let i=0;i<results.length;++i){
          let newli = document.createElement('li');
          let newP = document.createElement('p');
          newP.innerHTML= "번호: " +results[i].busNum + " 남은자리: "+ results[i].leftSeat ;
          newP.setAttribute('class','');  
          newli.append(newP);
          listParent.append(newli);
        }

        $("#timelist li").click(
          function(){
            $(this).addClass("timeselect");
            $(this).siblings().removeClass("timeselect");
          }
        );
      });
    });
}

let getTimeSchedule =()=>{
  $.post('common/RequestTime','',(result)=>{
    let arr = Array.from(result.times);
    let listParent = $('#daylist')[0];
    for(let i=0;i<arr.length;++i){
      let newli = document.createElement('li');
      let newP = document.createElement('p');
      newP.innerHTML= arr[i];
      newP.setAttribute('class','');  
      newli.append(newP);
      listParent.append(newli); 
    }
  
    setTimeTableEvent();
  });
}

let getEmptySeats = ()=>{
  let selectDate = $("#timelist li");
  let busNum = '1001';
  let sendParam = {selectDate,busNum};
  $.post('common/RequestEmptySeat',sendParam,(result)=>{
    
    let arr = Array.from(result.used);
    console.log(arr);
    $("#seatlist td").click(
      ()=>{
        $(this).toggleClass("seatselect");
      }
    
    );
  })
}


$(document).ready(()=>{
    for (var i=1; i <= $('.slider__slide').length; i++){
      $('.slider__indicators').append('<div class="slider__indicator" data-slide="'+i+'"></div>')
    }
    setTimeout(()=>{
      $('.slider__wrap').addClass('slider__wrap--hacked');
    }, 2000);
    
    let goToSlide = (number)=>{
        $('.slider__slide').removeClass('slider__slide--active');
        $('.slider__slide[data-slide='+number+']').addClass('slider__slide--active');

        if(number === 1){
          getTimeSchedule();
        }else if(number === 2){
          getEmptySeats();
          console.log('');
        }
    }
    
    let click = ()=>{
        var currentSlide = Number($('.slider__slide--active').data('slide'));
        var totalSlides = $('.slider__slide').length;
        currentSlide++
        if (currentSlide > totalSlides){
            currentSlide = 1;
        }

        goToSlide(currentSlide);
    };

    $('#go-to-next1').click(click);
    $('#go-to-next2').click(click);
    $('#go-to-next3').click(click);

    goToSlide(1);

    
})