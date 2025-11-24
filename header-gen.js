// var foffset = "";
// try {
//     if (offset != "") {
//         console.log("Offset found!");
//         foffset = offset;
//     }
// } catch (e) {
//     console.log("No offset set.");
// } 

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        myFunction(this);
        }
    };
    xhttp.open("GET","//top-links.xml", true);
    xhttp.send();
}

function myFunction(xml) {
    console.log(xml);
    var i;
    var xmlDoc = xml.responseXML;
    var x = xmlDoc.getElementsByTagName("menuItem");
    var output = "";
    for (i = 0;i<x.length;i++) {
        var title = x[i].childNodes[1].childNodes[0].textContent;
        var link = x[i].childNodes[3].childNodes[0].textContent;
        // <td><button onclick="window.location.href = 'home.html';">Home</button></td>  
        output += "<td><button onclick=\"window.location.href = " + link + "\">" + title + "</button></td>"; 
    }
    output += "</tr>";
    document.getElementById("toptable").innerHTML = output;
    console.log(output);
}