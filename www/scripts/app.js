/// <reference path="appSESTSENAT.js" />
/// <reference path="Jquery/jquery-2.1.1.min.js" />
/// <reference path="Jquery/jquery.loadTemplate-1.4.4.js" />
/// <reference path="Jquery/jquery-validate.js" />
/// <reference path="../appframework-2.1.0/build/appframework.js" />
/// <reference path="../appframework-2.1.0/build/jq.appframework.min.js" />
/// <reference path="../appframework-2.1.0/build/ui/appframework.ui.js" />

/// <reference path="../appframework-2.1.0/build/af.plugins.min.js" />
/// <reference path="../appframework-2.1.0/plugins/af.slidemenu.js" />

// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var mySwiper;

$.ui.useOSThemes = false;
$.ui.autoLaunch = true;
$.ui.backButtonText = "Voltar";
$.ui.openLinksNewTab = false;
$.ui.splitview = false;
$.ui.slideSideMenu = false;


//$.feat.nativeTouchScroll = true;

if ($.os.ios || $.os.ios7 || $.os.ipad) {
    $.feat.nativeTouchScroll = true;
    $("#afui").addClass("sest-ios");
}

var urlExterno = "http://extranet.sestsenat.org.br/sig";
var urlLocalhost = "http://extranet.sestsenat.org.br/sig";
//var urlLocalhost = "http://localhost:14934";

var progresso = new Number();
var maximo = new Number();
var progresso = 0;
var maximo = 7;


function start() {
    if ((progresso + 1) < maximo) {
        progresso = progresso + 1;
        document.getElementById("pg").value = progresso;
        setTimeout("start();", 200);
    } else {
        BindEventos();
    }
}

function onLoad() {
    if (window.cordova) {
        console.log("Cordova App");
        document.addEventListener('deviceready', onDeviceReady, false);
    } else {
        console.log("App sendo executado pelo browser Desktop");
        $(document).ready(function () {
            /*urlLocalhost = prompt("Informe o dominio", urlLocalhost);*/
            onDeviceReady();
        });
    }
}

function buscarDestaque() {
    inicioLoading("Buscando destaques...");
    setTimeout(function () {
        var destaques = "";
        for (var i = 0; i < 4; i++) {
            destaques += "<div class='destaque'> " +
                "<div class='destaque-container'>" +
                    "<div class='sestPicture picture-destaque'></div>" +
                    "<p>Lorem ipsum dolor sit amet, duo minim putant option et, qui in falli persius adolescens, solet evertitur eos ei. Legere volutpat tractatos in mel, veritus nominavi mel id. In duo modus impetus neglegentur.</p>" +
                "</div> <hr />" +
                "<div class='footer-destaque'>" +
                    "<span  style='font-size: 0.9em;float: left;font-family: Open Sans Condensed, sans-serif !important;'>01/09/2014</span>" +
                    "<span class='icon-curtir'></span>" +
                    "<span class='fa-comment-o' style='font-family:fontawesome;margin-right: 5px;'></span>" +
                '</div></div>';
        }
        $("div.box-destaque").append(destaques);
        fimLoading();
    }, 2000);
}

$.ui.ready(function () {
    //$.ui.loadContent("#menuSest", false, false, "fade");
    //buscarDestaque();
    $.ui.loadContent("#destaque", false, false, "fade");
    //$.ui.blockPageScroll();
    $.ui.disableRightSideMenu();

    if ($.os.ipad || $("body").width() > 500) {
        $.ui.setRightSideMenuWidth("300");
    }

    Login();
    EnviarMensagem();
    SelecionaUnidade();

    EventosDestaque();

    EventosTeste();



    $("#mapa").on("unloadpanel", function () {
        //$.ui.enableSideMenu();
        //$.ui.enableRightSideMenu();
    });

    AdicionarValidacao();

    $("#sobre").on("unloadpanel", function () {
        LimparDados("#sobre");
        LimparValidacoes("#formEmail");
    });

    $("#mapa").on("loadpanel", function (data) {
        //$.ui.disableSplitView();
        //$.ui.disableRightSideMenu();
        //$.ui.disableLeftSideMenu();
        setTimeout(function () {
            google.maps.event.trigger(map, "resize");
            centralizaMapa();
        }, 200);
    });

    $(".tabServicos").on("click", "li", function () {
        if (!$(this).hasClass("ativo")) {
            $(".conteudoServico div").hide();
            $("#" + $(this).attr("data-for")).parent().show();
            $("#" + $(this).attr("data-for")).fadeIn("fast");
            $(".tabServicos li").removeClass("ativo");
            $(this).addClass("ativo");
            $.ui.scrollToBottom("box-unidade", "400");
        }
    });
});


