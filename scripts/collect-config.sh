#!/bin/bash
output_file="config-documentation.html"
echo "<!DOCTYPE html><html><head><title>Config Documentation</title></head><body>" > $output_file

find "src/config" -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/.next/*" | while read -r file; do
    echo "<div>$file</div><pre><code>" >> $output_file
    cat "$file" >> $output_file
    echo "</code></pre>" >> $output_file
done

echo "</body></html>" >> $output_file
echo "Config documentation written to $output_file" 