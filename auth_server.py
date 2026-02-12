from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import hashlib

app = Flask(__name__)
CORS(app)

# Load credentials from config file
CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'config', 'credentials.json')

def load_credentials():
    """Load credentials from config file"""
    try:
        with open(CONFIG_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Warning: Credentials file not found at {CONFIG_PATH}")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in credentials file")
        return None

def validate_credentials(username, password):
    """Validate username and password against stored credentials"""
    creds = load_credentials()
    if not creds:
        return False
    
    for user in creds.get('users', []):
        if user['username'] == username and user['password'] == password:
            return True
    return False

def get_user_role(username):
    """Get user role from credentials"""
    creds = load_credentials()
    if not creds:
        return None
    
    for user in creds.get('users', []):
        if user['username'] == username:
            return user.get('role', 'user')
    return None

@app.route('/api/login', methods=['POST'])
def login():
    """Handle login requests"""
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username or not password:
        return jsonify({
            'success': False,
            'message': 'Username and password required'
        }), 400
    
    if validate_credentials(username, password):
        role = get_user_role(username)
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'username': username,
                'role': role
            }
        }), 200
    else:
        return jsonify({
            'success': False,
            'message': 'Invalid username or password'
        }), 401

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    """Serve static files (don't serve config directory)"""
    if path.startswith('config/') or path.startswith('api/'):
        return 'Not Found', 404
    return app.send_static_file(path)

if __name__ == '__main__':
    print("🚀 Starting Wolhwagalbi CMS Authentication Server...")
    print("📍 API available at http://localhost:5000/api/")
    print("⚠️  Make sure credentials.json is properly configured in config/")
    app.run(port=5000, debug=False)
