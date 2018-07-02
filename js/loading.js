// imitation of new page loading
function loading() {
  $body = $('body'),
  $('.loading')

  loader(10);

  function loader(delay) {
  	$('.loading').css('visibility','visible')
    setTimeout(function(){
      $body.addClass('loading');
    }, delay);

    setTimeout(function(){
      $body.addClass('loaded');
    }, delay + 1700);

    setTimeout(function(){
      $body.removeClass('restart').addClass('new-page');
    }, delay + 1950);

    setTimeout(function(){
      $body.css('background-color','#FFF')
      $('#c').css('display', 'none')
    }, delay + 2150);




  }
  
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
