#!/usr/bin/env python3
import sys
import os
import argparse
from pathlib import Path
import torch
from model import CNN
from torchvision import transforms
from PIL import Image

# AQUA20 dataset class names mapping
CLASS_NAMES = [
    "coral", "crab", "diver", "eel", "fish",
    "fishInGroups", "flatworm", "jellyfish", "marine_dolphin", "octopus",
    "rayfish", "seaAnemone", "seaCucumber", "seaSlug", "seaUrchin",
    "shark", "shrimp", "squid", "starfish", "turtle"
]

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model():
    model = CNN()
    model.load_state_dict(torch.load("seabed_cnn.pth", map_location=device))
    model.to(device).eval()
    return model

def predict_image(image_path):
    model = load_model()
    transform = transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.ToTensor(),
    ])
    
    img = Image.open(image_path).convert("RGB")
    input_tensor = transform(img).unsqueeze(0).to(device)
    
    with torch.no_grad():
        output = model(input_tensor)
        pred = output.argmax(1).item()
        class_name = CLASS_NAMES[pred]
    
    return class_name, pred

def main():
    parser = argparse.ArgumentParser(description='Seabed Classification Predictor')
    parser.add_argument('image_path', help='Path to the image to classify')
    
    args = parser.parse_args()
    
    image_path = Path(args.image_path)
    if not image_path.exists():
        print(f"Error: Image file '{image_path}' does not exist.")
        sys.exit(1)
    
    class_name, pred = predict_image(image_path)
    print(f"Predicted Class: {class_name} (Class {pred})")

if __name__ == "__main__":
    main()
