import os
import shutil
import sys


# install directory
DIR = r"C:\Program Files\Windows Sidebar\Gadgets\SSdutNews.Gadget"


def deal_access_deny():
    print "Access denied. Please make sure you run this program with Administrator Privillege."
    os.system("PAUSE")
    sys.exit()


if __name__ == "__main__":
    try:
        os.system("dist\updaterLauncher.exe stop")
        os.system("dist\updaterLauncher.exe remove")
        shutil.rmtree(DIR, True)
    except WindowsError as e:
        if e.args[0] == 5:
            deal_access_deny()
        else:
            raise e
        os.system("PAUSE")

    print "Please restart computer to finish unistall"
    os.system("PAUSE")




