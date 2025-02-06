#Challenge 1

from flask import Flask, request, redirect, url_for
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)

def is_authenticated_user():
    # This function checks if the user is authenticated and is omitted for brevity
   pass

@app.route('/')
def home():
    if not is_authenticated_user():
        logging.info('Unauthorized access attempt.')
        return redirect(url_for('login'))

    redirect_url = request.args.get('redirect_url')
    if redirect_url:
        logging.info(f'Redirecting to: {redirect_url}')
        return redirect(redirect_url)

    return 'Welcome to the home page!'

@app.route('/login')
def login():
    # Simulated login page
    return 'Login Page - User authentication goes here.'

if __name__ == '__main__':
    app.run(debug=False)


#Solution : 
"""
1. Here in Line no. 20 we can see that redirect_url is taking a user input without parsing and sanitising it leading to OPEN Redirect i.e http://yourapp.com/?redirect_url=https://malicious-website.com
2. In order to fix the issue instead of using `redirect_url` we can use `url_for` function in flask 
3. What is url_for : 
    1. url_for is a flask function which is used to dynamically generate a url to a given endpoint 
    2. Example : 
    
        from flask import Flask, url_for

        app = Flask(__name__)       --> Initialises flask app

        @app.route('/user/<username>')   -> States that any request matching /user/username must be handled by profile function 
        def profile(username):
            return f"Profile page of {username}"

        with app.test_request_context():      ->> this is mainly used for testing n debugging i  feel 
            print(url_for('profile', username='john'))  # Output: '/user/john'


So fixed code : 

    @app.route('/')
    def home():
        if not is_authenticated_user():
            logging.info('Unauthorized access attempt.')
            return redirect(url_for('login'))

        redirect_target = request.args.get('redirect_url')

        # Ensure redirection stays within the app
        if redirect_target in ['dashboard', 'profile', 'settings']:  
            logging.info(f'Redirecting to: {redirect_target}')
            return redirect(url_for(redirect_target))  # Using url_for to prevent open redirects


"""
