// var foffset = "";
// try {
// 	if (offset != "") {
// 		console.log("Offset found!");
// 		foffset = offset;
// 	}
// } catch (e) {
// 	console.log("No offset set.");
// }

// function loadDoc() {
// 	var xhttp = new XMLHttpRequest();
// 	xhttp.onreadystatechange = function () {
// 		if (this.readyState == 4 && this.status == 200) {
// 			createHeader(this);
// 		}
// 	};
// 	xhttp.open("GET", "/resources/top-links.xml", true);
// 	xhttp.send();
// }

// function createHeader(xml) {
// 	console.log(xml);
// 	var i;
// 	var xmlDoc = xml.responseXML;
// 	var x = xmlDoc.getElementsByTagName("menuItem");
// 	var output = "<tr>";
// 	for (i = 0; i < x.length; i++) {
// 		var title = x[i].childNodes[1].childNodes[0].textContent;
// 		var link = x[i].childNodes[3].childNodes[0].textContent;
// 		// <td><anchor onclick="window.location.href = 'home.html';">Home</anchor></td>  
// 		output += "<td><anchor onclick=\"window.location.href = " + link + "\">" + title + "</anchor></td>";
// 	}
// 	output += "</tr>";
// 	document.getElementById("toptable").innerHTML = output;
// 	console.log(output);
// }

async function getHeader() {
	const navlinks = document.getElementById("navlinks");
	try {
		const response = await fetch("/resources/header-links.json");
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = await response.json();
		for (let link of result) {
			let anchor = document.createElement("a");
			if (link["pathname"] == document.location.pathname) {
				anchor.classList.add("thispage");
			}
			anchor.setAttribute("href", link["pathname"]);
			anchor.appendChild(document.createTextNode(link["title"]));
			let listitem = document.createElement("li");
			listitem.appendChild(anchor);
			navlinks.appendChild(listitem);
		}
		console.log(result);
	} catch (error) {
		console.error(error.message);
	}
}