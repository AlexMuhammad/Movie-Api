// $('.search-button').on('click', function () {
//     $.ajax({
//       url: "http://www.omdbapi.com/?apikey=32f25124&s=" + $('.input-keyword').val(),
//       success: (results) => {
//         const movies = results.Search;
//         let cards = "";
//         movies.forEach((m) => {
//             cards += showCardsMovie(m);
//         });
//         $(".movie-container").html(cards);
//         //ketika tombol detail di-klik
//         $(".modal-detail-button").on("click", function () {
//           $.ajax({
//               url: "http://www.omdbapi.com/?apikey=32f25124&i=" + $(this).data('imdbid'),
//               success: m => {
//                   const movieDetail = showModalDetail(m);
//                   $('.modal-body').html(movieDetail);
//               },
//               error: (e) => {
//                   console.log(e.responseText);
//               }
//           });
//         });
//       },
//       error: (e) => {
//         e.responseText;
//       },
//     });
// });

// const searchButton = document.querySelector('.search-button');

// searchButton.addEventListener('click', function () {
//     const inputKeyword = document.querySelector('.input-keyword');
//     fetch("http://www.omdbapi.com/?apikey=32f25124&s=" + inputKeyword.value)
//         .then(respone => respone.json())
//         .then(respone => {
//             const movies = respone.Search;
//             let cards = ''
//             movies.forEach(m => cards += showCardsMovie(m));
//             const movieContainer = document.querySelector('.movie-container');
//             movieContainer.innerHTML = cards;

//             const movieDetail = document.querySelectorAll('.modal-detail-button');
//             movieDetail.forEach(btn => {
//                 btn.addEventListener('click', function () {
//                     const imdbid = this.dataset.imdbid;
//                     fetch("http://www.omdbapi.com/?apikey=32f25124&i=" + imdbid)
//                         .then(respone => respone.json())
//                         .then(m => {
//                             const modalDetail = showModalDetail(m);
//                             const modalBody = document.querySelector('.modal-body');
//                             modalBody.innerHTML = modalDetail;
//                         })
//                 });
//             });
//         });
// })

const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', async function () {
    try {
        const inputKeyword = document.querySelector('.input-keyword');
        const movies = await getMovies(inputKeyword.value.toLowerCase());
        updateUI(movies);    
    }
    catch (err) {
        alert(err);
    }
});

//event binding
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('modal-detail-button')) {
        const imdbid = e.target.dataset.imdbid;
        const movieDetail = await getMovieDetail(imdbid);
        updateUIDetail(movieDetail);
    }
});

function getMovies(keyword) {
    return fetch("http://www.omdbapi.com/?apikey=32f25124&s=" + keyword)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            } return response.json();
        })
        .then(response => {
            if (!response.Response) {
                throw new Error(response.Error);
            } return response.Search;
        });
}

function updateUI(movie) {
    let cards = '';
    movie.forEach(m => cards += showCardsMovie(m));
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = cards;
}

function getMovieDetail(im) {
    return fetch("http://www.omdbapi.com/?apikey=32f25124&i=" + im)
        .then(response => response.json())
        .then(response => response);
}

function updateUIDetail(md) {
    const modalDetail = showModalDetail(md);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = modalDetail;
}


function showModalDetail(m) {
    return `<div class="container-fluid">
                <div class="row">
                    <div class="col-md-3">
                        <img src="${m.Poster}" class="img-fluid" />
                    </div>
                    <div class="col-md">
                        <ul class="list-group">
                            <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
                            <li class="list-group-item"><strong>Director : </strong>${m.Director}</li>
                            <li class="list-group-item"><strong>Actors : </strong>${m.Actors}</li>
                            <li class="list-group-item"><strong>Writer : </strong>${m.Writer}</li>
                            <li class="list-group-item"><strong>Plot : </strong><br>${m.Plot}</li>
                        </ul>
                            </div>
                        </div>
                    </div>`;
}

function showCardsMovie(m) {
    return `<div class="col-md-4 my-3">
            <div class="card">
                <img src="${m.Poster}" class="card-img-top" />
                 <div class="card-body">
                <h5 class="card-title">${m.Title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal"
                data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Details</a>
                </div>
                </div>
            </div>`;
}