# -*- coding:utf-8 -*-
"""
This file generates description of model and 
intermediate images of extracted features
"""
import keras
import sys
import json
import numpy as np
from tensorflow.python.eager.function import _POSSIBLE_GRADIENT_TYPES_FIRST_ORDER

model_file = sys.argv[1]
print("py script get model file path [{}]".format(model_file))
model = keras.models.load_model(model_file)

total_num_layers = len(model.layers)
total_num_units = 0

for i in range(len(model.layers)):
    total_num_units += np.prod(model.layers[i].output_shape[1:])

model.summary()
print("total layers={}, num params={}, num units={}".format(total_num_layers, model.count_params(), total_num_units))

model_layers_info=[]
# desc each layer of model
# layer name, output shape, params
for layer in model.layers:
    if layer.__class__.__name__ == "InputLayer":
        model_layers_info.append({"name":layer.__class__.__name__, "shape":model.input_shape[1:], "params":layer.count_params()})
    else:
        model_layers_info.append({"name":layer.__class__.__name__, "shape":layer.output_shape[1:], "params":layer.count_params()})
    
# save basic info
with open("model_general_info.json","w+",encoding="utf-8") as f:
    f.write(json.dumps({"total_num_layers":total_num_layers,"total_params":model.count_params(), "total_units":int(total_num_units)}))

# save info of each layer
with open("model_layers_info.json","w+",encoding="utf-8") as f:
    f.write(json.dumps(model_layers_info))
