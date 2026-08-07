import difflib

def check_fuzzy_keywords(child_speech, keywords, threshold=0.7):
    missing_words = []
    for target in keywords:
        found = False

        if target in child_speech:
            found = True
        else:
            for word in child_speech:
                similarity = difflib.SequenceMatcher(None, target, word).ratio()
                if similarity >= threshold:
                    found = True
                    break
        
        if not found:
            missing_words.append(target)

    if len(missing_words) == 0:
        # return True
        return "excellent"
    else:
        # return False
        return "poor"
    
