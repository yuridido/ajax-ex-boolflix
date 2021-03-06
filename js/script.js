$(document).ready(function() {
    // creazione Generi
    generaGeneri('movie');

    // evento tasto ricerca
    $('header #tasto-cerca').click(function() {
        $('#welcome').hide();
        ricerca();
    });
    // evento invio nella casella input
    $('header #ricerca').keydown(function(event) {
        if (event.which == 13 || event.keyCode == 13) {
            $('#welcome').hide();
            ricerca();
        }
    });

    // FILTRO GENERI
    $('#generi-movie').change(function() {
        var genere = $(this).val();
        if(genere != 0) {
            $('.scheda .dati-scheda').each(function() {
                if ($(this).attr('data-genre').includes(genere)) {
                    $(this).parents('.contenitore-scheda').removeClass('inactive');
                    $(this).parents('.contenitore-scheda').addClass('active');
                } else {
                    $(this).parents('.contenitore-scheda').removeClass('active');
                    $(this).parents('.contenitore-scheda').addClass('inactive');
                }
            });
        } else  {
            $('.scheda .dati-scheda').each(function() {
                $(this).parents('.contenitore-scheda').removeClass('inactive');
                $(this).parents('.contenitore-scheda').addClass('active');
            });
        }
    });



    // *****FUNZIONI*****
    function generaGeneri(tipo) {
        $.ajax(
            {
                url: 'https://api.themoviedb.org/3/genre/' + tipo + '/list',
                method: 'GET',
                data: {
                    api_key: '1328a497ac2df77fd8be609391d51e42',
                    language: 'it-IT',
                },
                success: function(data) {
                    var source = $("#generi-template").html();
                    var template = Handlebars.compile(source);
                    for (i = 0; i < data.genres.length; i++) {
                        var context = {
                            id: data.genres[i].id,
                            name: data.genres[i].name,
                        }
                        var html = template(context);
                        $('#generi-movie').append(html);
                        }
                    },
                error: function() {
                    alert('errore')
                }

            }
        );
    }

    function ricerca() {
        // salvo il contenuto della casella in una variabile
        var testoRicerca = $('header #ricerca').val()
        // controllo il caso di stringa vuota
        if (testoRicerca == "") {
            svuota();
            $('#film').empty();
            $('#serie').empty();
            noResult('Film');
            noResult('Tv');
        } else {

            // effettuo la chiamata ajax per i film
            svuota();
            var url1 = 'https://api.themoviedb.org/3/search/movie';
            var url2 = 'https://api.themoviedb.org/3/search/tv';
            chiamata(testoRicerca, url1, 'Film');
            chiamata(testoRicerca, url2, 'Tv');


        }
    };

    function chiamata(query, url, typo) {
        $.ajax(
            {
                url: url,
                method: 'GET',
                data: {
                    api_key: '1328a497ac2df77fd8be609391d51e42',
                    language: 'it-IT',
                    query: query,
                },
                success: function(risposta) {
                    // controllo con un if se ho risultati utili altrimenti restituisco mess
                    if (risposta.results.length != 0) {
                        insertResult(risposta, typo);
                    } else {
                        noResult(typo);
                    }
                },
                error: function() {
                    alert('errore');
                }
            }
        );
    };

    function insertResult(data, typo) {
        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);

        if (data.results.length > 0) {
            console.log('ok');
            if (typo == 'Film') {
                $('#film').empty();
                $('#film').append('<h2>Film</h2>');
            } else if(typo == 'Tv') {
                $('#serie').empty();
                $('#serie').append('<h2>Serie Tv</h2>');
            }
        }
        for (var i = 0; i < data.results.length; i++) {
            if (data.results[i].poster_path == null) {
                var immagine = "img/cover1.jpg"
            } else {
                var immagine = "https://image.tmdb.org/t/p/w342/" + data.results[i].poster_path;
            };
            // creo l'oggetto con i dati della chiamata da inserire nel template
            if (typo == 'Film') {
                var titolo = data.results[i].title;
                var titoloOriginale = data.results[i].original_title;
                var tipo = 'movie';
            } else if (typo == 'Tv') {
                var titolo = data.results[i].name;
                var titoloOriginale = data.results[i].original_name;
                var tipo = 'tv';
            };

            var id = data.results[i].id;
            var idGeneri = "";
            idGeneri += generId(data.results[i]);


            var context = {
                titolo: titolo,
                titoloOriginale: titoloOriginale,
                lingua: flag(data.results[i].original_language),
                voto: stars(data.results[i].vote_average),
                img: immagine,
                tipo: typo,
                overview: (data.results[i].overview).substring(0, 220) + "[...]",
                id: id,
                genre: idGeneri,
            }

            var html = template(context);
            $('.container-'+ typo).append(html);
            cercaDettagli(id, tipo);
        }
    };


    function cercaDettagli(id, tipo) {
        var url = 'https://api.themoviedb.org/3/'+ tipo + '/' + id;
        $.ajax(
            {
                url: url,
                method: 'GET',
                data: {
                    api_key: '1328a497ac2df77fd8be609391d51e42',
                    language: 'it-IT',
                    append_to_response: 'credits',
                },
                success: function(risposta) {
                    var generi = risposta.genres;
                    var attori = risposta.credits.cast;
                    stampaDettagli(id, generi, attori)
                },
                error: function() {
                    alert('errore');
                }
            }
        );

    };

    function stampaDettagli(id, generi, attori) {
        // stampo gli Attori
        var listaAttori = "";
        for (i = 0; i < attori.length & i < 5; i++) {
            listaAttori += attori[i].name;
            if (i < 4) {
                listaAttori += ", "
            }
        }
        // stampo i Generi
        var listaGeneri = "";
        for (i = 0; i < generi.length; i++) {
            listaGeneri += generi[i].name;
            if (i < generi.length - 1) {
                listaGeneri += ", ";
            }
        }
        // appendo
        var source = $("#dettagli-template").html();
        var template = Handlebars.compile(source);
        var context = {
            attori: listaAttori,
            generi: listaGeneri,
        }
        var html = template(context);
        $('[data-id='+ id +']').append(html);
    }

    function generId(data) {
        var listaIdGen = "";
        for (i = 0; i < data.genre_ids.length; i++) {
            listaIdGen += data.genre_ids[i];
            if (i < data.genre_ids.length - 1) {
                listaIdGen += ", ";
            }
        }
        return listaIdGen;
    }



    function noResult(typo) {
        if(typo == 'movie') {
            return $('.container-'+typo).append('<div class="no-risultato"><span>nessun film trovato</span></div>');
        } else {
            return $('.container-'+typo).append('<div class="no-risultato"><span>nessuna serie tv trovata</span></div>');

        }
    };

    // funzione che restituisce le icone stella
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
    };

    // funzione per la bandierina
    function flag(lingua) {
        var bandiere = ['en', 'it'];
        if (bandiere.includes(lingua)) {
            return '<img class="bandiera" src="img/'+lingua+'.png" alt="">';
        } else {
            return lingua;
        };
    };

    // funzione per svuotare i container
    function svuota() {
        $('.container-Film').empty();
        $('.container-Tv').empty();
        $('header #ricerca').val("");
    };





});
