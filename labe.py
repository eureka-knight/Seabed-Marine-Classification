from datasets import load_dataset

# Load AQUA20 dataset (train split only to access label names)
dataset = load_dataset("taufiktrf/AQUA20", split="train")

# Access class label names
label_names = dataset.features["label"].names

# Print each label index with its corresponding class name
for index, name in enumerate(label_names):
    print(f"{index}: {name}")
