from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

class Memo(BaseModel):
    id:str
    content:str

memos = []

app = FastAPI()

@app.post("/memos")
def creat_memo(memo:Memo):
    memos.append(memo)
    return "success"

@app.get("/memos")
def read_memo():
    return memos

@app.put("/memos/{memo_id}")
def put_memo(req_memo:Memo): #rquestBody로 받기위한 형식
    for memo in memos: 
        #memos라는 상단에 만들어둔 배열을 돌면서 for문을 실행
        if memo.id==req_memo.id:
            memo.content=req_memo.content
            return 'success'
        return 'nothing'
    #기존 메모 id와 m의 Id가 같은때, 기존 M의 content를 rquest로 온 memo의 contemt로 변경하라. 성공을 반환. 만약 for문을 다 빠져나올때까지 성공 없으면 nothing 반환
            
@app.delete("/memos/{memo_id}")
def delete_memo(memo_id):
    for index, memo in enumerate(memos): #파이썬에서는 인덱스 값을 같이 빼낼 수 있음. 대신 enumerate라는 함수로 감싸줘야함
        if memo.id == memo_id:
            memos.pop(index) #memos에서 해당 Index를 pop 튕겨져 없앤다
            return {memo.id}
        return {memo.id}       
    
# 23.11.28 맨 첫번째 li에서만 edit,delete가 작동됨 ㅠ

app.mount("/", StaticFiles(directory='static', html=True), name='static')
# fastapi를 만들고 "/" 루트 경로에 우리 static파일에 있는 html을 호스팅해라