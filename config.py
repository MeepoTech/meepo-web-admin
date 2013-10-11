# this is the config file

# location to store uploaded client packages
upload_dir = '/var/www/campus-website/upload/'

# domain or IP which the redis sever run on
#redis_addr = '0.meepotech.com'

# platforms that we support(client)
platform_list = ['win32', 'win64', 'linux32', 'linux64',
                 'osx', 'android', 'ios']

# supported os version
adaptation = {
    'win32':    'XP/Vista/Win7/Win8',
    'win64':    'XP/Vista/Win7/Win8',
    'osx':      'Mac OS X 10.7+',
    'linux32':  ' ',
    'linux64':  ' ',
    'android':  'Android 2.2+',
    'ios':      'iOS 5.0+'
}
