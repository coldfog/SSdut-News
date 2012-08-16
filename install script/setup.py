import os
import shutil
import sys
import re


# install directory
DIR = r"C:\Program Files\Windows Sidebar\Gadgets\SSdutNews.Gadget"

def deal_access_deny():
    print "Access denied. Please make sure you run this program with Administrator Privillege."
    os.system("PAUSE")
    sys.exit()


def deal_directory_exist():
    cmd = raw_input('''The SSDUT News Updater has been installed. Would you want install again?(Y/N)''')
    cmd = cmd.upper()
    while(cmd != 'Y' and cmd != 'N'):
        cmd = raw_input("Please input Y or N:")
        cmd = cmd.upper()

    if cmd == 'N':
        print "Install has been canceled."
        os.system("PAUSE")
        sys.exit()
    elif cmd == 'Y':
        try:
            shutil.rmtree(DIR)
            shutil.copytree(".", DIR)
        except WindowsError as e:
            if e.args[0] == 5:
                deal_access_deny()


if __name__ == '__main__':
    # copy file to install directory
    try:
        #os.mkdir(DIR)
        shutil.copytree(".", DIR)
    except WindowsError as e:
        # The directory already existed.
        if e.args[0] == 183:
            deal_directory_exist()
        elif e.args[0] == 5:
            deal_access_deny()
        else:
            print e
            os.system("PAUSE")
            sys.exit()

    print '''Finished file copying.'''
    print '''Start install service...'''
    os.chdir(DIR)

    # install service
    result = os.popen("dist\updaterLauncher.exe --startup auto install").read()
    pattern = re.compile(r"[\S\s]*\((\d+)\)")
    errno = re.search(pattern, result)
    if errno == None:
        print result
        print ""
        os.system("dist\updaterLauncher.exe start")
        print "Install successed."
    else:
    #elif errno == 1072:
        print "Because after last uninstall you do not restart this computer. There are still some data remaining. Please restart computer first and try again."

    os.system("PAUSE")
