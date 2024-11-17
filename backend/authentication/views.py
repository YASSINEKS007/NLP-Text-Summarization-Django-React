import json

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import CustomUser

# Create your views here.


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    try:
        fullName = request.data.get("fullName").split()
        firstName = fullName[0]
        lastName = " ".join(fullName[1:])
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = CustomUser.objects.filter(email=email).first()
        if user is not None:
            return Response(
                {"error": "User Already Exists"},
                status=status.HTTP_409_CONFLICT,
            )

        CustomUser.objects.create_user(
            email=email, password=password, firstName=firstName, lastName=lastName
        )

        return Response(
            {"message": "User created successfully"}, status=status.HTTP_201_CREATED
        )

    except json.JSONDecodeError:
        return Response(
            {"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