function EventosDestaque() {
    //Implementa o carregamento no fim do scroller
    var myScroller = $.ui.scrollingDivs['destaque'];
    myScroller.addInfinite();

    $.bind(myScroller, "infinite-scroll", function () {
        var self = this;
        if ($("#afui_mask:visible").length == 0) {
            console.log("infinite to refresh");
            $.unbind(myScroller, "infinite-scroll-end");
            self.scrollToBottom();
            setTimeout(function () {
                //$(self.el).append("<div>This was loaded via inifinite scroll<br>More Content</div>");
                buscarDestaque();
                self.scrollToBottom();
            });
        }
        $(self.el).find("#infinite").remove();
        self.clearInfinite();
    });

    //Banner Rotativo
    mySwiper = new Swiper('.swiper-container', {
        simulateTouch: false,
        pagination: '.pagination',
        paginationClickable: true,
        shortSwipes: true,
        autoResize: true,
        resizeReInit: true,
        //touchRatio: 10,
        useCSS3Transforms: true,
        //freeModeFluid: true,
        //momentumRatio: 10,
        //onTouchEnd:function(){alert("erro")}
        //scrollContainer: true
        //freeModeFluid: true,
        //momentumRatio:2
    });

    //Resolve Bug Redimencionando
    $("#destaque").on("loadpanel", function () {
        mySwiper.resizeFix();
        $.ui.enableRightSideMenu();
        if ($("div.destaque").length == 0)
            buscarDestaque();
    });

    $("#destaque").on("unloadpanel", function () {
        $.ui.disableRightSideMenu();
    });

    //swipeLeft
    //swipeRight
    //swipeUp
    //swipeDown
    $("#destaque").on("swipeLeft swipeRight", ".destaque", function (evento,objeto) {
        console.log("swipe");
        var rotY;
        if (evento.type == "swipeLeft") {
            rotY= "-360deg";
        } else {
            rotY= "360deg";
        }
       
        var destaque = $(this);
        $(this).css3Animate({
            //x: 20,
            //y: 30,     
            origin: "50% 50%",
            scale: "1",
            //opacity: "1",
            rotateY: rotY,
            //rotateX: "360deg",
            //skewX: 50,
            time: "1000ms",
            //previous: true,          
            callback: function () {
                destaque.toggleClass("virado");
                destaque.attr("style","");
            }
        });
    });

    $("#destaque").on("click", ".destaque", function () {
        $.ui.showModal('modalDestaque',"pop");
    });
}
var divTeste;

function FecharApp() {
    notificacao.confirm("Deseja realmente fechar o aplicativo?", function (button) {
        if (button == 2)
            exitApp();
    }, "Fechar app", "não,sim");
    //exitApp();    
}

function onDeviceReady() {
    /* Handle the Cordova pause and resume events*/
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);
    if (window.cordova)
        navigator.splashscreen.hide()

    //start();
    //window.plugin.email.isServiceAvailable(function (isAvailable) {
    //    alert(isAvailable ? 'Service is available' : 'Service NOT available');
    //});

    //if (window.cordova)
    //    StatusBar.hide();
};

function onPause() {
};

function onResume() {
};

function BindEventos() {
    try {
        console.log("Bind on Device Ready");
        $.ui.launch();
    } catch (e) { alert("erro: " + e); };
}

function EnviarMensagem() {
    $("#btnEnviar").click(function (e) {
        e.preventDefault();
        if ($("#formEmail").valid()) {
            var url = (window.cordova ? urlExterno : urlLocalhost) + "/api/app/EnviarEmail";

            var request = $.ajax({
                url: url,
                type: 'GET',
                beforeSend: inicioLoading("Enviando E-Mail"),
                data: {
                    To: "rogercosta@sestsenat.org.br",
                    From: $("#emailFrom").val(),
                    Subject: $("#nomeFrom").val() + " - Fale Conosco " + formattedDate(null, true),
                    Body: $("#emailBody").val()
                },
                cache: false,
                dataType: 'json',
                success: function (data) {
                    LimparDados("#sobre");
                    fimLoading();
                    notificacao.confirm("Mensagem enviada com sucesso. Voltar para menu?", onConfirm, "Sucesso", "ok,cancelar");
                }, error: function (erro) {
                    notificacao.erroGenerico();
                }
            });
        }
        //window.plugin.email.open({
        //    to: ['rogercosta@sestsenat.org.br'],
        //    cc: ['rogr.df@gmail.com'],
        //    //bcc: ['john.doe@appplant.com', 'jane.doe@appplant.com'],
        //    subject: 'Teste',
        //    body: 'How are you? Nice greetings from Leipzig'
        //}, function () {
        //    try {
        //        notificacao.confirm("Mensagem enviada com sucesso. Voltar para menu?", onConfirm, "Sucesso", "ok,cancelar");
        //    } catch (x) {
        //        alert("mensagem enviada com sucesso");
        //        $.ui.loadContent("#menuSest", false, false, "fade");
        //    }
        //}, this);
    });
}

