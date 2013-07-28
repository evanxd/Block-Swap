// Last jsLint: 7/9/13
//

Beta Merge
===

Merged the beta branch in to the master branch

Nightly v.0.3.6
===

- Redesigned the lab, removed the demo - they ended up always being the same thing anyway
- Adjusted naming conventions

Nightly v.0.3.5
===

- Added dependencies for the hover and grid effects
- Worked on adaptable image sizing (resizes any artwork you want to fit the canvas). Currently only works when the image aspect ratio matches the canvas aspect ratio
- Code cleanup

Nightly v.0.3.0
===

- Changed all methods to reference the Puzzle object itself
- Added a function that finds all possible common divisors of a number. This is used for dynamic image resizing and block building

Nightly: v.0.2.21
===

- Code sweeping including JSLint
- Cleaned up the global namespace
- Puzzle object is virtually all-inclusive

Nightly: v.0.2.2
===

- End condition created
- Hide hover effects when removing the mouse from the canvas
- Code cleanup

Nightly: v.0.2.1
===

- Included more comments
- Removed timer function - not relevant to this repo
- Adjusted naming conventions
 
Major Commit v.0.2
===

Summary: Version 0.2 addresses many issues from previous versions including identification of puzzle blocks by number, current position and start position. Certain bugs were squashed while others were created.
	
- The naming conventions of "Pieces" have been altered to "Blocks"
- Blocks are now tracked by block number, current position and true positions at X/Y coords
- A CSS based hover function has been added

Initial Commit v.0.1
===

- First methods added to Puzzle objects
- Created timer function for gameplay
- Fixed a bug where Firefox could not select pieces