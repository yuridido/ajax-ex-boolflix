// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere
// completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API
// tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto

$(document).ready(function() {
    $('header #tasto-cerca').click(function() {
        ricercaFilm();
    });
    $('header #ricerca').keydown(function(event) {
        if (event.which == 13) {
            ricercaFilm();
        }
    });






    // FUNZIONI
    function ricercaFilm() {
        // salvo il contenuto della casella in una variabile
        var testoRicerca = $('header #ricerca').val()
        // controllo il caso di stringa vuota
        if (testoRicerca == "") {
            $('.container').empty();
            $('.container').html('nessun risultato');
        } else {
            // effettuo la chiamata ajax con la query della variabile ricavata
            $.ajax(
                {
                    url: 'https://api.themoviedb.org/3/search/movie',
                    method: 'GET',
                    data: {
                        api_key: '1328a497ac2df77fd8be609391d51e42',
                        language: 'it-IT',
                        query: testoRicerca,
                    },
                    success: function(risposta) {
                        $('.container').empty();
                        console.log(risposta.results.length);
                        // controllo con un if se ho risultati utili altrimenti restituisco mess
                        if (risposta.results.length == 0) {
                            $('.container').text('non ci sono risultati');
                        } else {
                            insertFilm(risposta);
                        }

                        $('header #ricerca').val("");
                    },
                    error: function() {
                        alert('errore');
                    }
                }
            );

        }
    };

    function insertFilm(data) {
        for (var i = 0; i < data.results.length; i++) {
            if (data.results[i].poster_path == null) {
                var immagine = "https://images.pexels.com/photos/2262403/pexels-photo-2262403.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            } else {
                var immagine = "https://image.tmdb.org/t/p/w500/" + data.results[i].poster_path;
            };
            // creo l'oggetto con i dati della chiamata da inserire nel template
            var context = {
                titolo: data.results[i].title,
                titoloOriginale: data.results[i].original_title,
                lingua: flag(data.results[i].original_language),
                voto: stars(data.results[i].vote_average),
                img: immagine,
            }

            var source = $("#entry-template").html();
            var template = Handlebars.compile(source);
            var html = template(context);
            $('.container').append(html);
        }
    }

    function reset() {
        $('.container').empty();
        $('header #ricerca').val("");
    }

    function stars(data) {
        var stelle = "";
        var voto = Math.ceil(data / 2);
        for (var i = 0; i < 5; i++) {
            if (i < voto) {
                stelle += '<i class="fas fa-star"></i>';
            } else {
                stelle += '<i class="far fa-star"></i>';
            }
        }
        return stelle;
    }

    function flag(data) {
        if (data == "en") {
            return '<img src="img/en.png" alt="bandiera inglese">';
        } else if (data == "it") {
            return '<img src="img/it.png" alt="bandiera inglese">';
        }   else {
            return data;
        }

    }


});
