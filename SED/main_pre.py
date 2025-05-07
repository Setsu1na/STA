import copy
import os
import numpy as np
import random
import shutil
import time
import sys
from src import trainer
from keras import backend as K
import tensorflow as tf
import argparse
from src.Logger import LOG
from keras.layers import Input,concatenate,GaussianNoise
from keras.models import load_model,Model
import shutil
os.environ['PYTHONHASHSEED'] = '0'
np.random.seed(42)
random.seed(12345)
session_conf = tf.ConfigProto(intra_op_parallelism_threads=1, inter_op_parallelism_threads=1)
tf.set_random_seed(1234)
sess = tf.Session(graph=tf.get_default_graph(), config=session_conf)
K.set_session(sess)

def bool_convert(value):
    """"
	Convert a string to a boolean type value
	Args:
		value: string in ['true','True','false','False']
			the string to convert
	Return:
		rvalue: bool
			a bool type value
	"""
    if value=='true' or value=='True':
        rvalue=True
    elif value=='false' or value=='False':
        rvalue=False
    else:
        assert False
    return rvalue


def test(task_name, model_name, model_path=None, at_preds={}, sed_preds={}):
    # prepare for testing
    train = trainer.trainer(task_name, model_name, True)
    if not model_path == None:
        train.best_model_path = model_path
    #while(1):
    sed_preds_out = train.save_sed_result(sed_preds)  # event detection result
    #time.sleep(5)
    # return at_preds_out, sed_preds_out
    return sed_preds_out

def test_models(task_name, model_name, model_list_path):

    def predict(A):
        A[A >= 0.5] = 1
        A[A < 0.5] = 0
        return A

    if model_list_path == None:
        test(task_name, sed_model_name)
    else:
        with open(model_list_path) as f:
            model_list = f.readlines()
        model_list = [m.rstrip() for m in model_list]
        print(model_list_path)
        print(model_list)
        if len(model_list) == 1:
            LOG.info('ensemble results (just a single model)')
            test(task_name, sed_model_name, model_list[0])
            return


if __name__ == '__main__':
    LOG.info('Disentangled feature')
    parser = argparse.ArgumentParser(description='')
    parser.add_argument('-n', '--task_name',
                        dest='task_name',
                        help='task name')

    parser.add_argument('-s', '--PS_model_name', dest='PS_model_name',
                        help='the name of the PS model')
    parser.add_argument('-t', '--PT_model_name', dest='PT_model_name',
                        help='the name of the PT model')
    parser.add_argument('-md', '--mode', dest='mode',
                        help='train or test')
    parser.add_argument('-g', '--augmentation', dest='augmentation',
                        help='select [true or false] : whether to use augmentation (add Gaussian noise)')
    parser.add_argument('-u', '--semi_supervised', dest='semi_supervised',
                        help='select [true or false] : whether to use unlabel data')
    parser.add_argument('-e', '--ensemble', dest='ensemble',
                        help='select [true or false] : whether to ensembel several models when testing')
    parser.add_argument('-w', '--model_weights_list', dest='model_weights_list',
                        help='the path of file containing a list of path of model weights to ensemble')
    f_args = parser.parse_args()

    task_name = f_args.task_name
    sed_model_name = f_args.PS_model_name
    at_model_name = f_args.PT_model_name
    mode = f_args.mode
    semi_supervised = f_args.semi_supervised
    augmentation = f_args.augmentation
    ensemble = f_args.ensemble
    model_weights_list = f_args.model_weights_list

    if mode not in ['train', 'test']:
        LOG.info('Invalid mode')
        assert LOG.info('try add --help to get usage')

    if task_name is None:
        LOG.info('task_name is required')
        assert LOG.info('try add --help to get usage')

    if sed_model_name is None:
        LOG.info('PS_model_name is required')
        assert LOG.info('try add --help to get usage')
    if mode == 'test':
        semi_supervised = False
        ensemble = bool_convert(ensemble)
        if not ensemble:
            model_weights_list = None
    if mode == 'test':
        test_models(task_name, sed_model_name, model_weights_list)

