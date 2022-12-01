document.getElementById("clear").addEventListener('click', clear);
document.getElementById("finish").addEventListener('click', finish);

function load_page(){
    create_square();
    fillFields();
}

async function create_square(){
    let string = `<table style="border-collapse: collapse; border: 1px solid black;" id="table">
                    <tbody id="tbody">`;
    let currency_select = document.getElementById("currency-select");
    let currency =  currency_select.options[currency_select.selectedIndex].value.split("_")[0];
    let nums = await fetch("http://localhost:8080/questions/numbers/" + currency);
    let numJson = await nums.json();
    let counter = 0;
    for (let i = 1; i <= 4; i++) {
        string += `<tr>`;
        for (let i = 1; i <= 4; i++) {
            if(contain(JSON.stringify(numJson), counter+1))  {
                string += `<td id="td_${counter+1}" style="cursor: pointer; border: 1px solid black; font-size: 18px; width: 30px; text-align: center; background-color: lightgreen;" 
                onclick='use(${counter+1}, "${currency}", "td_${counter+1}")'>${counter+1}</td>`; 
            }
            else{
                string += `<td id="td_${counter+1}" style="cursor: default; border: 1px solid black; font-size: 18px; width: 30px; text-align: center; background-color: darkred;">${counter+1}</td>`; 
            }      
            counter++;
        }
        string += `</tr>`;
    }
    string += `</tbody></table>`;

    document.getElementById("square").innerHTML = string;
}

function contain(numJsonStr, counter){
    let numJson = JSON.parse(numJsonStr);
    let con = false;
    for (let i = 0; i < numJson.length; i++) {
        if(numJson[i] == counter) con = true;
    }
    return con;
}

async function use(i, c, td_id){
    clear();
    document.getElementById("table").style = "display: none;";
    document.getElementById(td_id).style = "cursor: default; border: 1px solid black; font-size: 18px; width: 30px; text-align: center; background-color: darkred;";
    let q = await fetch("http://localhost:8080/questions?currency=" + c + "&number=" + i);
    let qJson = await q.json();
    let string = ``;
    document.getElementById("question-area").style = "width: 90%; margin-left: 5%; text-align: left;";
    string += `<h1 style="text-align: center; color: green;">Sual ${i} (${qJson.currency} - ${qJson.point})</h1>`;
    string += `<h2 style="text-align: center;"><i>"${qJson.subject}"</i></h2>`;
    string += `<h3 style="font-family: arial, sans-sherif;">${qJson.questionText}</h3><br>`;
    string += `<span class="ans" style="font-size: 20px; font-family: arial, sans-sherif;" hidden>A) ${qJson.answer_A}</span><br>`;
    string += `<span class="ans" style="font-size: 20px; font-family: arial, sans-sherif;" hidden>B) ${qJson.answer_B}</span><br>`;
    string += `<span class="ans" style="font-size: 20px; font-family: arial, sans-sherif;" hidden>C) ${qJson.answer_C}</span><br>`;
    if(qJson.answer_D.length > 0){ 
        string += `<span class="ans" style="font-size: 20px; font-family: arial, sans-sherif;" hidden>D) ${qJson.answer_D}</span><br>`;   
    } 
    if(qJson.answer_E.length > 0){ 
        string += `<span class="ans" style="font-size: 20px; font-family: arial, sans-sherif;" hidden>E) ${qJson.answer_E}</span><br>`;    
    }   
    
    string += `<br><button id="start_timer" style="margin: 100px 40% 5px 40%;" name="button" onclick="timer()">Cavablar</button><br> `;
    document.getElementById("question-area").innerHTML = string; 

    let url = 'http://localhost:8080/questions/' + qJson.id;
    fetch(url, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
    });
}

var int;
function startTimer(duration, display) {
    var audio = new Audio('audios/timer_start.mp3');
    audio.play();
    for (let i = 0; i < document.getElementsByClassName("ans").length; i++) {
            document.getElementsByClassName("ans")[i].hidden = false;  
    }   
    var timer = duration, minutes, seconds;
    int = setInterval(function () {
        
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        --timer
        if(timer == 6){
            audio = new Audio('audios/timer_end.mp3');
            audio.play();
        }

        if(timer < 0){
            clearInterval(int);
            document.getElementById("timer_span_div").style = "background-color: rgb(116, 1, 1);";
            document.getElementById("timer").style = "color: white;";
        }
    }, 1000);
}

function timer() {
    document.getElementById("start_timer").hidden = true;
    var fiveMinutes = 60 * 1,
    display = document.querySelector('#timer');
    startTimer(fiveMinutes, display);
}

