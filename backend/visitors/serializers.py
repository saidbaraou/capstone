from rest_framework import serializers
from .models import Visitor, Visit

class VisitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visitor
        fields = '__all__' # This will include all fields of the Visitor model in the serialized output

class VisitSerializer(serializers.ModelSerializer):
    # display host's full name instead of just the ID
    host_name = serializers.ReadOnlyField(source='host.get_full_name')
    # Optionally include visitor's email in the serialized output
    visitor_email = serializers.ReadOnlyField(source='host.email')

    class Meta:
        model = Visit
        fields = [
            'id',
            'visitor_full_name',
            'visitor_email',
            'visitor_company',
            'host',
            'host_name',
            'planned_arrival',
            'check_in_time',
            'check_out_time',
            'status',
            'purpose_of_visit',
            'safety_instructions_signed',
            'nda_accepted',
        ]
        # ID and arrival/departure times are managed by the system, so they should be read-only
        read_only_fields = ['id', 'check_in_time', 'check_out_time']