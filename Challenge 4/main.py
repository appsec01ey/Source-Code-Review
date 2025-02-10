#Challenge 4 

from flask import Flask, request

app = Flask(__name__)

USERNAME = "admin"
PASSWORD = "mypassword"

@app.route('/')
def home():
    return "Welcome to the Flask App!"

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if username == USERNAME and password == PASSWORD:
        return "Login successful!"
    else:
        return "Invalid credentials!"

if __name__ == '__main__':
    app.run(debug=False)


"""
1. Here the key issue is hardcoded credentials so try to store creds in a database (password should be hashed using bcrypt or argon n stored)
2. If creds are used to relay to some other app or service then : 
  1. Store the secret in an environment variable or a restricted config file (that is not part of version control)
  2. key vaults like google secret manager or aws secret vault etc
3. Additionally we can use @limiter.limit i.e flask limiter module to add rate limit to login endpoint n prevent bruteforcing attacks.
"""
