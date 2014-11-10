TRACEUR = node_modules/traceur/traceur
TRACEUR_MODULES = --modules commonjs

index.js: src/sassdoc.js
	$(TRACEUR) $(TRACEUR_MODULES) --out $@ $<
	sed -i '1a module.require("traceur");' $@
