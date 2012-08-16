#!/usr/bin/env python
# -*- coding: utf-8 -*-

#Introduce:

# This is the wrapper of SSDUT newsUpdater, the component for windows
# gadaget SSDUT. The wrapper is necessary for run newsUpdater as a Windows 
# Service. If you don't want newsUpdater run as Windows Service you can just
# run the newsUpdater.py
#
# Liscense:
# 
#  Copyright 2012 Feng Yuyao
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License
#
# Usage:
# prompt> python newsUpdater.py -help
#


import traceback
import os
import sys

import tornado.httpclient
import win32serviceutil
import win32security
import win32api
import win32service
import win32event

options = None

class newsLauncher(win32serviceutil.ServiceFramework):

    _svc_name_ = 'SSDUTNewsUpdater'
    _svc_display_name_ = 'SSDUT News Updater'
    _svc_description_ = 'The news updater of windows gadaget SSDUT News'


    def __init__(self, *args):
        win32serviceutil.ServiceFramework.__init__(self, *args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)


    def log(self, msg):
        import servicemanager
        servicemanager.LogInfoMsg(str(msg))
        def sleep(self, sec):
            win32api.Sleep(sec*1000, True)


    def SvcDoRun(self):
        self.log("SSDUT " + "Run")
        self.log("SSDUT " + "sys.arg" + sys.argv[0])
        self.ReportServiceStatus(win32service.SERVICE_START_PENDING)
        try:
            sys.WORK_DIR = "SSDUT_NEWS"
            sys.PORT = 8000

            cwd = os.path.join(os.environ['LOCALAPPDATA'], sys.WORK_DIR)
            try:
                os.mkdir(cwd)
            except Exception as e:
                pass
            os.chdir(cwd)

            self.log("SSDUT cwd" + cwd)
            self.log("SSDUT work place" + os.getcwd())
            import newsUpdater
            self.ReportServiceStatus(win32service.SERVICE_RUNNING)
            newsUpdater.main()
            win32event.WaitForSingleObject(self.hWaitStop, win32event.INFINITE)
            self.ReportServiceStatus(win32service.SERVICE_STOPPED)
        except Exception as e:
            self.log('Exception: %s' % e)
            self.log('line %d' % traceback.tb_lineno(sys.exc_info()[2]))
            self.SvcStop()
            self.ReportServiceStatus(win32service.SERVICE_STOPPED)


    def SvcStop(self):
        self.log("SSDUT " + "in stop")

        #self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        #sys.stopservice = True

        #http = tornado.httpclient.AsyncHTTPClient()
        #def _on_download(response):
            #self.log("SSDUT " + "in _on_download")
            #pass

        try:
            #server_url = r"http://127.0.0.1:"+ str(sys.PORT) +r"/close"
            #req = tornado.httpclient.HTTPRequest(url=server_url, method='POST')
            #http.fetch(req, _on_download)
            #self.log("SSDUT " + "First request")

            ## Send an extra request to newsUpader in order to close it, because
            ## threre is an bug when tornado run on windows.
            #http.fetch(server_url, _on_download)
            #self.log("SSDUT " + "Second request")
            tornado.ioloop.IOLoop.instance().stop()
            tornado.ioloop.IOLoop.instance().close()
        except Exception as e:
            self.log("SSDUT " + "line 100" + str(e))
            pass

        #win32api.Sleep(2, True)
        win32event.SetEvent(self.hWaitStop)
        self.log("SSDUT " + "stoped")



if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(newsLauncher)

