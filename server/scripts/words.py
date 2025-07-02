from wordfreq import zipf_frequency

INPUT = 'ordlist_sproegnaevn.txt'
OUTPUT = 'common_dansk_words.txt'
THRESHOLD = 3.5

with open(INPUT, encoding='utf-8') as fin, open(OUTPUT, 'w', encoding='utf-8') as fout:
    for line in fin:
        word = line.split(';', 1)[0]
        if zipf_frequency(word, 'da') >= THRESHOLD:
            fout.write(word + '\n')