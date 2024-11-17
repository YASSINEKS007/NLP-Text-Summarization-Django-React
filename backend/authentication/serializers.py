from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["firstName"] = user.firstName
        token["lastName"] = user.lastName
        token["email"] = user.email
        token["date_joined"] = int((user.date_joined).timestamp())

        return token


from rest_framework import serializers
from .models import CustomUser


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["firstName", "lastName", "email", "profile_picture", "password"]