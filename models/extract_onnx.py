"""little helper to display in and outputs because I only have the .onnx, not the .pt

or just use a proper tool like: https://netron.app/
"""

import onnx

model = onnx.load("best.onnx")

print("Inputs:")
for x in model.graph.input:
    print(x.name, x.type)

print("\nOutputs:")
for x in model.graph.output:
    print(x.name, x.type)
    
    
"""
from best.onnx:

Inputs: 
images tensor_type { 
    elem_type: 1 
    shape { 
        dim { dim_value: 1 } 
        dim { dim_value: 3 } 
        dim { dim_value: 640 } 
        dim { dim_value: 640 } 
    } 
} 
Outputs: 
output0 tensor_type { 
    elem_type: 1 
    shape { 
        dim { dim_value: 1 } 
        dim { dim_value: 6 } 
        dim { dim_value: 8400 } 
    } 
}

"""