function onConfirm(button) {
    //alert('You selected button ' + button);
    //console.log(button);
    if (button == 1) {
        //$.ui.loadContent("#destaque", false, false, "fade");
        $.ui.loadContent("#menuSest", false, false, "fade");
    }
}

function SelecionaUnidade() {
    $("#unidades").on("unloadpanel", function () {
        //if (!$("#unidades:visible").length) {
        LimparDados("#unidades");
        $("#qntUnidade").empty();
        $("#listaUnidade").empty();
        //}
    });

    $("#slUF").change(function () {
        var uf = $("#slUF").val();
        var url = (window.cordova ? urlExterno : urlLocalhost) + "/api/unidade/PesquisarPorUf";
        listaUnidade(url, uf, function () {
            var boxHeight = ($("#unidades").height() - $("#filtroUnidade").height()) - 35;/* - 285;*/
            $("#boxLista").height(boxHeight);
            $("#boxLista").scroller().scrollToTop()

            /*Bind evento de unidade*/
            BindUnidade();
        },
        function () {
            notificacao.alert("Ocorreu um erro", function () {
                notificacao.beep(2);
                notificacao.vibrate(200);
            }, "Erro", "OK");
        });
    });
}

function listaUnidade(url, uf, callbackSucesso, callbackErro) {
    try {
        inicioLoading("Buscando Unidades");
    } catch (e) {
        alert("erro: " + e);
    }
    $.ajax({
        type: "GET",
        url: url,
        data: { 'UF': uf },
        dataType: "json",
        crossDomain: true,
        success: function (data) {
            fimLoading();
            try {
                $("#qntUnidade").html("<p>Unidades encontradas: " + data.length + "</p>");
                $("#listaUnidade").html(
                    "<ul>" +
                jQuery.map(data, function (unidade, i) {
                    //if (url.contains(urlExterno, true))
                    //    unidade.NomeAbreviado = unidade.Nome;
                    return "<li class='btUnidade' data-id=" + unidade.Id + " > <span class='unidade-tipologia'>" +
                    unidade.Tipologia + "</span> <span class='unidade-descricao'>" +
                    (unidade.NomeAbreviado.length > 30 ? unidade.NomeAbreviado.slice(0, 30) + "..." : unidade.NomeAbreviado) +
                    "</span><span class='unidade-seta icon-arrow-right icon-2x'></span></li>";
                }).join("") + "</ul>");
                callbackSucesso();
            }
            catch (e) {
                alert("erro map:" + e);
            }
        },
        error: function (data) {
            fimLoading();
            callbackErro();
        }
    });
}

function BindUnidade() {
    $("#boxLista").on("click", "li.btUnidade", function () {
        inicioLoading("Carregando informações sobre a unidade...");
        $(".tabServicos li:first").click();
        var id = $(arguments[0].currentTarget).attr("data-id");
        var url = (window.cordova ? urlExterno : urlLocalhost) + "/api/unidade/Recuperar";
        $.ajax({
            type: "GET",
            url: url,
            data: { 'id': id },
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                fimLoading();
                data.imagem = "http://www.sestsenat.org.br/PublishingImages/Unidades/" + id + ".jpg";
                $("#containerTmpl").html($("#unidadeTmpl").html());
                $("#containerUnidade").loadTemplate("#containerTmpl", data, {
                    overwriteCache: true
                });
                try {
                    carregaMapa(data.Latitude, data.Longitude);
                    carregaServicos(id);
                } catch (e) {
                    alert("erro ao carregar mapa: " + e);
                }
                $.ui.loadContent("#box-unidade", false, false, "slide");
                //if (url.contains(urlExterno, true))
                //    unidade.NomeAbreviado = unidade.Nome;
                $.ui.setTitle(data.Tipologia + " - " + data.NomeAbreviado);
            },
            error: function (data) {
                fimLoading();
            }
        });
    });

}

function carregaServicos(idUnidade) {
    $("#servicoSaude").empty();
    $("#servicoCursos").empty();
    $("#servicoLazer").empty();
    $("#servicoOdontologia").empty();
    ServicoCurso(idUnidade);
    ServicoEsporte(idUnidade);
    ServicoOdontologia(idUnidade);
    ServicoSaude(idUnidade);
    $(".conteudoServico").scroller();
}

