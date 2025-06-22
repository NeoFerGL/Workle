import string
import random
from rest_framework.decorators import api_view
from rest_framework.response import Response  # Asegúrate de importar esto


@api_view(['POST'])
def generar_id_reunion(request):
    # Genera un ID único para la reunión
    room_id = ''.join(random.choices(
        string.ascii_letters + string.digits, k=10))
    return Response({"roomId": room_id})
