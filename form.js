$(document).ready(function() {
    
    $("#ziekte-expand").hide();
    $("#roken-expand").hide();
    $("#tab1").hide();
    $("#tab2").hide();

    $(".ziekte").change(function() {
        var value = $(this).val();
        if (value == "ja") {
            $( "#ziekte-expand" ).show(400);
        }
        else if (value == "nee") {
            $( "#ziekte-expand" ).hide(400);
        }
    })

    $(".roken").change(function() {
        var value = $(this).val();
        if (value == "ja") {
            $( "#roken-expand" ).show(400);
        }
        else if (value == "nee") {
            $( "#roken-expand" ).hide(400);
        }
    })

    // $(".botverlies").change(function() {
    //     var value = $(this).val();
        // if (value == "nee") {
        //     $( ".molaar-expand" ).show(400);
        // }
        // else if (value == "ja") {
        //     $( ".molaar-expand" ).hide(400);
        // }
    // })

    $("#paro-button").click(function() {
        var isFilledOut = checkIfFilledOut();
        if (isFilledOut == "correct") {
            var sentence = buildSentence();
            $("#result-sentence").html(sentence);
        }
        else {
            $("#result-sentence").html("Fout: " + isFilledOut);
        }
    })
    $("#next-tab0").click(function() {
        $("#tab0").hide();
        $("#tab1").show();
    })
    $("#next-tab1").click(function() {
        $("#tab1").hide();
        $("#tab2").show();
    })
    $("#prev-tab1").click(function() {
        $("#tab1").hide();
        $("#tab0").show();
    })
    $("#prev-tab2").click(function() {
        $("#tab2").hide();
        $("#tab1").show();
    })
      
});


function buildSentence() {
    var sentence = "Een "
    sentence = sentence.concat($("#leeftijd-input").val(), "-jarige ");

    if ($("input[name='geslacht']:checked").val() == "M") {
        sentence = sentence.concat("man ");
    }
    else if ($("input[name='geslacht']:checked").val() == "V") {
        sentence = sentence.concat("vrouw ");
    }

    sentence = sentence.concat("met ");

    sentence = sentence.concat(calculateParodont());

    sentence = sentence.concat("parodontitis stadium ");

    sentence = sentence.concat(calculateStage());

    sentence = sentence.concat(calculateProgression());

    if ($("input[name='suikerziekte']:checked").val() == "ja") {
        sentence = sentence.concat("met suikerziekte ")
    }

    if ($("#roken-expand").is(":visible")) {
        if ($("input[name='roken-expand']:checked").val() == "less") {
            sentence = sentence.concat("rookt < 10 sig/dag")
        }
        else {
            sentence = sentence.concat("rookt ≥ 10 sig/dag")
        }
    }

    console.log(sentence)
    return sentence
}

function calculateParodont() {
    if ($("input[name='botverlies']:checked").val() == "ja") {
        return "molaar/incisief "
    }
    else if ($("input[name='botverlies']:checked").val() == "nee") {
        var elements = $("#gebitselementen-input").val();
        var botverliesElements = $("#botverlies-elementen-input").val();

        if ((parseInt(botverliesElements, 10) / (parseInt(elements, 10))) < 0.3) {
            return "lokale "
        }
        else {
            return "gegeneraliseerde "
        }
    }

}

function calculateStage() {
    if (parseInt($("#verloren-input").val()) >= 5 && 
        ($("input[name='mobiliteit']:checked").val() == "ja" ||
         parseInt($("#gebitselementen-input").val()) < 20)) {
        return "IV "
    }
    else if ((parseInt($("#verloren-input").val())) >= 1) {
        return "III "
    }
    else if ($("input[name='wortellengte']:checked").val() == "less") {
        if ($("input[name='pocket']:checked").val() == "ja" ||
            $("input[name='angulair']:checked").val() == "ja" ||
            $("input[name='furcatie']:checked").val() == "ja") {
            return "III "
        }
        else {
            return "II "
        }
    }
    else if ($("input[name='mobiliteit']:checked").val() == "nee") {
        return "III "
    }
    else {
        return "II "
    }
}



function calculateProgression() {
    if ($("input[name='botverlies']:checked").val() == "ja" ||
        $("input[name='roken-expand']:checked").val() == "more" ||
        $("input[name='suikerziekte']:checked").val() == "ja") {
        return "graad C "
    }

    var percentage = parseInt($("#botverlies-percentage-input").val());
    var age = parseInt($("#leeftijd-input").val());
    var value = percentage / age;

    if (value < 0.25) {
        return "graad A "
    }
    else if (value >= 0.25 && value <= 1) {
        return "graad B "
    }
    else if (value >1) {
        return "graad C "
    }
}

// Checks whether form is correctly filled out. Returns error message or 
// "correct" if filled out correctly.
function checkIfFilledOut() {
    if (isNaN($("#leeftijd-input").val()) || $("#leeftijd-input").val() == "") {
        return "geef een getal als leeftijd op"
    }
    else if (!$("input[name='geslacht']:checked").val()) {
        return "geef een geslacht op"
    }
    else if (!$("input[name='ziekte']:checked").val()) {
        return "geef aan of persoon zeldzame ziekte/syndroom heeft"
    }
    else if ($("input[name='ziekte']:checked").val() == "ja" &&
             !$("input[name='ziekte-expand']:checked").val()) {
        return "geef aan welke zeldzame ziekte/syndroom persoon heeft"
    }
    else {
        return "correct"
    }
}