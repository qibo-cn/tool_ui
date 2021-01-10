# -*- coding:utf-8 -*-
"""
This is for data analyze
Generate file with json format content provided for html to display
"""
import json
import numpy as np
import sys
from os import path
from PIL import Image

x_norm_file = sys.argv[1]
x_test_file = sys.argv[2]
y_test_file = sys.argv[3]

x_norm = np.load(x_norm_file)["arr_0"]
x_test = np.load(x_test_file)["arr_0"]
y_test = np.load(y_test_file)["arr_0"]

norm_data_count = len(x_norm)
test_data_count = len(x_test)
total_data_count = norm_data_count + test_data_count

num_classes = len(y_test[0])
cls_counts = [0]*num_classes
for i in range(len(y_test)):
    cls = np.argmax(y_test[i])
    cls_counts[cls] += 1


sample_img_arr = np.array(np.squeeze(x_test[1])*255.0,dtype="uint8")
print("sample_img shape={}".format(np.shape(sample_img_arr)))
sample_img = Image.fromarray(sample_img_arr)
sample_img.save(path.join(path.abspath(path.dirname(__file__)), "sample.png"))
hist_gram_splits = np.array(np.linspace(0,255,num=10), dtype="int32")
hist_gram_bins = np.zeros(len(hist_gram_splits),dtype="int32")

for val in sample_img_arr.flatten():
    for i in range(1, len(hist_gram_splits)):
        if val <= hist_gram_splits[i] and val >= hist_gram_splits[i-1]:
            hist_gram_bins[i-1] += 1

hist_bin_names=[]
for i in range(len(hist_gram_splits)-1):
    hist_bin_names.append("{}-{}".format(hist_gram_splits[i],hist_gram_splits[i+1]))
print("hist gram bins:{}".format(hist_gram_splits))
# save data
data_info = {"total_data_count":total_data_count, "norm_data_count":norm_data_count, "test_data_count":test_data_count, \
    "num_classes":num_classes, 'cls_counts':cls_counts, "hist_bin_names":hist_bin_names,"hist_grams":hist_gram_bins.tolist()}

with open(path.join(path.abspath(path.dirname(__file__)), "data_info.json"),"w+",encoding="utf-8") as f:
    json.dump(data_info, f)
