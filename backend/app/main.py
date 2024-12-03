from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from starlette.requests import Request
from loguru import logger

from app.schemas.api import RealTimeAPI

app = FastAPI()

ALERT_REAL_TIME_API = 'https://www.oref.org.il/WarningMessages/alert/alerts.json'
ALERT_HISTORY_API = 'https://alerts-history.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=he&fromDate=01.01.2005&toDate=&mode=0'
# for debug change api to dummy json

class WebSocketPool(object):
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        print(self.active_connections)
        for connection in self.active_connections:
            await connection.send_text(message)

websocket_pool = WebSocketPool()

mainTemplate = Jinja2Templates(directory="../frontend")

# app.mount("/css", StaticFiles(directory="frontend/css"), name="css")
app.mount("/assets", StaticFiles(directory="../frontend/assets"), name="assets")
app.mount("/dist", StaticFiles(directory="../frontend/dist"), name="dist")

@app.get("/", response_class=HTMLResponse)
async def get_app(request: Request):
    return mainTemplate.TemplateResponse("index.html", {"request": request})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket): 
    await websocket_pool.connect(websocket)
    logger.info("Connection established")

    api = RealTimeAPI(ALERT_REAL_TIME_API)
    try:
        while True:
            data = await api.listen()
            await websocket_pool.broadcast(data)
    except WebSocketDisconnect:
        websocket_pool.disconnect(websocket)
        logger.info("Client disconnected")

@app.post("/send-message")
async def send_message(message: str):
    await websocket_pool.broadcast(message)
    return {"message": "Message sent to all connected clients"}