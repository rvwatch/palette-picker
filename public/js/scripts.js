$( document ).ready(function() {
  renderColors();
});

function renderColors(){
  $( 'article' ).each(function( ) {
    let color = getRandomColor();
    $( this ).css('background-color', color);
  });
}

function getRandomColor() {

  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

$( "#generate-colors" ).click(function( ) {
  renderColors();
});
