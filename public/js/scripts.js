$( document ).ready( async function() {
  renderColors();
  const projects = await getProjects();
  const palettes = await getPalettes();
  populateDropdown(projects);
  populatePalettes(palettes)
});

$.cssHooks.backgroundColor = {
  get: function(elem) {
      if (elem.currentStyle)
          var bg = elem.currentStyle["background-color"];
      else if (window.getComputedStyle)
          var bg = document.defaultView.getComputedStyle(elem,
              null).getPropertyValue("background-color");
      if (bg.search("rgb") == -1)
          return bg;
      else {
          bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
          function hex(x) {
              return ("0" + parseInt(x).toString(16)).slice(-2);
          }
          return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
      }
  }
}

const renderColors = function(){
  $( '.color' ).each(function( ) {
    if ( !$( this ).hasClass('locked')){
      let color = getRandomColor();
      $( this ).css('background-color', color);
    }
  });
}

const getRandomColor = function() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const getProjects = async function() {
  const response = await fetch('/api/v1/projects');
  const projects = await response.json();
  return projects;
}

const getPalettes = async function() {
  const response = await fetch('/api/v1/palettes');
  const palettes = await response.json();
  return palettes;
}

const populateDropdown = function( projects ){
  $( projects ).each(function(i, value ) {
    const {name, id} = value;
    const projectNameFound = $(`option:contains(${name})`).text();
    if ( !projectNameFound ){
      $('.project-menu').append(`<option id=${id}>${name}</option>`)
      $('.project-list header').after(
        `<div id=${id} class="project-block ${name} ${id}">
          <button class='delete-project-button'>delete project</button>
          <h1>${name}</h1>
        </div>`
      )
    }
  });
}

const populatePalettes = function (palettes){
  
  $( palettes ).each(function(i, value ) {
    const {name, project_id, color1, color2, color3, color4, color5, id} = value;

    $( `div.project-block.${project_id} h1` ).after( 
      `<ul id='${id}' class='${name}'>
        <li class='title'>${name}</li>
        <li><div style="background-color:${color1}"></div></li>
        <li><div style="background-color:${color2}"></div></li>
        <li><div style="background-color:${color3}"></div></li>
        <li><div style="background-color:${color4}"></div></li>
        <li><div style="background-color:${color5}"></div></li>
        <li>
          <button class="delete-palette"></button>
        </li>
      </ul>` );
  })
}

$( "#generate-colors" ).click(function( ) {
  renderColors();
});

$( ".locking-icon" ).click( function( event ) {
  $( this ).closest('article').toggleClass( "locked" );
  $( this ).toggleClass( "locked" );
});

$( "#manage-projects" ).click(function() {
  if ($.trim($(this).text()) === 'show projects') {
    $(this).text('hide projects');
  } else {
    $(this).text('show projects');        
  }
  $( 'hr' ).toggle( "fast");
  $( '.project-list' ).toggle( "fast");
});

$('#save-palette').click( async function() { 
  if ( $('#palette-name').val() === ''){ return; }
  var colorList = [];
  var currentProj = $('.project-menu option:selected').text();
  var projectId = $( `.project-menu option:selected` ).attr('id');
  var paletteName = $('#palette-name').val();

  colorList.push(paletteName);
  $( '.color' ).each(function( ) {
    colorList.push( $(this).css("backgroundColor"));
  });
  var paletteId = await addPalette(colorList.reverse(), projectId);
  
  $( `h1:contains(${currentProj})` ).after( 
  `<ul id='${paletteId}'class='${paletteName}'>
    <li class='title'>${paletteName}</li>
    <li>
      <button class="delete-palette"></button>
    </li>
  </ul>` );

  $.each(colorList, function( i, value ) {
    if (value !== paletteName){
      $(`.${paletteName} li:first-child`).after(`<li><div style='background-color:${value}'></div></li>`);
    }
  });
  $('#palette-name').val('');
});

$('#create-project').click( async function() { 
  const projectName = $('#project-name').val();
  const projectNameFound = $(`option:contains(${projectName})`).text();
    if ( projectName !== projectNameFound ){
    await addProject(projectName);
    const projects = await getProjects();
    populateDropdown(projects);
    }
  $('#project-name').val('');
})

$(document).on('click', '.delete-palette', function () {
  var deleteId = $( this ).closest( `ul` ).attr('id');
  deletePalette(deleteId);
});

$(document).on('click', '.delete-project-button', function () {
  var projectId = $( this ).closest( `div.project-block` ).attr('id');
  deleteProject(projectId);
});

const addProject = async function(projectName) {
  try {
    const response = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectName
      })
    })
    const projetInfo = await response.json();
    return paletteInfo;
  } catch (err) {
    return 'That Did not work. Try adding another project later...'
  };
}

const addPalette = async function(palettes, projectId) {
  try {
    const response = await fetch('/api/v1/palettes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: palettes[5],
        color1: palettes[4],
        color2: palettes[3],
        color3: palettes[2],
        color4: palettes[1],
        color5: palettes[0],
        project_id: projectId
      })
    })
    const paletteInfo = await response.json();
    return paletteInfo;
  } catch (err) {
    return 'That Did not work. Try adding another palette later...'
  };
}

const deletePalette = async (id) => {
  try {
    const response = await fetch(`/api/v1/palettes/${id}`, {
      method: 'DELETE'
    })
    if (response.status === 204) {
      $(`ul#${id}`).remove();
    }
  } catch (err) {
    return 'Delete Failed. Try removing something else.'
  };
}

const deleteProject = async (id) => {
  try {
    const response = await fetch(`/api/v1/projects/${id}`, {
      method: 'DELETE'
    })
    if (response.status === 204) {
      $(`div.project-block.${id}`).remove();
    }
  } catch (err) {
    return 'Delete Failed. Try removing something else.'
  };
}
