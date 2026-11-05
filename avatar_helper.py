import sys
import json
from gradio_client import Client, handle_file

def main():
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Nedovoljno argumenata. Upotreba: script.py <gradio_url> <image_path> <audio_path>"}))
        sys.exit(1)

    gradio_url = sys.argv[1]
    image_path = sys.argv[2]
    audio_path = sys.argv[3]

    try:
        # Povezivanje na Colab Gradio worker
        client = Client(gradio_url)

        # Poziv definisanog endpointa /generate_avatar
        result = client.predict(
            source_image=handle_file(image_path),
            driven_audio=handle_file(audio_path),
            api_name="/generate_avatar"
        )

        # Gradio vraća privremeni lokalni/remote filepath generisanog videa
        print(json.dumps({"success": True, "video_path": result}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()