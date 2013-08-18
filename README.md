# BroadPhase.js

BroadPhase.js is a small library that provides a easy and readable way to detect collisions in two dimensions.

The term broad phase is often used in physics engine, to describe the "first phase" of collision detections. Usually, collision detection are divided in two phases: the broad phase, and the narrow phase.

The broad phase doesn't checks precisely complex shapes, but instead, queries for possible collisions using bounding circles, axis aligned bounding boxes, and other structures that resembles the real shape, but are simpler, so the cost to test all the shapes of the system is way lower.

The narrow phase then gather all the pairs returned during the broad phase and use a more CPU intensive algorithm to precisely check if they are colliding.

It is important to mention is that for most of the common 2d games, using the broad phase alone is good enough.

## Algorithms

The library currently have three implemented methods of broad phase collision detection:

1. **Brute force**: as the name suggests, just "brute force check everything", which walks each object in the scene and checks with every other object. Of course, this is the most simple method, but it fits really well if you have few objects (usually < 100) on the screen.

2. **Hash grid**: divides the screen in a grid, so a object only needs to be checked which objects in the same cell that it is contained. This has a huge performance boost comparing to the brute force, given that the grid is well adjusted.

3. **Quad tree**: tree like structure, which divides the screen as needed. Usually has a worse performance than the hash grid (as building and querying the tree is more expensive), but can be better when the objects are heavy grouped.
