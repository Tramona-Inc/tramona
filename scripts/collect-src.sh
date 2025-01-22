#!/bin/bash

# Create output file with basic HTML structure
output_file="src-documentation.html"
echo "<!DOCTYPE html>
<html>
<head>
    <title>Source Code Documentation</title>
</head>
<body>" > $output_file

# Function to process files
process_directory() {
    local dir=$1
    
    # Find all files recursively, excluding node_modules, .next, and styles
    find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        -not -path "*/node_modules/*" \
        -not -path "*/.next/*" \
        -not -path "*/styles/*" | while read -r file; do
        
        echo "<div>$file</div>" >> $output_file
        echo "<pre><code>" >> $output_file
        cat "$file" >> $output_file
        echo "</code></pre>" >> $output_file
    done
}

# Start processing from src directory
process_directory "src"

# Close HTML tags
echo "</body></html>" >> $output_file

echo "Documentation has been written to $output_file" 