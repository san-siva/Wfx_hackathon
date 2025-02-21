from openai import OpenAI
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI
from langchain.schema import HumanMessage
import base64
import os



load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"),base_url=os.getenv("OPENAI_API_BASE"))

# Set your OpenAI API key



# Open the image file in binary mode

prompt = """
A DOM is being passed, we need to tag each element of the DOM with a groudID property.
This groupID has to be calculated based on following rules-
    1. Compare all the elements in a heirarchay. Hiearchy is a parent child relationship. example  BODY[0]/DIV[1] and BODY[0]/DIV[1]/DIV[0] is in one heairachy and needs to be compared, Similary BODY[0]/DIV[2]/DIV[0]/DIV[1] and BODY[0]/DIV[2]/DIV[0]/DIV[0] are in another heiararchy. While  BODY[0]/DIV[1] and BODY[0]/DIV[0] are in different heirarchy.
    2. If the innerText of the elements while camparing element in same heirarchy is same, the element has to be tagged with the same groupID which is a UUID.
    3. If not same, compare the clientBoundingRect data for the elements in the same hierachy  to check if the elements are close enough as visible on the page on the basis of the parameter passed in the clientBoundingRect.
    4. As output, give me the modified JSON.
    5. Don't modify the properties passed as input. Only add in the groupID for each element. 

Examples-
These two elements should have same groupIde-
    "path": "SPAN[0]",
            "tag": "SPAN",
            "attributes": {
                "class": "photoContainer forceSocialPhoto",
                "data-aura-rendered-by": "86:238;a",
                "data-aura-class": "forceSocialPhoto"
            },
            "innerTextHash": "",
            "getBoundingClientRect": {
                "x": 466.5,
                "y": 47.5,
                "width": 32,
                "height": 32,
                "top": 47.5,
                "right": 498.5,
                "bottom": 79.5,
                "left": 466.5
            },
            "isVisible": true,
            "children": [
                {
                    "path": "SPAN[0]/IMG[0]",
                    "tag": "IMG",
                    "attributes": {
                        "src": "https://casfx--stage.sandbox.file.force.com/profilephoto/729WL0000001wMv/T",
                        "alt": "User",
                        "class": "profileTrigger branding-user-profile circular",
                        "data-aura-rendered-by": "1571:0"
                    },
                    "innerTextHash": "",
                    "getBoundingClientRect": {
                        "x": 466.5,
                        "y": 47.5,
                        "width": 32,
                        "height": 32,
                        "top": 47.5,
                        "right": 498.5,
                        "bottom": 79.5,
                        "left": 466.5
                    },
                    "isVisible": true,
                    "children": []
                }
            ]
            
The output for the above example should not be any script but the passed json added with groupId attached to the elements
{         
            "groupId": 1,
            "path": "SPAN[0]",
            "tag": "SPAN",
            "attributes": {
                "class": "photoContainer forceSocialPhoto",
                "data-aura-rendered-by": "86:238;a",
                "data-aura-class": "forceSocialPhoto"
            },
            "innerTextHash": "",
            "getBoundingClientRect": {
                "x": 466.5,
                "y": 47.5,
                "width": 32,
                "height": 32,
                "top": 47.5,
                "right": 498.5,
                "bottom": 79.5,
                "left": 466.5
            },
            "isVisible": true,
            "children": [
                {
                    "groupId" : 1,
                    "path": "SPAN[0]/IMG[0]",
                    "tag": "IMG",
                    "attributes": {
                        "src": "https://casfx--stage.sandbox.file.force.com/profilephoto/729WL0000001wMv/T",
                        "alt": "User",
                        "class": "profileTrigger branding-user-profile circular",
                        "data-aura-rendered-by": "1571:0"
                    },
                    "innerTextHash": "",
                    "getBoundingClientRect": {
                        "x": 466.5,
                        "y": 47.5,
                        "width": 32,
                        "height": 32,
                        "top": 47.5,
                        "right": 498.5,
                        "bottom": 79.5,
                        "left": 466.5
                    },
                    "isVisible": true,
                    "children": []
                }
            ]
            
}
"""


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


model = get_smart_model()
data = ""
with open('/Users/suchith.krishna/Downloads/output.json', 'r') as file:
    data = file.read()

prompt += data

message = HumanMessage(
            content= [
                {"type": "text", "text": prompt}
            ]
)
print("req send")
ai_msg = model.invoke([message])
print(ai_msg)
print("**********************************")
# Print the response (this will contain the result of the image generation)
print(ai_msg.content)
# print(response.choices[0].message.content)