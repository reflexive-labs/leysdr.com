# leysdr.com — developer + CI entrypoints. `make help` lists targets.

.DEFAULT_GOAL := help
.PHONY: help install dev build preview check fmt fmt-check verify ci clean shots release

help: ## List targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install --no-audit --no-fund

dev: ## Start the dev server
	npm run dev

build: ## Build the static site to dist/
	npm run build

preview: ## Preview the built site
	npm run preview

check: ## Type-check (astro check)
	npm run check

fmt: ## Format with prettier
	npm run fmt

fmt-check: ## Verify formatting
	npm run fmt:check

verify: check fmt-check ## Fast pre-commit checks

ci: verify build ## Full CI pipeline

shots: ## Fetch app screenshots from the pinned leysdr release
	scripts/fetch-shots.sh

release: ## Pin the app release served from /updates/ (TAG=vX.Y.Z moves it)
	node scripts/fetch-release.mjs $(TAG)

clean: ## Remove build artifacts
	rm -rf dist .astro
