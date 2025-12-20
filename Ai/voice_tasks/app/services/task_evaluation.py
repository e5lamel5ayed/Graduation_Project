from utils.fuzzy_evaluation import check_fuzzy_keywords
from utils.shadowing_evaluation import sequance_matching_score
from utils.text_preprocessing import text_preprocessing

def evaluate(target_text: str, transcription_text: str, task_type: str):
    target_tokens = text_preprocessing(target_text)
    transcription_tokens = text_preprocessing(transcription_text)
    if task_type == "shadowing":

        score, report = sequance_matching_score(target_tokens, transcription_tokens)
        score_status = score_status_encoded(score)
        result = {"score_status": score_status
                  ,"word_status": report
                  }
        # for k, v in report.items():
        #       result[f"{k})"] = v

    elif task_type == "question":

        score_status = check_fuzzy_keywords(transcription_tokens, target_tokens)
        result = {
        "score_status": score_status
        }

    return result


def score_status_encoded(score):
    if score >= 90:
        return "excellent"
    elif score >= 70:
        return "good"
    elif score < 70:
        return "poor"