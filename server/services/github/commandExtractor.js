/**
 * Command Extractor: Extracts build, run, and dev commands deterministically
 */

/**
 * Extracts installation and run commands based on detected languages and configurations
 * 
 * @param {object} importantFiles - Matched files map from treeScanner
 * @param {object} packageJsonData - Extracted package.json dependencies and scripts
 * @returns {object} Maps action name -> command string
 */
export function extractCommands(importantFiles, packageJsonData = {}) {
  const commands = {
    install: '',
    dev: '',
    build: '',
    test: '',
    docker: ''
  };

  const hasFile = (filename) => !!importantFiles[filename.toLowerCase()];

  // 1. Node.js Ecosystem
  if (hasFile('package.json')) {
    let packageManager = 'npm';
    if (hasFile('pnpm-lock.yaml')) {
      packageManager = 'pnpm';
    } else if (hasFile('yarn.lock')) {
      packageManager = 'yarn';
    }

    commands.install = `${packageManager} install`;

    const scripts = packageJsonData.scripts || {};
    
    if (scripts.dev) {
      commands.dev = `${packageManager} run dev`;
    } else if (scripts.start) {
      commands.dev = `${packageManager} start`;
    } else {
      commands.dev = `${packageManager} run start`;
    }

    if (scripts.build) {
      commands.build = `${packageManager} run build`;
    }
    
    if (scripts.test) {
      commands.test = `${packageManager} run test`;
    }

  // 2. Python Ecosystem
  } else if (hasFile('requirements.txt') || hasFile('pyproject.toml') || hasFile('pipfile')) {
    if (hasFile('pyproject.toml')) {
      commands.install = 'poetry install';
      commands.dev = 'poetry run python main.py';
      commands.test = 'poetry run pytest';
    } else if (hasFile('pipfile')) {
      commands.install = 'pipenv install';
      commands.dev = 'pipenv run python main.py';
      commands.test = 'pipenv run pytest';
    } else {
      commands.install = 'pip install -r requirements.txt';
      commands.dev = 'python main.py';
      commands.test = 'pytest';
    }

  // 3. Go Ecosystem
  } else if (hasFile('go.mod')) {
    commands.install = 'go mod download';
    commands.dev = 'go run main.go';
    commands.build = 'go build -o app';
    commands.test = 'go test ./...';

  // 4. Rust Ecosystem
  } else if (hasFile('cargo.toml')) {
    commands.install = 'cargo fetch';
    commands.dev = 'cargo run';
    commands.build = 'cargo build --release';
    commands.test = 'cargo test';

  // 5. PHP Ecosystem
  } else if (hasFile('composer.json')) {
    commands.install = 'composer install';
    commands.dev = 'php -S localhost:8000';
    commands.test = 'vendor/bin/phpunit';
  }

  // 6. Docker CLI helper Commands
  if (hasFile('docker-compose.yml') || hasFile('docker-compose.yaml')) {
    commands.docker = 'docker compose up --build';
  } else if (hasFile('dockerfile')) {
    commands.docker = 'docker build -t app-image . && docker run -p 8080:8080 app-image';
  }

  return commands;
}
