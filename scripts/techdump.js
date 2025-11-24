function fillTable() {
    // var xml = loadDoc("scripts/page-text.xml");
    var places = ["JEC","DCC","VCC","LOW","MRC","Cogswell","West","Sage","Union"];
    var output = "<h3>Start of Generated Table</h3>";

    for (var i = 0;i<places.length;i++) {
        var temp_parsed = loadDoc("scripts/page-text.xml",places[i].substring(0,3));
        output += "<tr><td>";
        // var temp_parsed = parseXML(xml,places[i].substring(0,3));
        var temp_date = temp_parsed[1];
        var temp_data = temp_parsed[2];
        output += places[i] + "</td><td>" + temp_date + "</td><td>" + temp_data + "</td></tr>\n";
        // document.getElementById(places[i]).innerHTML = temp_data;
        // document.getElementById("d" + places[i]).innerHTML = temp_date;
    }
    output += "<h3>End of Generated Table</h3>"
    document.getElementById("infotable").innerHTML = output;
}

function loadDoc(file,desiredDest) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        parseXML(this,desiredDest);
        }
    };
    xhttp.open("GET", file, true);
    xhttp.send();
}

function retXML(xml) {
    return xml;
}

function parseXML(xml,desiredDest) {
    console.log(xml);
    var i;
    var xmlDoc = xml.responseXML;
    var x = xmlDoc.getElementsByTagName("textBlock");
    // var output = "";
    // var bold = false;
    for (i = 0;i<x.length;i++) {
        var dest = x[i].childNodes[1].childNodes[0].textContent;
        var date = x[i].childNodes[3].childNodes[0].textContent;
        var data = x[i].childNodes[5].childNodes[0].textContent;
        // if (dest == "JEC") {bold = true; output += "<b>";}
        if (dest == desiredDest) {
            return [dest,date,data];
        }
        // x[0].childNodes[1].childNodes[0] <== change the x[0] to change the textBlock, the childNodes[1] to either 1,3, or 5 for each block. Keep the last one the same.
        // output += "msg " + i + ": " + x[i].getElementsByTagName("msg")[0].childNodes[0].nodeValue + "<br>";
        // output += dest + ": (" + date + ") " + data + "<br>";
        // console.log("The child nodes of this msg is: " + x[i].getElementsByTagName("msg")[0].childNodes);
        // if (bold) {output += "</b>";bold = false;}
    }
}

function placeText(desiredDest,text) {
    document.getElementById(desiredDest).innerHTML = text;
}