#!/bin/bash

echo "=== iCal Integration Files ==="

echo "
Frontend Components:"
find ./src/components -type f -exec grep -l "iCal\|ics" {} \;

echo "
API Routes:"
find ./src/server/api -type f -exec grep -l "iCal\|ics" {} \;

echo "
Database Schema:"
find ./src/server/db -type f -exec grep -l "iCal\|ics" {} \;

echo "
API Endpoints:"
find ./src/pages/api -type f -exec grep -l "iCal\|ics" {} \;

echo "
Utilities:"
find ./src/utils -type f -exec grep -l "iCal\|ics" {} \;
