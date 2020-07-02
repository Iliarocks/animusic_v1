from flask import Flask, render_template

app = Flask(__name__);

@app.route('/sign-up')
def get_started():
    return render_template('login.html', action='Sign up')

@app.route('/login')
def login():
    return render_template('login.html', action='Sign in')

if __name__ == '__main__':
    app.run(debug=True)
