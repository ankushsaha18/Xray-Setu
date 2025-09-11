from django.urls import path
from . import views

urlpatterns = [
    path('upload-scan', views.upload_scan, name='upload_scan'),
    path('symptoms/transcribe', views.transcribe_symptoms, name='transcribe_symptoms'),
    path('diagnosis/multimodal', views.multimodal_diagnosis, name='multimodal_diagnosis'),
]