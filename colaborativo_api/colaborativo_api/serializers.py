from rest_framework import serializers
from rest_framework.authtoken.models import Token
from colaborativo_api.models import *
from colaborativo_api.models import Event

class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email')


class ProfilesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profiles
        fields = "__all__"


class ProfilesAllSerializer(serializers.ModelSerializer):
    # user=UserSerializer(read_only=True)
    class Meta:
        model = Profiles
        fields = '__all__'
        depth = 1


class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ('id', 'file', 'file_type', 'upload_date')


class SubEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'start', 'end', 'all_day', 'parent']


class EventSerializer(serializers.ModelSerializer):
    sub_events_data = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'start', 'end',
                  'all_day', 'parent', 'sub_events_data']

    def get_sub_events_data(self, obj):
        sub_events = obj.sub_events.all()
        return SubEventSerializer(sub_events, many=True).data

    def create(self, validated_data):
        return Event.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
