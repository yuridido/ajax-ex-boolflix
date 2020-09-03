// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere
// completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API
// tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto

// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

$(document).ready(function() {
    // evento tasto ricerca
    $('header #tasto-cerca').click(function() {
        ricerca();
    });
    // evento invio nella casella input
    $('header #ricerca').keydown(function(event) {
        if (event.which == 13) {
            ricerca();
        }
    });






    // FUNZIONI
    function ricerca() {
        // salvo il contenuto della casella in una variabile
        var testoRicerca = $('header #ricerca').val()
        // controllo il caso di stringa vuota
        if (testoRicerca == "") {
            $('.container').empty();
            noResult();
        } else {
            // effettuo la chiamata ajax per i film
            $('.container').empty();
            $('header #ricerca').val("");
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
                        console.log(risposta.results.length);
                        // controllo con un if se ho risultati utili altrimenti restituisco mess
                        if (risposta.results.length != 0) {
                            insertFilm(risposta);
                        };

                    },
                    error: function() {
                        alert('errore');
                    }
                }
            );
            // effettuo la chiamata ajax per le serie
            $.ajax(
                {
                    url: 'https://api.themoviedb.org/3/search/tv',
                    method: 'GET',
                    data: {
                        api_key: '1328a497ac2df77fd8be609391d51e42',
                        language: 'it-IT',
                        query: testoRicerca,
                    },
                    success: function(risposta) {
                        console.log(risposta.results.length);
                        // controllo con un if se ho risultati utili altrimenti restituisco mess
                        if (risposta.results.length == 0) {
                            noResult();
                        } else {
                            insertSerie(risposta);
                        }

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

    function insertSerie(data) {
        for (var i = 0; i < data.results.length; i++) {
            if (data.results[i].poster_path == null) {
                var immagine = "https://images.pexels.com/photos/2262403/pexels-photo-2262403.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            } else {
                var immagine = "https://image.tmdb.org/t/p/w500/" + data.results[i].poster_path;
            };
            // creo l'oggetto con i dati della chiamata da inserire nel template

            var context = {
                titolo: data.results[i].name,
                titoloOriginale: data.results[i].original_name,
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

    function noResult() {
        return $('.container').append('<div class="no-risultato"><span>nessun risultato</span></div>');
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
            return '<img class="bandiera" src="img/en.png" alt="bandiera inglese">';
        } else if (data == "it") {
            return '<img class="bandiera" src="img/it.png" alt="bandiera inglese">';
        }   else {
            return data;
        }

    }


});
