function loadStart(){
    fillSelects();
}

var left_check_true_count;
var right_check_true_count;
async function fillSelects(){
    let opt = await fetch("http://localhost:8080/teams/getList");
    let optJson = await opt.json();
    let string = ``;
    for (let i = 0; i < optJson.length; i++) {
        string += `<option value=${optJson[i].id}>${optJson[i].name}</option>`;     
    }
    document.getElementById("select_team1").innerHTML = string;
    document.getElementById("select_team2").innerHTML = string;
    document.getElementById("team1").innerHTML = document.getElementById("select_team1").options[document.getElementById("select_team1").selectedIndex].innerHTML;
    document.getElementById("team2").innerHTML = document.getElementById("select_team2").options[document.getElementById("select_team2").selectedIndex].innerHTML;
    document.getElementById("button_start").disabled = true;
    left_check_true_count = 0;
    right_check_true_count = 0;
}

function selectChanged(){
    document.getElementById("team1").innerHTML = document.getElementById("select_team1").options[document.getElementById("select_team1").selectedIndex].innerHTML;
    document.getElementById("level").innerHTML = document.getElementById("select_level").options[document.getElementById("select_level").selectedIndex].innerHTML;
    document.getElementById("team2").innerHTML = document.getElementById("select_team2").options[document.getElementById("select_team2").selectedIndex].innerHTML;
    
}

async function submit(){
    let _team_1 = document.getElementById("team1").innerHTML.trim();
    let _team_2 = document.getElementById("team2").innerHTML.trim();
    let _level = document.getElementById("level").innerHTML.trim();
    let _categories_1 = document.getElementById("cat-left").innerHTML;
    let _categories_2 = document.getElementById("cat-right").innerHTML;
    let _team1Point = null;
    let _team2Point = null;
    let _winner = null;
    fetch('http://localhost:8080/games', {
        method: 'POST',
        body: JSON.stringify({
            team_1: _team_1,
            team_2: _team_2,
            level: _level,
            categories_1: _categories_1,
            categories_2: _categories_2,
            team1Point: _team1Point,
            team2Point: _team2Point,
            winner: _winner
        }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .then(id =>window.location.href = "index.html?game_id=" + id);
     
}

function checkBoxChangedLeft(){
    let str1 = ``;
    let catLeft = "";
    let potensial = 0;
    let lefts = document.getElementsByClassName("input_checkbox_left");
    str1 = `<p class="left_currs" style="font-size: 25px; font-weight: 700;">Seçilmiş səbətlər (<span id="potensial1">0</span>)</p><hr>`;
    for (let i = 0; i < lefts.length; i++) {  
        if(lefts[i].checked){
            str1 += `<p class="left_currs" style="font-size: 25px; font-weight: 700;">${lefts[i].name.split("_")[0]} (${lefts[i].name.split("_")[1]})</p><hr>`;
            potensial += parseInt(lefts[i].name.split("_")[1], 10);
            catLeft += lefts[i].name + "=";
            left_check_true_count++;
        }            
    }
    catLeft = catLeft.substring(0, catLeft.length-1);
    document.getElementById("cat-left").innerHTML = catLeft;
    document.getElementById("left_div").innerHTML = "";
    document.getElementById("left_div").innerHTML = str1;
    document.getElementById("potensial1").innerHTML = potensial;
    if(left_check_true_count > 3 && right_check_true_count > 3){
        document.getElementById("button_start").disabled = false;
    }
}

function checkBoxChangedRight(){
    let str2 = ``;
    let catRight = "";
    let potensial = 0;
    let rights = document.getElementsByClassName("input_checkbox_right");
    str2 = `<p class="left_currs" style="font-size: 25px; font-weight: 700;">Seçilmiş səbətlər (<span id="potensial2">0</span>)</p><hr>`;
    for (let i = 0; i < rights.length; i++) {
        if(rights[i].checked){
            str2 += `<p class="right_currs" style="font-size: 25px; font-weight: 700;">${rights[i].name.split("_")[0]} (${rights[i].name.split("_")[1]})</p><hr>`;
            potensial += parseInt(rights[i].name.split("_")[1], 10);
            catRight += rights[i].name + "=";
            right_check_true_count++;
        }           
    }
    catRight = catRight.substring(0, catRight.length-1);
    document.getElementById("cat-right").innerHTML = catRight;
    document.getElementById("right_div").innerHTML = "";
    document.getElementById("right_div").innerHTML = str2;
    document.getElementById("potensial2").innerHTML = potensial;
    if(left_check_true_count > 3 && right_check_true_count > 3){
        document.getElementById("button_start").disabled = false;
    }
}


