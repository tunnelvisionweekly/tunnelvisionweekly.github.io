function colorByNumber(element) {
	console.log(element);
	console.log("element");
	var colors = ["transparent", "blue", "red", "green", "orange"];
	if (element.hasAttribute("style")) {
		element.removeAttribute("style");
	} else {
		element.setAttribute("style", "background-color:" + colors[parseInt(element.textContent, 10)]);
	}
}