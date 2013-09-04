# BroadPhase.js

BroadPhase.js is a small library that provides an easy and simple way to detect collisions in two dimensions.

The term broad phase is often used in physics engines to describe the "first phase" of collision detection, as usually, collision detection algorithms are divided in two phases: the broad phase and the narrow phase.

The broad phase is the simplest one, as it doesn't check precisely complex shapes, it just list all the _possible collisions_ using bounding circles, axis aligned bounding boxes, and other structures that resembles the real shape but are simpler, making it way less CPU intense to check lots of objects.

The narrow phase is where the precise collision check happens. It receives all the collision pairs from the broad phase and use a more precise (read, more CPU intensive) algorithm to check if the shapes are really colliding.

It is important to say that for majority of 2D games, using just the broad phase alone is good enough to give a great user experience.

## Algorithms

The library currently implements three broad phase collision algorithms:

1. **Brute force**: as the name suggests, just "brute force check everything agains everything", which means exactly that: check every object with every other object within the system. Even being a very naive method, it fits really well (and even better than the other methods) if you have few objects (usually < 100) on the screen.

2. **Hash grid**: splits the screen in a grid, and then place each object in its matched cell. This way an object only needs to be checked against objects that belong to the same cell. This has a huge performance boost comparing to the brute force, given that the grid size is well tuned (bad tuned grid sizes could make this algorithm worse than brute force, given the overhead of populating the cells).

3. **Quad tree**: builds a tree like structure, spliting the screen in four quadrants on demand when the cell limit is reached. This method is usualy bad when you have many moving objects, as the tree would need to be rebuilt every frame, but can perform better than the others when the objects are most static and/or heavy grouped.
