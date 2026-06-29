.PHONY: install setup dev build start lint

# Install project dependencies
install:
	npm install

# Configure local development hooks
setup:
	git config core.hooksPath .githooks
	chmod +x .githooks/commit-msg

# Start local Next.js dev server
dev:
	@bash -lc '. /home/abadon45/.nvm/nvm.sh; nvm use --silent 22 >/dev/null; npm run dev'

# Production build
build:
	npm run build

# Start production server after build
start:
	npm run start

# Lint project
lint:
	npm run lint
