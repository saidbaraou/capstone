from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Visitor, Visit
from .serializers import VisitorSerializer, VisitSerializer

class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.all()
    serializer_class = VisitorSerializer

class VisitViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing visit instances.
    """
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer

    @action(detail=True, methods=['post'], url_path='check-in')
    def check_in(self, request, pk=None):
        """
        Custom action to check in a visitor.
        URL: POST /api/visits/<uuid>/check-in/
        """
        visit = self.get_object()
        if visit.status == Visit.VisitStatus.CHECKED_IN:
            return Response(
                {"detail": "Visitor is already checked in."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        visit.mark_as_arrived()

        serializer = self.get_serializer(visit)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='check-out')
    def check_out(self, request, pk=None):
        """
        Custom action to check out a visitor.
        URL: POST /api/visits/<uuid>/check-out/
        """
        visit = self.get_object()
        if visit.status != Visit.VisitStatus.CHECKED_IN:
            return Response(
                {"detail": "Visitor cannot check out without being checked in first."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        visit.mark_as_departed()
        
        serializer = self.get_serializer(visit)
        return Response(serializer.data, status=status.HTTP_200_OK)