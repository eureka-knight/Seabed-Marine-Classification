import torch
from model import CNN
from aqua20_dataset_loader import get_dataloaders

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
_, test_loader = get_dataloaders()

model = CNN().to(device)
model.load_state_dict(torch.load("seabed_cnn.pth"))
model.eval()

correct, total = 0, 0
with torch.no_grad():
    for images, labels in test_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        predicted = outputs.argmax(1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

print(f"Test Accuracy: {(correct / total) * 100:.2f}%")
