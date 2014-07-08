var movApp = movApp || {};
movApp.key = "f6f240641ed79a1a7c59a7be318fae21";
movApp.templates = movApp.templates = {};
movApp.api = movApp.api = {};
// Handlebars template for pin info only
movApp.templates.pinSource = $("#mov-pin-template").html();
movApp.templates.pinTemplate =
  Handlebars.compile(movApp.templates.pinSource);
// Handlebars template for movie info
movApp.templates.movInfoSource = $("#mov-info-template").html();
movApp.templates.movInfoTemplate =
  Handlebars.compile(movApp.templates.movInfoSource);

// some basic api calls
movApp.api.urls = {
    // latest: "https://api.themoviedb.org/3/movie/latest",
    nowPlaying: "https://api.themoviedb.org/3/movie/now_playing",
    // upcoming: "https://api.themoviedb.org/3/movie/up_coming",
    popular: "https://api.themoviedb.org/3/movie/popular",
    topRated: "https://api.themoviedb.org/3/movie/top_rated"
  };

// Session Data
movApp.myPlaylists  = movApp.myPlaylists  || [];
movApp.curMovieType = movApp.curMovieType || movApp.api.urls.popular;
movApp.curMovArray  = movApp.curMovArray  || [];
movApp.currentMovie = movApp.currentMovie || null;

movApp.getMovies = function(movieListType){
  movApp.curMovArray = [];
  $.getJSON(movieListType,
    {api_key: movApp.key},
    function(json, textStatus) {
      movApp.curMovArray = json.results;
      movApp.setupPins(movApp.curMovArray);
      movApp.showMovieInfo(0);
  });
};

movApp.setupPins = function(movArray){
  for (var i = 0; i < movArray.length; i++) {
    movArray[i].arrayid = i;
    var $html = $(movApp.templates.pinTemplate(movArray[i]));
    $("#now-playing-movies").append($html);
  }
};

movApp.showMovieInfo = function(localID){
  var $html = $(movApp.templates.movInfoTemplate(movApp.curMovArray[localID]));
  $("#movie-info").empty();
  $("#movie-info").append($html);
};

movApp.changeData = function(movieTypeToChange){
  $("#now-playing-movies").empty();
  movApp.curMovieType = movieTypeToChange;
  movApp.getMovies(movApp.curMovieType);
};

// delegated event listener watching the pin container
$("#now-playing-movies").on("click", "#mov-button", function(){
    var arrayId = $(this).data("arrayid");
    movApp.showMovieInfo(arrayId);
});

$("#moviesSelect").change(function(){
  option = $( "select option:selected" )[0].value;
  console.log(movApp.api.urls[option]);
  if (movApp.api.urls.hasOwnProperty(option)) {
    movApp.changeData(movApp.api.urls[option]);
  } else {
    console.log("ERROR");
  }
});

movApp.changeData(movApp.api.urls.popular);
