(async () => {
	const navlinks_bottom = document.getElementById("navlinks-bottom");
	try {
		const response = await fetch("/resources/footer-links.json");
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = await response.json();
		let i = result["issues"].findIndex(issue => issue["pathname"] == document.location.pathname)
		if (i != -1) {
			if (i > 0) {
				let link = result["issues"][i - 1];
				let anchor = document.createElement("a");
				anchor.setAttribute("href", link["pathname"]);
				anchor.appendChild(document.createTextNode("Previous: " + link["title"]));
				let listitem = document.createElement("li");
				listitem.appendChild(anchor);
				navlinks_bottom.appendChild(listitem);
			}
			if (i < result["issues"].length - 1) {
				let link = result["issues"][i + 1];
				let anchor = document.createElement("a");
				anchor.setAttribute("href", link["pathname"]);
				anchor.appendChild(document.createTextNode("Next: " + link["title"]));
				let listitem = document.createElement("li");
				listitem.appendChild(anchor);
				navlinks_bottom.appendChild(listitem);
			}
			if (i > 1) {
				let link = result["issues"][0];
				let anchor = document.createElement("a");
				anchor.setAttribute("href", link["pathname"]);
				anchor.appendChild(document.createTextNode("Oldest: " + link["title"]));
				let listitem = document.createElement("li");
				listitem.appendChild(anchor);
				navlinks_bottom.appendChild(listitem);
			}
			if (i < result["issues"].length - 2) {
				let link = result["issues"][result["issues"].length - 1];
				let anchor = document.createElement("a");
				anchor.setAttribute("href", link["pathname"]);
				anchor.appendChild(document.createTextNode("Newest: " + link["title"]));
				let listitem = document.createElement("li");
				listitem.appendChild(anchor);
				navlinks_bottom.appendChild(listitem);
			}
		}
		console.log(result);
	} catch (error) {
		console.error(error.message);
	}
})();