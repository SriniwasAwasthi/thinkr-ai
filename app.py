from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
@app.route('/index.html')
def home():
    return render_template('index.html')

@app.route('/study-plan.html')
def study_plan():
    return render_template('study-plan.html')

@app.route('/tools.html')
def tools():
    return render_template('tools.html')

if __name__ == '__main__':
    app.run(debug=True, port=3000)

