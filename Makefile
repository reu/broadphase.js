build: concatenate minify

concatenate:
	@cat src/broadphase.js\
		 src/brute-force.js\
		 src/hash-grid.js\
		 src/quad-tree.js\
		 > broadphase.js

	@echo "generated broadphase.js"

minify:
	@./node_modules/.bin/uglifyjs broadphase.js -o broadphase.min.js -m
	@echo "generated broadphase.min.js"

.PHONY: concatenate minify build
