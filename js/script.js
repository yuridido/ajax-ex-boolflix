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
        ricerca();
    });
    $('header #ricerca').keydown(function(event) {
        if (event.which == 13) {
            ricerca();
        }
    });






    // FUNZIONI
    function ricerca() {
        // salvo il contenuto della casella in una variabile
        var testoRicerca = $('header #ricerca').val()
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
                        // svuoto la lista
                        $('.container').empty();

                        var source = $("#entry-template").html();
                        var template = Handlebars.compile(source);
                        console.log(risposta.results.length);
                        // controllo con un if se ho risultati utili altrimenti restituisco mess
                        if (risposta.results.length == 0) {
                            $('.container').text('non ci sono risultati');
                        } else {
                            for (var i = 0; i < risposta.results.length; i++) {
                                if (risposta.results[i].poster_path == null) {
                                    var immagine = "https://images.pexels.com/photos/2262403/pexels-photo-2262403.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                                } else {
                                    var immagine = "https://image.tmdb.org/t/p/w500/" + risposta.results[i].poster_path;
                                };
                                var context = {
                                    titolo: risposta.results[i].title,
                                    titoloOriginale: risposta.results[i].original_title,
                                    lingua: risposta.results[i].original_language,
                                    voto: risposta.results[i].vote_average,
                                    img: immagine,
                                }
                                var html = template(context);
                                $('.container').append(html);
                            }
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
});
