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

model = CNN()
model.load_state_dict(torch.load("seabed_cnn.pth", map_location=device))
model.to(device).eval()

transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
])

img = Image.open("image.jpg")  # Replace with your image
input_tensor = transform(img).unsqueeze(0).to(device)
with torch.no_grad():
    output = model(input_tensor)
    pred = output.argmax(1).item()
    class_name = CLASS_NAMES[pred]

print(f"Predicted Class: {class_name} (Class {pred})")