function finish(){
    let urlParams = new URLSearchParams(window.location.search);
    let game_id = urlParams.get('game_id');
    let point1 = parseInt(document.getElementById("collected1").innerHTML,10);
    let point2 = parseInt(document.getElementById("collected2").innerHTML,10);
    let _winner;
    if(point1 > point2){
        _winner = document.getElementById("team1").innerHTML;
    }
    if(point1 < point2){
        _winner = document.getElementById("team2").innerHTML;
    }
    if(point1 == point2){
        window.location.href = 'show_question.html?game_id=' + game_id + '&point1=' + point1 + '&point2=' + point2;
        return;
    }

    let url = 'http://localhost:8080/games/' + game_id;
    fetch(url, {
        method: 'PUT',
        body: JSON.stringify({
            id: game_id,
            team1Point: point1,
            team2Point: point2,
            winner: _winner
        }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
    })
    window.location.href = "..//start.html";
}

function clear(){
    clearInterval(int);
    document.getElementById("timer").innerHTML = "01:00";
    document.getElementById("timer_span_div").style = "background: none;";
    document.getElementById("timer").style = "color: black;";
}

async function fillFields(){
    let urlParams = new URLSearchParams(window.location.search);
    let game_id = urlParams.get('game_id');
    let point1 = urlParams.get('point1');
    let point2 = urlParams.get('point2');

    let game = await fetch("http://localhost:8080/games/getById/" + game_id);
    let gameJson = await game.json();
    document.getElementById("level").innerHTML = gameJson.level + " mərhələsi! (Əlavə suallar)";

    let team1 = await fetch("http://localhost:8080/teams/getByName?name=" + gameJson.team_1);
    let team1Json = await team1.json();
    document.getElementById("team1").innerHTML = gameJson.team_1;

    let team2 = await fetch("http://localhost:8080/teams/getByName?name=" + gameJson.team_2);
    let team2Json = await team2.json();
    document.getElementById("team2").innerHTML = gameJson.team_2;


    members1 = `<li class="li_innerbox2" style="font-weight: 700;">${team1Json.mem1} (Kapitan)</li><br>
            <li class="li_innerbox2">${team1Json.mem2}</li><br>
            <li class="li_innerbox2">${team1Json.mem3}</li><br>
            <li class="li_innerbox2">${team1Json.mem4}</li><br>
            <li class="li_innerbox2">${team1Json.mem5}</li>`;
    document.getElementById("memberlist_team1").innerHTML = members1;

    members2 = `<li class="li_innerbox2" style="font-weight: 700;">${team2Json.mem1} (Kapitan)</li><br>
            <li class="li_innerbox2">${team2Json.mem2}</li><br>
            <li class="li_innerbox2">${team2Json.mem3}</li><br>
            <li class="li_innerbox2">${team2Json.mem4}</li><br>
            <li class="li_innerbox2">${team2Json.mem5}</li>`;
    document.getElementById("memberlist_team2").innerHTML = members2;

    let catStringTeam1 = gameJson.categories_1.split("=");
    let catStringTeam2 = gameJson.categories_2.split("=");
    let categories_team1 = `
    <br>
    <label>${catStringTeam1[0].split("_")[2]} (${catStringTeam1[0].split("_")[0]}-${catStringTeam1[0].split("_")[1]})</label><br><br>
    <label>${catStringTeam1[1].split("_")[2]} (${catStringTeam1[1].split("_")[0]}-${catStringTeam1[1].split("_")[1]})</label><br><br>
    <label>${catStringTeam1[2].split("_")[2]} (${catStringTeam1[2].split("_")[0]}-${catStringTeam1[2].split("_")[1]})</label><br><br>`;
    document.getElementById("categoties_team1").innerHTML = categories_team1;
    document.getElementById("points_team1").innerHTML = `<br><span style="color: green; font-size: 25px; font-weight: 800;">Toplanılmış bal: <span style="color: green;" id="collected1">` + point1 + `</span>
    <br><button id="plus1" class="endButtons" onclick='calc("plus1")'>+</button>&nbsp;&nbsp;&nbsp;&nbsp;<button id="minus1" class="endButtons" onclick='calc("minus1")'>-</button><br>`;

    let categories_team2 = `
    <br>
    <label>${catStringTeam2[0].split("_")[2]} (${catStringTeam2[0].split("_")[0]}-${catStringTeam2[0].split("_")[1]})</label><br><br>
    <label>${catStringTeam2[1].split("_")[2]} (${catStringTeam2[1].split("_")[0]}-${catStringTeam2[1].split("_")[1]})</label><br><br>
    <label>${catStringTeam2[2].split("_")[2]} (${catStringTeam2[2].split("_")[0]}-${catStringTeam2[2].split("_")[1]})</label><br><br>`;
    document.getElementById("categoties_team2").innerHTML = categories_team2;
    document.getElementById("points_team2").innerHTML = `<br><span style="color: green; font-size: 25px; font-weight: 800;">Toplanılmış bal: <span style="color: green;" id="collected2">` + point1 + `</span>
    <br><button id="plus2" class="endButtons" onclick='calc("plus2")'>+</button>&nbsp;&nbsp;&nbsp;&nbsp;<button id="minus2" class="endButtons" onclick='calc("minus2")'>-</button><br>`;
}

function calc(s){   
    let urlParams = new URLSearchParams(window.location.search);
    let realpoint1 = urlParams.get('point1');
    let realpoint2 = urlParams.get('point2');
    let point1 = parseInt(document.getElementById("collected1").innerHTML,10);
    let point2 = parseInt(document.getElementById("collected2").innerHTML,10); 
    let currency_select = document.getElementById("currency-select");
    let currency =  parseInt(currency_select.options[currency_select.selectedIndex].value.split("_")[2],10);
    if(s == "plus1"){
        point1 += currency;
    }else if(s =="minus1"){
        point1 -= currency;
        if(realpoint1 > point1){
            point1 += currency;
        }
    }else if(s =="plus2"){
        point2 += currency;
    }else{
        point2 -= currency;
        if(realpoint2 > point2){
            point2 += currency;
        }
    }
    document.getElementById("collected1").innerHTML  = point1;
    document.getElementById("collected2").innerHTML  = point2;
}