#!/bin/bash
# Start Django backend server
echo "Starting Django backend server..."
cd crisp_backend
python manage.py runserver 0.0.0.0:8000