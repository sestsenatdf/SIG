     $(document).ready(function () {
        $.ui.launch();
        Login();
        SelecionaUnidade();
         EnviarMensagem();
         //$.ui._hideFooterOnScroll =false;
         //$.ui._hideHeaderOnScroll =false;
        //$().scroller();
        //navigator.notification.vibrate(2000);
        //navigator.notification.beep(5);
        setTimeout(function () {
            try {
                StatusBar.hide();
            } catch (e) {
            }
        }, 500);
    });

    function EnviarMensagem(){
        $("#btnEnviar").click(function(e){
             e.preventDefault();
           try{
            navigator.notification.confirm("Mensagem enviada com sucesso. Voltar para menu?",function(){
                $.ui.loadContent("#menu", false, false, "fade");
            },"Sucesso","ok,cancelar");
           }catch(x){
                    alert("mensagem enviada com sucesso");
            $.ui.loadContent("#menu", false, false, "fade");
           }
        });
    }


    function SelecionaUnidade() {
        $("#slUF").change(function () {
            var uf = $("#slUF").val();
            switch (uf) {
                case "df":
                    $.ui.loadContent("#unidade", false, false, "fade", null, "Distrito Federal");
                    break;
                case "pa":
                    $.ui.loadContent("#unidade", false, false, "fade", null, "Paraná");
                    break;
                case "sp":
                    $.ui.loadContent("#unidade", false, false, "fade", null, "São Paulo");
                    break;
                default:
                    break;
            }
        });

        $(".btUnidade").click(function () {
            $.ui.loadContent("#box-unidade", false, false, "slide");

        });
    }

    function Login() {
        $("#btnLogin").click(function (e) {
            e.preventDefault();
            try {
                StatusBar.hide();
            } catch (e) {
            }
            var login = $("#txLogin").val();
            var senha = $("#txSenha").val();
            if (login == "sest" && senha == "sest")
                $.ui.loadContent("#menu", false, false, "fade");
            else
                alert("login e senha inválidos");
        });
    }