from django.shortcuts import render_to_response

def add(request):
    return render_to_response('satellite/add.html')
