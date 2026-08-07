import difflib
from itertools import zip_longest


def sequance_matching_score(target_tokens, transcription_tokens):

    matcher = difflib.SequenceMatcher(None, target_tokens, transcription_tokens)
    
    report = []
    #report = {}
    correct_words_count = 0
    total_teacher_words = len(target_tokens)

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        
        if tag == 'equal':
            chunk_len = i2 - i1
            correct_words_count += chunk_len
            
            for i in range(i1, i2):
                report.append({
                    "word": target_tokens[i],
                    "status": "Green"
            
                })
                #report[target_tokens[i]] = "Green"

        elif tag == 'delete':
            for i in range(i1, i2):
                report.append({
                     "word": target_tokens[i],
                     "status": "Red"  
                })
                #report[target_tokens[i]] = "Red"

        elif tag == 'replace':

            teacher_chunk = target_tokens[i1:i2]
            transcription_chunk = transcription_tokens[j1:j2]

            for t_word, w_word in zip_longest(teacher_chunk, transcription_chunk, fillvalue=None):

                if t_word is None:
                    break  

                if w_word is None:
                    report.append({
                         "word": t_word,
                         "status": "Red"
                    })
                    #report[t_word] = "Red"
                    continue 

                else:
                    similarity = difflib.SequenceMatcher(None, t_word, w_word).ratio()
                    
                    if similarity >= 0.7:
                        correct_words_count += 1
                        report.append({
                             "word": t_word, 
                             "status": "Yellow"   
                        })
                        #report[t_word] = "Yellow"
                    else:
                        report.append({
                             "word": t_word, 
                             "status": "Red"  
                        })
                        #report[t_word] = "Red"

    if total_teacher_words == 0:
        final_score = 0
    else:
        final_score = int((correct_words_count / total_teacher_words) * 100)

    return final_score, report



