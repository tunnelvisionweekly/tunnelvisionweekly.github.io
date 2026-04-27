# tunnelvisionweekly.github.io
The official Tunnel Vision Website

<html>
  <h1>Hello</h1>

  <h1>Updating the Boxes</h1>
  <h2>How to do it</h2>
  To update whats new in the boxes, see /resources/techdump-updates.xml. The standard format for each entry (by location) is:

	<textBlock>
		<dest>location</dest>
		<date>date of the most recent update</date>
		<msg>
			A message goes here!
     	</msg> 
	</textBlock>
  
  All of the locations of known tech dumps should already be set up and each has an entry, so to update just change the date and message as appropriate. 

  <h2>How it works</h2>
  The xml file is retrieved and parsed using javascript, which is located in /scripts/newinthebox.js. This script is called from newinthebox.html, which is where the table is displayed.

  <h2>Old Files</h2>
  Old files are kept for reference sake presently (April 2026). These include:

  * /resources/z-archive-techdump-updates.json - used in the past for the actual updates that populate the table
  * /resources/page-text.xml - the original verson of the xml file, the updated version has a name that matches the purpose of the file
</html>
