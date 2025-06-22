from rest_framework import viewsets
from colaborativo_api.models import Event
from colaborativo_api.serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer

    def get_queryset(self):
        queryset = Event.objects.prefetch_related(
            'sub_events').all().order_by('start')
        event_type = self.request.query_params.get('type')
        if event_type == 'main':
            queryset = queryset.filter(parent__isnull=True)
        return queryset
