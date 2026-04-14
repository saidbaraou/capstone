from django.shortcuts import render
from rest_framework import viewsets
from .models import Visitor
from .serializer import VisitorSerializer

class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.all()
    serializer_class = VisitorSerializer

