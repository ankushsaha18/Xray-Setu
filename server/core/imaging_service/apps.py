from django.apps import AppConfig
import os


class ImagingServiceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'imaging_service'

    def ready(self):
        if os.getenv('VERCEL') or os.getenv('DISABLE_MODEL_PRELOAD', '').lower() == 'true':
            return

        # Preload model when Django starts
        try:
            from .model.model_loader import ModelLoader
            ModelLoader.get_instance().load_model()
        except Exception as e:
            # Log error but don't crash the app
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to preload model: {str(e)}")
