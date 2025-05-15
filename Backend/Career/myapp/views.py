<<<<<<< HEAD
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
=======
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User

CAREER_PATHS = {
    "Data Scientist": ["Python", "Machine Learning", "Statistics"],
    "Web Developer": ["JavaScript", "HTML", "CSS"],
    "Cybersecurity Analyst": ["Networking", "Security", "Linux"]
}
>>>>>>> d2b4be574a6bbfa960917d50098ab4d4043d7c9a

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
                
<<<<<<< HEAD
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
=======
            User.objects.create(
                name=data['name'],
                email=data['email'],
                education=data.get('education', []),
                skills=data.get('skills', []),
                interests=data.get('interests', []),
                career_goals=data.get('career_goals', '')
            )
>>>>>>> d2b4be574a6bbfa960917d50098ab4d4043d7c9a
            return JsonResponse({'status': 'success'})
            
        except Exception as e:
            return JsonResponse(
                {'message': str(e)}, 
                status=400
            )
<<<<<<< HEAD
        
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

=======

def get_recommendations(request, email):
    try:
        user = User.objects.get(email=email)
        user_skills = [skill['name'] for skill in user.skills]
        matches = []
        
        for career, skills in CAREER_PATHS.items():
            if any(skill in user_skills for skill in skills):
                matches.append(career)
                
        return JsonResponse({'recommendations': matches})
    except User.DoesNotExist:
        return JsonResponse({'status': 'user not found'}, status=404)


# def get_recommendations(request, email):
#     try:
#         user = User.objects.get(email=email)
#         user_skills = [skill['name'] for skill in user.skills]
        
#         recommendations = []
#         CAREER_PATHS = {
#             "Data Scientist": ["Python", "Machine Learning", "Statistics"],
#             "Web Developer": ["JavaScript", "HTML", "CSS"]
#         }
        
#         for career, required_skills in CAREER_PATHS.items():
#             if any(skill in user_skills for skill in required_skills):
#                 recommendations.append({
#                     "career": career,
#                     "required_skills": required_skills,
#                     "user_skills_matched": [s for s in required_skills if s in user_skills],
#                     "skills_missing": [s for s in required_skills if s not in user_skills]
#                 })

#         return JsonResponse({
#             'user': {
#                 'name': user.name,
#                 'email': user.email,
#                 'skills': user.skills
#             },
#             'recommendations': recommendations
#         })
        
#     except User.DoesNotExist:
#         return JsonResponse({'error': 'User not found'}, status=404)
>>>>>>> d2b4be574a6bbfa960917d50098ab4d4043d7c9a
