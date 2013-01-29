"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase

class CheckResourceMeta(TestCase):
    def test_authentication(self):
        import sys
        import inspect
        from tastypie.resources import ModelResource
        from rest_api.resources import ModelMeta
        from powr import resources
        
        for name, obj in inspect.getmembers(sys.modules[resources.__name__]):
            if inspect.isclass(obj) and issubclass(obj, ModelResource):
                self.assertTrue(issubclass(obj.Meta, ModelMeta), 
                                "%s.%s.Meta: Resources should inherit the meta options from ModelMeta"
                                 % (obj.__module__, obj.__name__))

class SimpleTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)
