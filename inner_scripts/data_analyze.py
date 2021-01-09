# -*- coding:utf-8 -*-
"""
This is for data analyze
Generate file with json format content provided for html to display
"""
import json
import numpy as np
import sys
from os import path

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

# save data
data_info = {"total_data_count":total_data_count, "norm_data_count":norm_data_count, "test_data_count":test_data_count, \
    "num_classes":num_classes, 'cls_counts':cls_counts}

with open(path.join(path.abspath(path.dirname(__file__)), "data_info.json"),"w+",encoding="utf-8") as f:
    json.dump(data_info, f)

