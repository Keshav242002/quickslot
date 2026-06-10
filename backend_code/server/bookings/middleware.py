import json
import os

import firebase_admin
from django.conf import settings
from django.http import JsonResponse
from firebase_admin import auth, credentials

from .models import User

_firebase_initialized = False


def _init_firebase():
    global _firebase_initialized
    if _firebase_initialized:
        return
    if firebase_admin._apps:
        _firebase_initialized = True
        return

    cred_json = getattr(settings, 'FIREBASE_CREDENTIALS_JSON', '')
    cred_path = getattr(settings, 'FIREBASE_CREDENTIALS_PATH', '')

    if cred_json:
        cred_dict = json.loads(cred_json)
        cred = credentials.Certificate(cred_dict)
    elif cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
    else:
        raise RuntimeError(
            "Firebase credentials not configured. Set FIREBASE_CREDENTIALS_JSON or "
            "FIREBASE_CREDENTIALS_PATH in environment."
        )

    firebase_admin.initialize_app(cred)
    _firebase_initialized = True


class FirebaseAuthMiddleware:
    EXEMPT_PATHS = ['/admin/', '/api/health/']

    def __init__(self, get_response):
        self.get_response = get_response
        try:
            _init_firebase()
        except Exception as e:
            import warnings
            warnings.warn(f"Firebase init failed: {e}. Auth middleware will reject all requests.")

    def __call__(self, request):
        if any(request.path.startswith(p) for p in self.EXEMPT_PATHS):
            return self.get_response(request)

        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse(
                {"error": "unauthorized", "message": "Missing or invalid Authorization header"},
                status=401,
            )

        token = auth_header.split('Bearer ', 1)[1].strip()
        try:
            decoded = auth.verify_id_token(token)
        except Exception:
            return JsonResponse(
                {"error": "unauthorized", "message": "Invalid or expired token"},
                status=401,
            )

        # auth.verify_id_token works identically for email/password AND Google Sign-In tokens —
        # the Firebase SDK normalises both into the same decoded payload shape, so no provider-specific
        # handling is needed here.
        firebase_uid = decoded['uid']
        email = decoded.get('email', '')
        name = decoded.get('name', '') or decoded.get('display_name', '') or email.split('@')[0]

        user, _ = User.objects.update_or_create(
            firebase_uid=firebase_uid,
            defaults={'name': name, 'email': email},
        )
        request.firebase_user = user
        return self.get_response(request)
