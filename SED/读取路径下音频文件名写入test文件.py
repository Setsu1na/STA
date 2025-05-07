import pandas as pd
import os
import glob
def WaveName_write_file():
    test_file = 'data\\text\\test_new.lst'
    path = "data\\real_wav"
    filenames = [os.path.splitext(os.path.basename(fpath))[0]  for fpath in glob.glob(os.path.join(path, "*"))]
    #print(filenames)
    fp = open(test_file,'w')
    lists=[line+"\n" for line in filenames]
    fp.writelines(lists)
    fp.close()