import requests
import asyncio
import json

class APIRequest:

    def __init__(self, url):
        self.url = url
        self.last_response = {} # not clean but works  

    def get(self):
        return json.loads(requests.get(self.url))
    
class RealTimeAPI(APIRequest):
    
    @staticmethod
    def parse_response(response, last_response):
        # parsed = {"add": {}, "remove": {}}
        categories = {"now": {}, "before": {}}
        parsed = {"add": [], "remove": []}
        for cat in response:
            categories["now"][int(cat["cat"])] = cat["data"]
        
        for cat in last_response:
            categories["before"][int(cat["cat"])] = cat["data"]
        
        for cat_id in categories["now"].keys():
            try:
                categories["before"][cat_id]
            except KeyError:
                categories["before"][cat_id] = []
        
        for cat_id in categories["before"].keys():
            try:
                categories["now"][cat_id]
            except KeyError:
                categories["now"][cat_id] = []

        for cat_id in categories["now"].keys():
            difference_add = set(categories["now"][cat_id]) - set(categories["before"][cat_id])
            if difference_add != set():
                difference_add = [(cat_id, item) for item in difference_add]
                parsed["add"].extend(difference_add)

            difference_remove = set(categories["before"][cat_id]) - set(categories["now"][cat_id])
            if difference_remove != set():
                difference_remove = [(cat_id, item) for item in difference_remove]
                parsed["remove"].extend(difference_remove)

        return parsed
    
    async def listen(self):
        last_response = self.last_response
        try:
            while True:
                await asyncio.wait(.5)
                response = self.get()
                if response == last_response:
                    self.last_response = response
                    return response
                last_response = response
        except:
            return 0
        
        
# with open('C:/Users/noams/OneDrive/Documents/home-edu/projects/orenalert/backend/app/testing.json', 'r') as f:
#     data = json.load(f)

#     processed = RealTimeAPI.parse_response(data[1], data[0])

#     with open ('C:/Users/noams/OneDrive/Documents/home-edu/projects/orenalert/backend/app/testingresult.json', 'w') as f:
#         json.dump(processed, f, indent=4, separators=(",", ": "))