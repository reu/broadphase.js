# BroadPhase.js

BroadPhase.js is a small library that provides an easy and simple way to detect collisions between objects in a two dimensional system.

The name broadphase was given because usually collision detection algorithms are divided in two phases: the _broad phase_ and the _narrow phase_.

The broad phase deals with _quantity_. It doesn't precisely check complex shapes collisions, instead, it just lists all the _possible collisions_ using simplified shapes, as bounding circles, axis aligned bounding boxes, and other geometrical structures that just resembles the real shape, thus making the collision checking against high number of object way less CPU intense.

The narrow phase deals with _quality_. As you can guess, this is where the precise collision check happens. The algorithm receives all the possible collision pairs from the broad phase and use a more precise (read: more CPU intensive) algorithm to check if the shapes are in fact colliding. This phase also returns the collision manifold when a collision does occur; this data is than used to resolve the collision.

It is important to point out that if your game does not require physical accurate realism (which is probably the case for the majority of 2D games), using just the broad phase alone to check for collisions is good enough to give a great user experience.

## Algorithms

The library currently implements three broad phase collision algorithms:

1. **Brute force**: as the name implies, just "brute force" check every object against every other object within the system. Even being a very naive method, it fits really well (and even better than the other methods) if you have few objects (usually < 100) on the screen.

2. **Hash grid**: splits the screen in a grid, and then place each object in its matched cell. This way an object only needs to be checked against objects that belong to the same cell. This has a huge performance boost comparing to the brute force, given that the grid size is well tuned (bad tuned grid sizes could make this algorithm worse than brute force, given the overhead of populating the cells).

3. **Quad tree**: builds a tree like structure, spliting the screen in four quadrants on demand when the cell limit is reached. This method is usualy bad when you have many moving objects, as the tree would need to be rebuilt every frame, but can perform better than the others when the objects are most static and/or heavy grouped.
