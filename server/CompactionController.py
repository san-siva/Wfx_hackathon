from webbrowser import Error

from flask import Flask, jsonify, request
from openai import OpenAI
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI
from langchain.schema import HumanMessage
from flask_cors import CORS
import os
import json

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), base_url=os.getenv("OPENAI_API_BASE"))

# Open the image file in binary mode
prompt = """
INPUT- 
Based on the image passed, output if the highlighted elements are functionally groupable or not.
Two elements are groupable if they are part of the same logical, sematic and functional unit.
The output should be a boolean value. Give me true or false.
"""

app = Flask(__name__)
CORS(app)

def get_smart_model():
    model = AzureChatOpenAI(
        openai_api_version=os.getenv("OPENAI_API_VERSION"),
        deployment_name=os.getenv("SMART_MODEL"),
        api_key=os.getenv("OPENAI_API_KEY"),
        azure_endpoint=os.getenv("OPENAI_API_BASE"),
        openai_api_type="azure",
        temperature=0.6,
    )
    return model

def call_ai(encoded_image, prompt):

    model = get_smart_model()
#     prompt += f"""
# obj1: {obj1_string},
# obj2: {obj2_string}
# """

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {"type": "image_url",
             "image_url": {"url": f"{encoded_image}"},}
        ]
    )

    print("req send")
    print(message)
    ai_msg = model.invoke([message])
    print("**********************************")
    print(ai_msg.content)

    response_data = {
        'status': 'success',
        'received_data': str(ai_msg.content)
    }

    return jsonify(response_data), 200

@app.route('/group', methods=['POST'])
def group_elements():
    if not request.is_json:
        raise Error("Did not receive data ")

    data = request.get_json()
    image = data['img']

    return call_ai(image, prompt)

if __name__ == '__main__':
    app.run(debug=True)
