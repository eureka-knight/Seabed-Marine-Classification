import torch
from torch import nn, optim
from model import CNN
from aqua20_dataset_loader import get_dataloaders

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
train_loader, _ = get_dataloaders()
model = CNN().to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

for epoch in range(21):
    model.train()
    total_loss = 0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    print(f"Epoch {epoch+1}, Loss: {total_loss:.4f}")

torch.save(model.state_dict(), "seabed_cnn.pth")
