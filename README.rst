Quick Sorted Download for Firefox
=================================

This extension adds a "Quick Sorted Download" item to context menu for links
and media files. Clicking it saves the file to a folder which is automatically
chosen based on configurable rules. Benefits compared to ordinary "Save As" include:

* No need to go through the save dialog; file is simply saved with a single click
* Files from same host can be sorted to different folders, based on path; Save As
  remembers only one download location per host.

This extension was inspired by the excellent "Download Sort" extension that no longer works
with recent versions of Firefox. While the goal is not to replicate all of its features,
automatically sorted single-click downloads are something I still very much love to have available.

Rules
-----

A rule consists of a regular expression ("Pattern") that's matched against the object URL, and a
older name. The folder must reside inside your Downloads directory. For example, if your downloads
directory is Downloads/, and you want to save files whose URL contains the word 'example' to
Downloads/example/, you could add a rule with pattern "example" and subfolder "example/".

If the URL matches none of the rules, the file is saved to the root of your downloads directory.
