from webbrowser import Error

from flask import Flask, jsonify, request
from openai import OpenAI
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI
from langchain.schema import HumanMessage
import os
import json

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), base_url=os.getenv("OPENAI_API_BASE"))

# Open the image file in binary mode
prompt = """
Two DOM objects are provided with the following attributes:

path: The path to the DOM element from the root.
tag: The tag of the DOM element.
attributes: The attributes of the element, such as class and id.
innerTextHash: A hash of the element's inner text (it’s empty if there is no inner text).
getBoundingClientRect: The coordinates of the element relative to the viewport.
isVisible: A flag indicating whether the element is visible.

Context:
path: Provides the location of the element within the DOM hierarchy.
tag: The type of the HTML element (e.g., <div>, <button>, etc.).
attributes: Defines various properties of the element, such as class, id, etc.
innerTextHash: Represents the hash of the element's inner text content (useful for comparing text content).
getBoundingClientRect: Provides the position and size of the element in the viewport, such as its coordinates (x, y), width, height, etc.
isVisible: Indicates whether the element is currently visible on the page.

Grouping Logic:
Using the above attributes, group the two DOM objects based on the following criteria:

Matching innerText: If the innerTextHash of both elements is the same, they should be grouped together.
ClientBoundingRect Comparison: If the inner text of the elements is different or empty, compare the getBoundingClientRect values. The elements should be grouped together if their bounding rectangles are visually close enough, according to a threshold value.
Attributes Comparison: Elements with similar attributes should be logically grouped together. For instance, buttons within the same panel should be grouped together, while a search icon should be grouped with the search bar.

Output:
The output should be a boolean indicating whether the two elements should be grouped or not.

Examples:
SAMPLE INPUT - 1:
obj1: {
    "path": "DIV[0]/DIV[0]/BUTTON[0]/LIGHTNING-PRIMITIVE-ICON[0]/svg[0]",
    "tag": "svg",
    "attributes": {
      "focusable": "false",
      "aria-hidden": "true",
      "viewBox": "0 0 520 520",
      "part": "icon",
      "lwc-45bd2ao4vb7": "",
      "data-key": "search",
      "class": "slds-button__icon slds-button__icon_left"
    },
    "innerTextHash": "",
    "getBoundingClientRect": {
      "x": 139,
      "y": 97.578125,
      "width": 14,
      "height": 14,
      "top": 97.578125,
      "right": 153,
      "bottom": 111.578125,
      "left": 139
    },
    "isVisible": true
  }
obj2: {
    "path": "DIV[0]/DIV[0]/BUTTON[0]/LIGHTNING-PRIMITIVE-ICON[0]",
    "tag": "LIGHTNING-PRIMITIVE-ICON",
    "attributes": {
      "variant": "bare",
      "data-data-rendering-service-uid": "146",
      "data-aura-rendered-by": "279:0",
      "lwc-45bd2ao4vb7-host": ""
    },
    "innerTextHash": "",
    "getBoundingClientRect": {
      "x": 139,
      "y": 95.5,
      "width": 22,
      "height": 15,
      "top": 95.5,
      "right": 161,
      "bottom": 110.5,
      "left": 139
    },
    "isVisible": true
  }

SAMPLE OUTPUT - 1:
true

Given the following input, provide a single word output (true or false)
INPUT:
"""

app = Flask(__name__)

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

def call_ai(obj1, obj2, prompt):
    obj1_string = json.dumps(obj1)
    obj2_string = json.dumps(obj2)

    model = get_smart_model()
    prompt += f"""
obj1: {obj1_string},
obj2: {obj2_string}
"""

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt}
        ]
    )

    print("req send")
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
    obj1 = data['obj1']
    obj2 = data['obj2']

    return call_ai(obj1, obj2, prompt)

if __name__ == '__main__':
    app.run(debug=True)
