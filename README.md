# tunnelvisionweekly.github.io

The official Tunnel Vision Website

## Updating the Boxes

To update what's new in the boxes, see /resources/techdump-updates.xml. The standard format for each entry (by location) is:

```html
<textBlock>
  <dest>location</dest>
  <date>date of the most recent update</date>
  <msg>
    A message goes here!
  </msg> 
</textBlock>
```

All of the locations of known tech dumps should already be set up and each has an entry, so to update just change the date and message as appropriate.

## How it works

The XML file is retrieved and parsed using JavaScript, which is located in `/scripts/newinthebox.js`. This script is called from `newinthebox.html`, which is where the table is displayed.

## Old Files

Old files are kept for reference sake presently (April 2026). These include:

* `/resources/z-archive-techdump-updates.json` - used in the past for the actual updates that populate the table
* `/resources/page-text.xml` - the original verson of the xml file, the updated version has a name that matches the purpose of the file
