async function submit(){
    let _name = document.getElementById("name").value.trim();
    let _mem1 = document.getElementById("mem1").value.trim();
    let _mem2 = document.getElementById("mem2").value.trim();
    let _mem3 = document.getElementById("mem3").value.trim();
    let _mem4 = document.getElementById("mem4").value.trim();
    let _mem5 = document.getElementById("mem5").value.trim();

    fetch('http://localhost:8080/teams', {
        method: 'POST',
        body: JSON.stringify({
            name: _name,
            mem1: _mem1,
            mem2: _mem2,
            mem3: _mem3,
            mem4: _mem4,
            mem5: _mem5,
        }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
    });

    for (let i = 0; i < document.getElementsByClassName("input").length; i++) {
        document.getElementsByClassName("input")[i].value = "";
    }
}