from fastapi import FastAPI

app = FastAPI(title='DOGE Creative Suite API', version='0.1.0')

@app.get('/')
def read_root():
    return {'status': 'ok', 'message': 'API is running', 'env': 'dev'}
