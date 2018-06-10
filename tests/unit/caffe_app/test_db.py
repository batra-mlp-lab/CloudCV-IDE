import json
import os
import unittest
from django.conf import settings
from django.core.urlresolvers import reverse
from django.test import Client
from django.contrib.auth.models import User
from caffe_app.models import Network


class SaveToDBTest(unittest.TestCase):

    def setUp(self):
        self.client = Client()

    def test_save_json(self):
        tests = open(os.path.join(settings.BASE_DIR, 'tests', 'unit', 'ide',
                                  'caffe_export_test.json'), 'r')
        net = json.load(tests)['net']
        response = self.client.post(
            reverse('saveDB'),
            {'net': net, 'net_name': 'netname', 'networkId': 1})
        response = json.loads(response.content)
        self.assertEqual(response['result'], 'success')

    def test_load(self):
        u_1 = User(id=1, username='user_1')
        u_1.save()
        u_2 = User(id=2, username='user_2')
        u_2.save()
        model = Network(name='net', network={})
        model.save()
        response = self.client.post(
            reverse('saveDB'),
            {'net': '{"net": "testnet"}', 'net_name': 'name', 'networkId': 1})
        response = json.loads(response.content)
        self.assertEqual(response['result'], 'success')
        self.assertTrue('id' in response)
        proto_id = response['id']
        response = self.client.post(reverse('loadDB'), {'proto_id': proto_id, 'user_id': 1})
        response = json.loads(response.content)
        self.assertEqual(response['result'], 'success')
        self.assertEqual(response['net_name'], 'name')

    def test_load_nofile(self):
        response = self.client.post(reverse('loadDB'),
                                    {'proto_id': 'inexistent'})
        response = json.loads(response.content)
        self.assertEqual(response['result'], 'error')
        self.assertEqual(response['error'], 'No network file found')
