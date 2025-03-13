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

# Print a formatted message to STDOUT with appropriate emoji indicators.
#
# Globals:
#   BLUE    - Color code for informational messages.
#   GREEN   - Color code for success messages.
#   RED     - Color code for error messages.
#   YELLOW  - Color code for warning messages.
#   NC      - Reset color code.
#
# Arguments:
#   type    - A string denoting the type of message ("info", "success", "error", "warning").
#             Any other value results in the message being printed without additional formatting.
#   message - The text of the message to display.
#
# Outputs:
#   Writes the formatted message to STDOUT.
#
# Example:
#   print_message "error" "An unexpected error occurred."
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

# Prints a formatted section header to STDOUT.
#
# This function outputs a header line with extra line breaks and color formatting to clearly separate sections of the script's output.
# It uses predefined global variables for bold text, blue color, and color reset.
#
# Globals:
#   BOLD - ANSI escape sequence for bold text formatting.
#   BLUE - ANSI escape sequence for blue text formatting.
#   NC   - ANSI escape sequence to reset terminal formatting.
#
# Arguments:
#   $1 - The text to be displayed as the section header.
#
# Outputs:
#   Writes the formatted header to STDOUT.
#
# Example:
#   print_header "Setup Complete"
print_header() {
    echo -e "\n\n${BOLD}${BLUE}=== $1 ===${NC}\n"
}

#-------------------------------------------
# Environment Configuration
#-------------------------------------------

# Checks for the existence of the .env file and loads its environment variables.
#
# This function prints a header indicating the environment check, verifies that the .env file
# exists in the current directory, and exits with status 1 if it is missing. If the file is found,
# the environment variables are loaded into the shell's environment for use by subsequent commands.
#
# Globals:
#   Environment variables are exported from the .env file.
#
# Outputs:
#   Informational, success, or error messages printed to the terminal.
#
# Example:
#   check_env_file
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

# Validates that all required environment variables are set.
#
# This function checks for the presence of the following environment variables:
#   NODE_VERSION, PROJECT_NAME, DB_NAME, DB_USER, DB_PWD, DB_PORT, and NUXT_PORT.
# If any of these variables are unset or empty, it prints an error message listing the missing ones
# and exits the script with a status code of 1.
#
# Globals:
#   NODE_VERSION, PROJECT_NAME, DB_NAME, DB_USER, DB_PWD, DB_PORT, and NUXT_PORT must be defined
#   in the environment.
#
# Example:
#   # Exit with an error if any required environment variable is missing.
#   validate_env_vars
validate_env_vars() {
    local required_vars=(
    "NODE_VERSION"
    "PROJECT_NAME"
    "DB_NAME"
    "DB_USER"
    "DB_PWD"
    "DB_PORT"
    "NUXT_URL"
    "NUXT_PORT"
    "BETTER_AUTH_SECRET"
    "NUXT_MAIL_USERNAME"
    "NUXT_MAIL_PASSWORD"
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

# Sets the Node.js version for the current session using nvm.
#
# Globals:
#   NODE_VERSION - Specifies the Node.js version to be used.
#
# Outputs:
#   Prints a header and status messages indicating whether the Node.js version was set successfully.
#
# Returns:
#   Exits the script with exit code 1 if setting the Node.js version fails.
#
# Example:
#   NODE_VERSION=14.17.0
#   use_node_version
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

# Installs local Nuxt dependencies using pnpm.
#
# Description:
#   Executes "pnpm install" to install the project's Nuxt dependencies, printing a header and
#   informational messages before and after the installation. If the installation succeeds,
#   a success message is displayed; if it fails, an error message is printed and the script exits
#   with a non-zero status.
#
# Globals:
#   Uses print_header and print_message for formatted terminal output.
#
# Outputs:
#   Prints status messages to STDOUT.
#
# Example:
#   install_dependencies
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

# Generates the Prisma client from the Nuxt workspace.
#
# Description:
#   Navigates to the 'nuxt' directory and executes the Prisma client generation command using pnpx.
#   Returns to the original directory after execution. This function uses external utilities to
#   print formatted informational and error messages, and it terminates the script if the generation fails.
#
# Globals:
#   Uses 'print_header' and 'print_message' for logging output.
#
# Arguments:
#   None
#
# Outputs:
#   Prints status messages to STDOUT.
#
# Returns:
#   Exits the script with code 1 if Prisma client generation fails.
#
# Example:
#   generate_prisma_client
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

# Build Docker images for the development environment.
#
# Description:
#   Uses Docker Compose with the 'compose.dev.yml' configuration file to build
#   Docker images without cache. It prints formatted status messages indicating
#   whether the build was successful or not, and exits the script with status 1 on failure.
#
# Globals:
#   print_header - Outputs formatted section headers.
#   print_message - Outputs formatted messages for different statuses.
#
# Outputs:
#   Status messages to STDOUT indicating the progress and result of the Docker image build.
#
# Returns:
#   None. Exits the script with status 1 if the build fails.
#
# Example:
#   build_images
build_images() {
    print_header "Build Docker Images"
    print_message "info" "Building docker images..."
    docker compose -f compose.prod.yml build --no-cache

    if [ $? -eq 0 ]; then
        print_message "success" "Docker images built successfully"
    else
        print_message "error" "Failed to build docker images"
        exit 1
    fi
}

# Start Docker containers.
#
# This function prints a header and an informational message, then starts Docker containers in detached mode
# using the Docker Compose file "compose.dev.yml". If the containers start successfully, a success message is printed;
# otherwise, it prints an error message and exits the script with status code 1.
#
# Globals:
#   None
#
# Arguments:
#   None
#
# Outputs:
#   Prints formatted messages to STDOUT.
#
# Returns:
#   Exits with status code 0 on success, or terminates the script with status code 1 on failure.
#
# Example:
#   start_containers
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

# Main function orchestrating the development environment setup.
#
# Description:
#   Runs a sequence of tasks to prepare the project environment:
#     - Sets the Node.js version using nvm.
#     - Installs Nuxt.js dependencies.
#     - Generates the Prisma client.
#     - Builds Docker images.
#     - Starts Docker containers.
#
#   If all tasks complete successfully, it prints the URLs for accessing the Nuxt application and Prisma Studio.
#   If any task fails, it prints an error message and exits with status 1.
#
# Globals:
#   BLUE       - Terminal color code for blue text.
#   BOLD       - Terminal code for bold text formatting.
#   YELLOW     - Terminal color code for yellow text.
#   NC         - Terminal code to reset formatting.
#   NUXT_PORT  - Port number on which the Nuxt application is served.
#
# Outputs:
#   Displays status messages and application URLs to STDOUT.
#
# Returns:
#   Exits with status 1 if an error occurs during any of the setup tasks.
#
# Example:
#   main  # Executes the complete environment setup process.
main() {
    use_node_version
    install_dependencies
    generate_prisma_client
    build_images
    start_containers

    echo -e "\n\n"
    if [ $? -eq 0 ]; then
        echo -e "${BLUE}Nuxt running on : ${BOLD}${YELLOW}http://localhost:${NUXT_PORT} ${NC}\n"
    else
        print_message "error" "Failed to start apps..."
        exit 1
    fi
}

#-------------------------------------------
# Main
#-------------------------------------------
main

