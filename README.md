# Seabed Classification Using Deep Learning

This project classifies underwater seabed images into 20 classes using a CNN model and the AQUA20 dataset from Hugging Face.

### Run Training:
```bash
python train.py
```

### Evaluate:
```bash
python test.py
```

### Predict on a New Image:
```bash
python predict.py
```

# For “A Deep Learning-Based System for Automated Seabed Imagery Recognition and Marine Feature Analysis”
➢ We will use CNN neural network.Why?
➢ CNNs are a type of deep neural network specifically designed for processing grid-like data, such as images.
➢ This process allows CNNs to identify patterns and features within the input data
➢ CNNs are widely used in image recognition, object detection, and other computer vision tasks.


## Software Tools:
➢OpenCV: A powerful library in Python for image and video
manipulation.
➢Python 3.x: Programming language.
➢ PyTorch: it is an open-source machine learning framework. It is widely used for applications such as
computer vision and natural language processing.
➢ Matplotlib/Seaborn: Matplotlib is a widely-used, opensource Python library primarily employed for creating static,animated, and interactive visualizations.
➢NumPy & Pandas: For data manipulation.


## Algorithm used:
# Convolutional Neural Networks (CNNs)

➢ CNNs are specialized deep learning algorithms designed for image data.
➢ It is a specialized form of artificial neural network designed particularly for analyzing visual data, such as images and videos
➢ Used for automatic feature learning (edges, shapes,textures) instead of manually engineering features.
➢ CNNs operate by processing input data through various layers, including convolutional layers, pooling layers, and fully connected layers. These layers work together to extractfeatures, reduce dimensionality, and ultimately classify or recognize patterns within the visual data. The architecture and operations within a CNN, like convolution and pooling, are defined by specific algorithms that allow the network to learn and identify features effectively.


## Loss Function: CrossEntropyLoss

➢ Used for multi-class classification.
➢ It calculates how far predicted probabilities are from actual labels.
➢ It tells the model how wrong its prediction is compared to the correct answer.
➢ Example:
Let’s say your model looks at an underwater image and says:
"This is coral."
But the real label is:
"This is sand."
Now the loss function says:
 "Oops! You're wrong — here's a big penalty."
If the model gets it almost right (e.g., says 80% coral, 20%
sand), the penalty is smaller.
If the model gets it completely right, the penalty is near zero.

➢ The loss value is what the model uses to learn
➢ During training, the model adjusts its weights to reduce the loss.
➢ Lower loss = better predictions.


## Methodology:

# Step 1: Dataset Preparation
➢ Dataset: AQUA20 on Hugging Face or Kaggle
➢ Contains 20 underwater classes (like coral, fish, sand, turtle, etc.)
➢ Data split into: train, valid, and test.

# Step 2: Preprocessing
➢ Resize all images to 128x128 or 64x64 for memory efficiency.
➢ Convert labels into class indices.

# Step 3: Model Training
➢ Train a CNN model using the training set.
➢ Tweak hyperparameters (epochs, learning rate) as needed.

# Step 4: Model Evaluation
➢ Use test data to evaluate the accuracy and generalization.
➢ Metrics: Accuracy.

# Step 5: Inference & Prediction
➢ Input a new seabed image.
➢ The trained model predicts the class (e.g., coral, sand, rock).


## Output prediction -> It predicts the classes
 0."coral"
 1."crab"
 2."diver",
 3."eel", 
 4."fish",
 5."fishInGroups", 
 6."flatworm",
 7."jellyfish", 
 8."marine_dolphin",
 9."octopus",
 10."rayfish", 
 11."seaAnemone", 
 12."seaCucumber",
 13."seaSlug", 
 14."seaUrchin",
 15"shark",
 16."shrimp",
 17."squid",
 18."starfish", 
 19."turtle"


## Future Scope of the project:

➢ Over 80% of the ocean is still unmapped, unobserved, and unexplored.

➢ It can help scientists automatically classify marine features from camera footage taken by underwater
drones.
➢ This reduces the need for manual labor in analyzing thousands of hours of footage.

➢ Automated classification of coral, sponges, algae, etc., helps in tracking marine ecosystem health.

➢ Long-term seabed imagery analysis can detect erosion, pollution, or glacier retreat, giving insights
into environmental impact.
➢ Combining underwater imagery with satellite data may provide a complete 3D map of ocean floors.

➢ Future models can fuse sonar, video, and hyperspectral data for better accuracy

➢ Underwater surveillance can be improved using AIbased feature detection in sensitive maritime zones

➢ Oil and gas industries, telecom cable installers, and seabed mining companies need automated seabed
mapping tools.

## The Nippon Foundation-GEBCO Seabed2030 project

Seabed 2030 is a collaborative project between GEBCO and The Nippon Foundation with the aim to facilitate the complete mapping of the global ocean floor by the year 2030. The operational launch of the project was announced by Mr Yohei Sasakawa, Chairman of The Nippon Foundation, at a press conference in February 2018.

read more about it (here)[https://www.gebco.net/about-us/seabed2030-project]







