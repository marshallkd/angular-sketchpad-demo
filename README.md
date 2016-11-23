# angular-sketchpad-demo
I wanted to practice using events and property binding in angular, so I built a small sketchpad demo.

To make it interesting, the sketchpad is composed of cells and the color of each is set in its css. The cells respond to mouse events and as each is triggered, the events are collected in the sketchpad component. If a particular stroke is clicked on, it can then be grabbed and dragged around.

On a structural level, the data for each stroke is handled separately from the view. This allows for strokes to be moved around relative to each other without interfering with the display of the other strokes.


