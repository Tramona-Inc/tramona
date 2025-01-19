#!/bin/bash
output_file="types-documentation.html"
echo "<!DOCTYPE html><html><head><title>Types Documentation</title></head><body>" > $output_file

find "src/types" -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/.next/*" | while read -r file; do
    echo "<div>$file</div><pre><code>" >> $output_file
    cat "$file" >> $output_file
    echo "</code></pre>" >> $output_file
done

echo "</body></html>" >> $output_file
echo "Types documentation written to $output_file" 