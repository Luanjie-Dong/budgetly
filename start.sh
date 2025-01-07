#start backend
echo "Starting Flask backend..."
cd backend || { echo "Backend directory not found!"; exit 1; }
export FLASK_APP=endpoint.py  
export FLASK_ENV=development  
flask run --host=0.0.0.0 --port=1000 &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
cd ../budget-web || { echo "Frontend directory not found!"; exit 1; }
npm run dev &
FRONTEND_PID=$!

# Open frontend in the default browser
sleep 5 
echo "Opening frontend in the default browser..."
if which xdg-open > /dev/null; then
  xdg-open http://localhost:3000 # Linux
elif which open > /dev/null; then
  open http://localhost:3000 # macOS
elif which start > /dev/null; then
  start http://localhost:3000 # Windows
else
  echo "Could not detect the platform to open the browser. Please open http://localhost:3000 manually."
fi

# Wait for processes to finish
echo "Both backend (PID $BACKEND_PID) and frontend (PID $FRONTEND_PID) are running."
wait $BACKEND_PID $FRONTEND_PID
