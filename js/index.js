var index = (function(){
    self = this;

    //Esconde el formulario que añade una nueva sesion
    formContainer = $(".form-container");
    homeContainer = $("#home");

    //Desplega el intervalo random si este es seleccionado
    random = $("#intervalRandom");
    random.click(function(){
        if (self.random.is(":checked")){
            $("#variableSeconds").show();
        } else{
            $("#variableSeconds").hide()
        }
    })

    //Abre el formulario para crear una nueva sesio
    createSession = $("#createSession");
    createSession.click(function(){
        showForm();
    })

    cancelSession = $("#cancelSession");
    cancelSession.click(function(){
        showHome();
        $("#session-form").trigger("reset");
    })

    //Añade los sujetos del formulario a una lista
    self.subjects = [];
    addSubj = $("#addSubj");
    addSubj.click(function(){
        newSubj = $("#subjects").val();
        if(newSubj != ""){
            $("#subj-container").append("<h3>" + newSubj + "</h3")
            $("#subjects").val("")
            self.subjects.push(newSubj);
        } else {
            alert("Agregue el nombre del sujeto")
        }
    })

    //Añade las categorias a una lista
    self.categories = [];
    addCat = $("#addCat");
    addCat.click(function(){
        newCat = $("#categories").val();
        if(newCat != ""){
            $("#cat-container").append("<h3>" + newCat + "</h3")
            $("#categories").val("")
            self.categories.push(newCat);
        } else {
            alert("Agregue el nombre de la categoria")
        }
    })

    //Saca los objetos del localstorage si ya estan creados
    sessionsInfo = JSON.parse(localStorage.getItem("observadorSessionsInfo"));
    if (sessionsInfo == null){
        sessionsInfo = {}
    }

    //Añade las sesiones al menu
    sessionList = $(".sessionList");
    if (sessionsInfo != null){
        Object.keys(sessionsInfo).forEach(sessionIndex => {
            sessionList.append('<li id = "' + sessionIndex + '"> <div class = "session-name">' + sessionsInfo[sessionIndex]["name"] + '</div><span class="delete-ses">x</span></li>');
            $(".sessionList li .session-name").last().on("click", (function(sessionIndex){
                return function(){
                    localStorage.setItem("actualSessionInfo", sessionIndex);
                    window.location.href -= "index.html"
                    window.location.href += "html/observation.html"
                };
            })(sessionIndex));
        });
    }

    var closebtns = document.getElementsByClassName("delete-ses");
    var i;

    for (i = 0; i < closebtns.length; i++) {
        closebtns[i].addEventListener("click", function() {
            // this.parentElement.style.display = 'none';
            // delete sessionsInfo[sessionIndex.parentElement];
            delElement = this.parentElement.id;
            delete sessionsInfo[delElement];
            localStorage.setItem("observadorSessionsInfo", JSON.stringify(sessionsInfo));
            showHome();
        });
    }

    //Orgnaiza los sujetos en un diccionario con sus respectivas categorias
    function createSubjectArray(){
        self.subjectArray = {};
        self.subjects.forEach(subject => {
            self.subjectArray[subject] = {}
            categories.forEach(category => {
                self.subjectArray[subject][category] = 0;
            });
        });
        return subjectArray;
    }
    
    delSesion = $("#borrar-sesiones");
    delSesion.click(function(){
        window.localStorage.clear();
        location.reload();
    })
    
    //Guarda toda la informacion del cuestionario en el localstorage
    function submitSession(){
        var entryname = $("#name").val();
        var entrysessionLength = $("#sessionLength").val();
        var entryintervalLengthSec = $("#intervalLengthSec").val();
        var entryintervalRandom = $("#intervalRandom").val();
        var entryvariableSeconds = $("#variableSeconds").val();
        var entrybeep = $("#beep").val();
        var entryflash = $("#flash").val();
        var subjectArray = createSubjectArray();
        if (Object.keys(subjectArray).length == 0){
            swal({
                title: "Agregue al menos un sujeto"
            });
        }else if (categories.length == 0){
            swal({
                title: "Agregue al menos una categoria"
            });
        } else if(entrysessionLength <= 0 || (entryintervalLengthSec <= 0 || (entryintervalRandom == "on" && entryvariableSeconds <= 0))){
            swal({
                title: "Agregar un numero valido"
            });
        }else if (entryname != "" && entrysessionLength != "" && (entryintervalLengthSec != "" || (entryintervalRandom == "on" && entryvariableSeconds != ""))){
            var newItem = {
                name : entryname,
                sessionLength : entrysessionLength,
                intervalLengthSec : entryintervalLengthSec,
                intervalRandom : entryintervalRandom,
                variableSeconds : entryvariableSeconds,
                beep : entrybeep,
                flash : entryflash,
                subjectArray : createSubjectArray()
            }
            sessionsInfo[Object.keys(sessionsInfo).length] = newItem;
            localStorage.setItem("observadorSessionsInfo", JSON.stringify(sessionsInfo))
            showHome();
            $("#session-form").trigger("reset");
        } else{
            swal({
                title: "Agregar todos los campos"
            });
        }
    };
    $("#submitSession").click(submitSession);
    
    //Guarda el cuestionario y muestra el menu principal
    showHome = function(){
        window.location.reload();
    }

    showForm = function(){
        formContainer.css("display", "flex");
        homeContainer.css("display", "none");
    }
})()