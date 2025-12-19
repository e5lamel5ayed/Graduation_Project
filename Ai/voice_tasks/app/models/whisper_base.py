from faster_whisper import WhisperModel

base: WhisperModel | None = None

def load_model():
    global base
    base = WhisperModel("base.en", device="cpu", compute_type="int8")
    