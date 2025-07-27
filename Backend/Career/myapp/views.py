from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from bson.json_util import dumps
from .models import users_db
import os
from django.conf import settings
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
from langchain_ollama import OllamaLLM
# from langchain_core.prompts import ChatPromptTemplate


csv_data = os.path.join(settings.BASE_DIR, 'dataset', 'Job_Skill_Recommendation.csv')
job_data = pd.read_csv(csv_data)

job_data['Technical Skills'] = job_data['Technical Skills'].apply(lambda x: [skill.strip() for skill in x.split(',')])
# job_data['Soft Skills'] = job_data['Soft Skills'].apply(lambda x: [skill.strip() for skill in x.split(',')])
# job_data['Tools/Technologies'] = job_data['Tools/Technologies'].apply(lambda x: [tool.strip() for tool in x.split(',')])

mlb_tech = MultiLabelBinarizer()
job_skill_matrix = mlb_tech.fit_transform(job_data['Technical Skills'])

# CAREER_PATHS = {
#     "Data Scientist": ["Python", "Machine Learning", "Statistics"],
#     "Web Developer": ["JavaScript", "HTML", "CSS"],
#     "Cybersecurity Analyst": ["Networking", "Security", "Linux"]
# }

@csrf_exempt
def create_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Manual validation
            if not data.get('name') or not data.get('email'):
                return JsonResponse(
                    {'message': 'Name and Email are required'}, 
                    status=400
                )
                
            user = {
                "name": data['name'],
                "email": data['email'],
                "password": data['password'],
                "education": data.get('education', []),
                "skills": data.get('skills', []),
                "interests": data.get('interests', []),
                "career_goals": data.get('career_goals', '')
            }
            users_db.insert_one(user)
            return JsonResponse({'status': 'success'})
            
        except Exception as e:
            return JsonResponse(
                {'message': str(e)}, 
                status=400
            )
        
@csrf_exempt
def get_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Manual validation
            if not data.get('email') or not data.get('password'):
                return JsonResponse(
                    {'message': 'Name and Email are required'}, 
                    status=400
                )
            
            user = users_db.find_one({'email': data['email'],  'password': data['password']})

            if not user:
                return JsonResponse({'error': 'No user found'}, status=404)
            
            user_json = json.loads(dumps(user))
            
            return JsonResponse({'user': user_json})

        except Exception as e:
            return JsonResponse(
                {'message': str(e)}, 
                status=400
            )

def get_recommendations(request, email):
    try:
        user = users_db.find_one({"email": email})
        user_skills = [skill['name'] for skill in user['skills']]
        user_interests = [interest for interest in user['interests']]

        if not user_skills and user_interests:
            return JsonResponse({'error': 'No Skill and Interest Provided'}, status=400)

        user_vector = mlb_tech.transform([user_skills, user_interests])
        similarities = cosine_similarity(user_vector, job_skill_matrix)
        top_indicies = similarities[0].argsort()[::-1][:5]
        recommended_jobs = job_data.iloc[top_indicies]

        results = recommended_jobs[['Job Title', 'Industry', 'Technical Skills']].to_dict(orient='records')
        
        # print(results)
        return JsonResponse({'recommendations': results}, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



SYSTEM_PROMPT =  """
Your name is Levi.
You are an AI Assistant with START, PLAN, ACTION, Observation and Output state.
Wait for the user prompt and first PLAN using avaliable tools.
After Planning, take the ACTION with apropriate tools and wait for Observation based on Action.
Once you get the observations, Return the AI response based on Start prompt and Observations.
If the user propt is just a casual question answer it casually.

Strictly return output in only Json format as in examples.
STRICTLY FOLLOW THE RULES

Avaliable Tools:
- function getuser(email: string): json
getuser is a function that accepts email as string and return user detials.
- function getrecommendations(skills: list): json object
getrecommendations is a function that accepts skills as list and return career recommendations according to the skills.

Example:
{"type": "user", "user": "what are my career recommendations according to my skills?"}
{"type": "plan", "plan": "I will call the getuser for user data"}
{"type": "observation", "observation": "random@gmail.com"}
{"type": "action", "function": "getuser", "input": "email"}
{"type": "plan", "plan": "I will call the getrecommendations for {"Skills":["Python","DL"]"}
{"type": "action", "function": "getrecommendations", "input": "{"Skills":["Python","DL"]"}"}
{"type": "observation", "Observation": "{"recommendations":[{"Job Title":"Project Manager","Industry":"Healthcare","Technical Skills":["SQL","Deep Learning","Power BI","R"]}]}"}
{"type": "output", "output": "{"recommendations":[{"Job Title":"Project Manager","Industry":"Healthcare","Technical Skills":["SQL","Deep Learning","Power BI","R"]}]}"}

"""

tools = {
    'getRecommendations': get_recommendations,
    'getuser': get_user,
}

messages = [
    {'role': 'system', 'content': SYSTEM_PROMPT},
]


@csrf_exempt
def chatbot(request):
    if request.method == 'POST':
        try:
            query = json.loads(request.body)
            user_input = query.get('message')
            # print(user_input)
            # return HttpResponse(user_input)

            # Manual validation
            if not user_input :
                return JsonResponse({'message': 'No input provided'}, status=400)
            
            model = OllamaLLM(model='llama3')
            messages.append(user_input)
            response = model.invoke(messages)
            # return HttpResponse(response)
            messages.append(response)
            # data = json.loads(response)
            print(response)
            return HttpResponse(response)

            # while True:
            #     if data['type'] == 'output':
            #         print(data['output'])
            #         return HttpResponse(data['output'])
            #         break

            #     elif data['type'] == 'action':
            #         fn = tools[data['function']]
            #         observation = fn(data['input'])
            #         obs = {'type': 'observation', 'observation': observation}
            #         messages.append({'role': 'developer', 'content': json.dumps(obs)})

        except Exception as e:
            return JsonResponse(
                {'message': str(e)}, 
                status=400
            )