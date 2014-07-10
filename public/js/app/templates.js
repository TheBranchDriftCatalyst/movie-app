define(["jquery", "handlebars"],function($, handlebars){

  var debug = false;

  var pinSource = $("#mov-pin-template").html();
  var pinTemplate = Handlebars.compile(pinSource);

  var movInfoSource = $("#mov-info-template").html();
  var movInfoTemplate = Handlebars.compile(movInfoSource);

  var genreSource = $("#genre-template").html();
  var genreTemplate = Handlebars.compile(genreSource);

  var currentMovieArray = currentMovieArray || [];

  var setupPins = function(movArray,callback){
      currentMovieArray = movArray;
      if (debug) console.log(currentMovieArray);
      for (var i = 0; i < currentMovieArray.length; i++) {
        if (currentMovieArray[i].poster_path === null){
          console.log("using default poster path");
          currentMovieArray[i].poster_path = "http://m.rgbimg.com/cache1nToqD/users/g/gr/greekgod/600/mlns11c.jpg";
        } else {
          currentMovieArray[i].poster_path = "http://image.tmdb.org/t/p/original/" + currentMovieArray[i].poster_path;
        }
        // console.log(currentMovieArray[i].poster_path);

        var $html = $(pinTemplate(currentMovieArray[i]));
        $("#movie-pin-board").append($html);
      }
      if (callback){
        callback(currentMovieArray);
      }
    };

  var showMovieInfo = function(movieData){
    var $html = $(movInfoTemplate(movieData));
    appSession.curMovieInViewer = movieData;
    $("#movie-info").empty();
    $("#movie-info").append($html);
  };

  var resetData = function(){
    // clear the dom
    //clear the currentMovieArray
    currentMovieArray = [];
    $("#movie-pin-board").empty();
  };

  var populateGenres = function(genreList){
    for (var i = 0; i < genreList.length; i++){
      var $html = $(genreTemplate(genreList[i]));
      $("#genreFilter").append($html);
    }

  };


  return {
    setupPins : setupPins,
    showMovieInfo : showMovieInfo,
    currentMovieArray: currentMovieArray,
    resetData : resetData,
    populateGenres : populateGenres
  };

});
