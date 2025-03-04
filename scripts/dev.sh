#!/bin/bash

#===========================================
# Scripts to start development environment
# Version: 1.0
#===========================================

#-------------------------------------------
# Color Configuration and Utility Functions
#-------------------------------------------

# Text formatting
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print formatted message with emoji indicators
print_message() {
    local type=$1
    local message=$2
    case $type in
        "info") echo -e "${BLUE}ℹ️  ${message}${NC}" ;;
        "success") echo -e "${GREEN}✅ ${message}${NC}" ;;
        "error") echo -e "${RED}❌ ${message}${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  ${message}${NC}" ;;
        *) echo -e "$message" ;;
    esac
}

# Print section header with clear separation
print_header() {
    echo -e "\n\n${BOLD}${BLUE}=== $1 ===${NC}\n"
}

#-------------------------------------------
# Environment Configuration
#-------------------------------------------

# Load and validate environment configuration
check_env_file() {
    print_header "Environment Check"
    if [ ! -f ".env" ]; then
        print_message "error" "Environment file not found: .env"
        exit 1
    fi
    print_message "info" "Loading environment variables..."
    set -a
    source .env
    set +a
    print_message "success" "Environment loaded successfully"
}

# Verify all required variables are set
validate_env_vars() {
    local required_vars=(
    "NODE_VERSION"
    "PROJECT_NAME"
    "DB_NAME"
    "DB_USER"
    "DB_PWD"
    "DB_PORT"
    "NUXT_PORT"
    )
    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo -e "\n"
        print_message "error" "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        echo -e "\n"
        exit 1
    fi
}

#-------------------------------------------
# Initialization
#-------------------------------------------

# Load configuration
check_env_file
validate_env_vars

#-------------------------------------------
# Functions
#-------------------------------------------

# Use the right node version
use_node_version() {
    print_header "Node Version"
    print_message "info" "Using right node version..."
    . ~/.nvm/nvm.sh
    nvm use ${NODE_VERSION}

    if [ $? -eq 0 ]; then
        print_message "success" "Node version set to ${NODE_VERSION}"
    else
        print_message "error" "Failed to set node version"
        exit 1
    fi
}

# Install local Nuxt dependencies
install_dependencies() {
    print_header "Install Dependencies"
    print_message "info" "Installing Nuxt dependencies..."
    pnpm install

    if [ $? -eq 0 ]; then
        print_message "success" "Dependencies installed successfully"
    else
        print_message "error" "Failed to install dependencies"
        exit 1
    fi
}

# Generate local Prisma client from nuxt workspace
generate_prisma_client() {
    print_header "Generate Prisma Client"
    print_message "info" "Generating Prisma client..."
    cd nuxt && pnpx prisma generate && cd ..

    if [ $? -eq 0 ]; then
        print_message "success" "Prisma client generated successfully"
    else
        print_message "error" "Failed to generate Prisma client"
        exit 1
    fi
}

# Build docker images
build_images() {
    print_header "Build Docker Images"
    print_message "info" "Building docker images..."
    docker compose -f compose.dev.yml build --no-cache

    if [ $? -eq 0 ]; then
        print_message "success" "Docker images built successfully"
    else
        print_message "error" "Failed to build docker images"
        exit 1
    fi
}

# Start docker containers
start_containers() {
    print_header "Start Docker Containers"
    print_message "info" "Starting docker containers..."
    docker compose -f compose.dev.yml up -d

    if [ $? -eq 0 ]; then
        print_message "success" "Docker containers started successfully"
    else
        print_message "error" "Failed to start docker containers"
        exit 1
    fi
}

# Main function to run all tasks
main() {
    use_node_version
    install_dependencies
    generate_prisma_client
    build_images
    start_containers

    echo -e "\n\n"
    if [ $? -eq 0 ]; then
        echo -e "${BLUE}Nuxt running on : ${BOLD}${YELLOW}http://localhost:${NUXT_PORT} ${NC}\n"
        echo -e "${BLUE}Prisma Studio running on : ${BOLD}${YELLOW}http://localhost:5555 ${NC}\n"
    else
        print_message "error" "Failed to start apps..."
        exit 1
    fi
}

#-------------------------------------------
# Main
#-------------------------------------------
main

