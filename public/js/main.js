var appSession = appSession || {};
// this will be an array of arrays
appSession.playLists = appSession.playLists || {};
appSession.curMovieInViewer = appSession.curMovieInViewer || null;
// appSession.MovieFullInfoHistory = appSession.MovieFullInfoHistory || {};

requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/vendor',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

// Start the main app logic.
require(['jquery', 'handlebars', 'app/api', 'require', "app/templates"],
function   ($,      handlebars,     api,     require,    templates) {

  var helperSetData = function(dataType){
      dataType = dataType || "popular";
      api.getMoviesFromApi(function(data){
                templates.setupPins(data);
                api.getMovieByID(data[0].id, function(data){
                                                templates.showMovieInfo(data);
                                              });
              }, dataType
      );
  };

    $(document).ready(function() {

      // delegated event listener watching the pin container
      $("#movie-pin-board").on("click", "#movie-pin", function(){
        var movieID = $(this).data("movieid");
        // need to mark this current pin

        // we need to get the full movie information
        // we will
        //     add movie to the current movie in view
        api.getMovieByID(movieID, function(data){templates.showMovieInfo(data);});
        $('html, body').animate({ scrollTop: 0 }, "medium");
      });

      $("#quickFilters").change(function(){
        var domItem = $( "#quickFilters option:selected" )[0];
        var option = domItem.value;
        templates.resetData();
        $("#filterNote").html($(domItem).text());
        helperSetData(option);
      });

      $("#genreFilter").change(function(){
        var option = $( "#genreFilter option:selected" ).data("genreid");
        var domItem = $( "#genreFilter option:selected" )[0];
        var pack = {genre : option};
        console.log(pack);
        templates.resetData();
        $("#filterNote").html($(domItem).text());
        helperSetData(pack);
      });

      $("#movie-info").on("click", ".add-to-playlist", function(){
        var curMovie = appSession.curMovieInViewer;

        var playlistName = prompt("Please enter playlist to add too: ");
        if (playlistName === null) {
          return;
        }else{
          console.log("Adding movie id[" + curMovie.id + "] to playlist [" + playlistName + "]");
          // here we need to see if the object has property playlistname
          // if it does we add the curMovie into the array
          //    else we create new array with playlist name as property/key and empty array
          if (appSession.playLists.hasOwnProperty(playlistName)){
            // not a new playlist
            appSession.playLists[playlistName].push(curMovie);
          } else {
            // new playlist
            // create new array in the playlist object
            appSession.playLists[playlistName] = [];
            appSession.playLists[playlistName].push(curMovie);
            // add new playlist filter option to dropdown menue
            var $item = $("<option value="+ playlistName+">"+playlistName+"</option>");
            $("#playlistFilter").append($item);

          }
        }
      });

      $("#playlistFilter").change(function(){
        var domItem = $( "#playlistFilter option:selected" )[0];
        var option = domItem.value;
        var movArray = appSession.playLists[option];
        console.log(movArray);
        templates.resetData();
        $("#filterNote").html($(domItem).text());
        templates.setupPins(movArray);
      });


      // populate the dom with default data
      helperSetData();
      api.getGenreList(function(data){templates.populateGenres(data);});

    });



});
