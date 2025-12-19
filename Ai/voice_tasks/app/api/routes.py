from fastapi import APIRouter, UploadFile , Form , File
from app.services.transcribe_small import transcribe_audio 
from app.services.task_evaluation import evaluate
import os
import shutil
from tempfile import NamedTemporaryFile


router = APIRouter()

@router.post("/voice_task")
async def evaluate_audio(
    audio: UploadFile = File(...),
    target: str = Form(...),
    task_type: str = Form(...)
):

    with NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        shutil.copyfileobj(audio.file, tmp)
        tmp_path = tmp.name

    try:
        transcription = transcribe_audio(tmp_path)
        result = evaluate(target, transcription, task_type)
    finally:
        os.remove(tmp_path) 
    
    return result
