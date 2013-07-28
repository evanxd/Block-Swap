About Block-Swap
===

*Block-Swap* is a *JavaScript* experiment aiming to create a scalable, adaptable, cross-browser friendly puzzle script using *HTML5 Canvas*. The original concept and functionality of this script was inherited from Rhuno's Puzzle tutorial - http://goo.gl/9StLQ.

Browser Support:
===

- Firefox 21+
- Chrome 27+
- Safari 6
- Opera 12+

For browsers that do not support HTML5 tags, HTML5Shiv has been included

Usage:
===

Demo: Currently you can view the working progress of Block-Swap by viewing the index.html

Download: The most stable version is kept in the *src* folder along with nightly edits. The most current version is attached to the demo and is always kept working - bugs conditional

Bugs
===

- The block outline function needs to be reset in order to remove the original outline
- Clicking too fast on the canvas can yield an undefined mouse position
- Selection and swapping seems a bit sluggish on Mozilla compared to Webkit based browsers

To Do
===

- Make entire puzzle scalable (Any size canvas can fit any size image, scale up or down and crop as needed)
- Disable mouse effect when hovering over a block that is already in place