function ServicoCurso(unidade) {
    var url = (window.cordova ? urlExterno : urlLocalhost) + "/api/servicoUnidade/cursos";
    $.ajax({
        type: "GET",
        url: url,
        data: { 'idunidade': unidade },
        dataType: "json",
        crossDomain: true,
        success: function (data) {
            var resultado = "<ul>";
            if (data.length > 0) {
                resultado += jQuery.map(data, function (val, i) {
                    return "<li data-id='" + val.Id + "'>" + val.Nome + "</li>";
                }).join("");
            } else {
                resultado += "<li>Unidade não está oferecendo cursos no momento</li>"
            }
            resultado += "</ul>";

            $("#servicoCursos").html(resultado);
        },
        error: function (data) {
            fimLoading();
        }
    });
}
function ServicoSaude(unidade) {
    var url = (window.cordova ? urlExterno : urlLocalhost) + "/api/servicoUnidade/medico";
    $.ajax({
        type: "GET",
        url: url,
        data: { 'idunidade': unidade },
        dataType: "json",
        crossDomain: true,
        success: function (data) {
            var resultado = "<ul>";
            if (data.length > 0) {
                resultado += jQuery.map(data, function (val, i) {
                    return "<li>" + val.Nome + "</li>";
                }).join("");
            } else {
                resultado += "<li>Unidade não presta serviço Médico</li>"
            }
            resultado += "</ul>";

            $("#servicoSaude").html(resultado);
        },
        error: function (data) {
            // fimLoading();
        }
    });
}
function ServicoEsporte(unidade) {
    var url = (window.cordova ? urlExterno : urlLocalhost) + "/api/servicoUnidade/esporte";
    $.ajax({
        type: "GET",
        url: url,
        data: { 'idunidade': unidade },
        dataType: "json",
        crossDomain: true,
        success: function (data) {
            var resultado = "<ul>";
            if (data.length > 0) {
                resultado += jQuery.map(data, function (val, i) {
                    return "<li>" + val.Nome + "</li>";
                }).join("");
            } else {
                resultado += "<li>Unidade não presta serviço de Esporte e Lazer</li>"
            }
            resultado += "</ul>";

            $("#servicoLazer").html(resultado);
        },
        error: function (data) {
            // fimLoading();
        }
    });
}
function ServicoOdontologia(unidade) {
    var url = (window.cordova ? urlExterno : urlLocalhost) + "/api/servicoUnidade/odontologia";
    $.ajax({
        type: "GET",
        url: url,
        data: { 'idunidade': unidade },
        dataType: "json",
        crossDomain: true,
        success: function (data) {
            var resultado = "<ul>";
            if (data.length > 0) {
                resultado += jQuery.map(data, function (val, i) {
                    return "<li>" + val.Nome + "</li>";
                }).join("");
            } else {
                resultado += "<li>Unidade não presta serviço de Odontologia</li>"
            }
            resultado += "</ul>";

            $("#servicoOdontologia").html(resultado);
        },
        error: function (data) {
            //fimLoading();
        }
    });
}

function Login() {
    $("#btnLogin").click(function (e) {
        e.preventDefault();

        var login = $("#txLogin").val();
        var senha = $("#txSenha").val();
        if (login == "sest" && senha == "sest")
            $.ui.loadContent("#menuSest", false, false, "fade");
        else
            alert("login e senha inválidos");
    });
}

function LimparDados(seletor) {
    $(seletor + " input").val("");
    $(seletor + " textarea").val("");
    /*$("#unidades select>option").removeProp("selected");*/
    $(seletor + " select>option:first").prop("selected", true);
}



function EventosTeste() {
    $("#btTesteAjax").click(function () {
        alert("clickou");
        var url = (window.cordova ? urlExterno : urlLocalhost) + "/api/unidade/PesquisarPorUf";
        listaUnidade(url, "SP");
    });

    $("#btTesteVersion").click(function () {
        notificacao.vibrate(200);
        notificacao.beep(2);
        alert(
        "Name: " + device.name + "  \n " +
        "Cordova: " + device.cordova + " \n " +
        "Plataforma: " + device.platform + " \n " +
        "System Version: " + device.version + " \n ");

    });

    $("#btTesteConnection").click(function () {
        /*checkConnection();*/
        console.log("add offline");
        document.addEventListener("offline", checkConnection, false);
        console.log("add online");
        document.addEventListener("online", checkConnection, false);
    });
}
function AdicionarValidacao() {
    $("#formEmail").validate();
    $("#emailFrom").rules("add", {
        required: true, email: true, messages: {
            required: "E-mail é Obrigatório",
            email: "Informe um e-mail válido"
        }
    });
    $("#nomeFrom").rules("add", {
        required: true, messages: {
            required: "Nome é Obrigatório",
        }
    });
    $("#emailBody").rules("add", {
        required: true, messages: {
            required: "Mensagem é Obrigatório",
        }
    });
}