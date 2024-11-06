from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')  # Render the HTML template

if __name__ == '__main__':
    app.run(debug=True)