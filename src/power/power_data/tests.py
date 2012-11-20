"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""
from django.test import TestCase

from power_data.models import Data


class SimpleTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)

class DataTest(TestCase):
    def test_insert(self):
        try:
            o = Data.objects.create(watt=1200, avg_volt=120, interval=10)
            o.save()
            o.delete()
        except Error as err:
            self.fail("Failed to create object: " + err)
