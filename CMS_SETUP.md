# 🍖 Wolhwagalbi CMS Setup Guide

## Overview
This CMS system uses a secure authentication server to manage events and credentials safely.

## Security Features
- ✅ Credentials stored in protected `config/credentials.json` (not in version control)
- ✅ Server-side authentication validation
- ✅ Session management via localStorage
- ✅ Protected admin endpoints
- ✅ `.gitignore` prevents credential leaks

## Installation & Setup

### 1. Install Dependencies
```bash
pip install flask flask-cors python-dotenv
```

### 2. Configure Credentials
Edit `config/credentials.json` to set your admin credentials:
```json
{
  "users": [
    {
      "username": "admin",
      "password": "your_secure_password",
      "role": "administrator"
    }
  ],
  "settings": {
    "sessionTimeout": 3600
  }
}
```

### 3. Start the Authentication Server
In one terminal, start the Flask auth server:
```bash
python auth_server.py
```
You should see:
```
🚀 Starting Wolhwagalbi CMS Authentication Server...
📍 API available at http://localhost:5000/api/
```

### 4. Start the Web Server
In another terminal, start the HTTP server:
```bash
python -m http.server 8080
```

### 5. Access the CMS
- **Login Page**: http://localhost:8080/login.html
- **Admin Panel**: http://localhost:8080/admin.html (protected by login)

## Credentials File Structure

The `config/credentials.json` file contains:
```json
{
  "users": [
    {
      "username": "admin",
      "password": "password123",
      "role": "administrator"
    },
    {
      "username": "manager",
      "password": "manager_password",
      "role": "manager"
    }
  ],
  "settings": {
    "sessionTimeout": 3600,        // 1 hour
    "maxLoginAttempts": 5,
    "lockoutDuration": 900         // 15 minutes
  }
}
```

## API Endpoints

### POST `/api/login`
Authenticate user and get session token.

**Request:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "username": "admin",
    "role": "administrator"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

### GET `/api/health`
Check if authentication server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-11T10:30:00.000000"
}
```

## Security Best Practices

1. **Change Default Credentials**
   - Always change the default passwords in `config/credentials.json`
   - Use strong, unique passwords

2. **Keep Credentials Safe**
   - Never commit `config/credentials.json` to git
   - The `.gitignore` prevents this, but double-check

3. **Use HTTPS in Production**
   - Replace `http://localhost` with `https://yourdomain.com`
   - Install SSL certificate on production server

4. **Restrict Access**
   - Run the auth server only on localhost in development
   - In production, use proper firewall rules
   - Consider implementing 2FA

5. **Regular Updates**
   - Update credentials periodically
   - Review login logs
   - Monitor authentication attempts

## Troubleshooting

### "Connection error. Make sure auth server is running on port 5000"
- Ensure `auth_server.py` is running in a separate terminal
- Check that port 5000 is not in use: `lsof -i :5000`

### "Invalid JSON in credentials file"
- Check `config/credentials.json` syntax
- Use a JSON validator to verify format

### Sessions not persisting
- Check browser localStorage is enabled
- Clear browser cache and try again
- Check that login was successful (check browser console)

## File Structure
```
WolhwaGalbiPH2026/
├── login.html              # Login page (connects to API)
├── admin.html              # Admin panel (protected)
├── auth_server.py          # Authentication API server
├── config/
│   └── credentials.json    # ⚠️ KEEP SECRET - Not in git
├── .gitignore              # Prevents credentials upload
├── content/
│   └── events/             # Event JSON files
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── README.md               # This file
```

## Environment Variables (Optional)
You can also use a `.env` file for additional configuration:
```
AUTH_SERVER_URL=http://localhost:5000
SESSION_TIMEOUT=3600
DEBUG=false
```

Load in `auth_server.py`:
```python
from dotenv import load_dotenv
load_dotenv()
```

## License
Proprietary - Wolhwagalbi Restaurant 2026
