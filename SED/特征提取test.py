import os
import numpy as np
import os
import glob
import time
from feature_extraction.gen_feature import extract_feature
os.system("python feature_extraction/gen_feature.py -l data/text/test.lst "
          "-w data/real_wav/ -f data/feature -c feature_extraction/feature.cfg -p 10")

def WaveName_write_file():
    test_file = 'data\\text\\test_new.lst'
    path = "data\\real_wav"
    filenames = [os.path.splitext(os.path.basename(fpath))[0]  for fpath in glob.glob(os.path.join(path, "*"))]
    #print(filenames)
    fp = open(test_file,'w')
    lists=[line+"\n" for line in filenames]
    fp.writelines(lists)
    fp.close()
'''
if __name__ == '__main__':
    wav_lst = "data/text/test_new.lst"
    wav_dir = "data/real_wav/"
    feature_dir = "data/feature/new"
    feature_cfg = "feature_extraction/feature.cfg"
    processes = int(10)
    while(1):
        time.sleep(10)
        WaveName_write_file()
        time.sleep(2)
        extract_feature(wav_lst, wav_dir, feature_dir, feature_cfg, processes)
'''
