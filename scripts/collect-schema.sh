#!/bin/bash

# Create output file
output_file="schema-documentation.md"
echo "# Database Schema Documentation" > $output_file

# Function to process directory
process_directory() {
    local dir=$1
    
    # Loop through all .ts files in the directory
    for file in "$dir"/*.ts; do
        if [ -f "$file" ]; then
            echo -e "\n## File: $(basename $file)\n\`\`\`typescript" >> $output_file
            cat "$file" >> $output_file
            echo -e "\n\`\`\`" >> $output_file
        fi
    done
    
    # Process subdirectories
    for subdir in "$dir"/*/; do
        if [ -d "$subdir" ]; then
            echo -e "\n# Directory: $(basename $subdir)" >> $output_file
            process_directory "$subdir"
        fi
    done
}

# Start processing from schema directory
process_directory "src/server/db/schema"

echo "Schema documentation has been written to $output_file" 