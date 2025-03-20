from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User

CAREER_PATHS = {
    "Data Scientist": ["Python", "Machine Learning", "Statistics"],
    "Web Developer": ["JavaScript", "HTML", "CSS"],
    "Cybersecurity Analyst": ["Networking", "Security", "Linux"]
}

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
                
            User.objects.create(
                name=data['name'],
                email=data['email'],
                education=data.get('education', []),
                skills=data.get('skills', []),
                interests=data.get('interests', []),
                career_goals=data.get('career_goals', '')
            )
            return JsonResponse({'status': 'success'})
            
        except Exception as e:
            return JsonResponse(
                {'message': str(e)}, 
                status=400
            )

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