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

        if not user_skills:
            return JsonResponse({'error': 'No Skill Provided'}, status=400)

        user_vector = mlb_tech.transform([user_skills])
        similarities = cosine_similarity(user_vector, job_skill_matrix)
        top_indicies = similarities[0].argsort()[::-1][:5]
        recommended_jobs = job_data.iloc[top_indicies]

        results = recommended_jobs[['Job Title', 'Industry', 'Technical Skills']].to_dict(orient='records')
        
        # print(results)
        return JsonResponse({'recommendations': results}, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

