# This script is use to freeze python to windows exe program

from distutils.core import setup
import py2exe
import sys

# If run without args, build executables, in quiet mode.
if len(sys.argv) == 1:
    sys.argv.append("py2exe")
    sys.argv.append("-q")

class Target:
    def __init__(self, **kw):
        self.__dict__.update(kw)
        # for the versioninfo resources
        self.version = "0.5.0"
        self.company_name = "No Company"
        self.copyright = "no copyright"
        self.name = "py2exe sample files"
myservice = Target(
    # used for the versioninfo resource
    description = "A app to update SSDUT news in background",
    # what to build.  For a service, the module name (not the
    # filename) must be specified!
    modules = ["updaterLauncher"],
    cmdline_style='pywin32'
    )

setup(
        service = [myservice],
        )
#setup(#console=['test_exe.pyw'],
        #options = {"py2exe": {"compressed": 1,
            #"optimize": 2,
            #"bundle_files": 1}},
        #zipfile = None,
        #windows = ['newsUpdater.py'],
        #)




