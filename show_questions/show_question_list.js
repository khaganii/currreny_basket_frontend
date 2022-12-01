
async function show_questions_by_currency(){
    let currency_select = document.getElementById("currency-select");
    let currency =  currency_select.options[currency_select.selectedIndex].value.split("_")[0];
    let nums = await fetch("http://localhost:8080/questions/" + currency);
    let numJson = await nums.json();
    let string = ``;
    document.getElementById("questions").style = "width: 40%; margin-left: 30%; border: 1px solid black";
    for (let i = 0; i < numJson.length; i++) {
        string += `<h1 style="text-align: center; color: green;">Sual ${i+1}</h1>`;
        string += `<h2 style="text-align: center;"><i>"${numJson[i].subject}"</i></h2>`;
        string += `<h3 style="font-family: arial, sans-sherif;">${numJson[i].questionText}</h3><br>`;
        string += `<span style="font-size: 20px; font-family: arial, sans-sherif;">A) ${numJson[i].answer_A}</span><br>`;
        string += `<span style="font-size: 20px; font-family: arial, sans-sherif;">B) ${numJson[i].answer_B}</span><br>`;
        string += `<span style="font-size: 20px; font-family: arial, sans-sherif;">C) ${numJson[i].answer_C}</span><br>`;
        if(numJson[i].answer_D.length > 0){ 
            string += `<span style="font-size: 20px; font-family: arial, sans-sherif;">D) ${numJson[i].answer_D}</span><br>`;   
        } 
        if(numJson[i].answer_E.length > 0){ 
            string += `<span style="font-size: 20px; font-family: arial, sans-sherif;">E) ${numJson[i].answer_E}</span><br>`;    
        } 
        string += `<hr>`;
    }
    document.getElementById("questions").innerHTML = string;
}

async function show_questions_by_subject(){
    let string = ``;

    let subject = document.getElementById("subjects");
    let _subject = subject.options[subject.selectedIndex].value;
    
    let nums = await fetch("http://localhost:8080/questions/subject/" + _subject);
    let numJson = await nums.json();

    document.getElementById("questions").style = "width: 40%; margin-left: 30%; border: 1px solid black";
    for (let i = 0; i < numJson.length; i++) {
        string += `<h1 style="text-align: center; color: green;">Sual ${i+1}</h1>`;
        string += `<h2 style="text-align: center;"><i>"${numJson[i].subject}"</i></h2>`;
        string += `<h3 style="font-family: arial, sans-sherif;">${numJson[i].questionText}</h3><br>`;
        string += `<span style="font-size: 20px; font-family: arial, sans-sherif;">A) ${numJson[i].answer_A}</span><br>`;
        string += `<span style="font-size: 20px; font-family: arial, sans-sherif;">B) ${numJson[i].answer_B}</span><br>`;
        string += `<span style="font-size: 20px; font-family: arial, sans-sherif;">C) ${numJson[i].answer_C}</span><br>`;
        if(numJson[i].answer_D.length > 0){ 
            string += `<span style="font-size: 20px; font-family: arial, sans-sherif;">D) ${numJson[i].answer_D}</span><br>`;   
        } 
        if(numJson[i].answer_E.length > 0){ 
            string += `<span style="font-size: 20px; font-family: arial, sans-sherif;">E) ${numJson[i].answer_E}</span><br>`;    
        } 

        string += `<hr>`;
    }
    document.getElementById("questions").innerHTML = string;    
}
