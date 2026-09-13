# 🌍 Vanguard Vision

**Vanguard Vision** is a powerful, full-stack Artificial Intelligence platform designed to analyze satellite and drone imagery in real-time. By leveraging large Vision-Language models, it allows users to interactively "chat" with their images, dynamically detecting objects, analyzing terrain, and extracting geospatial data using natural language.

---

## 🚀 How It Works (The Architecture)

The system is built on a modern, decoupled architecture connecting a React frontend to a PyTorch AI backend.

1. **User Interaction (Frontend):** The user uploads an aerial or satellite image to the sleek, mobile-responsive React UI (hosted on Vercel).
2. **Secure Tunneling (Networking):** The frontend communicates with the local AI server via a secure Ngrok tunnel.
3. **Natural Language Processing (NLP):** When the user asks a question (e.g., *"Find all blue trucks"*), the FastAPI backend router strips stopwords and extracts the core open-vocabulary targets.
4. **Zero-Shot AI Vision (Backend):** The backend feeds the image and the text prompt into **OWL-ViT** (a 300-million parameter Vision Transformer). Because it is a "Zero-Shot" model, it uses semantic text embeddings to find *anything* you describe, without needing to be pre-trained on a specific list of objects.
5. **Algorithmic Refinement:** 
   - A custom **Non-Maximum Suppression (NMS)** algorithm calculates the Intersection-over-Union (IoU) to brutally filter out overlapping, duplicate AI predictions.
   - **OpenCV KMeans clustering** analyzes the pixels inside the detected bounding boxes to extract dominant colors and estimate architectural features (like building floors).
6. **Geospatial Mapping:** If the image contains EXIF GPS data, the app extracts the coordinates and plots the exact global location on an interactive Leaflet Map.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Leaflet.
*   **Backend:** Python, FastAPI, Uvicorn.
*   **AI & Computer Vision:** PyTorch, Hugging Face Transformers (`google/owlvit-base-patch32`), OpenCV, NumPy.
*   **Deployment & Networking:** Vercel (Frontend), Ngrok (Tunneling), Docker.

---

## 💡 Why is this Useful? (Real World Applications)

Traditional object detection requires training rigid models to find specific things (e.g., a model that *only* knows how to find cars). Vanguard Vision uses **Open-Vocabulary** models, meaning it can find *anything* on the fly. This makes it incredibly versatile across multiple industries:

*   **🛡️ Defense & Tactical:** Instantly analyze drone feeds to locate specific enemy equipment, unmarked vehicles, or structural changes in hostile environments.
*   **🌾 Agriculture & Environment:** Use spectral analysis tools (like NDVI/NDWI) to assess crop health, track deforestation, or monitor water moisture levels across vast farmlands.
*   **🚑 Disaster Response:** Quickly scan satellite images of hurricane or earthquake zones to locate stranded survivors, assess damaged infrastructure, or find passable roads.
*   **🏙️ Urban Planning:** Automate the counting of buildings, vehicles in parking lots, or residential density over time without hiring manual data annotators.
