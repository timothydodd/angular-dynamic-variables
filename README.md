# Angular Dynamic Variables 🚀

A complete example demonstrating how to inject environment variables into Angular applications at **runtime** using Docker, eliminating the need to rebuild your app for different environments.

[![Angular](https://img.shields.io/badge/Angular-19-red?logo=angular)](https://angular.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

##  The Problem

Angular's default environment system bakes configuration values into JavaScript bundles during build time. This means:

- ❌ Rebuilding required for different environments
- ❌ Can't change configs after deployment  
- ❌ Makes container deployments inflexible
- ❌ Same image can't work across multiple environments

## The Solution

This project demonstrates a Docker-based approach that:

- ✅ **Runtime Configuration**: Inject variables when container starts
- ✅ **Zero Rebuilds**: Same build works across all environments
- ✅ **Docker Native**: Perfect for Kubernetes, Docker Swarm, etc.
- ✅ **Fallback Safe**: Sensible defaults if variables aren't provided
- ✅ **Dev Friendly**: No changes to your development workflow

##  How It Works

1. **Template System**: Uses `env-config.template.js` with placeholders
2. **Startup Script**: Replaces placeholders with environment variables at runtime
3. **Angular Service**: Intelligently chooses between build-time and runtime config
4. **Global Config**: Exposes configuration via `window.APP_CONFIG`

## Quick Start

### Prerequisites

- Node.js 18+
- Docker
- Angular CLI 19+

### Clone and Run

```bash
# Clone the repository
git clone https://github.com/timothydodd/angular-dynamic-variables.git
cd angular-dynamic-variables

# Navigate to the Angular app directory
cd angular-dynamic-variables

# Install dependencies
npm install

# Run in development mode
ng serve
# Visit http://localhost:4200
```

### Docker Usage

```bash
# Build the Docker image
docker build -t angular-dynamic-vars .

# Run with environment variables
docker run -p 8080:80 \
  -e API_URL="https://api.production.com" \
  -e FAV_COLOR="blue" \
  -e FAV_CATCH_PHRASE="Hello Production!" \
  angular-dynamic-vars

# Visit http://localhost:8080
```

## 📁 Project Structure

```
├── angular-dynamic-variables/           # Angular application directory
│   ├── src/
│   │   ├── app/
│   │   │   └── _services/
│   │   │       └── config.service.ts    # Configuration service
│   │   ├── environments/
│   │   │   ├── environment.ts           # Development config
│   │   │   └── environment.prod.ts      # Production config
│   │   └── env-config.js                # Runtime config file
│   ├── angular.json                     # Angular CLI configuration
│   └── package.json                     # Dependencies
├── env-config.template.js               # Template with placeholders
├── generate-env-config.sh               # Startup script
└── Dockerfile                           # Multi-stage Docker build
```

## Configuration

### Environment Variables

The following environment variables are supported:

| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | Backend API URL | `window.location.origin` |
| `FAV_COLOR` | Theme color | `'yellow'` |
| `FAV_CATCH_PHRASE` | Application tagline | `'I like producing'` |

### Adding New Variables

1. **Add to template** (`env-config.template.js`):
```javascript
myNewVar: '${MY_NEW_VAR}',
```

2. **Update startup script** (`generate-env-config.sh`):
```bash
ENV_VARS="API_URL FAV_COLOR FAV_CATCH_PHRASE MY_NEW_VAR"
```

3. **Update service** (`config.service.ts`):
```typescript
get myNewVar(): string {
  return this.config.myNewVar;
}
```

## Development vs Production

### Development Mode
- Uses `environment.ts` values
- No Docker required
- Hot reload works normally

### Production Mode  
- Uses `environment.prod.ts` as fallback
- Overrides with `window.APP_CONFIG` values
- Requires Docker for runtime variable injection

## Technical Details

### Configuration Priority

1. **Development**: `environment.ts` values
2. **Production**: `environment.prod.ts` fallbacks
3. **Runtime**: `window.APP_CONFIG` overrides (production only)

### Build Process

1. Angular builds normally with `ng build --configuration production`
2. `env-config.js` is copied to build output (not processed/minified)
3. Docker startup script replaces template placeholders
4. Generated config file overwrites the build output version

### Multi-Stage Docker Build

- **Stage 1**: Node.js container builds Angular app
- **Stage 2**: Nginx container serves static files + handles runtime config


## 🐳 Docker Compose Example

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "8080:80"
    environment:
      - API_URL=https://api.example.com
      - FAV_COLOR=green
      - FAV_CATCH_PHRASE=Docker Compose Rocks!
```


## 📝 Related Blog Post

This repository accompanies the blog post: **"Dynamic Environment Variables in Angular: A Docker-Ready Solution"**

[Read the full tutorial here →](https://robododd.com/dynamic-environment-variables-in-angular-a-docker-ready-solution/)

## 🚨 Common Issues

### Variables Not Working?

1. Check container logs: `docker logs <container-name>`
2. Verify environment variables are set correctly
3. Ensure `generate-env-config.sh` has execute permissions
4. Check `env-config.js` was generated properly in container

### Build Failures?

1. Ensure Angular CLI version compatibility
2. Check Node.js version (18+ required)
3. Verify all dependencies are installed

## 📄 License

This project is licensed under the MIT License

## ⭐ Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---



*Making Angular deployments more flexible, one container at a time!* 🚢
