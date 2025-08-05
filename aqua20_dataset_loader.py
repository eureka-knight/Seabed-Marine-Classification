from datasets import load_dataset
from torchvision import transforms
from torch.utils.data import DataLoader, Dataset
import torch

def get_dataloaders(batch_size=32):
    dataset = load_dataset("taufiktrf/AQUA20")

    from PIL import Image

    def convert_image(image):
        if isinstance(image, Image.Image):
            image = image.convert("RGB")
        return image

    transform = transforms.Compose([
        transforms.Lambda(convert_image),
        transforms.Resize((128, 128)),
        transforms.ToTensor(),
    ])


    class AquaDataset(Dataset):
        def __init__(self, split):
            self.data = dataset[split]
            self.transform = transform

        def __len__(self):
            return len(self.data)

        def __getitem__(self, idx):
            img = self.data[idx]["image"]
            label = self.data[idx]["label"]
            return self.transform(img), label

    return (
        DataLoader(AquaDataset("train"), batch_size=batch_size, shuffle=True),
        DataLoader(AquaDataset("test"), batch_size=batch_size)
    )
