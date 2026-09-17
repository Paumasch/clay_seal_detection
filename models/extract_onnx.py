"""little helper to display in and outputs because I only have the .onnx, not the .pt"""

import onnx

model = onnx.load("best.onnx")

print("Inputs:")
for x in model.graph.input:
    print(x.name, x.type)

print("\nOutputs:")
for x in model.graph.output:
    print(x.name, x.type)