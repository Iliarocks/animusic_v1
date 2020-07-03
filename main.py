from flask import Flask, render_template

app = Flask(__name__);

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/sign-up')
def get_started():
    return render_template('login.html', action='Sign up', link='Sign in', question="Already have an account?", title1='Create', title2='account')

@app.route('/sign-in')
def login():
    return render_template('login.html', action='Sign in', link='Sign up', question="Don't have an account?", title1='Welcome', title2='back')

if __name__ == '__main__':
    app.run(debug=True)
