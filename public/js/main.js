<<<<<<< HEAD
let GetSchedule = ()=>{
  $('#daylist').empty();
  $('#timelist').empty();

  //GetDate
  $.post('common/RequestTime','',(result)=>{
    if(result.message === 'unAutherized'){
      location.href = '/error.html'
    }

=======

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
>>>>>>> 1d51751f0c033e7cc99af4663e0a81c962830743
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
<<<<<<< HEAD

    //GetTime
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
            newP.setAttribute('class',results[i].busNum);
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
  });
}

let GetEmptySeats = ()=>{
  let selectDate = $("#daylist .dayselect").text();
  let busNum = $('#timelist > li.timeselect > p').attr('class');
  let sendParam = {selectDate, busNum};
  $('.disable').removeAttr('class');
  $('.seatselect').removeAttr('class');
  
  $.post('common/RequestEmptySeat',sendParam,(result)=>{
    if(result.result){    //잘못된 접근 //
      location.href = 'error.html';
      return;
    }
    if(result.message === 'unAutherized'){
      location.href = '/error.html'
    }

    $('#selectlist').empty();
    let arr = Array.from(result.used);
    let list = $('#seatlist td');
    
    for(let i=0;i<arr.length;++i){
      $(list[arr[i]-1]).attr('class','disable');
    }

    $("#seatlist td").off();
    $("#seatlist td").not('.disable').click((event)=>{
        let selectedSeats = $('#selectlist')[0];
        $(event.target).toggleClass("seatselect");

        if($(event.target).attr('class') === 'seatselect'){
          let newli = document.createElement('li');
          let newP = document.createElement('p');
          newP.innerHTML= $(event.target).text();
          newP.setAttribute('id',$(event.target).text());  
          newli.append(newP);
          selectedSeats.append(newli); 
          
          let elements = $("#selectlist > li");
          let arr = [];
          for(let i=0;i<elements.length;++i){
            arr[i] = $(elements[i]).children('p').attr('id');
          }
          
          arr.sort((a,b)=> {return a-b;});

          for(let i=0;i<arr.length;++i){
            $(elements[i]).children('p').attr('id',arr[i]);
            $(elements[i]).children('p').text(arr[i]);
          }
        }else{
          $('#selectlist #'+$(event.target).text()).parent().remove();
        }
        
        $('.sum').text($("#selectlist > li").length * 7000);
      });
  });
}

let sendSelected = ()=>{
  let selected = [];
  let elements = $("#selectlist > li p");
  for(let i=0;i<elements.length;++i){
    selected[i] = elements[i].innerHTML;
  }
  let sendParam = {selected};
  console.log(sendParam);
  $.post('/common/PrePurchase',sendParam,(result)=>{ 
    alert(result);
  })
}

=======
  
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


>>>>>>> 1d51751f0c033e7cc99af4663e0a81c962830743
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

<<<<<<< HEAD
        console.log(number);
        if(number === 1){
          GetSchedule();
        }else if(number === 2){
          GetEmptySeats();
        }else if(number === 3){
          sendSelected();
=======
        if(number === 1){
          getTimeSchedule();
        }else if(number === 2){
          getEmptySeats();
          console.log('');
>>>>>>> 1d51751f0c033e7cc99af4663e0a81c962830743
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

<<<<<<< HEAD
    let clickprev = ()=>{
      var currentSlide = Number($('.slider__slide--active').data('slide'));
      currentSlide=1;

      goToSlide(currentSlide);
  };

=======
>>>>>>> 1d51751f0c033e7cc99af4663e0a81c962830743
    $('#go-to-next1').click(click);
    $('#go-to-next2').click(click);
    $('#go-to-next3').click(click);

<<<<<<< HEAD
    $('#go-to-prev1').click(clickprev);
    $('#go-to-prev2').click(clickprev);
    $('#go-to-prev3').click(clickprev);
    goToSlide(1);
});
=======
    goToSlide(1);

    
})
>>>>>>> 1d51751f0c033e7cc99af4663e0a81c962830743
