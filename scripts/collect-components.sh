#!/bin/bash
output_file="components-documentation.html"
echo "<!DOCTYPE html><html><head><title>Components Documentation</title></head><body>" > $output_file

find "src/components" -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/.next/*" | while read -r file; do
    echo "<div>$file</div><pre><code>" >> $output_file
    cat "$file" >> $output_file
    echo "</code></pre>" >> $output_file
done

echo "</body></html>" >> $output_file
echo "Components documentation written to $output_file" 