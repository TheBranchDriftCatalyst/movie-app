
define(["jquery", "app/templates"],function($, templates){

  var APIKEY = "f6f240641ed79a1a7c59a7be318fae21";
  var urls = {
          // latest: "http://api.themoviedb.org/3/movie/latest",
      nowPlaying: "http://api.themoviedb.org/3/movie/now_playing",
        upcoming: "http://api.themoviedb.org/3/movie/upcoming",
         popular: "http://api.themoviedb.org/3/movie/popular",
        topRated: "http://api.themoviedb.org/3/movie/top_rated",
      // requires a movie ID
           movie: "http://api.themoviedb.org/3/movie/",
      // just returns a list of genres
           genre: "http://api.themoviedb.org/3/genre/movie/list",

      // this will be preoccupied with information
      genres : {},
    };

  var cachedMovieList = cachedMovieList || {};

  // return a json result object of a single movie
  // and add it to the local cache or return from local cache
  // if the movie is already within it
  var getMovieByID = function(movieID, callback){
    if (cachedMovieList.hasOwnProperty(movieID)){
      console.log("Movie Returned from Local Cache");
      callback(cachedMovieList[movieID]);
    } else {
      var url = urls.movie + movieID;
      $.ajax({
        dataType: "json",
        url: url,
        data: {api_key: APIKEY},
        success: function(json){
          console.log("getMovieByID Api Request Success mvid[" + json.id + "]");
            // check to make sure the poster is there if not we do a generic poster
            if (json.poster_path === null){
              json.poster_path = "http://m.rgbimg.com/cache1nToqD/users/g/gr/greekgod/600/mlns11c.jpg";
            }else{
              temp = json.poster_path;
              json.poster_path = "";
              json.poster_path = "http://image.tmdb.org/t/p/original/" + temp;
            }
          callback(json);
          // whenever we lookup a movie's full details
          //  we add it to the movieList as well
          addMovieToSessionList(json);
        },
        error: function(error){
          console.log("Error with Ajax Request getMovieByID");
          console.log(error);
        }
      });
    }
  };
  var addMovieToSessionList = function(json){
    console.log(json.id +"- movie being added to cache");
    cachedMovieList[json.id] = json;
  };

  var constructGenreURLS = function(genreArray){
    for (var i = 0; i < genreArray.length; i++){
      urls.genres[genreArray[i].id] =  "http://api.themoviedb.org/3/genre/"+ genreArray[i].id +"/movies";
    }
    // console.log(urls);
  };

  var movieGenres = movieGenres || [];
  var getGenreList = function(callback){
    $.ajax({
      dataType: "json",
      url: urls.genre,
      data: {api_key: APIKEY},
      success: function(json){
        callback(json.genres);
        constructGenreURLS(json.genres);
        movieGenres = json.genres;
        console.log("getMovieGenres Api Request Success");
      },
      error: function(error){
        console.log("Error with Ajax Request getMovieByID");
        console.log(error);
      }
    });
  };

  return {
    // Returns an array of movie objects with basic info
    getMoviesFromApi: function(callback, callType){

      if (urls.hasOwnProperty(callType)){
        // if call type is in first layer url object
        queryURL = urls[callType];
      }else if (callType.genre !== null){
        queryURL = urls.genres[callType.genre];
      } else {
        queryURL = urls.popular;
      }

      $.ajax({
        dataType: "json",
        url: queryURL,
        data: {api_key: APIKEY, include_adult: true},
        success: function(json){
          console.log("JSON Response Success");
          callback(json.results);
        },
        error: function(error){
          console.log("ERROR");
          console.log(error);
        },
      });
    },
    getMovieByID: getMovieByID,
    urls: urls,
    getGenreList : getGenreList,
    cachedMovieList: cachedMovieList,
    movieGenres: movieGenres,
  };


});
