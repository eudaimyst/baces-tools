$buildScript = {
    # Remove dist directory if it exists
    if (Test-Path -Path .\dist) {
        Remove-Item -Path .\dist -Recurse -Force
    }

    # Create dist and dist/images directories
    New-Item -Path .\dist\images -ItemType Directory -Force

    # Copy contents of src/images to dist/images
    Copy-Item -Path .\src\images\* -Destination .\dist\images -Recurse -Force

    # Run parcel build with no cache
    parcel build --no-cache
}

# Execute the build script
& $buildScript