// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  // check if both the year and genre parameters are provided
  if (year == undefined || genre == undefined) {
    // if not provided, show customized error message to avoid errors in future 
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `ERROR! Please input movie year and genre parameters in the API. eg: ?year=xyz&genre=Abc. Year range: 2010-2020. Genres: Action,Adventure,Animation,Biography,Comedy,Crime,Documentary,Drama,Family,Fantasy,History,Horror,Music,Musical,Mystery,News,Reality-TV,Romance,Sci-Fi,Sport,Talk-Show,Thriller,War,Western` // a string of data
    }
  }
  // if both the parameters are provided, filter the movies list
  else {
    // create the return value with 2 data points - no of results, movies list
    let returnValue = {
      numResults: 0,
      movies: []
    }
    // iterate through the movies database  
    for (let i=0; i < moviesFromCsv.length; i++) {
      let movie = moviesFromCsv[i] // store each movie row in memory 
      // include movie results if movie release year and genre match the inputs
      if (movie.startYear == year && movie.genres.includes(genre) == true) { 
        // exlcude movie results if genres or runtime is \NN
        if (movie.genres != `\\N` && movie.runtimeMinutes != `\\N`){
          // create an object and store details of the movie in it 
          let postObject = {
            primaryTitle: movie.primaryTitle,
            year: movie.startYear,
            genres: movie.genres
          }
          // add the object to the movies array in returnValue
          returnValue.movies.push(postObject) 
        }
      }
    }
    returnValue.numResults = returnValue.movies.length // add the no of results to returnValue
    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // convert returnValue to a string of data
    }
  }
}