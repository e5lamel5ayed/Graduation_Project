from models import whisper_base 

def transcribe_audio(fpath: str):
        model = whisper_base.base
        if model is None:
                raise RuntimeError("Whisper model not loaded")
        segments, info = model.transcribe(fpath,
                                          language="en",
                                          vad_filter=True,
                                          beam_size=5,
                                          condition_on_previous_text=False)
        text = " ".join([segment.text for segment in segments])
        return text 


