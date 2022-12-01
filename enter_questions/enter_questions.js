
async function loadPage(){
    document.getElementById("submit").disabled = true;
    show_numbers();
}

async function show_numbers(){
    let currency_select = document.getElementById("currency-select");
    let currency =  currency_select.options[currency_select.selectedIndex].value.split("_")[0];
    let nums = await fetch("http://localhost:8080/questions/numbers/" + currency);
    let numJson = await nums.json();
    let links = ``;
    let flag;
    for (let i = 1; i <= 16; i++) { 
        flag = false;
        for (let k = 0; k < numJson.length; k++) {
            if(i == numJson[k]){
                flag = true;
            } 
        }
        if(!flag){
            links += `<span style="cursor: pointer; text-decoration: underline;" onClick="writeValue(${i})">${i}</span>&nbsp;&nbsp;`;
        }
    }
    document.getElementById("numbers").innerHTML = links;  
}

async function submit(){
    let currency_select = document.getElementById("currency-select");
    let subject = document.getElementById("subjects");
    let _number = document.getElementById("selected-number").innerHTML.trim();
    let _questionText = document.getElementById("text").value.trim();
    let _answer_A = document.getElementById("Answer__A").value.trim();
    let _answer_B = document.getElementById("Answer__B").value.trim();
    let _answer_C = document.getElementById("Answer__C").value.trim();
    let _answer_D = document.getElementById("Answer__D").value.trim();
    let _answer_E = document.getElementById("Answer__E").value.trim();
    let _currency = currency_select.options[currency_select.selectedIndex].value.split("_")[0].trim();
    let _currencyDescription = currency_select.options[currency_select.selectedIndex].value.split("_")[1].trim();
    let _subject = subject.options[subject.selectedIndex].value;
    let _point = currency_select.options[currency_select.selectedIndex].value.split("_")[2].trim();
    let _isUsed = false;

    fetch('http://localhost:8080/questions', {
        method: 'POST',
        body: JSON.stringify({
            number: _number,
            questionText: _questionText,
            answer_A: _answer_A,
            answer_B: _answer_B,
            answer_C: _answer_C,
            answer_D: _answer_D,
            answer_E: _answer_E,
            currency: _currency,
            currencyDescription: _currencyDescription,
            subject: _subject,
            point: _point,
            isUsed: _isUsed
        }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
    });
    for (let i = 0; i < document.getElementsByClassName("input").length; i++) {
        document.getElementsByClassName("input")[i].value = "";
    }
    loadPage();
      
}

function writeValue(i){
    document.getElementById("submit").disabled = false;
    document.getElementById("selected-number").innerHTML = i;
}