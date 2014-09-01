var mapOptions
var map;
var marker;
var origem;
var destino;
var markerMe;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

WebFontConfig = {
    google: { families: ['Open+Sans+Condensed:300:latin'] }
};

(function () {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();


function inicioLoading(mensagem) {
    $.ui.blockUI(0.1);
    $.ui.showMask(mensagem);
}

function fimLoading() {
    $.ui.unblockUI();
    $.ui.hideMask();
}

function showHide(obj, objToHide) {
    var el = $("#" + objToHide)[0];

    if (obj.className == "expanded") {
        obj.className = "collapsed";
    } else {
        obj.className = "expanded";
    }
    $(el).toggle();
}


var notificationCTRL = function () {
    return {
        alert: function (mensagem, callback, titulo, nomeBotao) {
            if (window.cordova) {
                navigator.notification.alert(mensagem, callback, titulo, nomeBotao);
            } else {
                console.log("não suporta notificação alert");
                alert(mensagem);
            }
            return this;
        },
        confirm: function (mensagem, callback, titulo, botoes) {
            if (window.cordova) {
                navigator.notification.confirm(mensagem, callback, titulo, botoes);
            } else {
                var r = confirm(mensagem);
                console.log(r + " - não suporta notificação confirm");
                if (r) {
                    callback(1);
                }

            }
            return this;
        },
        erroGenerico: function () {
            notificacao.alert("Ocorreu um erro ao realizar essa operação.", function () { }, "Erro", "Ok");
        }
        ,
        vibrate: function (tempo) {
            if (window.cordova)
                navigator.notification.vibrate(tempo);
            else
                console.log("não suporta notificação vibrate");
            return this;
        },
        beep: function (quantidade) {
            if (window.cordova)
                navigator.notification.beep(quantidade);
            else
                console.log("não suporta notificação beep");

            return this;
        }
    }
}

var notificacao = new notificationCTRL();


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    alert('Connection type: ' + states[networkState]);
}

String.prototype.contains = function (str, ignoreCase) {
    return (ignoreCase ? this.toUpperCase() : this)
      .indexOf(ignoreCase ? str.toUpperCase() : str) >= 0;
};

function exitApp() {
    if (navigator.app) {
        navigator.app.exitApp();
    } else if (navigator.device) {
        navigator.device.exitApp();
    } else {
        alert("Navegador não suporta");
    }
}

function carregaMapa(lat, long) {
   
    directionsDisplay = new google.maps.DirectionsRenderer();
    mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: true,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        overviewMapControl: true
    };
    map = new google.maps.Map(document.getElementById("myMap"),
        mapOptions);

    directionsDisplay.setMap(map);
    MarcarMapa(lat,long);   
}

function CalcularRota() {
    var request = {
        origin: origem,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

function MarcarMapa(lat,long) {
    destino = new google.maps.LatLng(lat, long);
    //marker = new google.maps.Marker({
    //    position: map.getCenter(),
    //    map: map,
    //    title: 'Click to zoom'
    //});

    navigator.geolocation.getCurrentPosition(function (position) {
        origem = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        //markerMe = new google.maps.Marker({
        //    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        //    map: map,
        //    title: 'Click to zoom'
        //});
        CalcularRota();
    }, function () { }, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
}

function centralizaMapa() {
    map.panTo(origem);
}

function formattedDate(date, hasTime) {
    var d = new Date(date || Date.now()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    var data = [day, month, year].join('/');
    if (hasTime == true)
        data += " " + d.toTimeString().slice(0, 8);
    return data;
}

function LimparValidacoes(seletor) {
    var $form = $("#formEmail");

    if (typeof (seletor) != "undefined")
        $form = $(seletor);
    //reset jQuery Validate's internals
    $form.validate().resetForm();

    //reset unobtrusive validation summary, if it exists
    $form.find("[data-valmsg-summary=true]")
        .removeClass("validation-summary-errors")
        .addClass("validation-summary-valid")
        .find("ul").empty();

    //reset unobtrusive field level, if it exists
    $form.find("[data-valmsg-replace]")
        .removeClass("field-validation-error")
        .addClass("field-validation-valid")
        .empty();
}