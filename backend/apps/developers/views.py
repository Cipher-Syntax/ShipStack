from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import DeveloperProfile
from .serializers import DeveloperProfileSerializer

class DeveloperProfileManageView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DeveloperProfileSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        try:
            return DeveloperProfile.objects.get(user=self.request.user)
        except DeveloperProfile.DoesNotExist:
            return None

    def put(self, request, *args, **kwargs):
        if not getattr(request.user, 'is_verified_developer', False):
            return Response({"error": "Only verified developers can manage a storefront."}, status=status.HTTP_403_FORBIDDEN)
            
        instance = self.get_object()
        
        # When sending FormData with empty file fields, they might come as 'null' strings or empty.
        # Clean them up if needed.
        data = request.data.copy()
        if 'logo' in data and (data['logo'] == 'null' or not data['logo']):
            data.pop('logo')
        if 'banner' in data and (data['banner'] == 'null' or not data['banner']):
            data.pop('banner')

        if instance:
            serializer = self.get_serializer(instance, data=data, partial=True)
        else:
            serializer = self.get_serializer(data=data)
            
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data)

class PublicStorefrontView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = DeveloperProfileSerializer
    queryset = DeveloperProfile.objects.all()
    lookup_field = 'slug'
