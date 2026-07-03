from faster_whisper import WhisperModel

small: WhisperModel | None = None

def load_model():
    global small
    small = WhisperModel("small.en", device="cpu", compute_type="int8")
    