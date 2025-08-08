#!/usr/bin/env python3
import argparse
import os
import sys
from pathlib import Path

import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

from model import CNN

# AQUA20 class labels
CLASS_NAMES = [
    "coral",
    "crab",
    "diver",
    "eel",
    "fish",
    "fishInGroups",
    "flatworm",
    "jellyfish",
    "marine_dolphin",
    "octopus",
    "rayfish",
    "seaAnemone",
    "seaCucumber",
    "seaSlug",
    "seaUrchin",
    "shark",
    "shrimp",
    "squid",
    "starfish",
    "turtle",
]

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def load_model():
    try:
        model = CNN()
        model.load_state_dict(torch.load("seabed_cnn.pth", map_location=device))
        model.to(device).eval()
        return model
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        sys.exit(1)


def predict_image(image_path):
    try:
        model = load_model()

        transform = transforms.Compose(
            [
                transforms.Resize((128, 128)),
                transforms.ToTensor(),
            ]
        )

        img = Image.open(image_path).convert("RGB")
        input_tensor = transform(img).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(input_tensor)
            probabilities = F.softmax(output, dim=1)
            confidence, predicted_idx = torch.max(probabilities, dim=1)

        class_name = CLASS_NAMES[predicted_idx.item()]
        confidence_score = confidence.item()

        return class_name, predicted_idx.item(), confidence_score

    except Exception as e:
        print(f"❌ Prediction failed: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="🔍 Seabed Classification Predictor")
    parser.add_argument("image_path", help="Path to the image to classify")

    args = parser.parse_args()
    image_path = Path(args.image_path)

    if not image_path.exists():
        print(f"❌ Error: Image file '{image_path}' does not exist.")
        sys.exit(1)

    class_name, class_idx, confidence = predict_image(image_path)
    print(f"✅ Predicted Class: {class_name} (Class {class_idx})")
    print(f"📈 Confidence: {confidence * 100:.2f}%")


if __name__ == "__main__":
    main()
