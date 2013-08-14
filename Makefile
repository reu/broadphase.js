build: concatenate minify

concatenate:
	cat src/broadphase.js\
		src/brute-force.js\
		> broadphase.js

minify:
	@./node_modules/.bin/uglifyjs broadphase.js -o broadphase.min.js

.PHONY: concatenate minify build
